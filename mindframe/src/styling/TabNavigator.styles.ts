import { Platform } from "react-native";
import { colors } from "./theme";

export const tabBarStyle = {
  backgroundColor: colors.surface,
  borderTopColor: colors.border,
  borderTopWidth: 1,
  height: Platform.OS === "ios" ? 84 : 64,
  paddingTop: 8,
  paddingBottom: Platform.OS === "ios" ? 28 : 10,
};