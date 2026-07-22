import { StyleSheet } from "react-native";
import { colors, spacing, type } from "../../theme";

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxl,
    gap: 4,
  },
  glyph: {
    fontSize: 22,
    color: colors.inkFaint,
    marginBottom: spacing.xs,
  },
  title: {
    ...type.bodyStrong,
    color: colors.inkMuted,
  },
  subtitle: {
    ...type.body,
    fontSize: 13,
    color: colors.inkFaint,
    textAlign: "center",
    maxWidth: 260,
  },
});