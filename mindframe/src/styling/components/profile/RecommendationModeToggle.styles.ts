import { StyleSheet } from "react-native";
import { colors, radius, spacing, type } from "../../theme";

export const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  label: {
    ...type.bodyStrong,
    fontSize: 14,
    color: colors.ink,
  },
  options: {
    gap: spacing.sm,
  },
  option: {
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  optionSelected: {
    borderColor: colors.brand,
    backgroundColor: colors.brandSoft,
  },
  optionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: 4,
  },
  radio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: colors.brand,
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.brand,
  },
  optionLabel: {
    ...type.bodyStrong,
    fontSize: 14,
    color: colors.ink,
  },
  optionLabelSelected: {
    color: colors.brand,
  },
  optionDescription: {
    ...type.body,
    fontSize: 12,
    color: colors.inkMuted,
    lineHeight: 17,
    marginLeft: 24,
  },
});