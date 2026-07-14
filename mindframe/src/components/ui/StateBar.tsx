import { View, Text } from "react-native";
import { styles } from "../../styling/StateBar.styles";
import { colors } from "../../styling/theme";

export function StateBar({
  label,
  value,
  invert = false,
}: {
  label: string;
  value: number;
  invert?: boolean;
}) {
  const isHigh = value > 55;
  const color = invert
    ? isHigh
      ? colors.stress
      : colors.energy
    : isHigh
    ? colors.energy
    : colors.stress;

  return (
    <View style={styles.barRow}>
      <Text style={styles.barLabel}>{label}</Text>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${value}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.barValue}>{Math.round(value)}</Text>
    </View>
  );
}