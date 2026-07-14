import React from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { Button } from "./Button";
import { styles } from "../../styling/ConfirmDialog.styles";

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = true,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>{title}</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}
          <View style={styles.actions}>
            <View style={styles.actionItem}>
              <Button label={cancelLabel} variant="secondary" onPress={onCancel} />
            </View>
            <View style={styles.actionItem}>
              <Button
                label={confirmLabel}
                variant={destructive ? "danger" : "primary"}
                onPress={onConfirm}
              />
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}