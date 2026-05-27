import { TaskStatus } from "./calendar/Calendar.types";

export type TaskDifficulty = "low" | "medium" | "high";

export interface BaseTask {
  id: string;
}

export interface ScheduledTask extends BaseTask {
  title: string;
  startDateTime: string;
  endDateTime: string;
  color: string;
  priority: TaskPriority;
  status: TaskStatus;
  subtasks?: string[];
  isRecommended: boolean;
}
 
export interface Task extends BaseTask {
  cognitiveLoad: number;      //1–10
  durationMinutes: number;
  difficulty: TaskDifficulty;
  isRepeat?: boolean;         //user has done this task type before
}
