import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import {
  UserPreferences,
  WorkStyle,
  EnergyPattern,
  StressToleranceLevel,
} from "../../types/UserPreferences.types";
import { SegmentedControl } from "../ui/SegmentedControl";
import { RecommendationModeToggle } from "./RecommendationModeToggle";

interface Props {
  preferences: UserPreferences;
  onChange: (patch: Partial<UserPreferences>) => void;
}

const WORK_STYLE_OPTIONS: { value: WorkStyle; label: string }[] = [
  { value: "deep-focus", label: "Deep focus" },
  { value: "both", label: "Both" },
  { value: "flexible", label: "Flexible" },
];

const ENERGY_PATTERN_OPTIONS: { value: EnergyPattern; label: string }[] = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
  { value: "inconsistent", label: "Varies" },
];

const STRESS_TOLERANCE_OPTIONS: { value: StressToleranceLevel; label: string }[] = [
  { value: "low", label: "Sensitive" },
  { value: "medium", label: "Balanced" },
  { value: "high", label: "Resilient" },
];

const MAX_REC_OPTIONS = [
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
];

export function PreferencesForm({ preferences, onChange }: Props) {
  return (
    <View style={styles.container}>
      {/* Work behaviour */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Work style</Text>

        <View style={styles.field}>
          <Text style={styles.label}>
            How do you prefer to structure your sessions?
          </Text>
          <SegmentedControl
            options={WORK_STYLE_OPTIONS}
            value={preferences.workStyle}
            onChange={(v) => {
                onChange({ workStyle: v });
            }}
            />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>
            When are you naturally most productive?
          </Text>
          <SegmentedControl
            options={ENERGY_PATTERN_OPTIONS}
            value={preferences.energyPattern}
            onChange={(v) => onChange({ energyPattern: v })}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Stress sensitivity</Text>
          <Text style={styles.hint}>
            Controls how early stress and energy warnings appear.
            Sensitive surfaces them sooner; Resilient quiets them.
          </Text>
          <SegmentedControl
            options={STRESS_TOLERANCE_OPTIONS}
            value={preferences.stressTolerance}
            onChange={(v) => onChange({ stressTolerance: v })}
          />
        </View>
      </View>

      {/* Recommendations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommendations</Text>

        <View style={styles.field}>
          <RecommendationModeToggle
            value={preferences.recommendationMode}
            onChange={(v) => onChange({ recommendationMode: v })}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>
            How many recommendations to show at once
          </Text>
          <SegmentedControl
            options={MAX_REC_OPTIONS}
            value={preferences.maxRecommendations}
            onChange={(v) => onChange({ maxRecommendations: v })}
          />
        </View>

        <View style={styles.rowField}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>
              Actionable recommendations only
            </Text>
            <Text style={styles.hint}>
              Only show recommendations that include a one-tap action.
            </Text>
          </View>

          <Switch
            value={preferences.enableActionableOnly}
            onValueChange={(v) =>
              onChange({ enableActionableOnly: v })
            }
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 24,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  field: {
    gap: 8,
  },
  rowField: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
  },
  hint: {
    fontSize: 12,
    color: "#666",
  },
});