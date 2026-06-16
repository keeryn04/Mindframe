import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

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
            style={[
              styles.option,
              isSelected && styles.optionSelected,
            ]}
          >
            <Text
              style={[
                styles.label,
                isSelected && styles.labelSelected,
              ]}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  option: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  optionSelected: {
    backgroundColor: "#6366f1",
  },
  label: {
    fontSize: 14,
    color: "#333",
  },
  labelSelected: {
    color: "#fff",
    fontWeight: "600",
  },
});
