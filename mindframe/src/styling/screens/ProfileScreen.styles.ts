import { StyleSheet } from "react-native";
import { colors, radius, shadow, spacing, type } from "../theme";

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  loadingSafe: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    ...type.body,
    color: colors.inkMuted,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.base,
  },

  identityCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.base,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: colors.inkOnBrand,
    fontWeight: "700",
    fontSize: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.sm,
    fontSize: 15,
    color: colors.ink,
    backgroundColor: colors.surfaceAlt,
  },
  colorLabel: {
    ...type.caption,
    color: colors.inkFaint,
    textTransform: "uppercase",
    marginBottom: spacing.sm,
  },
  colorPicker: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  colorSwatch: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: colors.ink,
  },
  bottomPad: {
    height: spacing.xxxl,
  },
});