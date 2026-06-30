// ─────────────────────────────────────────────────────────────────────────────
// stats/components/ProductivityTimeline.tsx
//
// 7-day bar chart of tasks completed per calendar day.
// Today's bar is highlighted in teal; past days use a muted variant.
//
// Uses react-native-gifted-charts (BarChart).
//
// Responsibilities:
//   • Convert DailyCount[] into gifted-charts BarData[]
//   • Highlight today
//   • Handle the zero-data case
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { DailyCount } from "../../types/stats/stats.types";
import { toLocalDateString } from "../../utils/useStatsData";

interface Props {
  days: DailyCount[];     // exactly 7 entries, oldest first
}

const TODAY_COLOR = "#1D9E75";        // teal
const PAST_COLOR  = "#9FE1CB";        // teal-100 (muted)
const ZERO_COLOR  = "#D3D1C7";        // gray-100

function buildBarData(days: DailyCount[]) {
  const today = toLocalDateString(new Date());
  const maxCount = Math.max(...days.map((d) => d.count), 1);

  return days.map((day) => {
    const isToday = day.date === today;
    const hasData = day.count > 0;
    return {
      value: day.count,
      label: day.label,
      frontColor: isToday
        ? TODAY_COLOR
        : hasData
        ? PAST_COLOR
        : ZERO_COLOR,
      topLabelComponent:
        day.count > 0
          ? () => (
              <Text
                style={{
                  fontSize: 10,
                  color: isToday ? TODAY_COLOR : "#5F5E5A",
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

function EmptyState() {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No completions this week</Text>
    </View>
  );
}

export function ProductivityTimeline({ days }: Props) {
  const totalThisWeek = days.reduce((s, d) => s + d.count, 0);
  const barData = buildBarData(days);

  return (
    <View style={styles.container}>
      {totalThisWeek === 0 ? (
        <EmptyState />
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

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  axisLabel: {
    fontSize: 11,
    color: "#888780",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: "#888780",
  },
  total: {
    marginLeft: "auto",
    fontSize: 12,
    color: "#5F5E5A",
    fontWeight: "500",
  },
  emptyContainer: {
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 13,
    color: "#888780",
  },
});