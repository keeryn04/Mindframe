// ─────────────────────────────────────────────────────────────────────────────
// stats/components/StatsSummaryCard.tsx
//
// A single metric tile.  Renders a label, a large value, and an optional
// unit string.  Used in a horizontal row at the top of StatsScreen.
//
// Deliberately dumb — receives only display values, no computation here.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  label: string;
  value: string | number;
  unit?: string;
  accentColor?: string;
}

export function StatsSummaryCard({ label, value, unit, accentColor }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      <View style={styles.valueRow}>
        <Text style={[styles.value, accentColor ? { color: accentColor } : null]}>
          {value}
        </Text>
        {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#F1EFE8",   // c-gray-50 equivalent
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    minWidth: 76,
  },
  label: {
    fontSize: 11,
    color: "#5F5E5A",             // c-gray-600
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 2,
  },
  value: {
    fontSize: 26,
    fontWeight: "600",
    color: "#2C2C2A",             // c-gray-900
    lineHeight: 30,
  },
  unit: {
    fontSize: 12,
    color: "#888780",             // c-gray-400
    marginBottom: 3,
  },
});