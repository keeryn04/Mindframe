import { StyleSheet } from "react-native";
import { colors, radius, spacing, type } from "../theme";

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  calendar: { flex: 1 },
});

export const banner = StyleSheet.create({
  wrap:       { flexDirection: "row", marginHorizontal: spacing.md, marginBottom: spacing.sm, borderRadius: radius.md, overflow: "hidden" },
  strip:      { width: 4 },
  body:       { flex: 1, paddingHorizontal: spacing.md, paddingVertical: 10 },
  row:        { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: 3 },
  tag:        { fontSize: 9, fontWeight: "800", letterSpacing: 1 },
  urgentPill: { borderRadius: 3, paddingHorizontal: 6, paddingVertical: 1 },
  urgentText: { fontSize: 9, fontWeight: "800", color: colors.inkOnBrand, letterSpacing: 0.8 },
  headline:   { fontSize: 14, fontWeight: "700", marginBottom: 2 },
  detail:     { fontSize: 12, color: colors.inkMuted, lineHeight: 17 },
});

export const callout = StyleSheet.create({
  urgentTouchWrap: { marginHorizontal: spacing.md, marginBottom: spacing.sm },
  urgentCard: {
    backgroundColor: colors.stress,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
  },
  urgentLabel: { color: colors.inkOnBrand, fontSize: 15, fontWeight: "700" },
  urgentSub:   { color: "#FDE4DC", fontSize: 12, marginTop: 2 },

  suggestedCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.momentumSoft,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    borderWidth: 1,
    borderColor: "#F3DDB8",
  },
  suggestedLabel: { color: colors.momentum, fontSize: 14, fontWeight: "700" },
  suggestedSub:   { color: colors.momentum, fontSize: 12, marginTop: 2 },

  subtleLink: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    color: colors.inkMuted,
    fontSize: 13,
    textDecorationLine: "underline",
  },
});

export const modalStyles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surfaceAlt },
  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  pageTitle: { ...type.display, fontSize: 26, color: colors.ink },
  pageSubtitle: { ...type.body, fontSize: 14, color: colors.inkFaint, marginTop: 4 },
  list: { flex: 1 },
  listContent: { paddingHorizontal: spacing.base, paddingTop: 4, paddingBottom: spacing.xxl },
  sessionContainer: { flex: 1, paddingHorizontal: spacing.base },
});