export type TaskDifficulty = "low" | "medium" | "high";
 
export interface Task {
  id: string;
  cognitiveLoad: number;      //1–10
  durationMinutes: number;
  difficulty: TaskDifficulty;
  isRepeat?: boolean;         //user has done this task type before
}