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
7. [Store](#7-store)
8. [Data flow](#8-data-flow)
9. [Extending the system](#9-extending-the-system)

---

## 1. Overview

The system tracks a five-dimensional **user state** and updates it in response to **events** (tasks completed, failed, interrupted, breaks taken, sessions started/ended). After every event, a **recommendation engine** reads the new state and produces personalised strings telling the user what to do next.

```
AppEvent → Rule Engine → UserState → Recommendation Engine → Recommendation[]
                ↓
           Zustand Store → React Native UI
```

All state changes are **purely functional** — nothing mutates in place. The store calls the engine, gets a new state back, and replaces the old one.

---

## 2. Types

### `UserState`

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

### `AppEvent`

A TypeScript **discriminated union** — each variant's `type` string narrows the full type at compile time, making task properties safe to access without casting.

```ts
export type AppEvent =
  | { type: "TASK_COMPLETED";   task: Task }
  | { type: "TASK_FAILED";      task: Task }
  | { type: "TASK_INTERRUPTED"; task: Task }
  | { type: "BREAK_TAKEN";      durationMinutes: number }
  | { type: "SESSION_STARTED" }
  | { type: "SESSION_ENDED" };
```

### `Task`

```ts
export interface Task {
  id:              string;
  cognitiveLoad:   number;          // 1–10
  durationMinutes: number;
  difficulty:      "low" | "medium" | "high";
  isRepeat?:       boolean;
}
```

### `StateDelta`

Rules return **signed changes**, not absolute values. Positive = increase, negative = decrease. All deltas from all matching rules are additively merged before being applied.

```ts
type StateDelta = Partial<Record<keyof UserState, number>>;

// Example: { stressLevel: -4.5, focusLevel: +10 }
```

### `EngineResult`

What `handleEvent` returns. Always destructure `nextState` — never read `get().state` after a dispatch to get the new value, as Zustand's `set` is async.

```ts
interface EngineResult {
  nextState:  UserState;
  traces:     RuleTrace[];   // one entry per matched rule
  totalDelta: StateDelta;    // net change across all rules
}
```

---

## 3. Rule engine

**File:** `src/components/recommendations/ruleEngine.tsx`  
**Entry point:** `runEngine(event, state, rules, modifiers)`

A pure function — same inputs always produce the same output. Runs in four stages for every rule:

| Stage | What happens |
|---|---|
| **1. Match** | `rule.matches(event)` — rules that return false are skipped entirely |
| **2. Apply** | `rule.apply(event)` returns a raw `StateDelta` — rules read from the event only, never from state |
| **3. Modify** | Active modifiers scale the delta by their multiplier before it is merged |
| **4. Merge** | The modified delta is additively merged into a running total |

After all rules have run, the total delta is applied to the original state and every field is **clamped to [0, 100] once**, at the end.

```ts
// Clamping happens once — not per rule
next[key] = Math.min(100, Math.max(0, state[key] + totalDelta[key]));
```

> **Why clamp at the end?** If one rule adds +50 and another subtracts −30, the net +20 is what gets clamped — not each contribution individually. This preserves the relative contribution of every rule.

---

## 4. Rules

**File:** `src/types/TaskRules.tsx`

Each rule is an object with three fields:

```ts
interface StateRule {
  name:    string;
  matches: (event: AppEvent) => boolean;
  apply:   (event: AppEvent) => StateDelta;
}
```

Rules that match the same event type all fire and their deltas merge. **Each rule does exactly one thing** — `task-completed-focus-boost` only touches `focusLevel`; `task-completed-energy-drain` only touches `energyLevel`. This makes them independently testable and their interactions predictable.

### Full rule list

#### `TASK_COMPLETED` (5 rules)

| Rule | Field | Formula |
|---|---|---|
| `task-completed-stress-relief` | `stressLevel` | `-(cognitiveLoad × 0.5)` |
| `task-completed-energy-drain` | `energyLevel` | `-(durationMinutes × 0.3)` |
| `task-completed-focus-boost` | `focusLevel` | `+10` high / `+6` medium / `+3` low |
| `task-completed-momentum` | `momentum` | `+7` new task / `+3` repeat |
| `task-completed-confidence` | `confidence` | `+8` high / `+4` medium / `+2` low |

#### `TASK_FAILED` (4 rules)

| Rule | Field | Formula |
|---|---|---|
| `task-failed-stress` | `stressLevel` | `+(cognitiveLoad × 1.2)` |
| `task-failed-energy-drain` | `energyLevel` | `-(durationMinutes × 0.5)` |
| `task-failed-focus-momentum-loss` | `focusLevel`, `momentum` | `focusLevel −12`, `momentum −10` |
| `task-failed-confidence-drop` | `confidence` | `−6` high / `−4` medium / `−2` low |

#### Other events (4 rules)

| Rule | Event | Effect |
|---|---|---|
| `task-interrupted-penalty` | `TASK_INTERRUPTED` | `stressLevel +5`, `focusLevel −15`, `momentum −8` |
| `break-taken-recovery` | `BREAK_TAKEN` | `energyLevel +log₂(duration+1)×8`, `stressLevel −(same×0.6)` |
| `session-started-prime` | `SESSION_STARTED` | `focusLevel +5`, `momentum +5` |
| `session-ended-relief` | `SESSION_ENDED` | `stressLevel −10`, `momentum −5` |

---

## 5. Modifiers

**File:** `src/types/Modifiers.tsx`

Modifiers are **context multipliers**. They read current state, and if their condition is met, scale the delta of specific named rules before merging. They do not produce their own deltas.

```ts
interface RuleModifier {
  name:       string;
  condition:  (state: UserState) => boolean;
  affects:    string[];    // rule names this applies to
  multiplier: number;
}
```

> Modifiers check state at the **start** of the event — before any deltas are applied — so conditions are stable within a single dispatch.

### Full modifier list

| Modifier | Condition | Multiplier | Affects |
|---|---|---|---|
| `exhausted-amplifier` | `energyLevel < 20` | ×1.5 | Failed/interrupted rules |
| `flow-state-booster` | `focusLevel > 75` AND `momentum > 70` | ×1.4 | Completed rules |
| `stress-saturation-dampener` | `stressLevel > 80` | ×0.5 | Stress-spiking rules |
| `low-confidence-vulnerability` | `confidence < 30` | ×1.6 | Confidence and focus-loss rules |
| `high-confidence-resilience` | `confidence > 75` | ×0.65 | Failure penalty rules |
| `well-rested-recovery` | `energyLevel > 70` | ×0.8 | `break-taken-recovery` |

Multiple modifiers can fire on the same rule in the same dispatch — they compound multiplicatively:

```
// exhausted-amplifier (×1.5) + low-confidence-vulnerability (×1.6) both fire:
rawDelta { confidence: -4 } → ×1.5 → -6 → ×1.6 → -9.6
```

---

## 6. Recommendation engine

**Files:** `src/types/recommendations/recommendationRules.tsx`, `src/components/recommendations/recEngine.ts`

After every event, the new `UserState` is passed to `getRecommendations()`, which evaluates a set of recommendation rules and returns a prioritised list of personalised strings.

### How it works

Each `RecommendationRule` has a `condition` and a `build` function. `build` receives the full state so every string can include the actual number:

```ts
type RecommendationRule = {
  id:        string;
  condition: (state: UserState) => boolean;
  build:     (state: UserState) => Recommendation;
};
```

`getRecommendations` filters matching rules, sorts by priority, and caps the result:

```ts
export function getRecommendations(state: UserState, maxResults = 3): Recommendation[] {
  return recommendationRules
    .filter(rule => rule.condition(state))
    .map(rule => ({ ...rule.build(state), generatedAt: Date.now() }))
    .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])
    .slice(0, maxResults);
}
```

### Priority order

`urgent` → `high` → `normal` → `low`

### Recommendation shape

```ts
interface Recommendation {
  id:           string;
  generatedAt:  number;                    // timestamp
  category:     RecommendationCategory;   // "recovery" | "focus" | "motivation" | "warning" | "celebrate"
  priority:     RecommendationPriority;   // "urgent" | "high" | "normal" | "low"
  headline:     string;                   // short label
  detail:       string;                   // full sentence
  action?:      string;                   // optional CTA label
  actionEvent?: string;                   // event type to dispatch when CTA tapped
}
```

### Current recommendation rules (12)

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
| `recovered-focus` | `55 ≤ focus ≤ 78` AND `energy > 50` | focus | low |
| `lost-momentum` | `momentum < 20` AND `stress < 70` | motivation | normal |
| `steady-state` | balanced — no urgent signals | focus | low |

---

## 7. Store

**File:** `src/store/useUserStateStore.tsx`

A thin Zustand wrapper around the engine. Holds state, the last trace, the last delta, and the current recommendations. Contains no rule logic.

```ts
interface UserStateStore {
  state:           UserState;
  lastTrace:       RuleTrace[];
  lastDelta:       StateDelta;
  recommendations: Recommendation[];
  dispatch:        (event: AppEvent) => void;
}
```

### The dispatch pattern

`nextState` comes directly from the rules engine result.

```ts
dispatch: (event) => {
  const { nextState, traces, totalDelta } = handleEvent(event, get().state);
  set({
    state:           nextState,
    lastTrace:       traces,
    lastDelta:       totalDelta,
    recommendations: getRecommendations(nextState),
  });
},
```

### Subscribing in components

Use selector functions to subscribe to exactly the slice you need — this prevents re-renders when unrelated fields change:

```ts
const recommendations = useUserStateStore(s => s.recommendations);
const dispatch        = useUserStateStore(s => s.dispatch);
const focusLevel      = useUserStateStore(s => s.state.focusLevel);
```

---

## 8. Data flow

Full trace of a `TASK_COMPLETED` (hard, cognitiveLoad 9, 90 min) with `flow-state-booster` active (focusLevel 80, momentum 75):

```
dispatch({ type: "TASK_COMPLETED", task: { difficulty: "high", cognitiveLoad: 9, durationMinutes: 90 } })
  │
  ├─ handleEvent(event, currentState)
  │    │
  │    ├─ task-completed-stress-relief  → raw: { stressLevel: -4.5  }  → ×1.4 → { stressLevel: -6.3  }
  │    ├─ task-completed-energy-drain   → raw: { energyLevel: -27   }  →  ×1  → { energyLevel: -27   }
  │    ├─ task-completed-focus-boost    → raw: { focusLevel:  +10   }  → ×1.4 → { focusLevel:  +14   }
  │    ├─ task-completed-momentum       → raw: { momentum:    +7    }  → ×1.4 → { momentum:    +9.8  }
  │    └─ task-completed-confidence     → raw: { confidence:  +8    }  → ×1.4 → { confidence:  +11.2 }
  │
  ├─ totalDelta: { stressLevel: -6.3, energyLevel: -27, focusLevel: +14, momentum: +9.8, confidence: +11.2 }
  │
  ├─ applyDelta + clamp → nextState
  │
  ├─ getRecommendations(nextState) → Recommendation[]
  │
  └─ set({ state, lastTrace, lastDelta, recommendations })
       │
       └─ React re-renders subscribed components
```

---

## 9. Extending the system

### Add a new event type

1. Add a variant to `AppEvent` in `types/AppEvent.tsx`
2. Write rules in `types/TaskRules.tsx` that match on the new type
3. Add them to the `TaskRules` array

### Add a new state field

1. Add the field to `UserState` in `types/UserState.tsx`
2. Add the key to `STATE_KEYS` in `components/recommendations/ruleEngine.tsx`
3. Rules that want to affect it return it in their delta

Existing rules are unaffected.

### Add a new modifier

1. Write a `RuleModifier` object in `types/Modifiers.tsx`
2. Add it to the `modifiers` array

### Add a new recommendation

1. Write a `RecommendationRule` object in `types/recommendations/RecommendationRules.tsx`
2. Add it to the `recommendationRules` array