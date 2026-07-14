import { StyleSheet } from "react-native";
import { colors, radius, spacing, type } from "./theme";

export const styles = StyleSheet.create({
  barRow: { flexDirection: "row", alignItems: "center", marginBottom: spacing.sm },
  barLabel: { width: 80, fontSize: 13, color: colors.inkMuted },
  barTrack: {
    flex: 1,
    height: 8,
    backgroundColor: colors.surfaceSunken,
    borderRadius: radius.sm,
    overflow: "hidden",
  },
  barFill: { height: "100%", borderRadius: radius.sm },
  barValue: {
    width: 32,
    textAlign: "right",
    ...type.micro,
    fontSize: 12,
    color: colors.inkMuted,
  },
});