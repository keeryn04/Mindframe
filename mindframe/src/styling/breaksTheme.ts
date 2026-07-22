// ─────────────────────────────────────────────────────────────────────────────
// src/styling/breaksTheme.ts
//
// Semantic color + label + glyph lookup tables for break activities.
// Kept separate from theme.ts because these map a *domain key*
// (breathing, movement, mindfulness…) to tokens, the same pattern as
// statsTheme.ts uses for stats metrics/outcomes/priorities.
// ─────────────────────────────────────────────────────────────────────────────

import { colors } from "./theme";
import { BreakActivityCategory } from "../types/AppEvent.types";

export const CATEGORY_COLORS: Record<BreakActivityCategory, string> = {
  breathing: colors.energy,
  movement: colors.momentum,
  mindfulness: colors.confidence,
  social: colors.info,
  rest: colors.brand,
};

export const CATEGORY_SOFT_COLORS: Record<BreakActivityCategory, string> = {
  breathing: colors.energySoft,
  movement: colors.momentumSoft,
  mindfulness: colors.confidenceSoft,
  social: colors.infoSoft,
  rest: colors.brandSoft,
};

export const CATEGORY_LABELS: Record<BreakActivityCategory, string> = {
  breathing: "Breathing",
  movement: "Movement",
  mindfulness: "Mindfulness",
  social: "Social",
  rest: "Rest",
};

export const CATEGORY_GLYPHS: Record<BreakActivityCategory, string> = {
  breathing: "◒",
  movement: "↝",
  mindfulness: "◉",
  social: "◇",
  rest: "◡",
};
