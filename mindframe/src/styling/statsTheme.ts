// ─────────────────────────────────────────────────────────────────────────────
// stats/constants/statsTheme.ts
//
// All colours, labels, and display thresholds used across the Stats screen.
// Changing a colour here propagates everywhere automatically.
// ─────────────────────────────────────────────────────────────────────────────

import { TaskPriority } from '../types/calendar/Calendar.types';

// ── Cognitive metric colours ─────────────────────────────────────────────────
// Each metric has a single brand colour used in gauges and legends.
// stress uses red because it is the "danger" signal; others are positive.
export const METRIC_COLORS = {
  stressLevel: "#E24B4A",   // red   — high stress = bad
  energyLevel: "#1D9E75",   // teal  — energy = vitality
  focusLevel:  "#7F77DD",   // purple — focus = mental clarity
  momentum:    "#BA7517",   // amber  — momentum = forward motion
  confidence:  "#639922",   // green  — confidence = growth
} as const;

export const METRIC_LABELS = {
  stressLevel: "Stress",
  energyLevel: "Energy",
  focusLevel:  "Focus",
  momentum:    "Momentum",
  confidence:  "Confidence",
} as const;

// ── Task outcome colours ─────────────────────────────────────────────────────
export const OUTCOME_COLORS = {
  completed: "#1D9E75",   // teal
  delayed:   "#BA7517",   // amber
  skipped:   "#E24B4A",   // red
  pending:   "#888780",   // gray
} as const;

export const OUTCOME_LABELS = {
  completed: "Completed",
  delayed:   "Delayed",
  skipped:   "Skipped",
  pending:   "Pending",
} as const;

// ── Priority colours ─────────────────────────────────────────────────────────
export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  high:   "#E24B4A",
  medium: "#BA7517",
  low:    "#1D9E75",
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  high:   "High",
  medium: "Medium",
  low:    "Low",
};

// ── Thresholds used by gauge colour-banding ──────────────────────────────────
// stress is inverted — low stress is good.
export const GAUGE_THRESHOLDS = {
  stress: { warn: 50, danger: 75 },
  positive: { warn: 40, ok: 65 },   // energy, focus, momentum, confidence
} as const;

// ── Timeline ─────────────────────────────────────────────────────────────────
export const TIMELINE_DAYS = 7;