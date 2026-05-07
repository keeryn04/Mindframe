import { Task } from "./UserTask";

export type AppEvent =
  | { type: "TASK_COMPLETED";   task: Task }
  | { type: "TASK_FAILED";      task: Task }
  | { type: "TASK_INTERRUPTED"; task: Task }
  | { type: "BREAK_TAKEN";      durationMinutes: number }
  | { type: "SESSION_STARTED" }
  | { type: "SESSION_ENDED" };