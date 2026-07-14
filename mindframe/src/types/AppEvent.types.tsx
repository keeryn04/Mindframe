import { Task } from "./Task.types";

/**
 * The kind of break activity that was performed. Drives which
 * category-specific StateRules fire in TaskRules.types.tsx.
 */
export type BreakActivityCategory =
  | "breathing"
  | "movement"
  | "mindfulness"
  | "social"
  | "rest";

export type AppEvent =
  | { type: "TASK_COMPLETED";   task: Task }
  | { type: "TASK_FAILED";      task: Task }
  | { type: "TASK_INTERRUPTED"; task: Task }
  | { type: "TASK_CREATED";     task: Task }
  | { type: "TASK_UPDATED";     task: Task }
  | { type: "TASK_DELETED";     task: Task }
  // activityType is optional so any existing caller that only knows
  // the duration (e.g. a generic "take a break" CTA) still works —
  // it just won't trigger the category-specific bonus rules.
  | { type: "BREAK_TAKEN";      durationMinutes: number; activityType?: BreakActivityCategory }
  | { type: "SESSION_STARTED" }
  | { type: "SESSION_ENDED" };


export type TaskEvent = Extract<AppEvent, { task: Task }>;
export type TaskEventType = TaskEvent["type"];