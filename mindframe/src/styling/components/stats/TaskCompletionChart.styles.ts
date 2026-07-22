import { StyleSheet } from "react-native";
import { colors } from "../../theme";

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
  },
  centerLabel: {
    alignItems: "center",
  },
  centerPct: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.ink,
  },
  centerSub: {
    fontSize: 11,
    color: colors.inkFaint,
    fontWeight: "500",
  },
  legend: {
    gap: 10,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    fontSize: 13,
    color: colors.inkMuted,
    flex: 1,
  },
  legendCount: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
    minWidth: 24,
    textAlign: "right",
  },
});