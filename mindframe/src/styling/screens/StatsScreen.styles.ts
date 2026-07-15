import { StyleSheet } from "react-native";
import { colors, radius, spacing } from "../theme";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.base,
    paddingTop: 4,
  },
  summaryRow: {
    flexDirection: "row",
    marginBottom: spacing.md,
    marginHorizontal: -4,
  },
  gaugeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    gap: spacing.md,
    marginBottom: spacing.base,
  },
  streakRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  streakPill: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  streakValue: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.ink,
  },
  streakLabel: {
    fontSize: 12,
    color: colors.inkFaint,
    flex: 1,
  },
  bottomPad: {
    height: spacing.xxl,
  },
});