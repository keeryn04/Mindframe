// ─────────────────────────────────────────────────────────────────────────────
// src/styling/theme.ts
//
// Single source of truth for the app's visual language.
//
// Concept: an "instrument panel for your mind" — the app treats the user's
// cognitive state (stress / energy / focus / momentum / confidence) as
// real, readable data, so the palette is built around five distinct
// "readings" rather than one generic brand color, on a calm, paper-toned
// backdrop that stays out of the way. Every accent below is used
// consistently for the *same* meaning everywhere in the app: brand/focus
// is always the same violet, recovery is always the same teal, and so on.
//
// Do not inline hex values or magic numbers in components — pull from here
// so the whole app moves together if the palette ever changes.
// ─────────────────────────────────────────────────────────────────────────────

export const colors = {
  bg: "#F3F6F0",
  surface: "#FFFFFF",
  surfaceAlt: "#ECEFE6",
  surfaceSunken: "#E7EAE0",
  border: "#DEE4D7",
  borderStrong: "#C7CEBC",

  ink: "#1E241F",
  inkMuted: "#5C6459",
  inkFaint: "#8F968A",
  inkOnBrand: "#FFFFFF",

  // Brand / focus — the app's identity color, used for primary actions
  brand: "#463C82",
  brandHover: "#372F68",
  brandSoft: "#EBE8FA",

  // Energy / recovery — teal, positive & restorative
  energy: "#0E7A67",
  energySoft: "#E1F4EE",

  // Stress / warning / danger — rust, never the AI-cliché terracotta
  stress: "#B14A34",
  stressSoft: "#FBEAE3",

  // Momentum — ochre amber
  momentum: "#9C6B18",
  momentumSoft: "#FAF0DA",

  // Confidence — muted plum
  confidence: "#7C4568",
  confidenceSoft: "#F5EAF0",

  // Info / celebrate — steel blue
  info: "#1F6693",
  infoSoft: "#E5F1F8",

  overlay: "rgba(23, 26, 20, 0.5)",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

// A restrained type scale. RN can't easily load custom display faces
// without extra native config, so distinctiveness comes from weight,
// tracking, and size relationships rather than a swapped-in font family.
export const type = {
  display: { fontSize: 30, fontWeight: "700" as const, letterSpacing: -0.6 },
  title: { fontSize: 22, fontWeight: "700" as const, letterSpacing: -0.3 },
  subtitle: { fontSize: 17, fontWeight: "600" as const, letterSpacing: -0.1 },
  body: { fontSize: 15, fontWeight: "400" as const },
  bodyStrong: { fontSize: 15, fontWeight: "600" as const },
  caption: { fontSize: 12, fontWeight: "600" as const, letterSpacing: 0.6 },
  micro: { fontSize: 11, fontWeight: "500" as const, letterSpacing: 0.3 },
};

export const shadow = {
  card: {
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  raised: {
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 6,
  },
} as const;

// Status-bearing accents, keyed by meaning so components don't have to
// re-derive "which color means recovery" themselves.
export const semantic = {
  recovery: colors.energy,
  recoverySoft: colors.energySoft,
  warning: colors.stress,
  warningSoft: colors.stressSoft,
  focus: colors.brand,
  focusSoft: colors.brandSoft,
  motivation: colors.momentum,
  motivationSoft: colors.momentumSoft,
  celebrate: colors.info,
  celebrateSoft: colors.infoSoft,
} as const;

export const theme = { colors, spacing, radius, type, shadow, semantic };
export type Theme = typeof theme;
export default theme;