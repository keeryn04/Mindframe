import { StateRule } from "../types/RuleTypes";
import { AppEvent } from "../types/AppEvent";
 
/**
 * Completing a task relieves stress proportional to cognitive load.
 */
const taskCompletedStressRelief: StateRule = {
  name: "task-completed-stress-relief",
  description: "Reduces stress based on cognitive load of completed task",
  matches: (e) => e.type === "TASK_COMPLETED",
  apply: (e) => {
    const { task } = e as Extract<AppEvent, { type: "TASK_COMPLETED" }>;
    return { stressLevel: -(task.cognitiveLoad * 0.5) };
  },
};
 
/**
 * Completing a task drains energy based on duration.
 */
const taskCompletedEnergyDrain: StateRule = {
  name: "task-completed-energy-drain",
  description: "Drains energy based on how long the task took",
  matches: (e) => e.type === "TASK_COMPLETED",
  apply: (e) => {
    const { task } = e as Extract<AppEvent, { type: "TASK_COMPLETED" }>;
    return { energyLevel: -(task.durationMinutes * 0.3) };
  },
};
 
/**
 * Completing a task builds focus — harder tasks build more.
 */
const taskCompletedFocusBoost: StateRule = {
  name: "task-completed-focus-boost",
  description: "Builds focus after task completion; more for high difficulty",
  matches: (e) => e.type === "TASK_COMPLETED",
  apply: (e) => {
    const { task } = e as Extract<AppEvent, { type: "TASK_COMPLETED" }>;
    const boost = task.difficulty === "high" ? 10 : task.difficulty === "medium" ? 6 : 3;
    return { focusLevel: boost };
  },
};
 
/**
 * Completing any task builds momentum. Repeating familiar tasks
 * gives a smaller boost since there's less novelty.
 */
const taskCompletedMomentum: StateRule = {
  name: "task-completed-momentum",
  description: "Builds momentum on completion; less for repeat tasks",
  matches: (e) => e.type === "TASK_COMPLETED",
  apply: (e) => {
    const { task } = e as Extract<AppEvent, { type: "TASK_COMPLETED" }>;
    return { momentum: task.isRepeat ? 3 : 7 };
  },
};
 
/**
 * Completing a task, especially a hard one, boosts confidence.
 */
const taskCompletedConfidence: StateRule = {
  name: "task-completed-confidence",
  description: "Increases confidence on task completion",
  matches: (e) => e.type === "TASK_COMPLETED",
  apply: (e) => {
    const { task } = e as Extract<AppEvent, { type: "TASK_COMPLETED" }>;
    const boost = task.difficulty === "high" ? 8 : task.difficulty === "medium" ? 4 : 2;
    return { confidence: boost };
  },
};
 
/**
 * Failing a task spikes stress proportional to cognitive load.
 */
const taskFailedStress: StateRule = {
  name: "task-failed-stress",
  description: "Spikes stress proportional to cognitive load on failure",
  matches: (e) => e.type === "TASK_FAILED",
  apply: (e) => {
    const { task } = e as Extract<AppEvent, { type: "TASK_FAILED" }>;
    return { stressLevel: task.cognitiveLoad * 1.2 };
  },
};
 
/**
 * Failing still drains energy — effort was still expended.
 */
const taskFailedEnergyDrain: StateRule = {
  name: "task-failed-energy-drain",
  description: "Drains energy even on failure",
  matches: (e) => e.type === "TASK_FAILED",
  apply: (e) => {
    const { task } = e as Extract<AppEvent, { type: "TASK_FAILED" }>;
    return { energyLevel: -(task.durationMinutes * 0.5) };
  },
};
 
/**
 * Failing breaks focus and resets momentum.
 */
const taskFailedFocusMomentumLoss: StateRule = {
  name: "task-failed-focus-momentum-loss",
  description: "Losing focus and momentum on failure",
  matches: (e) => e.type === "TASK_FAILED",
  apply: () => ({ focusLevel: -12, momentum: -10 }),
};
 
/**
 * Failure dents confidence, scaled by difficulty.
 */
const taskFailedConfidenceDrop: StateRule = {
  name: "task-failed-confidence-drop",
  description: "Reduces confidence on failure",
  matches: (e) => e.type === "TASK_FAILED",
  apply: (e) => {
    const { task } = e as Extract<AppEvent, { type: "TASK_FAILED" }>;
    const drop = task.difficulty === "high" ? 6 : task.difficulty === "medium" ? 4 : 2;
    return { confidence: -drop };
  },
};
 
/**
 * Interruptions spike stress and shatter focus.
 */
const taskInterruptedPenalty: StateRule = {
  name: "task-interrupted-penalty",
  description: "Stress spike and focus loss from interruption",
  matches: (e) => e.type === "TASK_INTERRUPTED",
  apply: () => ({ stressLevel: 5, focusLevel: -15, momentum: -8 }),
};
 
/**
 * Taking a break restores energy and reduces stress.
 * Longer breaks restore more (logarithmic, not linear).
 */
const breakTakenRecovery: StateRule = {
  name: "break-taken-recovery",
  description: "Restores energy and lowers stress after a break",
  matches: (e) => e.type === "BREAK_TAKEN",
  apply: (e) => {
    const { durationMinutes } = e as Extract<AppEvent, { type: "BREAK_TAKEN" }>;
    const recovery = Math.log2(durationMinutes + 1) * 8;
    return { energyLevel: recovery, stressLevel: -recovery * 0.6 };
  },
};
 
/**
 * Starting a session gives a small focus and momentum prime.
 */
const sessionStartedPrime: StateRule = {
  name: "session-started-prime",
  description: "Small focus and momentum prime at session start",
  matches: (e) => e.type === "SESSION_STARTED",
  apply: () => ({ focusLevel: 5, momentum: 5 }),
};
 
/**
 * Ending a session releases stress accumulated during work.
 */
const sessionEndedRelief: StateRule = {
  name: "session-ended-relief",
  description: "Stress release at end of session",
  matches: (e) => e.type === "SESSION_ENDED",
  apply: () => ({ stressLevel: -10, momentum: -5 }),
};
 
export const taskRules: StateRule[] = [
  taskCompletedStressRelief,
  taskCompletedEnergyDrain,
  taskCompletedFocusBoost,
  taskCompletedMomentum,
  taskCompletedConfidence,
  taskFailedStress,
  taskFailedEnergyDrain,
  taskFailedFocusMomentumLoss,
  taskFailedConfidenceDrop,
  taskInterruptedPenalty,
  breakTakenRecovery,
  sessionStartedPrime,
  sessionEndedRelief,
];