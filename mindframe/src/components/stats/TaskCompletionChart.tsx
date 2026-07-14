// ─────────────────────────────────────────────────────────────────────────────
// stats/components/TaskCompletionChart.tsx
//
// Donut chart + legend showing the split of completed / delayed / skipped /
// pending tasks across all time.
//
// Uses react-native-gifted-charts (PieChart) — lightweight, zero native deps.
// Install: npx expo install react-native-gifted-charts react-native-linear-gradient
//
// Responsibilities:
//   • Receive raw counts
//   • Build the pie data array (only slices with count > 0)
//   • Render chart + legend
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { OUTCOME_COLORS, OUTCOME_LABELS } from "../../styling/statsTheme";

interface Props {
  completedCount: number;
  delayedCount: number;
  skippedCount: number;
  pendingCount: number;
  totalTasks: number;
}

interface PieSlice {
  value: number;
  color: string;
  label: string;
}

function buildSlices(props: Props): PieSlice[] {
  const entries: { key: keyof typeof OUTCOME_COLORS; count: number }[] = [
    { key: "completed", count: props.completedCount },
    { key: "delayed",   count: props.delayedCount },
    { key: "skipped",   count: props.skippedCount },
    { key: "pending",   count: props.pendingCount },
  ];

  return entries
    .filter(({ count }) => count > 0)
    .map(({ key, count }) => ({
      value: count,
      color: OUTCOME_COLORS[key],
      label: OUTCOME_LABELS[key],
    }));
}

function EmptyState() {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No tasks yet</Text>
      <Text style={styles.emptySubText}>Add tasks to see your completion breakdown</Text>
    </View>
  );
}

export function TaskCompletionChart(props: Props) {
  const { totalTasks, completedCount } = props;
  const slices = buildSlices(props);
  const completionPct =
    totalTasks === 0 ? 0 : Math.round((completedCount / totalTasks) * 100);

  if (totalTasks === 0) return <EmptyState />;

  return (
    <View style={styles.container}>
      <View style={styles.chartRow}>
        {/* Donut */}
        <PieChart
          data={slices}
          donut
          radius={68}
          innerRadius={46}
          innerCircleColor={"#FAFAF8"}
          centerLabelComponent={() => (
            <View style={styles.centerLabel}>
              <Text style={styles.centerPct}>{completionPct}%</Text>
              <Text style={styles.centerSub}>done</Text>
            </View>
          )}
        />

        {/* Legend */}
        <View style={styles.legend}>
          {slices.map((slice) => (
            <View key={slice.label} style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: slice.color }]} />
              <Text style={styles.legendLabel}>{slice.label}</Text>
              <Text style={styles.legendCount}>{slice.value}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
  },
  centerLabel: {
    alignItems: "center",
  },
  centerPct: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2C2C2A",
  },
  centerSub: {
    fontSize: 11,
    color: "#888780",
    fontWeight: "500",
  },
  legend: {
    gap: 10,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    fontSize: 13,
    color: "#5F5E5A",
    flex: 1,
  },
  legendCount: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2C2C2A",
    minWidth: 24,
    textAlign: "right",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 6,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#5F5E5A",
  },
  emptySubText: {
    fontSize: 13,
    color: "#888780",
  },
});