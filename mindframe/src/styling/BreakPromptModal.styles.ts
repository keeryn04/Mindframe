import { StyleSheet } from "react-native";
import { colors, radius, shadow, spacing, type } from "./theme";

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    width: "100%",
    maxWidth: 360,
    ...shadow.raised,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.stressSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  icon: {
    fontSize: 22,
    color: colors.stress,
  },
  headline: {
    ...type.subtitle,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  detail: {
    ...type.body,
    fontSize: 14,
    color: colors.inkMuted,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  actions: {
    gap: spacing.sm,
  },
});