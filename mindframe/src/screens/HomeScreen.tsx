import React from "react";
import { View, Text, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserStateStore } from "../store/useUserStateStore";
import { useBreakPromptStore } from "../store/useBreakPromptStore";
import { Recommendation, RecommendationCategory } from "../types/recommendations/Recommendation.types";
import { Calendar } from "../components/calendar/Calendar";
import { BreakMiniBar, getBreakEmphasis } from "../components/breaks/BreakMiniBar";
import { BreakSheet } from "../components/breaks/BreakSheet";
import { ScreenHeader } from "../components/ui/ScreenHeader";
import { semantic } from "../styling/theme";
import { styles, banner } from "../styling/screens/HomeScreen.styles";

const CATEGORY_STYLE: Record<RecommendationCategory, { bg: string; accent: string; label: string }> = {
  recovery:   { bg: semantic.recoverySoft, accent: semantic.recovery, label: "Recovery" },
  focus:      { bg: semantic.focusSoft, accent: semantic.focus, label: "Focus" },
  motivation: { bg: semantic.motivationSoft, accent: semantic.motivation, label: "Motivation" },
  warning:    { bg: semantic.warningSoft, accent: semantic.warning, label: "Warning" },
  celebrate:  { bg: semantic.celebrateSoft, accent: semantic.celebrate, label: "Nice work" },
};

// ─── Recommendation banner ─────────────────────────────────────────────────

function RecommendationBanner({ rec }: { rec: Recommendation }) {
  const s = CATEGORY_STYLE[rec.category];
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
        <Text style={banner.detail} numberOfLines={3}>{rec.detail}</Text>
      </View>
    </View>
  );
}

// ─── HomeScreen ───────────────────────────────────────────────────────────────

function formatWeekdayDate() {
  const today = new Date();
  return {
    weekday: today.toLocaleDateString("en-US", { weekday: "long" }),
    date: today.toLocaleDateString("en-US", { month: "long", day: "numeric" }),
  };
}

export function HomeScreen() {
  const state = useUserStateStore((s) => s.state);
  const recommendations = useUserStateStore((s) => s.recommendations);
  const topRec = recommendations[0] ?? null;

  const modalVisible = useBreakPromptStore((s) => s.modalVisible);
  const openModal = useBreakPromptStore((s) => s.openModal);
  const closeModal = useBreakPromptStore((s) => s.closeModal);

  const emphasis = getBreakEmphasis(state);
  const { weekday, date } = formatWeekdayDate();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScreenHeader title={weekday} subtitle={date} />
      {topRec && <RecommendationBanner rec={topRec} />}

      <View style={styles.calendar}>
        <Calendar />
      </View>

      {/* Collapsed mini bar — tapping it slides the full break sheet up */}
      <BreakMiniBar emphasis={emphasis} onPress={openModal} />

      {/* Expanded break sheet — takes over the full screen when opened */}
      <Modal visible={modalVisible} transparent animationType="none" onRequestClose={closeModal}>
        <BreakSheet onClose={closeModal} />
      </Modal>
    </SafeAreaView>
  );
}
