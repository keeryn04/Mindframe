// ─────────────────────────────────────────────────────────────────────────────
// screens/StatsScreen.tsx
//
// Layout-only screen. It calls useStatsData() once and fans the result out
// to each section. No logic lives here — all computation is in the hook and
// all rendering is in the leaf components.
//
// Scroll structure (top → bottom):
//   1. Summary row          — key numbers at a glance
//   2. Mental state         — arc gauges for 5 cognitive metrics
//   3. Task outcomes        — donut chart: completed / delayed / skipped
//   4. This week            — 7-day bar chart of daily completions
//   5. By priority          — horizontal bars grouped by priority level
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useStatsData } from "../utils/useStatsData";

import { ScreenHeader }          from "../components/ui/ScreenHeader";
import { SectionCard }          from "../components/ui/SectionCard";
import { StatsSummaryCard }     from "../components/stats/StatsSummaryCard";
import { UserStateGauge }       from "../components/stats/UserStateGauge";
import { TaskCompletionChart }  from "../components/stats/TaskCompletionChart";
import { ProductivityTimeline } from "../components/stats/ProductivityTimeline";
import { PriorityBreakdown }    from "../components/stats/PriorityBreakdown";

import {
  METRIC_COLORS,
  METRIC_LABELS,
  OUTCOME_COLORS,
} from "../styling/statsTheme";

import { styles } from "../styling/screens/StatsScreen.styles";

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDuration(minutes: number): string {
  if (minutes === 0) return "—";
  if (minutes < 60)  return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

function formatPct(rate: number): string {
  return `${Math.round(rate * 100)}`;
}

// ── Screen ───────────────────────────────────────────────────────────────────

export function StatsScreen() {
  const data = useStatsData();

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      <ScreenHeader title="Your stats" subtitle="How the week is going" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── 1. Summary row ─────────────────────────────────────────────── */}
        <View style={styles.summaryRow}>
          <StatsSummaryCard
            label="Done"
            value={data.completedCount}
            accentColor={OUTCOME_COLORS.completed}
          />
          <StatsSummaryCard
            label="Rate"
            value={formatPct(data.completionRate)}
            unit="%"
            accentColor={OUTCOME_COLORS.completed}
          />
          <StatsSummaryCard
            label="Streak"
            value={data.currentStreak}
            unit="d"
            accentColor={METRIC_COLORS.momentum}
          />
          <StatsSummaryCard
            label="Avg time"
            value={formatDuration(data.avgTaskDurationMinutes)}
            accentColor={METRIC_COLORS.focusLevel}
          />
        </View>

        {/* ── 2. Mental state ─────────────────────────────────────────────── */}
        <SectionCard
          title="Mental state"
          subtitle="Live snapshot of your cognitive metrics"
        >
          <View style={styles.gaugeGrid}>
            <UserStateGauge
              value={data.stressLevel}
              label={METRIC_LABELS.stressLevel}
              color={METRIC_COLORS.stressLevel}
              isInverted
            />
            <UserStateGauge
              value={data.energyLevel}
              label={METRIC_LABELS.energyLevel}
              color={METRIC_COLORS.energyLevel}
            />
            <UserStateGauge
              value={data.focusLevel}
              label={METRIC_LABELS.focusLevel}
              color={METRIC_COLORS.focusLevel}
            />
            <UserStateGauge
              value={data.momentum}
              label={METRIC_LABELS.momentum}
              color={METRIC_COLORS.momentum}
            />
            <UserStateGauge
              value={data.confidence}
              label={METRIC_LABELS.confidence}
              color={METRIC_COLORS.confidence}
            />
          </View>

          {/* Streak callout */}
          <View style={styles.streakRow}>
            <StreakPill label="Current streak" value={data.currentStreak} />
            <StreakPill label="Best streak"    value={data.longestStreak} />
          </View>
        </SectionCard>

        {/* ── 3. Task outcomes ────────────────────────────────────────────── */}
        <SectionCard
          title="Task outcomes"
          subtitle={`${data.totalTasks} total task${data.totalTasks !== 1 ? "s" : ""}`}
        >
          <TaskCompletionChart
            completedCount={data.completedCount}
            delayedCount={data.delayedCount}
            skippedCount={data.skippedCount}
            pendingCount={data.pendingCount}
            totalTasks={data.totalTasks}
          />
        </SectionCard>

        {/* ── 4. This week ────────────────────────────────────────────────── */}
        <SectionCard title="This week" subtitle="Completed tasks per day">
          <ProductivityTimeline days={data.last7Days} />
        </SectionCard>

        {/* ── 5. By priority ──────────────────────────────────────────────── */}
        <SectionCard
          title="By priority"
          subtitle="Are you avoiding your hardest tasks?"
        >
          <PriorityBreakdown data={data.byPriority} />
        </SectionCard>

        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Inline sub-component: streak pill ────────────────────────────────────────

function StreakPill({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.streakPill}>
      <Text style={styles.streakValue}>{value}</Text>
      <Text style={styles.streakLabel}>{label}</Text>
    </View>
  );
}