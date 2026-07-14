import React from "react";
import { Pressable, Text } from "react-native";
import { styles } from "../../styling/IconButton.styles";

interface IconButtonProps {
  glyph: string;
  onPress: () => void;
  label?: string;
  variant?: "default" | "muted" | "danger";
  size?: "sm" | "md";
}

const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };

export function IconButton({
  glyph,
  onPress,
  label,
  variant = "default",
  size = "md",
}: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel={label ?? glyph}
      style={({ pressed }) => [
        styles.base,
        styles[size],
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.glyph, styles[`${variant}Glyph` as const]]}>{glyph}</Text>
    </Pressable>
  );
}