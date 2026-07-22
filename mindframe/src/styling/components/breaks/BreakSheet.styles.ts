import { StyleSheet } from "react-native";
import { colors, radius, spacing, type } from "../../theme";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  handleWrap: {
    alignItems: "center",
    paddingTop: spacing.sm,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderStrong,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  headerText: {
    flex: 1,
    gap: 2,
    paddingRight: spacing.md,
  },
  title: {
    ...type.display,
    fontSize: 26,
    color: colors.ink,
  },
  subtitle: {
    ...type.body,
    fontSize: 14,
    color: colors.inkFaint,
  },

  chipScroll: {
    flexGrow: 0,
  },
  chipRow: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1.5,
  },
  chipGlyph: {
    fontSize: 13,
  },
  chipLabel: {
    ...type.bodyStrong,
    fontSize: 13,
  },

  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.base,
    paddingTop: 4,
    paddingBottom: spacing.xxl,
  },
  sessionContainer: {
    flex: 1,
    paddingHorizontal: spacing.base,
  },
});
