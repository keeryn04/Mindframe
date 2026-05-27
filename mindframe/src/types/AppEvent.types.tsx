import { Task } from "./Task.types";

export type AppEvent =
  | { type: "TASK_COMPLETED";   task: Task }
  | { type: "TASK_FAILED";      task: Task }
  | { type: "TASK_INTERRUPTED"; task: Task }
  | { type: "TASK_CREATED";     task: Task }
  | { type: "TASK_UPDATED";     task: Task }
  | { type: "TASK_DELETED";     task: Task }
  | { type: "BREAK_TAKEN";      durationMinutes: number }
  | { type: "SESSION_STARTED" }
  | { type: "SESSION_ENDED" };


export type TaskEvent = Extract<AppEvent, { task: Task }>;
export type TaskEventType = TaskEvent["type"];
