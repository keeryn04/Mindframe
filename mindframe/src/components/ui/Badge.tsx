import React from "react";
import { Text, View } from "react-native";
import { styles } from "../../styling/Badge.styles";

interface BadgeProps {
  label: string;
  color: string;
  backgroundColor: string;
}

export function Badge({ label, color, backgroundColor }: BadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
}