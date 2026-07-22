// ─────────────────────────────────────────────────────────────────────────────
// components/ui/SectionCard.tsx
//
// Shared card container used by every section in StatsScreen.
// Keeps visual consistency and eliminates repeated style declarations.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Text, View } from "react-native";
import { styles } from "../../styling/components/ui/SectionCard.styles";

interface Props {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function SectionCard({ title, subtitle, children }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.rail} />
      <View style={styles.body}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {children}
      </View>
    </View>
  );
}