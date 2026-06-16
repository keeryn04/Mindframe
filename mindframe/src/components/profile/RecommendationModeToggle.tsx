import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { RecommendationMode } from "../../types/UserPreferences.types";

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
              style={[
                styles.option,
                isSelected && styles.optionSelected,
              ]}
            >
              <Text style={styles.optionLabel}>{mode.label}</Text>
              <Text style={styles.optionDescription}>
                {mode.description}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
  },
  options: {
    gap: 8,
  },
  option: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  optionSelected: {
    borderColor: "#6366f1",
    backgroundColor: "#eef2ff",
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 12,
    color: "#666",
  },
});