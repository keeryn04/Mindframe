import { ScheduledTask } from "../types/Task.types";

export function getMonthGrid(year: number, month: number): Date[] {
  const firstOfMonth = new Date(year, month, 1);
  const startPadding = firstOfMonth.getDay();

  const cells: Date[] = [];
  for (let i = 0; i < 42; i++) {
    cells.push(new Date(year, month, 1 - startPadding + i));
  }
  return cells;
}

export function getWeekDays(date: Date): Date[] {
  const sunday = new Date(date);
  sunday.setDate(date.getDate() - date.getDay());
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    return d;
  });
}

function taskOccursOnDay(task: ScheduledTask, date: Date): boolean {
  const taskStart = new Date(task.startDateTime);
  const taskEnd = new Date(task.endDateTime);

  const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
  const dayEnd   = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);

  return taskStart <= dayEnd && taskEnd >= dayStart;
}

export function getTasksForDay(tasks: ScheduledTask[], date: string) {
  return tasks.filter(
    (t) => t.startDateTime.split('T')[0] === date
  );
}

export function getTasksForWeek(tasks: ScheduledTask[], weekDate: Date): ScheduledTask[] {
  const days = getWeekDays(weekDate);
  const weekStart = days[0];
  const weekEnd   = days[6];

  const start = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate(), 0, 0, 0, 0);
  const end   = new Date(weekEnd.getFullYear(),   weekEnd.getMonth(),   weekEnd.getDate(),   23, 59, 59, 999);

  return tasks.filter((t) => {
    const taskStart = new Date(t.startDateTime);
    const taskEnd   = new Date(t.endDateTime);
    return taskStart <= end && taskEnd >= start;
  });
}

export function dateTimeToHourOffset(dateTime: string, startHour: number): number {
  const d = new Date(dateTime);
  return (d.getHours() + d.getMinutes() / 60) - startHour;
}

export function getTaskTopPercent(
  startDateTime: string,
  visibleStartHour: number,
  visibleHours: number
): number {
  const offset = dateTimeToHourOffset(startDateTime, visibleStartHour);
  return Math.max(0, Math.min(100, (offset / visibleHours) * 100));
}

export function getTaskHeightPercent(
  startDateTime: string,
  endDateTime: string,
  visibleHours: number
): number {
  const start = new Date(startDateTime);
  const end   = new Date(endDateTime);
  const durationHours = (end.getTime() - start.getTime()) / 3_600_000;
  return Math.max(2, (durationHours / visibleHours) * 100);
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth()    === b.getMonth()    &&
    a.getDate()     === b.getDate()
  );
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function isPastDay(date: Date): boolean {
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const dateStart  = new Date(date.getFullYear(),  date.getMonth(),  date.getDate());
  return dateStart < todayStart;
}

const DAY_NAMES  = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
] as const;

export function formatMonthYear(year: number, month: number): string {
  return `${MONTH_NAMES[month]} ${year}`;
}

export function formatShortDate(date: Date): string {
  return `${DAY_NAMES[date.getDay()]} ${date.getDate()}`;
}

export function formatWeekRange(weekDate: Date): string {
  const days = getWeekDays(weekDate);
  const start = days[0];
  const end   = days[6];

  if (start.getMonth() === end.getMonth()) {
    return `${MONTH_NAMES[start.getMonth()]} ${start.getDate()}–${end.getDate()}, ${end.getFullYear()}`;
  }
  return (
    `${MONTH_NAMES[start.getMonth()]} ${start.getDate()} – ` +
    `${MONTH_NAMES[end.getMonth()]} ${end.getDate()}, ${end.getFullYear()}`
  );
}

export function formatDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Inverse of formatDateString. Built from local Y/M/D components rather
 * than `new Date("YYYY-MM-DD")`, which JS parses as UTC midnight and can
 * silently shift a day in negative UTC-offset timezones.
 */
export function dateStringToLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

/** Combines a "YYYY-MM-DD" date and "HH:MM" time into one local Date. */
export function timeStringToLocalDate(dateStr: string, timeStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  const [h, min] = timeStr.split(":").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1, h ?? 0, min ?? 0);
}

/** "HH:MM" (24h, zero-padded) from a Date — the inverse of timeStringToLocalDate. */
export function dateToTimeString(date: Date): string {
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

export function formatTime(dateTime: string): string {
  const d = new Date(dateTime);
  const h = d.getHours();
  const m = d.getMinutes();
  const suffix = h >= 12 ? "PM" : "AM";
  const hour   = h % 12 === 0 ? 12 : h % 12;
  const min    = m.toString().padStart(2, "0");
  return `${hour}:${min} ${suffix}`;
}

export function formatHourLabel(hour: number): string {
  if (hour === 0)  return "12 AM";
  if (hour === 12) return "12 PM";
  return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
}

export function addMonths(year: number, month: number, delta: number): { year: number; month: number } {
  const d = new Date(year, month + delta, 1);
  return { year: d.getFullYear(), month: d.getMonth() };
}

export function addWeeks(date: Date, delta: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + delta * 7);
  return d;
}

export function parseDateString(s: string): Date {
  return new Date(s);
}
