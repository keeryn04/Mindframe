import React from "react";
import { Modal, Text, View } from "react-native";
import { useUserStateStore } from "../../store/useUserStateStore";
import { useBreakPromptStore } from "../../store/useBreakPromptStore";
import { THRESHOLDS } from "../../types/UserState.types";
import { Button } from "../ui/Button";
import { styles } from "../../styling/BreakPromptModal.styles";

export function BreakPromptModal() {
  const state = useUserStateStore((s) => s.state);
  const dismissedAt = useBreakPromptStore((s) => s.dismissedAt);
  const canShow = useBreakPromptStore((s) => s.canShow);
  const dismiss = useBreakPromptStore((s) => s.dismiss);
  const openModal = useBreakPromptStore((s) => s.openModal);

  const isCritical =
    state.energyLevel < THRESHOLDS.criticalEnergy ||
    state.stressLevel > THRESHOLDS.highStressCritical;

  const visible = isCritical && canShow();

  function handleStartActivity() {
    dismiss();
    openModal();
  }

  function handleDismiss() {
    dismiss();
  }

  const isEnergyDriven = state.energyLevel < THRESHOLDS.criticalEnergy;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleDismiss}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <Text style={styles.icon}>{isEnergyDriven ? "◔" : "◎"}</Text>
          </View>
          <Text style={styles.headline}>
            {isEnergyDriven ? "You're running on empty" : "Stress is at a critical level"}
          </Text>
          <Text style={styles.detail}>
            {isEnergyDriven
              ? "Continuing now risks mistakes and a much longer recovery. A short break can turn this around."
              : "Your decision quality and retention drop sharply here. A short break now will likely cost you less than pushing through."}
          </Text>
          <View style={styles.actions}>
            <Button label="Start a break" variant="danger" onPress={handleStartActivity} />
            <Button label="Not now" variant="ghost" onPress={handleDismiss} />
          </View>
        </View>
      </View>
    </Modal>
  );
}