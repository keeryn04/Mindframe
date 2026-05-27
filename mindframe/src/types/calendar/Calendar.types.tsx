import { ScheduledTask } from "../Task.types";

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'in_progress' | 'complete' | 'skipped' | 'failed' | 'delayed';
export type CalendarView = 'week' | 'month';

/**
 * A scheduled task block
 * Mirrors what the scheduling engine writes and what the UI reads.
 */
export interface CalendarKitEvent {
  id: string;
  title: string;
  start: { dateTime: string };
  end: { dateTime: string };
  color: string;
  _task: ScheduledTask;
}

export interface DotMarker {
  key: string;
  color: string;
  selectedColor?: string;
}

export interface MarkedDate {
  selected?: boolean;
  marked?: boolean;
  dots?: DotMarker[];
  selectedColor?: string;
}

export type MarkedDatesMap = Record<string, MarkedDate>;

export interface CalendarState {
  tasks: ScheduledTask[];
  selectedDate: string; //YYYY-MM-DD
  activeView: CalendarView; //which view is active

  setSelectedDate: (date: string) => void;
  setActiveView: (view: CalendarView) => void;
  addTask: (task: ScheduledTask) => void;
  updateTask: (id: string, patch: Partial<ScheduledTask>) => void;
  removeTask: (id: string) => void;
  setTasks: (tasks: ScheduledTask[]) => void;
  completeTask: (id: string) => void;
  skipTask: (id: string) => void;
  delayTask: (id: string) => void;
}