// ─────────────────────────────────────────────────────────────────────────────
// components/stats/ProductivityTimeline.tsx
//
// 7-day bar chart of tasks completed per calendar day. Today's bar is
// highlighted; past days use a muted variant.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { DailyCount } from "../../types/stats/stats.types";
import { toLocalDateString } from "../../utils/useStatsData";
import { colors } from "../../styling/theme";
import { EmptyState } from "../ui/EmptyState";
import { styles } from "../../styling/ProductivityTimeline.styles";

interface Props {
  days: DailyCount[]; // exactly 7 entries, oldest first
}

const TODAY_COLOR = colors.energy;
const PAST_COLOR = "#9FE1CB";
const ZERO_COLOR = colors.surfaceSunken;

function buildBarData(days: DailyCount[]) {
  const today = toLocalDateString(new Date());

  return days.map((day) => {
    const isToday = day.date === today;
    const hasData = day.count > 0;
    return {
      value: day.count,
      label: day.label,
      frontColor: isToday ? TODAY_COLOR : hasData ? PAST_COLOR : ZERO_COLOR,
      topLabelComponent:
        day.count > 0
          ? () => (
              <Text
                style={{
                  fontSize: 10,
                  color: isToday ? TODAY_COLOR : colors.inkMuted,
                  fontWeight: "600",
                  marginBottom: 2,
                }}
              >
                {day.count}
              </Text>
            )
          : undefined,
    };
  });
}

export function ProductivityTimeline({ days }: Props) {
  const totalThisWeek = days.reduce((s, d) => s + d.count, 0);
  const barData = buildBarData(days);

  return (
    <View style={styles.container}>
      {totalThisWeek === 0 ? (
        <EmptyState glyph="▁" title="No completions this week" />
      ) : (
        <BarChart
          data={barData}
          barWidth={30}
          spacing={12}
          roundedTop
          hideRules
          hideAxesAndRules
          xAxisLabelTextStyle={styles.axisLabel}
          maxValue={Math.max(...days.map((d) => d.count)) + 1}
          height={120}
          noOfSections={3}
          isAnimated
        />
      )}
      <View style={styles.footer}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: TODAY_COLOR }]} />
          <Text style={styles.legendText}>Today</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: PAST_COLOR }]} />
          <Text style={styles.legendText}>Past days</Text>
        </View>
        <Text style={styles.total}>
          {totalThisWeek} task{totalThisWeek !== 1 ? "s" : ""} this week
        </Text>
      </View>
    </View>
  );
}