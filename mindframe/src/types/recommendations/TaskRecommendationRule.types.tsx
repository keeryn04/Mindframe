import { AppEvent, TaskEventType } from "../AppEvent.types";
import { Task } from "../Task.types";
import { UserState } from "../UserState.types";
import { Recommendation } from "./Recommendation.types";

/**
 * A TaskRecommendationRule fires in response to a specific task event.
 * Unlike the general RecommendationRule, it receives the triggering Task
 * alongside the current UserState — allowing recommendations that reference
 * what the user just did ("That was a long task — rest before the next one").
 */
export type TaskRecommendationRule = {
  id: string;
  /** The event types this rule listens for. */
  eventTypes: TaskEventType[];
  condition: (state: UserState, task: Task) => boolean;
  build: (state: UserState, task: Task) => Recommendation;
};

// ─── After Completion ────────────────────────────────────────────────────────

/**
 * Finishing a long, high-load task with already-low energy is a burnout signal.
 * Nudge the user to step away before starting anything else.
 */
const longHighLoadCompletedLowEnergy: TaskRecommendationRule = {
  id: "long-high-load-completed-low-energy",
  eventTypes: ["TASK_COMPLETED"],
  condition: (state, task) =>
    task.durationMinutes > 45 &&
    task.cognitiveLoad >= 7 &&
    state.energyLevel < 40,
  build: (_state, task) => ({
    id: "long-high-load-completed-low-energy",
    category: "recovery",
    priority: "high",
    headline: "Good work — now step away",
    detail: `That was a demanding task. Your energy is low after ${Math.round(task.durationMinutes)} minutes of focused work. Rest for at least 10 minutes before starting the next one.`,
    action: "Log a break",
    actionEvent: "BREAK_TAKEN",
  }),
};

/**
 * Completing a hard task with high confidence and momentum — the user is
 * primed. Encourage them to chain into another difficult task immediately.
 */
const hardTaskCompletedInFlow: TaskRecommendationRule = {
  id: "hard-task-completed-in-flow",
  eventTypes: ["TASK_COMPLETED"],
  condition: (state, task) =>
    task.difficulty === "high" &&
    state.momentum > 65 &&
    state.confidence > 60 &&
    state.energyLevel > 45,
  build: () => ({
    id: "hard-task-completed-in-flow",
    category: "celebrate",
    priority: "normal",
    headline: "You're in the zone — keep going",
    detail:
      "You just finished a hard task while in a strong state. This is a rare window — start your next difficult task now while the momentum holds.",
  }),
};

/**
 * Completing a repeat task gives a smaller momentum boost, but it's a
 * signal the user may be avoiding harder work. Gently prompt them to
 * graduate to something more challenging.
 */
const repeatTaskCompletedHighCapacity: TaskRecommendationRule = {
  id: "repeat-task-completed-high-capacity",
  eventTypes: ["TASK_COMPLETED"],
  condition: (state, task) =>
    !!task.isRepeat &&
    state.energyLevel > 60 &&
    state.focusLevel > 55,
  build: () => ({
    id: "repeat-task-completed-high-capacity",
    category: "motivation",
    priority: "low",
    headline: "You have more to give",
    detail:
      "You just finished something familiar. Your energy and focus are both solid — consider tackling something harder instead of staying in the safe zone.",
  }),
};

// ─── After Failure ────────────────────────────────────────────────────────────

/**
 * Failing a high-difficulty task when confidence is already low is a
 * compounding blow. Redirect firmly to an easy win.
 */
const hardTaskFailedLowConfidence: TaskRecommendationRule = {
  id: "hard-task-failed-low-confidence",
  eventTypes: ["TASK_FAILED"],
  condition: (state, task) =>
    task.difficulty === "high" && state.confidence < 35,
  build: () => ({
    id: "hard-task-failed-low-confidence",
    category: "motivation",
    priority: "high",
    headline: "Step back, pick an easy win",
    detail:
      "That was a tough task and it didn't go to plan. Your confidence is already low — fighting another hard task now will make things worse. Find something small you know you can finish.",
  }),
};

/**
 * Failing any task when energy is critically low: the failure is likely
 * caused by depletion, not inability. Name that clearly.
 */
const taskFailedCriticalEnergy: TaskRecommendationRule = {
  id: "task-failed-critical-energy",
  eventTypes: ["TASK_FAILED"],
  condition: (state) => state.energyLevel < 20,
  build: (_state, task) => ({
    id: "task-failed-critical-energy",
    category: "recovery",
    priority: "urgent",
    headline: "This isn't a you problem — you're exhausted",
    detail: `You're running on almost no energy. The failure on "${task.difficulty}" difficulty work is expected at this level. Stop working and rest before attempting anything else.`,
    action: "Log a break",
    actionEvent: "BREAK_TAKEN",
  }),
};

// ─── After Interruption ───────────────────────────────────────────────────────

/**
 * Being interrupted on a high-difficulty task is especially costly.
 * Acknowledge the disruption and suggest a recovery micro-task
 * before re-attempting the hard work.
 */
const highDifficultyTaskInterrupted: TaskRecommendationRule = {
  id: "high-difficulty-task-interrupted",
  eventTypes: ["TASK_INTERRUPTED"],
  condition: (_state, task) => task.difficulty === "high",
  build: () => ({
    id: "high-difficulty-task-interrupted",
    category: "focus",
    priority: "high",
    headline: "Interrupted on hard work — reset first",
    detail:
      "Getting interrupted mid-way through a difficult task breaks the context you built up. Do a quick 5-minute easy task to clear your head before returning to it.",
  }),
};

/**
 * Multiple rapid interruptions combined with low focus: the environment
 * is the problem. Prompt the user to address the source.
 */
const interruptedWithCollapsedFocus: TaskRecommendationRule = {
  id: "interrupted-with-collapsed-focus",
  eventTypes: ["TASK_INTERRUPTED"],
  condition: (state) => state.focusLevel < 25 && state.momentum < 30,
  build: () => ({
    id: "interrupted-with-collapsed-focus",
    category: "warning",
    priority: "high",
    headline: "Focus has collapsed — change your environment",
    detail:
      "Your focus and momentum are both very low. Interruptions are compounding. Consider moving locations, silencing notifications, or taking a proper break before continuing.",
    action: "Log a break",
    actionEvent: "BREAK_TAKEN",
  }),
};

// ─── After Creation ───────────────────────────────────────────────────────────

/**
 * Creating a high-load task when the user is already stressed:
 * flag the scheduling risk before they commit.
 */
const highLoadTaskCreatedHighStress: TaskRecommendationRule = {
  id: "high-load-task-created-high-stress",
  eventTypes: ["TASK_CREATED"],
  condition: (state, task) =>
    task.cognitiveLoad >= 7 && state.stressLevel > 65,
  build: (_state, task) => ({
    id: "high-load-task-created-high-stress",
    category: "warning",
    priority: "high",
    headline: "Heavy task added while stressed",
    detail: `You've added a high-demand task while already under stress. Consider scheduling it for when your stress is lower — starting it now risks a poor result and more stress.`,
  }),
};

/**
 * Creating a task (any difficulty) with low energy: surface a gentle
 * reminder that planning is fine, execution can wait.
 */
const taskCreatedLowEnergy: TaskRecommendationRule = {
  id: "task-created-low-energy",
  eventTypes: ["TASK_CREATED"],
  condition: (state) => state.energyLevel < 30,
  build: () => ({
    id: "task-created-low-energy",
    category: "recovery",
    priority: "normal",
    headline: "Good to plan — don't start yet",
    detail:
      "You've added a task, but your energy is low. Planning is a good use of this state — execution can wait until you've rested.",
  }),
};

// ─── Both-style nudges (workStyle-agnostic; filtered at engine level) ────

/**
 * After completing a task when using deep-focus or both style,
 * and the session has been running a while (proxied via low energy),
 * nudge a structured break.
 */
const structuredBreakAfterCompletion: TaskRecommendationRule = {
  id: "structured-break-after-completion",
  eventTypes: ["TASK_COMPLETED"],
  condition: (state) =>
    state.energyLevel < 55 && state.momentum > 40,
  build: () => ({
    id: "structured-break-after-completion",
    category: "recovery",
    priority: "low",
    headline: "Good stopping point for a short break",
    detail:
      "You've just completed a task and your energy is starting to dip. A 5-minute break now keeps you effective for longer.",
    action: "Log a break",
    actionEvent: "BREAK_TAKEN",
  }),
};

export const taskRecommendationRules: TaskRecommendationRule[] = [
  // Urgent / high-priority first so the engine can short-circuit early if needed
  taskFailedCriticalEnergy,
  hardTaskFailedLowConfidence,
  highLoadTaskCreatedHighStress,
  interruptedWithCollapsedFocus,
  longHighLoadCompletedLowEnergy,
  highDifficultyTaskInterrupted,
  hardTaskCompletedInFlow,
  taskCreatedLowEnergy,
  structuredBreakAfterCompletion,
  repeatTaskCompletedHighCapacity,
];