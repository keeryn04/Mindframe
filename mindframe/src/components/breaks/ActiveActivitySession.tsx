import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { BreakActivity } from "../../types/breaks/BreakActivity.types";

interface ActiveActivitySessionProps {
  activity: BreakActivity;
  /** Called with the actual number of minutes spent once the session ends. */
  onComplete: (actualMinutes: number) => void;
  onCancel: () => void;
}

export function ActiveActivitySession({ activity, onComplete, onCancel }: ActiveActivitySessionProps) {
  const totalSeconds = activity.defaultDurationMinutes * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) {
      const actualMinutes = totalSeconds / 60;
      onComplete(actualMinutes);
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  function finishEarly() {
    const elapsedMinutes = Math.max(1, Math.round((totalSeconds - secondsLeft) / 60));
    onComplete(elapsedMinutes);
  }

  const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{activity.title}</Text>
      <Text style={styles.timer}>{minutes}:{seconds}</Text>

      {activity.steps && (
        <View style={styles.steps}>
          {activity.steps.map((step, i) => (
            <Text key={i} style={styles.step}>{i + 1}. {step}</Text>
          ))}
        </View>
      )}

      <Pressable style={styles.doneButton} onPress={finishEarly} accessibilityRole="button">
        <Text style={styles.doneButtonText}>I'm done</Text>
      </Pressable>
      <Pressable style={styles.cancelButton} onPress={onCancel} accessibilityRole="button">
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  timer: {
    fontSize: 48,
    fontWeight: "300",
    marginBottom: 24,
  },
  steps: {
    marginBottom: 24,
    alignSelf: "stretch",
  },
  step: {
    fontSize: 14,
    color: "#4A4A4A",
    marginBottom: 4,
  },
  doneButton: {
    backgroundColor: "#1D9E75",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 12,
  },
  doneButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  cancelButton: {
    paddingVertical: 8,
  },
  cancelButtonText: {
    color: "#8A8A8A",
  },
});