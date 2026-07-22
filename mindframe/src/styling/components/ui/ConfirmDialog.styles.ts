import { StyleSheet } from "react-native";
import { colors, radius, shadow, spacing, type } from "../../theme";

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  card: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    ...shadow.raised,
  },
  title: {
    ...type.subtitle,
    color: colors.ink,
    marginBottom: 6,
  },
  message: {
    ...type.body,
    color: colors.inkMuted,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  actionItem: {
    flex: 1,
  },
});