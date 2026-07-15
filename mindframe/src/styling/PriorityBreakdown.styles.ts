import { StyleSheet } from "react-native";
import { colors, radius } from "./theme";

export const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  group: {
    gap: 8,
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priorityBadge: {
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  priorityLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  totalLabel: {
    fontSize: 12,
    color: colors.inkFaint,
  },
  bars: {
    gap: 6,
  },
  barRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  barLabel: {
    width: 48,
    fontSize: 12,
    color: colors.inkMuted,
  },
  track: {
    flex: 1,
    height: 8,
    backgroundColor: colors.surfaceSunken,
    borderRadius: radius.sm,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: radius.sm,
  },
  barCount: {
    width: 24,
    fontSize: 12,
    color: colors.ink,
    fontWeight: "500",
    textAlign: "right",
  },
  noneText: {
    fontSize: 12,
    color: colors.inkFaint,
    paddingLeft: 4,
  },
});