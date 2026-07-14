import React from "react";
import { View, Text, StyleSheet, SafeAreaView, Modal, FlatList } from "react-native";
import { useUserStateStore } from "../store/useUserStateStore";
import { useBreakPromptStore } from "../store/useBreakPromptStore";
import { Recommendation, RecommendationCategory } from "../types/recommendations/Recommendation.types";
import { THRESHOLDS, UserState } from "../types/UserState.types";
import { Calendar } from "../components/calendar/Calendar";
import { breakActivities, BreakActivity } from "../types/breaks/BreakActivity.types";
import { ActivityCard } from "../components/ui/ActivityCard";
import { ActiveActivitySession } from "../components/breaks/ActiveActivitySession";

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

// ─── Recommendation banner (unchanged) ────────────────────────────────────────

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
  wrap:       { flexDirection: "row", marginHorizontal: 12, marginBottom: 8, borderRadius: 10, overflow: "hidden" },
  strip:      { width: 4 },
  body:       { flex: 1, paddingHorizontal: 12, paddingVertical: 10 },
  row:        { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 3 },
  tag:        { fontSize: 9, fontWeight: "800", letterSpacing: 1 },
  urgentPill: { borderRadius: 3, paddingHorizontal: 6, paddingVertical: 1 },
  urgentText: { fontSize: 9, fontWeight: "800", color: "#fff", letterSpacing: 0.8 },
  headline:   { fontSize: 14, fontWeight: "700", marginBottom: 2 },
  detail:     { fontSize: 12, color: "#555", lineHeight: 17 },
});

// ─── Header (unchanged) ────────────────────────────────────────────────────────

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

// ─── Break emphasis ─────────────────────────────────────────────────────────
// Pure function of state — same thresholds already used by BreakPromptModal
// and the recovery recommendation rules, so "low energy" means one thing
// across the app.

type BreakEmphasis = "urgent" | "suggested" | "subtle";

function getBreakEmphasis(state: UserState): BreakEmphasis {
  if (state.energyLevel < THRESHOLDS.criticalEnergy || state.stressLevel > THRESHOLDS.highStressCritical) {
    return "urgent";
  }
  if (state.energyLevel < THRESHOLDS.lowEnergy || state.stressLevel > THRESHOLDS.elevatedStress) {
    return "suggested";
  }
  return "subtle";
}

const EMPHASIS_COPY: Record<BreakEmphasis, { label: string; sub?: string }> = {
  urgent:    { label: "Take a break now",  sub: "Your energy is critically low" },
  suggested: { label: "Consider a break",  sub: "Energy is getting low" },
  subtle:    { label: "Need a break?" },
};

function BreakCallout({ emphasis, onPress }: { emphasis: BreakEmphasis; onPress: () => void }) {
  const copy = EMPHASIS_COPY[emphasis];

  if (emphasis === "urgent") {
    return (
      <Text onPress={onPress} style={callout.urgentTouchWrap}>
        <View style={callout.urgentCard}>
          <Text style={callout.urgentLabel}>{copy.label}</Text>
          {copy.sub && <Text style={callout.urgentSub}>{copy.sub}</Text>}
        </View>
      </Text>
    );
  }

  if (emphasis === "suggested") {
    return (
      <View style={callout.suggestedCard} onTouchEnd={onPress}>
        <Text style={callout.suggestedLabel}>{copy.label}</Text>
        {copy.sub && <Text style={callout.suggestedSub}>{copy.sub}</Text>}
      </View>
    );
  }

  return (
    <Text style={callout.subtleLink} onPress={onPress}>
      {copy.label}
    </Text>
  );
}

const callout = StyleSheet.create({
  urgentTouchWrap: { marginHorizontal: 12, marginBottom: 8 },
  urgentCard: {
    backgroundColor: "#D85A30",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  urgentLabel: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
  urgentSub:   { color: "#FDE4DC", fontSize: 12, marginTop: 2 },

  suggestedCard: {
    marginHorizontal: 12,
    marginBottom: 8,
    backgroundColor: "#FEF3E2",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#F3DDB8",
  },
  suggestedLabel: { color: "#854F0B", fontSize: 14, fontWeight: "700" },
  suggestedSub:   { color: "#9A6A2E", fontSize: 12, marginTop: 2 },

  subtleLink: {
    marginHorizontal: 16,
    marginBottom: 8,
    color: C.textMuted,
    fontSize: 13,
    textDecorationLine: "underline",
  },
});

// ─── Break modal content (moved from BreaksScreen.tsx) ────────────────────────

function BreakModalContent({ onClose }: { onClose: () => void }) {
  const dispatch = useUserStateStore((s) => s.dispatch);
  const [active, setActive] = React.useState<BreakActivity | null>(null);

  function startActivity(activity: BreakActivity) {
    setActive(activity);
  }

  function completeActivity(actualMinutes: number) {
    if (!active) return;
    dispatch({
      type: "BREAK_TAKEN",
      durationMinutes: actualMinutes,
      activityType: active.category,
    });
    setActive(null);
    onClose();
  }

  function cancelActivity() {
    setActive(null);
  }

  return (
    <View style={modalStyles.root}>
      <View style={modalStyles.pageHeader}>
        <Text style={modalStyles.pageTitle}>Take a break</Text>
        <Text style={modalStyles.pageSubtitle}>
          {active ? active.title : "Pick something that fits how you're feeling right now."}
        </Text>
        <Text style={modalStyles.closeLink} onPress={onClose}>Close</Text>
      </View>

      {active ? (
        <View style={modalStyles.sessionContainer}>
          <ActiveActivitySession
            activity={active}
            onComplete={completeActivity}
            onCancel={cancelActivity}
          />
        </View>
      ) : (
        <FlatList
          style={modalStyles.list}
          data={breakActivities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ActivityCard activity={item} onPress={startActivity} />}
          contentContainerStyle={modalStyles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const modalStyles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F1EFE8" },
  pageHeader: { paddingTop: 56, paddingHorizontal: 20, paddingBottom: 12 },
  pageTitle: { fontSize: 28, fontWeight: "700", color: "#2C2C2A" },
  pageSubtitle: { fontSize: 14, color: "#888780", marginTop: 4 },
  closeLink: { position: "absolute", top: 56, right: 20, fontSize: 14, color: "#534AB7", fontWeight: "600" },
  list: { flex: 1 },
  listContent: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 32 },
  sessionContainer: { flex: 1, paddingHorizontal: 16 },
});

// ─── HomeScreen ───────────────────────────────────────────────────────────────

export function HomeScreen() {
  const state = useUserStateStore((s) => s.state);
  const recommendations = useUserStateStore((s) => s.recommendations);
  const topRec = recommendations[0] ?? null;

  const modalVisible = useBreakPromptStore((s) => s.modalVisible);
  const openModal = useBreakPromptStore((s) => s.openModal);
  const closeModal = useBreakPromptStore((s) => s.closeModal);

  const emphasis = getBreakEmphasis(state);

  return (
    <SafeAreaView style={styles.safe}>
      <Header />
      {topRec && <RecommendationBanner rec={topRec} />}
      <View style={styles.calendar}>
        <Calendar />
      </View>
      <BreakCallout emphasis={emphasis} onPress={openModal} />

      <Modal visible={modalVisible} animationType="slide" onRequestClose={closeModal}>
        <BreakModalContent onClose={closeModal} />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:     { flex: 1, backgroundColor: C.bg },
  calendar: { flex: 1 },
});