import { StyleSheet } from "react-native";
import { colors, radius, shadow, spacing, type } from "../../theme";

export const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  label: {
    ...type.caption,
    color: colors.inkFaint,
    textTransform: "uppercase",
    marginBottom: spacing.sm,
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    backgroundColor: colors.surfaceAlt,
  },
  fieldError: {
    borderColor: colors.stress,
  },
  glyph: {
    fontSize: 15,
  },
  value: {
    ...type.body,
    fontSize: 15,
    color: colors.ink,
  },
  errorText: {
    fontSize: 12,
    color: colors.stress,
    marginTop: 4,
  },

  // iOS picker floats as its own overlay (a transparent Modal) instead of
  // sitting inline in the form's layout, so opening it no longer pushes
  // the rest of the form down.
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  iosPickerCard: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: "center",
    ...shadow.raised,
  },
  iosPickerTitle: {
    ...type.subtitle,
    fontSize: 15,
    color: colors.ink,
    marginBottom: spacing.sm,
  },

  // Explicit sizing matters here: left to size itself inside the card's
  // padding, the inline calendar and the spinner both collapse — clipping
  // the spinner's numerals and stretching its selection highlight past
  // the width of the text it's supposed to sit behind.
  datePickerWrap: {
    width: 300,
    alignItems: "center",
  },
  datePicker: {
    width: 300,
    height: 340,
  },
  timePickerWrap: {
    width: "100%",
    alignItems: "center",
  },
  timePicker: {
    width: 220,
    height: 180,
  },

  doneWrap: {
    alignSelf: "stretch",
    marginTop: spacing.md,
  },
});
