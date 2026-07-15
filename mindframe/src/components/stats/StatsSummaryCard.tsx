// ─────────────────────────────────────────────────────────────────────────────
// components/stats/StatsSummaryCard.tsx
//
// A single metric tile. Renders a label, a large value, and an optional
// unit string. Used in a horizontal row at the top of StatsScreen.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Text, View } from "react-native";
import { styles } from "../../styling/StatsSummaryCard.styles";

interface Props {
  label: string;
  value: string | number;
  unit?: string;
  accentColor?: string;
}

export function StatsSummaryCard({ label, value, unit, accentColor }: Props) {
  return (
    <View style={styles.card}>
      {accentColor && <View style={[styles.accentDot, { backgroundColor: accentColor }]} />}
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      <View style={styles.valueRow}>
        <Text style={[styles.value, accentColor ? { color: accentColor } : null]}>{value}</Text>
        {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </View>
    </View>
  );
}