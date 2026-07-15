import { StyleSheet } from "react-native";
import { colors, radius, spacing, type } from "./theme";

export const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginHorizontal: 4,
    minWidth: 76,
    borderWidth: 1,
    borderColor: colors.border,
  },
  accentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginBottom: 6,
  },
  label: {
    ...type.micro,
    color: colors.inkMuted,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 2,
  },
  value: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.ink,
    lineHeight: 28,
  },
  unit: {
    fontSize: 12,
    color: colors.inkFaint,
    marginBottom: 3,
  },
});