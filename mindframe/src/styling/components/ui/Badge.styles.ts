import { StyleSheet } from "react-native";
import { radius, spacing, type } from "../../theme";

export const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.pill,
    alignSelf: "flex-start",
  },
  label: {
    ...type.micro,
    letterSpacing: 0.4,
  },
});