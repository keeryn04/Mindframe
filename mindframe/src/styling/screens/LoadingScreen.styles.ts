import { StyleSheet } from "react-native";
import { colors, radius } from "../theme";

export const styles = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: colors.bg },
  center:         { flex: 1, alignItems: "center", justifyContent: "center", gap: 28 },
  wordmarkWrap:   { flexDirection: "row", alignItems: "center", gap: 8 },
  wordmarkAccent: { width: 6, height: 32, borderRadius: radius.sm / 2, backgroundColor: colors.brand },
  wordmark:       { fontSize: 32, fontWeight: "700", color: colors.ink, letterSpacing: -1 },
  dotsRow:        { flexDirection: "row", gap: 8, height: 16, alignItems: "flex-end" },
  dot:            { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.brand },
  label:          { fontSize: 13, color: colors.inkFaint, letterSpacing: 0.3 },
});