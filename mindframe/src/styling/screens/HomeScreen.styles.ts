import { StyleSheet } from "react-native";
import { colors, radius, spacing } from "../theme";

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
