// ─────────────────────────────────────────────────────────────────────────────
// stats/types.ts
//
// All derived data shapes for the Stats screen live here.
// Components import from this file; they never compute their own data.
// ─────────────────────────────────────────────────────────────────────────────

export type TaskPriority = "high" | "medium" | "low";

export type TaskOutcome = "completed" | "delayed" | "skipped" | "pending";

/** One day's worth of completions for the timeline chart. */
export interface DailyCount {
  /** date string, e.g. "2025-06-18" */
  date: string;
  /** Human-readable short label, e.g. "Mon" */
  label: string;
  count: number;
}

/** Outcome counts for a single priority tier. */
export interface PriorityOutcomes {
  priority: TaskPriority;
  completed: number;
  delayed: number;
  skipped: number;
}

/** The full derived dataset consumed by the Stats screen and its children. */
export interface StatsData {
  // ── User state snapshot ───────────────────────────────────────────────────
  stressLevel: number;    // 0–100
  energyLevel: number;    // 0–100
  focusLevel: number;     // 0–100
  momentum: number;       // 0–100
  confidence: number;     // 0–100

  // ── Task outcome totals ───────────────────────────────────────────────────
  totalTasks: number;
  completedCount: number;
  delayedCount: number;
  skippedCount: number;
  pendingCount: number;

  /** Value 0–1. Excludes pending tasks from the denominator. */
  completionRate: number;

  /** Average minutes from start to end across all completed tasks. */
  avgTaskDurationMinutes: number;

  // ── Breakdown by priority ─────────────────────────────────────────────────
  byPriority: PriorityOutcomes[];

  // ── Timeline (last 7 days) ────────────────────────────────────────────────
  /** Ordered oldest → newest; always exactly 7 entries. */
  last7Days: DailyCount[];

  // ── Streaks ───────────────────────────────────────────────────────────────
  currentStreak: number;
  longestStreak: number;
}