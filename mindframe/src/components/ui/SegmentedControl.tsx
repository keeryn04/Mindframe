import React from "react";
import { View, Text, Pressable } from "react-native";
import { styles } from "../../styling/SegmentedControl.styles";

interface Option<T extends string | number> {
  value: T;
  label: string;
}

interface Props<T extends string | number> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
}: Props<T>) {
  return (
    <View style={styles.container}>
      {options.map((opt) => {
        const isSelected = value === opt.value;

        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={[styles.option, isSelected && styles.optionSelected]}
          >
            <Text style={[styles.label, isSelected && styles.labelSelected]}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}