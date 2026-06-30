// ─────────────────────────────────────────────────────────────────────────────
// stats/components/PriorityBreakdown.tsx
//
// For each priority level (high / medium / low), shows horizontal progress
// bars for completed, delayed, and skipped — letting the user see at a glance
// whether they're avoiding hard tasks.
//
// Uses a hand-rolled horizontal bar layout (no chart library) because
// gifted-charts' grouped bar doesn't easily support horizontal rendering with
// labels on the left. The implementation is ~40 lines and fully readable.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  OUTCOME_COLORS,
  PRIORITY_COLORS,
  PRIORITY_LABELS,
} from "../../styling/statsTheme";
import { PriorityOutcomes } from "../../types/stats/stats.types";

interface Props {
  data: PriorityOutcomes[];
}

interface BarRowProps {
  label: string;
  count: number;
  total: number;
  color: string;
}

function BarRow({ label, count, total, color }: BarRowProps) {
  const pct = total === 0 ? 0 : count / total;

  return (
    <View style={styles.barRow}>
      <Text style={styles.barLabel}>{label}</Text>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            { width: `${Math.round(pct * 100)}%`, backgroundColor: color },
          ]}
        />
      </View>
      <Text style={styles.barCount}>{count}</Text>
    </View>
  );
}

interface PriorityGroupProps {
  outcomes: PriorityOutcomes;
}

function PriorityGroup({ outcomes }: PriorityGroupProps) {
  const { priority, completed, delayed, skipped } = outcomes;
  const total = completed + delayed + skipped;

  return (
    <View style={styles.group}>
      <View style={styles.groupHeader}>
        <View
          style={[
            styles.priorityBadge,
            { backgroundColor: PRIORITY_COLORS[priority] + "22" },
          ]}
        >
          <Text
            style={[styles.priorityLabel, { color: PRIORITY_COLORS[priority] }]}
          >
            {PRIORITY_LABELS[priority]}
          </Text>
        </View>
        <Text style={styles.totalLabel}>{total} task{total !== 1 ? "s" : ""}</Text>
      </View>

      {total === 0 ? (
        <Text style={styles.noneText}>None recorded</Text>
      ) : (
        <View style={styles.bars}>
          <BarRow
            label="Done"
            count={completed}
            total={total}
            color={OUTCOME_COLORS.completed}
          />
          <BarRow
            label="Delayed"
            count={delayed}
            total={total}
            color={OUTCOME_COLORS.delayed}
          />
          <BarRow
            label="Skipped"
            count={skipped}
            total={total}
            color={OUTCOME_COLORS.skipped}
          />
        </View>
      )}
    </View>
  );
}

export function PriorityBreakdown({ data }: Props) {
  return (
    <View style={styles.container}>
      {data.map((outcomes) => (
        <PriorityGroup key={outcomes.priority} outcomes={outcomes} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  group: {
    gap: 8,
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priorityBadge: {
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  priorityLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  totalLabel: {
    fontSize: 12,
    color: "#888780",
  },
  bars: {
    gap: 6,
  },
  barRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  barLabel: {
    width: 48,
    fontSize: 12,
    color: "#5F5E5A",
  },
  track: {
    flex: 1,
    height: 8,
    backgroundColor: "#D3D1C7",
    borderRadius: 4,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 4,
  },
  barCount: {
    width: 24,
    fontSize: 12,
    color: "#2C2C2A",
    fontWeight: "500",
    textAlign: "right",
  },
  noneText: {
    fontSize: 12,
    color: "#B4B2A9",
    paddingLeft: 4,
  },
});