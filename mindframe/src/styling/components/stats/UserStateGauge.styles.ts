import { StyleSheet } from "react-native";
import { colors } from "../../theme";

const SIZE = 80;

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: SIZE,
    marginTop: -4,
  },
  value: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: -8,
  },
  label: {
    fontSize: 11,
    color: colors.inkFaint,
    marginTop: 2,
    fontWeight: "500",
  },
});