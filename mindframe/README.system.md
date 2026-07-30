# System README

> **Living document.** Updated as new systems are introduced. Each section describes one layer of the architecture — what it does, how it works, and how to extend it.

---

## Table of contents

1. [Overview](#1-overview)
2. [Types](#2-types)
3. [Rule engine](#3-rule-engine)
4. [Rules](#4-rules)
5. [Modifiers](#5-modifiers)
6. [Recommendation engine](#6-recommendation-engine)
7. [Stores](#7-stores)
8. [Persistence](#8-persistence)
9. [Screens & navigation](#9-screens--navigation)
10. [Derived stats](#10-derived-stats)
11. [Styling](#11-styling)
12. [Data flow](#12-data-flow)
13. [Extending the system](#13-extending-the-system)

---

## 1. Overview

The app tracks a five-dimensional **user state** and updates it in response to **events** — tasks created, updated, completed, failed, interrupted, or deleted; breaks taken; sessions started/ended. After every event, a **recommendation engine** reads the new state (and, depending on the person's settings, the event itself) and produces personalised cards telling them what to do next.

```
AppEvent → Rule Engine → UserState → Recommendation Engine → Recommendation[]
                ↓                           ↑
           Zustand Store ──── UserPreferences
                ↓
        SQLite (persisted)
                ↓
           React Native UI
```

Two things distinguish this app's version of the system from a minimal rules engine:

- **Preferences steer the engine, not just the UI.** `UserPreferences` (work style, stress tolerance, recommendation mode, etc.) is read by the recommendation engine on every dispatch, so the same `UserState` can produce different recommendations for different people.
- **Everything is persisted.** State, tasks, and preferences all live in SQLite (`expo-sqlite`) behind small repository objects, so the engine's output survives an app restart.

All state changes are still **purely functional** — nothing mutates in place. The store calls the engine, gets a new state back, and replaces the old one.

---

## 2. Types

### `UserState`

**File:** `src/types/UserState.types.tsx`

Five numeric fields, all clamped to **[0, 100]** by the engine after every event.

| Field | Meaning |
|---|---|
| `stressLevel` | Cognitive and emotional load. High = overwhelmed. |
| `energyLevel` | Physical and mental capacity. Drains with effort, restores with breaks. |
| `focusLevel` | Concentration quality. Built by completing tasks, shattered by interruptions. |
| `momentum` | Streak and flow state. Accumulates with completions, resets on failure. |
| `confidence` | Success/failure history. Affects vulnerability to negative events. |

```ts
export interface UserState {
  stressLevel: number;
  energyLevel: number;
  focusLevel:  number;
  momentum:    number;
  confidence:  number;
}
```

This file also defines `THRESHOLDS` — the single source of truth for "the user needs to step away" cutoffs (`criticalEnergy`, `lowEnergy`, `highStressCritical`, `elevatedStress`). Both the recommendation rules and `BreakPromptModal`'s trigger condition read from here, so the popup and the recommendation cards can never disagree on where the line is.

### `AppEvent`

**File:** `src/types/AppEvent.types.tsx`

A TypeScript **discriminated union** — each variant's `type` string narrows the full type at compile time.

```ts
export type AppEvent =
  | { type: "TASK_COMPLETED";   task: Task }
  | { type: "TASK_FAILED";      task: Task }
  | { type: "TASK_INTERRUPTED"; task: Task }
  | { type: "TASK_CREATED";     task: Task }
  | { type: "TASK_UPDATED";     task: Task }
  | { type: "TASK_DELETED";     task: Task }
  | { type: "BREAK_TAKEN";      durationMinutes: number; activityType?: BreakActivityCategory }
  | { type: "SESSION_STARTED" }
  | { type: "SESSION_ENDED" };

export type TaskEvent = Extract<AppEvent, { task: Task }>;
export type TaskEventType = TaskEvent["type"];
```

Every task mutation in the app — not just completion/failure — round-trips through this union. Creating, editing, and deleting a task all dispatch events too (see [§4](#4-rules)). `BREAK_TAKEN` optionally carries `activityType` (`breathing` | `movement` | `mindfulness` | `social` | `rest`), which lets rules react to *which kind* of break was taken, not just that one was.

### `Task` vs `ScheduledTask`

**File:** `src/types/Task.types.tsx`

The engine and the calendar UI care about different shapes of the same task, so the type is split in two:

```ts
export interface Task {
  id:               string;
  cognitiveLoad:    number;      // 1–10
  durationMinutes:  number;
  difficulty:       "low" | "medium" | "high";
  isRepeat?:        boolean;
}

export interface ScheduledTask {
  id:             string;
  title:          string;
  startDateTime:  string;
  endDateTime:    string;
  color:          string;
  priority:       TaskPriority;      // "low" | "medium" | "high"
  status:         TaskStatus;        // "in_progress" | "delayed" | "complete" | "skipped" | "failed"
  subtasks?:      string[];
  isRecommended:  boolean;
}
```

`ScheduledTask` is what the calendar, task store, and forms work with. `Task` is what the engine works with. `useTaskStore` converts between them (`scheduledToTask`) every time it emits an event — `priority` maps to `cognitiveLoad`/`difficulty` via `mapPriorityToLoad`/`mapPriorityToDifficulty`, and duration is derived from the start/end timestamps.

### `UserPreferences`

**File:** `src/types/UserPreferences.types.tsx`

Not part of the original engine — this is what lets the same event/state pair produce different recommendations for different people.

```ts
export interface UserPreferences {
  displayName: string;
  avatarColor: string;
  workStyle: "deep-focus" | "both" | "flexible";
  energyPattern: "morning" | "afternoon" | "evening" | "inconsistent";
  stressTolerance: "low" | "medium" | "high";
  recommendationMode: "task" | "general";
  maxRecommendations: number;        // 1–3
  enableActionableOnly: boolean;
}
```

How each field is actually used is covered in [§6](#6-recommendation-engine).

### `StateDelta`

**File:** `src/types/RuleTypes.types.tsx`

Rules return **signed changes**, not absolute values. Positive = increase, negative = decrease. All deltas from all matching rules are additively merged before being applied.

```ts
export type StateDelta = Partial<Record<keyof UserState, number>>;

// Example: { stressLevel: -4.5, focusLevel: +10 }
```

### `EngineResult`

```ts
export interface EngineResult {
  nextState:  UserState;
  traces:     RuleTrace[];   // one entry per matched rule
  totalDelta: StateDelta;    // net change across all rules
}
```

Always destructure `nextState` from the result of `handleEvent` — never read the store's state again after a dispatch to get the new value, since Zustand's `set` is applied asynchronously.

---

## 3. Rule engine

**File:** `src/components/recommendations/ruleEngine.tsx`
**Entry point:** `runEngine(event, state, rules, modifiers)`

A pure function — same inputs always produce the same output. Runs in four stages for every rule:

| Stage | What happens |
|---|---|
| **1. Match** | `rule.matches(event)` — rules that return false are skipped entirely |
| **2. Apply** | `rule.apply(event, state)` returns a raw `StateDelta` |
| **3. Modify** | Active modifiers scale the delta by their multiplier before it is merged |
| **4. Merge** | The modified delta is additively merged into a running total |

After all rules have run, the total delta is applied to the original state and every field is **clamped to [0, 100] once**, at the end:

```ts
next[key] = Math.min(100, Math.max(0, state[key] + totalDelta[key]));
```

> **Why clamp at the end?** If one rule adds +50 and another subtracts −30, the net +20 is what gets clamped — not each contribution individually. This preserves the relative contribution of every rule.

`src/components/recommendations/handleEvent.tsx` is the thin wrapper the rest of the app actually calls — it fixes `runEngine`'s `rules`/`modifiers` arguments to the app's real `taskRules` and `modifiers` arrays, and adds two conveniences:

```ts
export function handleEvent(event: AppEvent, state: UserState): EngineResult
export function applyEvent(event: AppEvent, state: UserState): UserState   // nextState only
export function replayEvents(events: AppEvent[], initialState: UserState)  // fold a whole sequence
```

`replayEvents` is mainly useful for tests or debug tooling — replaying a recorded sequence of events from a known starting state should always reproduce the same final state, since the engine is pure.

---

## 4. Rules

**File:** `src/types/TaskRules.types.tsx`

Each rule is an object with four fields:

```ts
export interface StateRule {
  name:        string;
  description: string;
  matches:     (event: AppEvent) => boolean;
  apply:       (event: AppEvent, state: UserState) => StateDelta;
}
```

Rules that match the same event type all fire and their deltas merge. **Each rule does exactly one thing** — `task-completed-focus-boost` only touches `focusLevel`; `task-completed-energy-drain` only touches `energyLevel`. This makes them independently testable and their interactions predictable.

### Full rule list (20 rules)

#### `TASK_COMPLETED` (5)

| Rule | Field | Formula |
|---|---|---|
| `task-completed-stress-relief` | `stressLevel` | `-(cognitiveLoad × 0.5)` |
| `task-completed-energy-drain` | `energyLevel` | `-(durationMinutes × 0.3)` |
| `task-completed-focus-boost` | `focusLevel` | `+10` high / `+6` medium / `+3` low |
| `task-completed-momentum` | `momentum` | `+7` new task / `+3` repeat |
| `task-completed-confidence` | `confidence` | `+8` high / `+4` medium / `+2` low |

#### `TASK_FAILED` (4)

| Rule | Field | Formula |
|---|---|---|
| `task-failed-stress` | `stressLevel` | `+(cognitiveLoad × 1.2)` |
| `task-failed-energy-drain` | `energyLevel` | `-(durationMinutes × 0.5)` |
| `task-failed-focus-momentum-loss` | `focusLevel`, `momentum` | `focusLevel −12`, `momentum −10` |
| `task-failed-confidence-drop` | `confidence` | `−6` high / `−4` medium / `−2` low |

> Note: in the UI, "Skip" is what actually dispatches `TASK_FAILED` (see `useTaskStore.skipTask`) — there's no separate "fail" action exposed to the person.

#### `TASK_INTERRUPTED` (1)

| Rule | Effect |
|---|---|
| `task-interrupted-penalty` | `stressLevel +5`, `focusLevel −15`, `momentum −8` |

> Dispatched by `useTaskStore.delayTask` — pushing a task's date back counts as an interruption to the engine, even though the task itself isn't lost.

#### `TASK_CREATED` / `TASK_UPDATED` / `TASK_DELETED` (3)

| Rule | Effect |
|---|---|
| `task-created-impact` | `stressLevel +(cognitiveLoad × 0.2)`, `focusLevel +2`, `momentum +3` — adding work has a small cost but also builds intent |
| `task-updated-clarity` | `stressLevel −2`, `focusLevel +4` — editing a task reduces ambiguity |
| `task-deleted-effect` | high difficulty → `stressLevel −8, momentum −2`; medium → `stressLevel −4`; low → `stressLevel +2, confidence −1` (mild guilt for dropping something easy) |

#### `BREAK_TAKEN` (5)

| Rule | Fires when | Effect |
|---|---|---|
| `break-taken-recovery` | always (baseline) | `energyLevel +log₂(duration+1)×8`, `stressLevel −(same×0.6)` |
| `break-breathing-calm` | `activityType === "breathing"` | `stressLevel −6`, `focusLevel +4` |
| `break-movement-energy` | `activityType === "movement"` | `energyLevel +6`, `momentum +4` |
| `break-mindfulness-clarity` | `activityType === "mindfulness"` | `stressLevel −5`, `confidence +3` |
| `break-social-momentum` | `activityType === "social"` | `momentum +5`, `confidence +3` |

The baseline rule fires for every break regardless of category (including legacy callers that only supply `durationMinutes`); the category-specific rules stack an additional bonus on top when `activityType` is present.

#### `SESSION_STARTED` / `SESSION_ENDED` (2)

| Rule | Effect |
|---|---|
| `session-started-prime` | `focusLevel +5`, `momentum +5` |
| `session-ended-relief` | `stressLevel −10`, `momentum −5` |

---

## 5. Modifiers

**File:** `src/types/Modifiers.types.tsx`

Modifiers are **context multipliers**. They read current state, and if their condition is met, scale the delta of specific named rules before merging. They do not produce their own deltas.

```ts
export interface RuleModifier {
  name:        string;
  description: string;
  condition:   (state: UserState) => boolean;
  affects:     string[];    // rule names this applies to; empty = all rules
  multiplier:  number;
}
```

> Modifiers check state at the **start** of the event — before any deltas are applied — so conditions are stable within a single dispatch.

### Full modifier list (6)

| Modifier | Condition | Multiplier | Affects |
|---|---|---|---|
| `exhausted-amplifier` | `energyLevel < 20` | ×1.5 | `task-failed-stress`, `task-failed-focus-momentum-loss`, `task-failed-confidence-drop`, `task-interrupted-penalty` |
| `flow-state-booster` | `focusLevel > 75` AND `momentum > 70` | ×1.4 | `task-completed-focus-boost`, `task-completed-momentum`, `task-completed-confidence`, `task-completed-stress-relief` |
| `stress-saturation-dampener` | `stressLevel > 80` | ×0.5 | `task-failed-stress`, `task-interrupted-penalty` |
| `low-confidence-vulnerability` | `confidence < 30` | ×1.6 | `task-failed-confidence-drop`, `task-failed-focus-momentum-loss` |
| `high-confidence-resilience` | `confidence > 75` | ×0.65 | `task-failed-stress`, `task-failed-confidence-drop`, `task-failed-focus-momentum-loss` |
| `well-rested-recovery` | `energyLevel > 70` | ×0.8 | `break-taken-recovery`, `break-movement-energy` |

Multiple modifiers can fire on the same rule in the same dispatch — they compound multiplicatively:

```
// exhausted-amplifier (×1.5) + low-confidence-vulnerability (×1.6) both fire:
rawDelta { confidence: -4 } → ×1.5 → -6 → ×1.6 → -9.6
```

---

## 6. Recommendation engine

**File:** `src/components/recommendations/recEngine.tsx`

This is the layer that changed most from a minimal rules engine — it now branches on preferences and can key off either state alone or state *and* the triggering task.

### Two rule sets

**General rules** (`src/types/recommendations/RecommendationRule.types.tsx`) key on `UserState` only — the classic "how are you doing right now" cards:

```ts
export type RecommendationRule = {
  id:        string;
  condition: (state: UserState) => boolean;
  build:     (state: UserState) => Recommendation;
};
```

**Task rules** (`src/types/recommendations/TaskRecommendationRule.types.tsx`) key on `UserState` *and* the `Task` that triggered the event, so their copy can reference specifics ("That was a demanding task... after 90 minutes of focused work"):

```ts
export type TaskRecommendationRule = {
  id:         string;
  eventTypes: TaskEventType[];               // which event types this rule listens for
  condition:  (state: UserState, task: Task) => boolean;
  build:      (state: UserState, task: Task) => Recommendation;
};
```

### Mode selection

`UserPreferences.recommendationMode` picks which set runs:

- **`"general"`** (default) — always uses the general rules.
- **`"task"`** — uses task rules filtered to the triggering event's type, but **falls back to general rules if no task rule matches**, so switching to task mode never leaves the person with an empty recommendation list.

```ts
export function getRecommendations(
  state: UserState,
  preferences: UserPreferences = defaultPreferences,
  lastEvent?: AppEvent,
  generalRules: RecommendationRule[] = recommendationRules,
  taskRules: TaskRecommendationRule[] = taskRecommendationRules
): Recommendation[]
```

### Post-processing (applied regardless of mode)

1. **`stressTolerance`** shifts the priority of `category: "warning"` recommendations by one tier: `low` tolerance promotes them (surfaces warnings sooner), `high` demotes them (quiets them), `medium` leaves them alone.
2. **`enableActionableOnly`** filters the list down to recommendations that have an `actionEvent` — i.e. ones with a real one-tap action, not just advice text.
3. Results are sorted by priority and capped at `maxRecommendations` (1–3).

```ts
return candidates
  .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])
  .slice(0, maxRecommendations);
```

`getTopRecommendation(state, preferences?, lastEvent?)` is a convenience wrapper that returns only `[0]` — used by `HomeScreen`'s recommendation banner.

### Priority order

`urgent` → `high` → `normal` → `low`

### Recommendation shape

**File:** `src/types/recommendations/Recommendation.types.tsx`

```ts
export interface Recommendation {
  id:           string;
  category:     RecommendationCategory;  // "recovery" | "focus" | "motivation" | "warning" | "celebrate"
  priority:     RecommendationPriority;  // "urgent" | "high" | "normal" | "low"
  headline:     string;                  // short label
  detail:       string;                  // full sentence
  action?:      string;                  // optional CTA label, e.g. "Take a break"
  actionEvent?: string;                  // event type to dispatch directly when CTA tapped
  actionRoute?: string;                  // route to navigate to instead, when the CTA needs more input
}
```

`actionEvent` vs `actionRoute` is the distinction between a one-tap action (e.g. `BREAK_TAKEN` fired immediately) and one that needs the person to make a choice first (e.g. routing to the Breaks sheet to pick an activity).

### Current general rules (12)

| Rule | Condition | Category | Priority |
|---|---|---|---|
| `critical-energy` | `energyLevel < 15` | recovery | urgent |
| `high-stress-critical` | `stressLevel > 85` | warning | urgent |
| `low-energy` | `15 ≤ energy < 35` | recovery | high |
| `elevated-stress` | `65 ≤ stress ≤ 85` | warning | high |
| `low-confidence` | `confidence < 28` | motivation | high |
| `low-focus` | `focusLevel < 30` AND `energyLevel > 40` | focus | high |
| `in-flow` | `focusLevel > 78` AND `momentum > 68` | focus | normal |
| `high-momentum` | `momentum > 80` AND `confidence > 65` | celebrate | normal |
| `peak-state` | all indicators green, `stress < 40` | celebrate | normal |
| `lost-momentum` | `momentum < 20` AND `stress < 70` | motivation | normal |
| `recovered-focus` | `55 ≤ focus ≤ 78` AND `energy > 50` | focus | low |
| `steady-state` | balanced — no urgent signals | focus | low |

### Current task rules (10)

| Rule | Fires on | Condition | Category | Priority |
|---|---|---|---|---|
| `task-failed-critical-energy` | `TASK_FAILED` | `energyLevel < 20` | recovery | urgent |
| `hard-task-failed-low-confidence` | `TASK_FAILED` | `difficulty: high` AND `confidence < 35` | motivation | high |
| `high-load-task-created-high-stress` | `TASK_CREATED` | `cognitiveLoad ≥ 7` AND `stressLevel > 65` | warning | high |
| `interrupted-with-collapsed-focus` | `TASK_INTERRUPTED` | `focusLevel < 25` AND `momentum < 30` | warning | high |
| `long-high-load-completed-low-energy` | `TASK_COMPLETED` | `duration > 45` AND `cognitiveLoad ≥ 7` AND `energyLevel < 40` | recovery | high |
| `high-difficulty-task-interrupted` | `TASK_INTERRUPTED` | `difficulty: high` | focus | high |
| `hard-task-completed-in-flow` | `TASK_COMPLETED` | `difficulty: high` AND `momentum > 65` AND `confidence > 60` AND `energyLevel > 45` | celebrate | normal |
| `task-created-low-energy` | `TASK_CREATED` | `energyLevel < 30` | recovery | normal |
| `structured-break-after-completion` | `TASK_COMPLETED` | `energyLevel < 55` AND `momentum > 40` | recovery | low |
| `repeat-task-completed-high-capacity` | `TASK_COMPLETED` | `isRepeat` AND `energyLevel > 60` AND `focusLevel > 55` | motivation | low |

Urgent/high-priority task rules are listed first in the array so the engine effectively short-circuits toward the most important signal when several would match.

---

## 7. Stores

Four Zustand stores, each owning one slice of state. None of them contain rule logic — they call into the engine/repositories and hold the result.

### `useUserStateStore`

**File:** `src/store/useUserStateStore.tsx`

```ts
interface UserStateStore {
  state:           UserState;
  lastTrace:       RuleTrace[];
  lastDelta:       StateDelta;
  recommendations: Recommendation[];
  isHydrated:      boolean;
  initialize:      (repo: UserStateRepo) => Promise<void>;
  dispatch:        (event: AppEvent) => void;
}
```

```ts
dispatch: async (event) => {
  const { nextState, traces, totalDelta } = handleEvent(event, get().state);
  const preferences = useUserPreferencesStore.getState().preferences;

  set({
    state:           nextState,
    lastTrace:       traces,
    lastDelta:       totalDelta,
    recommendations: getRecommendations(nextState, preferences, event),
  });

  if (repoRef) await repoRef.save(nextState);
},
```

Note it reaches into `useUserPreferencesStore.getState()` directly rather than taking preferences as an argument — this is what lets recommendations react to preference changes without every caller having to thread preferences through.

### `useTaskStore`

**File:** `src/store/useTaskStore.tsx`

Owns `tasks: ScheduledTask[]`, `selectedDate`, `activeView`. Every mutation (`addTask`, `updateTask`, `removeTask`, `completeTask`, `delayTask`, `skipTask`) does three things: updates local state, persists via `taskRepo`, and emits the matching `AppEvent` into `useUserStateStore.dispatch` (via the module-level `emitTaskEvent` helper, converting `ScheduledTask → Task` first). This is the only place `ScheduledTask` and `Task` are bridged.

`delayTask(id, newDate)` shifts a task's `startDateTime`/`endDateTime` to `newDate` while preserving the original time-of-day and duration, sets `status: "delayed"`, and dispatches `TASK_INTERRUPTED`.

### `useUserPreferencesStore`

**File:** `src/store/useUserPreferencesStore.tsx`

The simplest of the four — `preferences`, `isHydrated`, `initialize(repo)`, `updatePreferences(patch)`. `ProfileScreen` debounces calls to `updatePreferences` (500ms) so typing in the name field doesn't hit SQLite on every keystroke.

### `useBreakPromptStore`

**File:** `src/store/useBreakPromptStore.tsx`

Pure UI/ephemeral state — not persisted, not part of the engine. Tracks `dismissedAt` (so the critical break popup won't re-prompt for 10 minutes after being dismissed) and `modalVisible` (whether the full break sheet is open). Read by both `BreakPromptModal` (the automatic popup) and `HomeScreen`'s `BreakMiniBar`/`BreakSheet` (the manual entry point), so dismissing one closes the other too.

### Subscribing in components

Use selector functions to subscribe to exactly the slice you need — this prevents re-renders when unrelated fields change:

```ts
const recommendations = useUserStateStore(s => s.recommendations);
const dispatch        = useUserStateStore(s => s.dispatch);
const focusLevel      = useUserStateStore(s => s.state.focusLevel);
```

---

## 8. Persistence

**Files:** `src/db/migrations.ts`, `src/db/DatabaseContext.tsx`, `src/db/useDatabase.tsx`, `src/db/repositories/*`

State, tasks, and preferences all live in SQLite via `expo-sqlite`, behind three repository objects that map between DB rows and app types (`createUserStateRepo`, `createTaskRepo`, `createUserPreferencesRepo` — each just `load()`/`save()`, plus `taskRepo.delete()`/`clearAll()`).

### Migrations

`migrations.ts` holds a versioned array of migration functions. `runMigrations(db)` reads the SQLite `user_version` PRAGMA, runs only the migrations after that version, and bumps `user_version` once each succeeds — so a crash mid-migration safely retries from the same point on next launch. Rules noted in the file itself: never edit a shipped migration, only add new ones; keep each one idempotent (`IF NOT EXISTS`, `INSERT OR IGNORE`).

### Startup sequence

`AppProviders` wires this together:

```
DatabaseProvider (opens db, runs migrations)
  → AppInitializer (waits for db ready, then calls .initialize(repo) on all three stores)
    → NavigationContainer
```

`RootNavigator` shows `LoadingScreen` while `useDatabase()` reports not-ready, `ErrorScreen` if it failed, and the real `TabNavigator` once ready. Nothing renders the main UI before all three stores have hydrated from disk.

---

## 9. Screens & navigation

**Files:** `src/navigators/*`, `src/screens/*`, `src/components/calendar/*`, `src/components/breaks/*`

### Navigation

`RootNavigator` (native stack: `Loading` / `Error` / `Main`) wraps `TabNavigator` (bottom tabs: `Stats`, `Home`, `Profile` — `initialRouteName` is explicitly `Home`, since tab order alone doesn't determine the default route).

### Modal orchestration rule

Several screens use RN's `<Modal>` for forms, detail views, and dialogs. The hard rule across this codebase: **only one native `<Modal>` is ever visible at a time.** `Calendar.tsx` is the clearest example — it owns four modals (`TaskFormModal`, `TaskDetailModal`, `DelayTaskDialog`, `ConfirmDialog`) as siblings, and every "open the next one" handler closes whichever is currently open first:

```ts
const handleEdit = (task: ScheduledTask) => {
  setDetailOpen(false);   // close current modal...
  setSelectedTask(task);
  setFormOpen(true);      // ...before opening the next one
};
```

Stacking multiple `<Modal>`s at once (e.g. one modal rendering another inside itself) previously froze touch input app-wide on Android after closing — this pattern exists specifically to avoid that regressing.

### Home

`HomeScreen` shows the recommendation banner (top recommendation from `useUserStateStore`), the `Calendar`, and `BreakMiniBar` — a small persistent bar pinned above the tab bar whose color/copy reflects break urgency (via `getBreakEmphasis`, using the same `THRESHOLDS` as `BreakPromptModal`). Tapping it opens `BreakSheet` in a full-screen `Modal`, which supports swipe-down-to-dismiss via a `PanResponder` on its drag handle.

### Profile

`ProfileScreen` renders `PreferencesForm`, which is the UI for every `UserPreferences` field described in [§2](#2-types) — including `RecommendationModeToggle` for switching between `"general"` and `"task"` recommendation modes.

### Stats

`StatsScreen` is purely presentational — see [§10](#10-derived-stats).

---

## 10. Derived stats

**File:** `src/utils/useStatsData.tsx`

`useStatsData()` is the only place that computes anything for the Stats screen — it reads both `useTaskStore` and `useUserStateStore`, and derives a single `StatsData` object (completion/delayed/skipped/pending counts, completion rate, average task duration, a 7-day completion timeline, a by-priority breakdown, and current/longest streaks), memoized on `[tasks, userState]`.

`StatsScreen` and its child components (`StatsSummaryCard`, `UserStateGauge`, `TaskCompletionChart`, `ProductivityTimeline`, `PriorityBreakdown`) never compute — they only render values already present on `StatsData`. If a new stat is needed, it's added to `StatsData` and computed inside `useStatsData`, not inline in a component.

---

## 11. Styling

**Files:** `src/styling/theme.ts`, `statsTheme.ts`, `breaksTheme.ts`, `navigationTheme.ts`

`theme.ts` is the single source of design tokens (`colors`, `spacing`, `radius`, `type`, `shadow`, `semantic`) — components never inline hex values. `statsTheme.ts` and `breaksTheme.ts` are domain-specific lookup tables (metric → color, break category → color/label/glyph) built on top of `theme.ts`, following the same pattern so new domains get their own small theme file rather than growing the base one. `navigationTheme.ts` feeds `NavigationContainer` so native chrome matches the same palette.

Every component's styles live in a sibling `ComponentName.styles.ts` file and are imported in, never written inline — this is consistent across all UI, calendar, breaks, stats, and profile components.

---

## 12. Data flow

Full trace of a `TASK_COMPLETED` (hard, cognitiveLoad 9, 90 min) with `flow-state-booster` active (focusLevel 80, momentum 75), preferences in `"general"` mode:

```
useTaskStore.completeTask(id)
  │
  ├─ scheduledToTask(task) → Task { difficulty: "high", cognitiveLoad: 9, durationMinutes: 90 }
  │
  ├─ dispatch({ type: "TASK_COMPLETED", task })
  │    │
  │    ├─ handleEvent(event, currentState)
  │    │    │
  │    │    ├─ task-completed-stress-relief  → raw: { stressLevel: -4.5  }  → ×1.4 → { stressLevel: -6.3  }
  │    │    ├─ task-completed-energy-drain   → raw: { energyLevel: -27   }  →  ×1  → { energyLevel: -27   }
  │    │    ├─ task-completed-focus-boost    → raw: { focusLevel:  +10   }  → ×1.4 → { focusLevel:  +14   }
  │    │    ├─ task-completed-momentum       → raw: { momentum:    +7    }  → ×1.4 → { momentum:    +9.8  }
  │    │    └─ task-completed-confidence     → raw: { confidence:  +8    }  → ×1.4 → { confidence:  +11.2 }
  │    │
  │    ├─ totalDelta: { stressLevel: -6.3, energyLevel: -27, focusLevel: +14, momentum: +9.8, confidence: +11.2 }
  │    ├─ applyDelta + clamp → nextState
  │    ├─ getRecommendations(nextState, preferences, event) → Recommendation[]
  │    └─ set({ state, lastTrace, lastDelta, recommendations })
  │
  ├─ taskRepo.upsert(...)   → persisted to SQLite
  │
  └─ React re-renders subscribed components
       (HomeScreen banner, StatsScreen gauges, Calendar row status)
```

---

## 13. Extending the system

### Add a new event type

1. Add a variant to `AppEvent` in `src/types/AppEvent.types.tsx`.
2. Write rules in `src/types/TaskRules.types.tsx` that match on the new type and add them to the `taskRules` array.
3. If a store should emit it, wire the dispatch call into the relevant store action (see `useTaskStore`'s `emitTaskEvent` for the pattern).
4. Optionally add matching entries to `taskRecommendationRules` if the new event should ever produce a task-mode recommendation — remember to list the event type in that rule's `eventTypes`.

### Add a new state field

1. Add the field to `UserState` in `src/types/UserState.types.tsx`.
2. Add the key to `STATE_KEYS` in `src/components/recommendations/ruleEngine.tsx`.
3. Rules that want to affect it return it in their delta.

Existing rules are unaffected.

### Add a new modifier

1. Write a `RuleModifier` object in `src/types/Modifiers.types.tsx`.
2. Add it to the `modifiers` array.

### Add a new recommendation

- **General** (state-only): add a `RecommendationRule` to `src/types/recommendations/RecommendationRule.types.tsx` and its `recommendationRules` array.
- **Task-specific**: add a `TaskRecommendationRule` to `src/types/recommendations/TaskRecommendationRule.types.tsx` and its `taskRecommendationRules` array — remember `eventTypes` controls which dispatches it's even considered for.

### Add a new preference

1. Add the field to `UserPreferences` in `src/types/UserPreferences.types.tsx` and to `defaultPreferences`.
2. Add a column to `user_preferences` in a **new** migration in `src/db/migrations.ts` (never edit a shipped one) and map it in `userPreferencesRepo.ts`'s `load`/`save`.
3. Add the control to `PreferencesForm.tsx`.
4. If it should affect recommendations, read it inside `getRecommendations` in `recEngine.tsx` (see `applyStressTolerance`/`enableActionableOnly` for the pattern).

### Add a new screen-level modal

Follow the pattern in [§9](#9-screens--navigation): the screen (not the modal component) owns all "which modal is open" state, and every handler that opens modal B closes modal A first. Never render one `<Modal>` as a descendant of another that's simultaneously visible.