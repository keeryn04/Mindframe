import { create } from 'zustand';
import { CalendarState } from '../types/calendar/Calendar.types';
import { formatDateString } from '../utils/calendarUtils';
import { useUserStateStore } from './useUserStateStore';
import { TaskEvent, TaskEventType } from '../types/AppEvent.types';
import { ScheduledTask, Task } from '../types/Task.types';

export interface CalendarStore {
  tasks: ScheduledTask[];
  addTask: (task: ScheduledTask) => void;
  updateTask: (id: string, patch: Partial<ScheduledTask>) => void;
  removeTask: (id: string) => void;
  completeTask: (id: string) => void;
  failTask: (id: string) => void;
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
    tasks: [],
    selectedDate: formatDateString(new Date()),
    activeView: 'week',

    setSelectedDate: (date) => set({ selectedDate: date }),
    setActiveView: (view) => set({ activeView: view }),

    
    addTask: (task) => {
      set((state) => ({
        tasks: [...state.tasks, task],
      }));

      emitTaskEvent('TASK_CREATED', task);
    },

    updateTask: (id, patch) => {
      const existing = get().tasks.find((t) => t.id === id);
      if (!existing) return;

      const updated = { ...existing, ...patch };

      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? updated : t)),
      }));

      emitTaskEvent('TASK_UPDATED', updated);
    },

    removeTask: (id) => {
      const existing = get().tasks.find((t) => t.id === id);
      if (!existing) return;

      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
      }));

      emitTaskEvent('TASK_DELETED', existing);
    },


    setTasks: (tasks) => set({ tasks }),

    completeTask: (id) => {
      const task = get().tasks.find((t) => t.id === id); // read first
      if (!task) return;
      set((state) => ({
        tasks: state.tasks.map((t) => t.id === id ? { ...t, status: 'complete' } : t),
      }));
      emitTaskEvent('TASK_COMPLETED', task); // emit original
    },

    delayTask: (id) => {
      const task = get().tasks.find((t) => t.id === id);
      if (!task) return;
      set((state) => ({
        tasks: state.tasks.map((t) => t.id === id ? { ...t, status: 'delayed' } : t),
      }));
      emitTaskEvent('TASK_INTERRUPTED', task);
    },

    skipTask: (id) => {
      const task = get().tasks.find((t) => t.id === id);
      if (!task) return;
      set((state) => ({
        tasks: state.tasks.map((t) => t.id === id ? { ...t, status: 'skipped' } : t),
      }));
      emitTaskEvent('TASK_FAILED', task);
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


