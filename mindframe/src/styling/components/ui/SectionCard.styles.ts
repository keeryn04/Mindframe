import { StyleSheet } from "react-native";
import { colors, radius, shadow, spacing, type } from "../../theme";

export const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    overflow: "hidden",
    ...shadow.card,
  },
  rail: {
    width: 4,
    backgroundColor: colors.brandSoft,
  },
  body: {
    flex: 1,
    padding: spacing.base,
  },
  header: {
    marginBottom: spacing.md,
    gap: 2,
  },
  title: {
    ...type.subtitle,
    fontSize: 15,
    color: colors.ink,
  },
  subtitle: {
    ...type.body,
    fontSize: 12,
    color: colors.inkFaint,
  },
});