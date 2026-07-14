// ─────────────────────────────────────────────────────────────────────────────
// stats/components/UserStateGauge.tsx
//
// A semi-circular arc gauge for a single 0–100 cognitive metric.
// Drawn with react-native-svg — no third-party chart library needed here
// because an arc is simple enough to render directly and perfectly tailored
// to our metric semantics (inverted colour for stress).
//
// Accepts:
//   value        0–100
//   label        display name
//   color        the brand colour for this metric (from statsTheme)
//   isInverted   true for stress — high value = bad, arc fills red
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

interface Props {
  value: number;       // 0–100
  label: string;
  color: string;
  isInverted?: boolean;
}

const SIZE       = 80;   // total SVG canvas size (px)
const RADIUS     = 30;   // arc radius
const STROKE_W   = 7;
const CX         = SIZE / 2;
const CY         = SIZE / 2 + 6;   // shift centre down so the flat edge sits at bottom

// Convert 0–100 value to a dash offset for a semi-circle arc.
// The arc runs from 180° (left) to 0° (right) — a half circle.
const CIRCUMFERENCE = Math.PI * RADIUS;   // half circumference for 180° arc

function buildArcPath(cx: number, cy: number, r: number): string {
  // Draw the top half of a circle (left → right)
  return `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
}

/** Colour that reflects "how good is this reading" */
function resolveColor(value: number, brandColor: string, isInverted: boolean): string {
  if (isInverted) {
    // Stress: low = good (teal), medium = amber, high = red
    if (value > 75) return "#E24B4A";
    if (value > 50) return "#BA7517";
    return "#1D9E75";
  }
  return brandColor;
}

export function UserStateGauge({ value, label, color, isInverted = false }: Props) {
  const clamped   = Math.max(0, Math.min(100, value));
  const progress  = clamped / 100;
  const dashOffset = CIRCUMFERENCE * (1 - progress);
  const arcColor  = resolveColor(clamped, color, isInverted);
  const arcPath   = buildArcPath(CX, CY, RADIUS);

  return (
    <View style={styles.container}>
      <Svg width={SIZE} height={SIZE / 2 + 16}>
        {/* Track (unfilled arc) */}
        <Path
          d={arcPath}
          fill="none"
          stroke="#D3D1C7"        // c-gray-100
          strokeWidth={STROKE_W}
          strokeLinecap="round"
        />
        {/* Filled arc */}
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

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: SIZE,
    // Negative margin pulls the label up under the flat arc edge
    marginTop: -4,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: -8,   // overlap slightly into the arc gap
  },
  label: {
    fontSize: 11,
    color: "#888780",   // c-gray-400
    marginTop: 2,
    fontWeight: "500",
  },
});