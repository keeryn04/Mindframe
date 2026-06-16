import { RecommendationRule, recommendationRules } from "../../types/recommendations/RecommendationRule.types";
import { TaskRecommendationRule, taskRecommendationRules } from "../../types/recommendations/TaskRecommendationRule.types";
import { Recommendation, RecommendationPriority } from "../../types/recommendations/Recommendation.types";
import { UserState } from "../../types/UserState.types";
import { AppEvent, TaskEvent } from "../../types/AppEvent.types";
import { UserPreferences, StressToleranceLevel, defaultPreferences } from "../../types/UserPreferences.types";

const PRIORITY_ORDER: Record<RecommendationPriority, number> = {
  urgent: 0,
  high:   1,
  normal: 2,
  low:    3,
};

const PRIORITY_TIERS: RecommendationPriority[] = ["urgent", "high", "normal", "low"];

function promotePriority(p: RecommendationPriority): RecommendationPriority {
  const i = PRIORITY_TIERS.indexOf(p);
  return PRIORITY_TIERS[Math.max(0, i - 1)];
}

function demotePriority(p: RecommendationPriority): RecommendationPriority {
  const i = PRIORITY_TIERS.indexOf(p);
  return PRIORITY_TIERS[Math.min(PRIORITY_TIERS.length - 1, i + 1)];
}

/**
 * Shifts the priority of warning-category recommendations based on how
 * sensitively the user wants to be alerted.
 *
 *   low tolerance  → warnings surface earlier (promoted one tier)
 *   high tolerance → warnings are quieted    (demoted one tier)
 *   medium         → no change (default)
 */
function applyStressTolerance(
  recs: Recommendation[],
  tolerance: StressToleranceLevel
): Recommendation[] {
  if (tolerance === "medium") return recs;

  return recs.map((r) => {
    if (r.category !== "warning") return r;
    return {
      ...r,
      priority:
        tolerance === "low"
          ? promotePriority(r.priority)
          : demotePriority(r.priority),
    };
  });
}

/**
 * Narrows an AppEvent to a TaskEvent, returning null if it doesn't carry a task.
 * Used to safely access `event.task` without unsafe casting.
 */
function asTaskEvent(event: AppEvent): TaskEvent | null {
  return "task" in event ? (event as TaskEvent) : null;
}

/**
 * Runs the general recommendation engine against the current UserState.
 * This is the original behaviour, unchanged in logic.
 */
function getGeneralRecommendations(
  state: UserState,
  rules: RecommendationRule[]
): Recommendation[] {
  return rules
    .filter((rule) => rule.condition(state))
    .map((rule) => rule.build(state));
}

/**
 * Runs the task-mode recommendation engine.
 * Only fires if the event is a TaskEvent; returns an empty array otherwise.
 * Each rule also declares which event types it responds to, providing a
 * second layer of filtering beyond the condition function.
 */
function getTaskRecommendations(
  state: UserState,
  event: AppEvent,
  rules: TaskRecommendationRule[]
): Recommendation[] {
  const taskEvent = asTaskEvent(event);
  if (!taskEvent) return [];

  return rules
    .filter((rule) => rule.eventTypes.includes(taskEvent.type))
    .filter((rule) => rule.condition(state, taskEvent.task))
    .map((rule) => rule.build(state, taskEvent.task));
}

/**
 * Primary entry point for the recommendation engine.
 *
 * Branches on `preferences.recommendationMode`:
 *   "general" → uses RecommendationRules keyed on UserState only.
 *   "task"    → uses TaskRecommendationRules keyed on (UserState + Task).
 *               Falls back to general mode if `lastEvent` is absent or
 *               is not a task-carrying event.
 *
 * Post-processing (applied regardless of mode):
 *   - stressTolerance shifts warning priority tiers up or down.
 *   - enableActionableOnly filters to recs that have an actionEvent.
 *   - Results are sorted by priority and capped at maxRecommendations.
 *
 * Preferences default to `defaultPreferences` when omitted so that
 * callers that haven't wired preferences yet get sensible behaviour.
 */
export function getRecommendations(
  state: UserState,
  preferences: UserPreferences = defaultPreferences,
  lastEvent?: AppEvent,
  generalRules: RecommendationRule[] = recommendationRules,
  taskRules: TaskRecommendationRule[] = taskRecommendationRules
): Recommendation[] {
  const {
    recommendationMode,
    maxRecommendations,
    stressTolerance,
    enableActionableOnly,
  } = preferences;

  // ── 1. Generate candidates based on mode ──────────────────────────────────

  let candidates: Recommendation[];

  const taskEvent = lastEvent ? asTaskEvent(lastEvent) : null;
  const canUseTaskMode = recommendationMode === "task" && !!taskEvent;

  if (canUseTaskMode && lastEvent) {
    candidates = getTaskRecommendations(state, lastEvent, taskRules);

    // If task mode produces nothing for this event (no rules matched),
    // fall back to general so the user always sees something useful.
    if (candidates.length === 0) {
      candidates = getGeneralRecommendations(state, generalRules);
    }
  } else {
    candidates = getGeneralRecommendations(state, generalRules);
  }

  // ── 2. Apply preference-based post-processing ─────────────────────────────

  candidates = applyStressTolerance(candidates, stressTolerance);

  if (enableActionableOnly) {
    candidates = candidates.filter((r) => !!r.actionEvent);
  }

  // ── 3. Sort and cap ───────────────────────────────────────────────────────

  return candidates
    .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])
    .slice(0, maxRecommendations);
}

/**
 * Convenience wrapper — returns only the single top recommendation.
 * Accepts the same arguments as getRecommendations for full compatibility.
 */
export function getTopRecommendation(
  state: UserState,
  preferences?: UserPreferences,
  lastEvent?: AppEvent
): Recommendation | null {
  return getRecommendations(state, preferences, lastEvent)[0] ?? null;
}