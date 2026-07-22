import { StyleSheet } from "react-native";
import { colors, radius, type } from "../../theme";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    padding: 3,
  },
  option: {
    flex: 1,
    paddingVertical: 9,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.sm,
  },
  optionSelected: {
    backgroundColor: colors.surface,
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  label: {
    ...type.body,
    fontSize: 13,
    color: colors.inkMuted,
    fontWeight: "500",
  },
  labelSelected: {
    color: colors.brand,
    fontWeight: "700",
  },
});