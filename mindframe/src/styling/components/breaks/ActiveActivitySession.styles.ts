import { StyleSheet } from "react-native";
import { colors, spacing, type } from "../../theme";

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: spacing.xl,
  },
  title: {
    ...type.subtitle,
    color: colors.ink,
    marginBottom: spacing.lg,
  },
  dialWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
  },
  dialCenter: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  timer: {
    fontSize: 34,
    fontWeight: "300",
    color: colors.ink,
    fontVariant: ["tabular-nums"],
  },
  steps: {
    marginBottom: spacing.xl,
    alignSelf: "stretch",
    gap: 10,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  stepDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.energy,
    marginTop: 7,
  },
  step: {
    ...type.body,
    fontSize: 14,
    color: colors.inkMuted,
    flex: 1,
    lineHeight: 20,
  },
  actions: {
    alignSelf: "stretch",
    gap: spacing.sm,
  },
});
