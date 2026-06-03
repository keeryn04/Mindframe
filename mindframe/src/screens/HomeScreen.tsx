import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useUserStateStore } from "../store/useUserStateStore";
import { Recommendation, RecommendationCategory } from "../types/recommendations/Recommendation.types";
import { CalendarScreen } from "../components/calendar/CalendarScreen";

// ─── Palette ─────────────────────────────────────────────────────────────────

const C = {
  bg:          "#FAFAF8",
  surface:     "#FFFFFF",
  border:      "#EDEDEA",
  textPrimary: "#1A1A18",
  textMuted:   "#888780",
};

const CATEGORY_COLOR: Record<RecommendationCategory, { bg: string; accent: string; label: string }> = {
  recovery:   { bg: "#E8F8F2", accent: "#0F6E56", label: "Recovery"   },
  focus:      { bg: "#EEEDFE", accent: "#534AB7", label: "Focus"      },
  motivation: { bg: "#FEF3E2", accent: "#854F0B", label: "Motivation" },
  warning:    { bg: "#FCEBEB", accent: "#A32D2D", label: "Warning"    },
  celebrate:  { bg: "#E8F4FD", accent: "#1565A8", label: "Nice work"  },
};

// ─── Recommendation banner ────────────────────────────────────────────────────

function RecommendationBanner({ rec }: { rec: Recommendation }) {
  const s = CATEGORY_COLOR[rec.category];
  return (
    <View style={[banner.wrap, { backgroundColor: s.bg }]}>
      <View style={[banner.strip, { backgroundColor: s.accent }]} />
      <View style={banner.body}>
        <View style={banner.row}>
          <Text style={[banner.tag, { color: s.accent }]}>{s.label.toUpperCase()}</Text>
          {rec.priority === "urgent" && (
            <View style={[banner.urgentPill, { backgroundColor: s.accent }]}>
              <Text style={banner.urgentText}>URGENT</Text>
            </View>
          )}
        </View>
        <Text style={[banner.headline, { color: s.accent }]}>{rec.headline}</Text>
        <Text style={banner.detail} numberOfLines={2}>{rec.detail}</Text>
      </View>
    </View>
  );
}

const banner = StyleSheet.create({
  wrap:       { flexDirection: "row", marginHorizontal: 12, marginBottom: 8,
                borderRadius: 10, overflow: "hidden" },
  strip:      { width: 4 },
  body:       { flex: 1, paddingHorizontal: 12, paddingVertical: 10 },
  row:        { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 3 },
  tag:        { fontSize: 9, fontWeight: "800", letterSpacing: 1 },
  urgentPill: { borderRadius: 3, paddingHorizontal: 6, paddingVertical: 1 },
  urgentText: { fontSize: 9, fontWeight: "800", color: "#fff", letterSpacing: 0.8 },
  headline:   { fontSize: 14, fontWeight: "700", marginBottom: 2 },
  detail:     { fontSize: 12, color: "#555", lineHeight: 17 },
});

// ─── Header ───────────────────────────────────────────────────────────────────

function Header() {
  const today = new Date();
  const weekday = today.toLocaleDateString("en-US", { weekday: "long" });
  const date    = today.toLocaleDateString("en-US", { month: "long", day: "numeric" });

  return (
    <View style={header.wrap}>
      <Text style={header.weekday}>{weekday}</Text>
      <Text style={header.date}>{date}</Text>
    </View>
  );
}

const header = StyleSheet.create({
  wrap:    { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  weekday: { fontSize: 24, fontWeight: "700", color: C.textPrimary, letterSpacing: -0.3 },
  date:    { fontSize: 14, color: C.textMuted, marginTop: 1 },
});

// ─── HomeScreen ───────────────────────────────────────────────────────────────

export function HomeScreen() {
  const recommendations = useUserStateStore((s) => s.recommendations);
  const topRec = recommendations[0] ?? null;

  return (
    <SafeAreaView style={styles.safe}>
      <Header />
      {topRec && <RecommendationBanner rec={topRec} />}
      <View style={styles.calendar}>
        <CalendarScreen />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:     { flex: 1, backgroundColor: C.bg },
  calendar: { flex: 1 },
});