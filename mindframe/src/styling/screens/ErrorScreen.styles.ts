import { StyleSheet } from "react-native";
import { colors, radius, spacing } from "../theme";

export const styles = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: colors.bg },
  center:       { flex: 1, alignItems: "center", justifyContent: "center",
                  paddingHorizontal: spacing.xxl, gap: spacing.xl },

  iconWrap:     { width: 64, height: 64, alignItems: "center", justifyContent: "center" },
  iconRing:     { position: "absolute", width: 64, height: 64, borderRadius: 32,
                  borderWidth: 2, borderColor: colors.stress, opacity: 0.3 },
  iconGlyph:    { fontSize: 30, fontWeight: "700", color: colors.stress, lineHeight: 34 },

  textBlock:    { alignItems: "center", gap: spacing.sm },
  title:        { fontSize: 22, fontWeight: "700", color: colors.ink, letterSpacing: -0.4 },
  hint:         { fontSize: 14, color: colors.inkMuted, lineHeight: 21, textAlign: "center" },

  errorBox:     { width: "100%", backgroundColor: colors.surfaceAlt, borderRadius: radius.md,
                  padding: spacing.md, gap: 6 },
  errorLabel:   { fontSize: 9, fontWeight: "800", color: colors.inkFaint, letterSpacing: 1 },
  errorMessage: { fontSize: 12, color: colors.inkMuted, lineHeight: 18, fontFamily: "monospace" },

  retryWrap:    { minWidth: 180 },
});