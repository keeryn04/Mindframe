import { DefaultTheme, Theme } from "@react-navigation/native";
import { colors } from "./theme";

// Passed to <NavigationContainer theme={navigationTheme}> so every screen —
// including ones we don't render ourselves, like native headers or
// system UI — inherits the same palette instead of React Navigation's
// default blue.
export const navigationTheme: Theme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.brand,
    background: colors.bg,
    card: colors.surface,
    text: colors.ink,
    border: colors.border,
    notification: colors.stress,
  },
};