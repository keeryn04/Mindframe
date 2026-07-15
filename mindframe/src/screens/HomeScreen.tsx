import React from "react";
import { View, Text, Modal, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserStateStore } from "../store/useUserStateStore";
import { useBreakPromptStore } from "../store/useBreakPromptStore";
import { Recommendation, RecommendationCategory } from "../types/recommendations/Recommendation.types";
import { THRESHOLDS, UserState } from "../types/UserState.types";
import { Calendar } from "../components/calendar/Calendar";
import { breakActivities, BreakActivity } from "../types/breaks/BreakActivity.types";
import { ActivityCard } from "../components/ui/ActivityCard";
import { ActiveActivitySession } from "../components/breaks/ActiveActivitySession";
import { ScreenHeader } from "../components/ui/ScreenHeader";
import { IconButton } from "../components/ui/IconButton";
import { semantic } from "../styling/theme";
import { styles, banner, callout, modalStyles } from "../styling/screens/HomeScreen.styles";

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
        <Text style={banner.detail} numberOfLines={2}>{rec.detail}</Text>
      </View>
    </View>
  );
}

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
      <View style={callout.urgentTouchWrap} onTouchEnd={onPress}>
        <View style={callout.urgentCard}>
          <Text style={callout.urgentLabel}>{copy.label}</Text>
          {copy.sub && <Text style={callout.urgentSub}>{copy.sub}</Text>}
        </View>
      </View>
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

// ─── Break modal content ───────────────────────────────────────────────────

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
    <SafeAreaView style={modalStyles.root}>
      <View style={modalStyles.pageHeader}>
        <View>
          <Text style={modalStyles.pageTitle}>Take a break</Text>
          <Text style={modalStyles.pageSubtitle}>
            {active ? active.title : "Pick something that fits how you're feeling right now."}
          </Text>
        </View>
        <IconButton glyph="✕" label="Close" onPress={onClose} />
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
    </SafeAreaView>
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

      <BreakCallout emphasis={emphasis} onPress={openModal} />

      <Modal visible={modalVisible} animationType="slide" onRequestClose={closeModal}>
        <BreakModalContent onClose={closeModal} />
      </Modal>
    </SafeAreaView>
  );
}