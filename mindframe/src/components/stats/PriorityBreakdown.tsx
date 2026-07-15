// ─────────────────────────────────────────────────────────────────────────────
// components/stats/PriorityBreakdown.tsx
//
// For each priority level (high / medium / low), shows horizontal progress
// bars for completed, delayed, and skipped — letting the user see at a
// glance whether they're avoiding hard tasks.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Text, View } from "react-native";
import {
  OUTCOME_COLORS,
  PRIORITY_COLORS,
  PRIORITY_LABELS,
} from "../../styling/statsTheme";
import { PriorityOutcomes } from "../../types/stats/stats.types";
import { styles } from "../../styling/PriorityBreakdown.styles";

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
        <View style={[styles.fill, { width: `${Math.round(pct * 100)}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.barCount}>{count}</Text>
    </View>
  );
}

function PriorityGroup({ outcomes }: { outcomes: PriorityOutcomes }) {
  const { priority, completed, delayed, skipped } = outcomes;
  const total = completed + delayed + skipped;

  return (
    <View style={styles.group}>
      <View style={styles.groupHeader}>
        <View style={[styles.priorityBadge, { backgroundColor: PRIORITY_COLORS[priority] + "22" }]}>
          <Text style={[styles.priorityLabel, { color: PRIORITY_COLORS[priority] }]}>
            {PRIORITY_LABELS[priority]}
          </Text>
        </View>
        <Text style={styles.totalLabel}>{total} task{total !== 1 ? "s" : ""}</Text>
      </View>

      {total === 0 ? (
        <Text style={styles.noneText}>None recorded</Text>
      ) : (
        <View style={styles.bars}>
          <BarRow label="Done" count={completed} total={total} color={OUTCOME_COLORS.completed} />
          <BarRow label="Delayed" count={delayed} total={total} color={OUTCOME_COLORS.delayed} />
          <BarRow label="Skipped" count={skipped} total={total} color={OUTCOME_COLORS.skipped} />
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