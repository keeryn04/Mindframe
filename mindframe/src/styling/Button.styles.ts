import { StyleSheet } from "react-native";
import { colors, radius, spacing, type } from "./theme";

export const styles = StyleSheet.create({
  base: {
    paddingVertical: 13,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  fullWidth: {
    alignSelf: "stretch",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.45,
  },

  primary: { backgroundColor: colors.brand },
  primaryLabel: { color: colors.inkOnBrand },

  secondary: { backgroundColor: colors.surface, borderColor: colors.borderStrong },
  secondaryLabel: { color: colors.ink },

  ghost: { backgroundColor: "transparent" },
  ghostLabel: { color: colors.brand },

  danger: { backgroundColor: colors.stress },
  dangerLabel: { color: colors.inkOnBrand },

  label: {
    ...type.bodyStrong,
  },
});