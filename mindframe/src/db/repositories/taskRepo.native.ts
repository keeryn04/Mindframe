import { SQLiteDatabase } from "expo-sqlite";
import { Task, ScheduledTask } from "../../types/Task.types";

export type FullTask = Task & ScheduledTask;

function mapRowToTask(row: any): FullTask {
  return {
    id: row.id,
    title: row.title,
    startDateTime: row.start_date_time,
    endDateTime: row.end_date_time,
    color: row.color,
    priority: row.priority,
    status: row.status,
    isRecommended: !!row.is_recommended,
    subtasks: row.subtasks ? JSON.parse(row.subtasks) : [],

    cognitiveLoad: row.cognitive_load,
    durationMinutes: row.duration_minutes,
    difficulty: row.difficulty,
    isRepeat: !!row.is_repeat,
  };
}

function mapTaskToRow(task: FullTask) {
  return {
    ...task,
    is_recommended: task.isRecommended ? 1 : 0,
    cognitive_load: task.cognitiveLoad,
    duration_minutes: task.durationMinutes,
    is_repeat: task.isRepeat ? 1 : 0,
    subtasks: task.subtasks ? JSON.stringify(task.subtasks) : null,
  };
}

export function createTaskRepo(db: SQLiteDatabase) {
  return {
    async getAll(): Promise<FullTask[]> {
      const rows = await db.getAllAsync<any>("SELECT * FROM tasks");
      return rows.map(mapRowToTask);
    },

    async getById(id: string): Promise<FullTask | null> {
      const row = await db.getFirstAsync<any>(
        "SELECT * FROM tasks WHERE id = ?",
        [id]
      );
      return row ? mapRowToTask(row) : null;
    },

    async upsert(task: FullTask): Promise<void> {
      const t = mapTaskToRow(task);

      await db.runAsync(
        `
        INSERT INTO tasks (
          id, title, start_date_time, end_date_time,
          color, priority, status, is_recommended,
          cognitive_load, duration_minutes, difficulty,
          is_repeat, subtasks
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          title = excluded.title,
          start_date_time = excluded.start_date_time,
          end_date_time = excluded.end_date_time,
          color = excluded.color,
          priority = excluded.priority,
          status = excluded.status,
          is_recommended = excluded.is_recommended,
          cognitive_load = excluded.cognitive_load,
          duration_minutes = excluded.duration_minutes,
          difficulty = excluded.difficulty,
          is_repeat = excluded.is_repeat,
          subtasks = excluded.subtasks
        `,
        [
          t.id,
          t.title,
          t.startDateTime,
          t.endDateTime,
          t.color,
          t.priority,
          t.status,
          t.is_recommended,
          t.cognitive_load,
          t.duration_minutes,
          t.difficulty,
          t.is_repeat,
          t.subtasks,
        ]
      );
    },

    async delete(id: string): Promise<void> {
      await db.runAsync("DELETE FROM tasks WHERE id = ?", [id]);
    },

    async clearAll(): Promise<void> {
      await db.runAsync("DELETE FROM tasks");
    },
  };
}