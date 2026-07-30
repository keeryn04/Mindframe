import React, { useEffect, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { Button } from "../ui/Button";
import { DateTimeField } from "../ui/DateTimeField";
import { dateStringToLocalDate, formatDateString } from "../../utils/calendarUtils";
import { styles } from "../../styling/components/calendar/DelayTaskDialog.styles";

interface DelayTaskDialogProps {
  visible: boolean;
  taskTitle?: string;
  /** Current date of the task, "YYYY-MM-DD" — used to prefill the field. */
  initialDate?: string;
  onConfirm: (newDate: string) => void;
  onCancel: () => void;
}

export function DelayTaskDialog({
  visible,
  taskTitle,
  initialDate,
  onConfirm,
  onCancel,
}: DelayTaskDialogProps) {
  const [date, setDate] = useState<Date>(() =>
    dateStringToLocalDate(initialDate ?? formatDateString(new Date()))
  );

  // Re-seed the field whenever a new task is targeted for delay.
  useEffect(() => {
    if (visible) {
      setDate(dateStringToLocalDate(initialDate ?? formatDateString(new Date())));
    }
  }, [visible, initialDate]);

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

          <DateTimeField label="New date" mode="date" value={date} onChange={setDate} />

          <View style={styles.actions}>
            <View style={styles.actionItem}>
              <Button label="Cancel" variant="secondary" onPress={onCancel} />
            </View>
            <View style={styles.actionItem}>
              <Button label="Delay" variant="primary" onPress={() => onConfirm(formatDateString(date))} />
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
