// ─────────────────────────────────────────────────────────────────────────────
// stats/hooks/useStatsData.ts
//
// Single hook that reads from both Zustand stores and returns a fully-derived
// StatsData object.  Components never compute — they only render.
//
// Design notes:
//  • useMemo guards prevent re-derivation unless tasks or userState change.
//  • All helper functions are pure and unit-testable in isolation.
//  • "pending" = any status that is not complete, delayed, or skipped.
// ─────────────────────────────────────────────────────────────────────────────

import { useMemo } from "react";
import { useTaskStore } from "../store/useTaskStore";
import { useUserStateStore } from "../store/useUserStateStore";
import { ScheduledTask } from "../types/Task.types";
import { TIMELINE_DAYS } from "../styling/statsTheme";
import { TaskPriority } from "../types/calendar/Calendar.types";
import { DailyCount, PriorityOutcomes, StatsData } from "../types/stats/stats.types";

// ── Pure helpers ─────────────────────────────────────────────────────────────

function isCompleted(t: ScheduledTask): boolean {
  return t.status === "complete";
}

function isDelayed(t: ScheduledTask): boolean {
  return t.status === "delayed";
}

function isSkipped(t: ScheduledTask): boolean {
  return t.status === "skipped";
}

function isPending(t: ScheduledTask): boolean {
  return !isCompleted(t) && !isDelayed(t) && !isSkipped(t);
}

export function toLocalDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function shortDayLabel(date: string): string {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[new Date(date).getDay()];
}

function buildLast7Days(tasks: ScheduledTask[]): DailyCount[] {
  const counts: DailyCount[] = [];
  const today = new Date();

  for (let i = TIMELINE_DAYS - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const date = toLocalDateString(d);

    const count = tasks.filter(
      (t) => isCompleted(t) && t.startDateTime.startsWith(date)
    ).length;

    counts.push({ date: date, label: shortDayLabel(date), count });
  }

  return counts;
}

function buildByPriority(tasks: ScheduledTask[]): PriorityOutcomes[] {
  const priorities: TaskPriority[] = ["high", "medium", "low"];

  return priorities.map((priority) => {
    const subset = tasks.filter((t) => t.priority === priority);
    return {
      priority,
      completed: subset.filter(isCompleted).length,
      delayed:   subset.filter(isDelayed).length,
      skipped:   subset.filter(isSkipped).length,
    };
  });
}

function computeAvgDuration(tasks: ScheduledTask[]): number {
  const completed = tasks.filter(isCompleted);
  if (completed.length === 0) return 0;

  const totalMs = completed.reduce((sum, t) => {
    const start = new Date(t.startDateTime).getTime();
    const end   = new Date(t.endDateTime).getTime();
    return sum + Math.max(0, end - start);
  }, 0);

  return Math.round(totalMs / completed.length / 60_000);
}

/**
 * Streak = consecutive calendar days (most recent first) that each have
 * at least one completed task.
 */
function computeStreaks(tasks: ScheduledTask[]): {
  currentStreak: number;
  longestStreak: number;
} {
  const completedDates = new Set(
    tasks
      .filter(isCompleted)
      .map((t) => toLocalDateString(new Date(t.startDateTime)))
  );

  if (completedDates.size === 0) return { currentStreak: 0, longestStreak: 0 };

  // Build a sorted list of unique completion dates (descending)
  const sorted = Array.from(completedDates).sort((a, b) =>
    b.localeCompare(a)
  );

  // Current streak — walk back from today
  const todayStr = toLocalDateString(new Date());
  let currentStreak = 0;
  const cursor = new Date();

  while (true) {
    const date = toLocalDateString(cursor);
    if (completedDates.has(date)) {
      currentStreak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      // Allow a gap for today if nothing done yet
      if (date === todayStr) {
        cursor.setDate(cursor.getDate() - 1);
        continue;
      }
      break;
    }
  }

  // Longest streak — full scan
  let longestStreak = 0;
  let run = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diffDays =
      (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);

    if (Math.round(diffDays) === 1) {
      run++;
      longestStreak = Math.max(longestStreak, run);
    } else {
      run = 1;
    }
  }

  longestStreak = Math.max(longestStreak, currentStreak, 1);

  return { currentStreak, longestStreak };
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useStatsData(): StatsData {
  const tasks     = useTaskStore((s) => s.tasks);
  const userState = useUserStateStore((s) => s.state);

  return useMemo<StatsData>(() => {
    const completedCount = tasks.filter(isCompleted).length;
    const delayedCount   = tasks.filter(isDelayed).length;
    const skippedCount   = tasks.filter(isSkipped).length;
    const pendingCount   = tasks.filter(isPending).length;
    const totalTasks     = tasks.length;

    const resolvedCount = completedCount + delayedCount + skippedCount;
    const completionRate =
      resolvedCount === 0 ? 0 : completedCount / resolvedCount;

    const { currentStreak, longestStreak } = computeStreaks(tasks);

    return {
      // User state
      stressLevel: userState.stressLevel,
      energyLevel: userState.energyLevel,
      focusLevel:  userState.focusLevel,
      momentum:    userState.momentum,
      confidence:  userState.confidence,

      // Totals
      totalTasks,
      completedCount,
      delayedCount,
      skippedCount,
      pendingCount,
      completionRate,
      avgTaskDurationMinutes: computeAvgDuration(tasks),

      // Breakdowns
      byPriority: buildByPriority(tasks),
      last7Days:  buildLast7Days(tasks),

      // Streaks
      currentStreak,
      longestStreak,
    };
  }, [tasks, userState]);
}