import React, { useEffect, useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import { Button } from "../ui/Button";
import { colors } from "../../styling/theme";
import { styles } from "../../styling/components/calendar/DelayTaskDialog.styles";

interface DelayTaskDialogProps {
  visible: boolean;
  taskTitle?: string;
  /** Current date of the task, "YYYY-MM-DD" — used to prefill the field. */
  initialDate?: string;
  onConfirm: (newDate: string) => void;
  onCancel: () => void;
}

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  return !Number.isNaN(new Date(`${value}T00:00:00`).getTime());
}

export function DelayTaskDialog({
  visible,
  taskTitle,
  initialDate,
  onConfirm,
  onCancel,
}: DelayTaskDialogProps) {
  const [date, setDate] = useState(initialDate ?? "");
  const [error, setError] = useState<string | null>(null);

  // Re-seed the field whenever a new task is targeted for delay.
  useEffect(() => {
    if (visible) {
      setDate(initialDate ?? "");
      setError(null);
    }
  }, [visible, initialDate]);

  function handleConfirm() {
    if (!isValidDate(date)) {
      setError("Enter a valid date as YYYY-MM-DD");
      return;
    }
    onConfirm(date);
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>Push this task back</Text>
          {taskTitle ? (
            <Text style={styles.message} numberOfLines={2}>
              Choose a new date for "{taskTitle}".
            </Text>
          ) : null}

          <Text style={styles.fieldLabel}>New date</Text>
          <TextInput
            style={[styles.input, error && styles.inputError]}
            value={date}
            onChangeText={(v) => {
              setDate(v);
              if (error) setError(null);
            }}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.inkFaint}
            keyboardType="numbers-and-punctuation"
            autoFocus
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.actions}>
            <View style={styles.actionItem}>
              <Button label="Cancel" variant="secondary" onPress={onCancel} />
            </View>
            <View style={styles.actionItem}>
              <Button label="Delay" variant="primary" onPress={handleConfirm} />
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
