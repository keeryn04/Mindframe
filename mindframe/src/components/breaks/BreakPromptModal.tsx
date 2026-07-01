import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUserStateStore } from "../../store/useUserStateStore";
import { useBreakPromptStore } from "../../store/useBreakPromptStore";
import { THRESHOLDS } from "../../types/UserState.types";
import { ROUTES } from "../../navigators/routes";

/**
 * Mounted once at the root of the navigation tree (see RootNavigator)
 * so it can float over any screen. Visibility is fully derived from
 * useUserStateStore + useBreakPromptStore — no event listeners needed.
 */
export function BreakPromptModal() {
  const navigation = useNavigation<any>();
  const state = useUserStateStore((s) => s.state);
  const dismissedAt = useBreakPromptStore((s) => s.dismissedAt);
  const canShow = useBreakPromptStore((s) => s.canShow);
  const dismiss = useBreakPromptStore((s) => s.dismiss);

  const isCritical =
    state.energyLevel < THRESHOLDS.criticalEnergy ||
    state.stressLevel > THRESHOLDS.highStressCritical;

  const visible = isCritical && canShow();

  function handleStartActivity() {
    dismiss();
    navigation.navigate(ROUTES.BREAKS);
  }

  function handleDismiss() {
    dismiss();
  }

  const isEnergyDriven = state.energyLevel < THRESHOLDS.criticalEnergy;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleDismiss}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.headline}>
            {isEnergyDriven ? "You're running on empty" : "Stress is at a critical level"}
          </Text>
          <Text style={styles.detail}>
            {isEnergyDriven
              ? "Continuing now risks mistakes and a much longer recovery. A short break can turn this around."
              : "Your decision quality and retention drop sharply here. A short break now will likely cost you less than pushing through."}
          </Text>
          <Pressable style={styles.primaryButton} onPress={handleStartActivity} accessibilityRole="button">
            <Text style={styles.primaryButtonText}>Start a break</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={handleDismiss} accessibilityRole="button">
            <Text style={styles.secondaryButtonText}>Not now</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 360,
  },
  headline: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    color: "#4A4A4A",
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: "#D85A30",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  secondaryButton: {
    paddingVertical: 8,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#8A8A8A",
  },
});