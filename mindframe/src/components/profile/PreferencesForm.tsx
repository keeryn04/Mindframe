import React from "react";
import { View, Text, Switch } from "react-native";
import {
  UserPreferences,
  WorkStyle,
  EnergyPattern,
  StressToleranceLevel,
} from "../../types/UserPreferences.types";
import { SegmentedControl } from "../ui/SegmentedControl";
import { RecommendationModeToggle } from "./RecommendationModeToggle";
import { colors } from "../../styling/theme";
import { styles } from "../../styling/components/profile/PreferencesForm.styles";

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

function SectionHeading({ title }: { title: string }) {
  return (
    <View style={styles.sectionHeading}>
      <View style={styles.sectionHeadingRail} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

export function PreferencesForm({ preferences, onChange }: Props) {
  return (
    <View style={styles.container}>
      {/* Work behaviour */}
      <View style={styles.section}>
        <SectionHeading title="Work style" />

        <View style={styles.field}>
          <Text style={styles.label}>How do you prefer to structure your sessions?</Text>
          <SegmentedControl
            options={WORK_STYLE_OPTIONS}
            value={preferences.workStyle}
            onChange={(v) => onChange({ workStyle: v })}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>When are you naturally most productive?</Text>
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
        <SectionHeading title="Recommendations" />

        <View style={styles.field}>
          <RecommendationModeToggle
            value={preferences.recommendationMode}
            onChange={(v) => onChange({ recommendationMode: v })}
          />
        </View>
      </View>
    </View>
  );
}