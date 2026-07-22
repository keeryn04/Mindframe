// ─────────────────────────────────────────────────────────────────────────────
// components/stats/UserStateGauge.tsx
//
// A semi-circular arc gauge for a single 0–100 cognitive metric.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { colors } from "../../styling/theme";
import { styles } from "../../styling/components/stats/UserStateGauge.styles";

interface Props {
  value: number; // 0–100
  label: string;
  color: string;
  isInverted?: boolean;
}

const SIZE = 80;
const RADIUS = 30;
const STROKE_W = 7;
const CX = SIZE / 2;
const CY = SIZE / 2 + 6;

const CIRCUMFERENCE = Math.PI * RADIUS;

function buildArcPath(cx: number, cy: number, r: number): string {
  return `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
}

function resolveColor(value: number, brandColor: string, isInverted: boolean): string {
  if (isInverted) {
    if (value > 75) return colors.stress;
    if (value > 50) return colors.momentum;
    return colors.energy;
  }
  return brandColor;
}

export function UserStateGauge({ value, label, color, isInverted = false }: Props) {
  const clamped = Math.max(0, Math.min(100, value));
  const progress = clamped / 100;
  const dashOffset = CIRCUMFERENCE * (1 - progress);
  const arcColor = resolveColor(clamped, color, isInverted);
  const arcPath = buildArcPath(CX, CY, RADIUS);

  return (
    <View style={styles.container}>
      <Svg width={SIZE} height={SIZE / 2 + 16}>
        <Path
          d={arcPath}
          fill="none"
          stroke={colors.surfaceSunken}
          strokeWidth={STROKE_W}
          strokeLinecap="round"
        />
        <Path
          d={arcPath}
          fill="none"
          stroke={arcColor}
          strokeWidth={STROKE_W}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
        />
      </Svg>
      <Text style={[styles.value, { color: arcColor }]}>{Math.round(clamped)}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}