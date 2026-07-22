import React from "react";
import { Pressable, Text, View } from "react-native";
import { UserState, THRESHOLDS } from "../../types/UserState.types";
import { colors } from "../../styling/theme";
import { styles } from "../../styling/components/breaks/BreakMiniBar.styles";

export type BreakEmphasis = "urgent" | "suggested" | "subtle";

export function getBreakEmphasis(state: UserState): BreakEmphasis {
  if (state.energyLevel < THRESHOLDS.criticalEnergy || state.stressLevel > THRESHOLDS.highStressCritical) {
    return "urgent";
  }
  if (state.energyLevel < THRESHOLDS.lowEnergy || state.stressLevel > THRESHOLDS.elevatedStress) {
    return "suggested";
  }
  return "subtle";
}

const EMPHASIS_COPY: Record<BreakEmphasis, { label: string; sub: string }> = {
  urgent:    { label: "Take a break now",  sub: "Energy is critically low" },
  suggested: { label: "Consider a break",  sub: "Energy is getting low" },
  subtle:    { label: "Need a break?",     sub: "Tap to browse activities" },
};

const EMPHASIS_ACCENT: Record<BreakEmphasis, string> = {
  urgent: colors.stress,
  suggested: colors.momentum,
  subtle: colors.brand,
};

interface BreakMiniBarProps {
  emphasis: BreakEmphasis;
  onPress: () => void;
}

export function BreakMiniBar({ emphasis, onPress }: BreakMiniBarProps) {
  const copy = EMPHASIS_COPY[emphasis];
  const accent = EMPHASIS_ACCENT[emphasis];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.bar, pressed && styles.barPressed]}
      accessibilityRole="button"
      accessibilityLabel="Open break activities"
    >
      <View style={[styles.dot, { backgroundColor: accent }]} />

      <View style={styles.textBlock}>
        <Text style={styles.label}>{copy.label}</Text>
        <Text style={styles.sub}>{copy.sub}</Text>
      </View>

      <View style={styles.chevronWrap}>
        <View style={styles.chevronUp} />
      </View>
    </Pressable>
  );
}
