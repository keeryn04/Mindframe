import { StyleSheet } from "react-native";
import { colors, radius, spacing, type } from "./theme";

export const styles = StyleSheet.create({
  container: {
    padding: spacing.base,
    gap: spacing.xl,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.base,
    gap: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  sectionHeadingRail: {
    width: 4,
    height: 16,
    borderRadius: 2,
    backgroundColor: colors.brand,
  },
  sectionTitle: {
    ...type.subtitle,
    color: colors.ink,
  },
  field: {
    gap: spacing.sm,
  },
  rowField: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  label: {
    ...type.bodyStrong,
    fontSize: 14,
    color: colors.ink,
  },
  hint: {
    ...type.body,
    fontSize: 12,
    color: colors.inkFaint,
    lineHeight: 16,
  },
});