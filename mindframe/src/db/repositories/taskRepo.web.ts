import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task, ScheduledTask } from "../../types/Task.types";

export type FullTask = Task & ScheduledTask;
const KEY = "tasks";

async function readAll(): Promise<FullTask[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}
async function writeAll(tasks: FullTask[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(tasks));
}

export function createTaskRepo(_db?: unknown) {
  return {
    async getAll() { return readAll(); },
    async getById(id: string) {
      return (await readAll()).find((t) => t.id === id) ?? null;
    },
    async upsert(task: FullTask) {
      const tasks = await readAll();
      const idx = tasks.findIndex((t) => t.id === task.id);
      if (idx >= 0) tasks[idx] = task; else tasks.push(task);
      await writeAll(tasks);
    },
    async delete(id: string) {
      await writeAll((await readAll()).filter((t) => t.id !== id));
    },
    async clearAll() {
      await AsyncStorage.removeItem(KEY);
    },
  };
}