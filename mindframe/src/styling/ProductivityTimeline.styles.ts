import { StyleSheet } from "react-native";
import { colors } from "./theme";

export const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  axisLabel: {
    fontSize: 11,
    color: colors.inkFaint,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: colors.inkFaint,
  },
  total: {
    marginLeft: "auto",
    fontSize: 12,
    color: colors.inkMuted,
    fontWeight: "500",
  },
});