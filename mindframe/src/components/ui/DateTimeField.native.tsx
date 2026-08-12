import React, { useState } from "react";
import { Modal, Platform, Pressable, Text, View } from "react-native";
import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Button } from "./Button";
import { styles } from "../../styling/components/ui/DateTimeField.styles";

type FieldMode = "date" | "time";

interface DateTimeFieldProps {
  label: string;
  value: Date;
  mode: FieldMode;
  onChange: (date: Date) => void;
  error?: string;
}

function formatValue(value: Date, mode: FieldMode): string {
  if (mode === "time") {
    return value.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
  return value.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
}

/**
 * Wraps @react-native-community/datetimepicker behind one consistent field.
 *
 * Android's picker is already a modal dialog (calendar for dates, clock/
 * spinner for times depending on the device's clock-style setting), so we
 * just open it imperatively via DateTimePickerAndroid and let it manage its
 * own visibility.
 *
 * iOS has no built-in modal chrome — its picker is an inline view — so we
 * present it ourselves as a floating card over a dimmed backdrop (its own
 * Modal), rather than inline in the form's layout. Inline would otherwise
 * push the rest of the form down every time it's opened. The picker is
 * given an explicit width/height: left to size itself inside the card's
 * padding, the inline calendar and spinner both collapse — clipping the
 * spinner's numerals and stretching its selection highlight to the wrong
 * width.
 */
export function DateTimeField({ label, value, mode, onChange, error }: DateTimeFieldProps) {
  const [showPicker, setShowPicker] = useState(false);

  function openPicker() {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value,
        mode,
        is24Hour: false,
        onChange: (_event, selected) => {
          if (selected) onChange(selected);
        },
      });
      return;
    }
    setShowPicker(true);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <Pressable
        onPress={openPicker}
        style={[styles.field, error && styles.fieldError]}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${formatValue(value, mode)}`}
      >
        <Text style={styles.glyph}>{mode === "time" ? "🕐" : "📅"}</Text>
        <Text style={styles.value}>{formatValue(value, mode)}</Text>
      </Pressable>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {Platform.OS === "ios" && (
        <Modal
          visible={showPicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowPicker(false)}
        >
          <Pressable style={styles.backdrop} onPress={() => setShowPicker(false)}>
            <Pressable style={styles.iosPickerCard} onPress={(e) => e.stopPropagation()}>
              <Text style={styles.iosPickerTitle}>{label}</Text>

              <View style={mode === "date" ? styles.datePickerWrap : styles.timePickerWrap}>
                <DateTimePicker
                  value={value}
                  mode={mode}
                  display={mode === "time" ? "spinner" : "inline"}
                  themeVariant="light"
                  style={mode === "date" ? styles.datePicker : styles.timePicker}
                  onChange={(_event, selected) => {
                    if (selected) onChange(selected);
                  }}
                />
              </View>

              <View style={styles.doneWrap}>
                <Button label="Done" onPress={() => setShowPicker(false)} />
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}
