// ─────────────────────────────────────────────────────────────────────────────
// components/stats/TaskCompletionChart.tsx
//
// Donut chart + legend showing the split of completed / delayed / skipped /
// pending tasks across all time.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { OUTCOME_COLORS, OUTCOME_LABELS } from "../../styling/statsTheme";
import { colors } from "../../styling/theme";
import { EmptyState } from "../ui/EmptyState";
import { styles } from "../../styling/components/stats/TaskCompletionChart.styles";

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
    { key: "delayed", count: props.delayedCount },
    { key: "skipped", count: props.skippedCount },
    { key: "pending", count: props.pendingCount },
  ];

  return entries
    .filter(({ count }) => count > 0)
    .map(({ key, count }) => ({
      value: count,
      color: OUTCOME_COLORS[key],
      label: OUTCOME_LABELS[key],
    }));
}

export function TaskCompletionChart(props: Props) {
  const { totalTasks, completedCount } = props;
  const slices = buildSlices(props);
  const completionPct = totalTasks === 0 ? 0 : Math.round((completedCount / totalTasks) * 100);

  if (totalTasks === 0) {
    return <EmptyState glyph="◔" title="No tasks yet" subtitle="Add tasks to see your completion breakdown" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.chartRow}>
        <PieChart
          data={slices}
          donut
          radius={68}
          innerRadius={46}
          innerCircleColor={colors.surface}
          centerLabelComponent={() => (
            <View style={styles.centerLabel}>
              <Text style={styles.centerPct}>{completionPct}%</Text>
              <Text style={styles.centerSub}>done</Text>
            </View>
          )}
        />

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