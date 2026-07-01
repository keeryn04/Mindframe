import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { BreakActivity } from "../../types/breaks/BreakActivity.types";

interface ActivityCardProps {
  activity: BreakActivity;
  onPress: (activity: BreakActivity) => void;
}

const CATEGORY_LABEL: Record<BreakActivity["category"], string> = {
  breathing: "Breathing",
  movement: "Movement",
  mindfulness: "Mindfulness",
  social: "Social",
  rest: "Rest",
};

export function ActivityCard({ activity, onPress }: ActivityCardProps) {
  return (
    <Pressable
      onPress={() => onPress(activity)}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      accessibilityRole="button"
      accessibilityLabel={`Start ${activity.title}`}
    >
      <View style={styles.headerRow}>
        <Text style={styles.title}>{activity.title}</Text>
        <Text style={styles.badge}>{CATEGORY_LABEL[activity.category]}</Text>
      </View>
      <Text style={styles.description}>{activity.description}</Text>
      <Text style={styles.duration}>{activity.defaultDurationMinutes} min</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E2E2",
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
  },
  cardPressed: {
    opacity: 0.7,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  badge: {
    fontSize: 12,
    color: "#6B6B6B",
  },
  description: {
    fontSize: 14,
    color: "#4A4A4A",
    marginBottom: 8,
  },
  duration: {
    fontSize: 12,
    color: "#8A8A8A",
  },
});