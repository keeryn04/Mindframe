
import { create } from "zustand";
import { formatDateString } from "../utils/calendarUtils";
import { useUserStateStore } from "./useUserStateStore";
import { TaskEvent, TaskEventType } from "../types/AppEvent.types";
import { ScheduledTask, Task } from "../types/Task.types";
import { createTaskRepo, FullTask } from "../db/repositories/taskRepo";
import { TaskStatus } from "../types/calendar/Calendar.types";

export interface TaskStore {
  tasks: ScheduledTask[];

  selectedDate: string;
  activeView: string;

  isHydrated: boolean;

  initialize: (repo: ReturnType<typeof createTaskRepo>) => Promise<void>;

  setSelectedDate: (date: string) => void;
  setActiveView: (view: string) => void;

  addTask: (task: ScheduledTask) => Promise<void>;
  updateTask: (id: string, patch: Partial<ScheduledTask>) => Promise<void>;
  removeTask: (id: string) => Promise<void>;

  completeTask: (id: string) => Promise<void>;
  delayTask: (id: string, newDate: string) => Promise<void>;
  skipTask: (id: string) => Promise<void>;
}

let repoRef: ReturnType<typeof createTaskRepo> | null = null;

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  selectedDate: formatDateString(new Date()),
  activeView: "week",
  isHydrated: false,

  setSelectedDate: (date) => set({ selectedDate: date }),
  setActiveView: (view) => set({ activeView: view }),

  initialize: async (repo) => {
    repoRef = repo;

    try {
      const fullTasks = await repo.getAll();

      const tasks: ScheduledTask[] = fullTasks.map((t) => ({
        id: t.id,
        title: t.title,
        startDateTime: t.startDateTime,
        endDateTime: t.endDateTime,
        color: t.color,
        priority: t.priority,
        status: t.status,
        subtasks: t.subtasks,
        isRecommended: t.isRecommended,
      }));

      set({ tasks, isHydrated: true });
    } catch (e) {
      // Loading existing tasks failed (corrupted storage, disk issue, etc).
      // Fall back to an empty task list rather than leaving the app stuck
      // on a permanent loading state — the user can still use the app and
      // new tasks will persist normally going forward.
      console.error("useTaskStore: failed to load tasks", e);
      set({ tasks: [], isHydrated: true });
    }
  },

  addTask: async (task) => {
    set((state) => ({
      tasks: [...state.tasks, task],
    }));

    await persistTask(task);
    emitTaskEvent("TASK_CREATED", task);
  },

  updateTask: async (id, patch) => {
    const existing = get().tasks.find((t) => t.id === id);
    if (!existing) return;

    const updated = { ...existing, ...patch };

    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? updated : t
      ),
    }));

    await persistTask(updated);
    emitTaskEvent("TASK_UPDATED", updated);
  },

  removeTask: async (id) => {
    const existing = get().tasks.find((t) => t.id === id);
    if (!existing) return;

    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    }));

    if (repoRef) {
      try {
        await repoRef.delete(id);
      } catch (e) {
        console.error("useTaskStore: failed to delete task", e);
      }
    }

    emitTaskEvent("TASK_DELETED", existing);
  },

  completeTask: async (id) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;

    const updated = { ...task, status: "complete" as TaskStatus };

    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? updated : t
      ),
    }));

    await persistTask(updated);
    emitTaskEvent("TASK_COMPLETED", task);
  },

  delayTask: async (id, newDate) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;

    // Keep the same time-of-day and duration; only the calendar date moves.
    const startTimePart = task.startDateTime.split('T')[1] ?? '00:00:00';
    const endTimePart = task.endDateTime.split('T')[1] ?? '00:00:00';

    const updated = {
      ...task,
      startDateTime: `${newDate}T${startTimePart}`,
      endDateTime: `${newDate}T${endTimePart}`,
      status: "delayed" as TaskStatus,
    };

    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? updated : t
      ),
    }));

    await persistTask(updated);
    emitTaskEvent("TASK_INTERRUPTED", task);
  },

  skipTask: async (id) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;

    const updated = { ...task, status: "skipped" as TaskStatus };

    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? updated : t
      ),
    }));

    await persistTask(updated);
    emitTaskEvent("TASK_FAILED", task);
  },
}));

function computeDuration(startDateTime: string, endDateTime: string): number {
  return (
    (new Date(endDateTime).getTime() -
      new Date(startDateTime).getTime()) /
    60000
  );
}

function mapPriorityToLoad(priority: string): number {
  switch (priority) {
    case 'high': return 8;
    case 'medium': return 5;
    case 'low': return 2;
    default: return 5;
  }
}

function mapPriorityToDifficulty(
  priority: string
): 'low' | 'medium' | 'high' {
  switch (priority) {
    case 'high': return 'high';
    case 'medium': return 'medium';
    case 'low': return 'low';
    default: return 'medium';
  }
}

function scheduledToTask(s: ScheduledTask): Task {
  const durationMinutes = computeDuration(s.startDateTime, s.endDateTime);
  const cognitiveLoad = mapPriorityToLoad(s.priority);
  return {
    id: s.id,
    cognitiveLoad,
    durationMinutes,
    difficulty: mapPriorityToDifficulty(s.priority),
    isRepeat: false,
  };
}

async function persistTask(task: ScheduledTask) {
  if (!repoRef) return;

  const full: FullTask = {
    ...task,
    cognitiveLoad: mapPriorityToLoad(task.priority),
    durationMinutes: computeDuration(
      task.startDateTime,
      task.endDateTime
    ),
    difficulty: mapPriorityToDifficulty(task.priority),
    isRepeat: false,
  };

  try {
    await repoRef.upsert(full);
  } catch (e) {
    // The in-memory task list already reflects the change (optimistic
    // update above) so the UI stays responsive; we log rather than throw
    // so a storage hiccup can't take down the whole app. The write will
    // simply be retried the next time this task is touched.
    console.error("useTaskStore: failed to persist task", task.id, e);
  }
}

function emitTaskEvent(
  type: TaskEventType,
  task: ScheduledTask
) {
  const dispatch = useUserStateStore.getState().dispatch;

  const event: TaskEvent = {
    type,
    task: scheduledToTask(task),
  };

  dispatch(event);
}
