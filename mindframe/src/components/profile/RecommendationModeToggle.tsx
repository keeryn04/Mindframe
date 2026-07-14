import React from "react";
import { View, Text, Pressable } from "react-native";
import { RecommendationMode } from "../../types/UserPreferences.types";
import { styles } from "../../styling/RecommendationModeToggle.styles";

interface Props {
  value: RecommendationMode;
  onChange: (mode: RecommendationMode) => void;
}

const MODES = [
  {
    id: "general" as RecommendationMode,
    label: "General",
    description:
      "Recommendations reflect your overall state — stress, energy, focus, and momentum — and update continuously as you work.",
  },
  {
    id: "task" as RecommendationMode,
    label: "Task",
    description:
      "Recommendations respond to each specific task you complete, skip, or interrupt. You'll see targeted feedback tied to what you just did.",
  },
];

export function RecommendationModeToggle({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Recommendation mode</Text>

      <View style={styles.options}>
        {MODES.map((mode) => {
          const isSelected = value === mode.id;

          return (
            <Pressable
              key={mode.id}
              onPress={() => onChange(mode.id)}
              style={[styles.option, isSelected && styles.optionSelected]}
            >
              <View style={styles.optionHeader}>
                <View style={[styles.radio, isSelected && styles.radioSelected]}>
                  {isSelected && <View style={styles.radioDot} />}
                </View>
                <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                  {mode.label}
                </Text>
              </View>
              <Text style={styles.optionDescription}>{mode.description}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}