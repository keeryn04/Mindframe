// ─────────────────────────────────────────────────────────────────────────────
// stats/components/SectionCard.tsx
//
// Shared card container used by every section in StatsScreen.
// Keeps visual consistency and eliminates repeated style declarations.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function SectionCard({ title, subtitle, children }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#2C2C2A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    marginBottom: 14,
    gap: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2C2C2A",
  },
  subtitle: {
    fontSize: 12,
    color: "#888780",
  },
});