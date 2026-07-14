import { StyleSheet } from "react-native";
import { colors, radius } from "./theme";

export const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
  },
  sm: { width: 30, height: 30 },
  md: { width: 36, height: 36 },
  pressed: { opacity: 0.7 },

  glyph: { fontSize: 16, fontWeight: "600" },
  defaultGlyph: { color: colors.ink },
  mutedGlyph: { color: colors.inkMuted },
  dangerGlyph: { color: colors.stress },
});