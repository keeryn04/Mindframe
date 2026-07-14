import React from "react";
import { Text, View } from "react-native";
import { styles } from "../../styling/EmptyState.styles";

interface EmptyStateProps {
  glyph?: string;
  title: string;
  subtitle?: string;
}

export function EmptyState({ glyph = "○", title, subtitle }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.glyph}>{glyph}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}