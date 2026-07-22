import { StyleSheet } from "react-native";
import { colors, spacing, type } from "../../theme";

export const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...type.display,
    fontSize: 28,
    color: colors.ink,
  },
  subtitle: {
    ...type.body,
    fontSize: 14,
    color: colors.inkMuted,
  },
  right: {
    marginLeft: spacing.md,
  },
});