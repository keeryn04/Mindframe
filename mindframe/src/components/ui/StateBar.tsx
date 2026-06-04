import { View, Text, StyleSheet } from "react-native";

export function StateBar({ label, value, invert = false }: { label: string; value: number; invert?: boolean }) {
  const isHigh = value > 55;
  const color = invert
    ? (isHigh ? '#c0392b' : '#0F6E56')
    : (isHigh ? '#0F6E56' : '#c0392b');
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

const styles = StyleSheet.create({
  barRow:       { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  barLabel:     { width: 80, fontSize: 13, color: '#333' },
  barTrack:     { flex: 1, height: 8, backgroundColor: '#eee', borderRadius: 4, overflow: 'hidden' },
  barFill:      { height: '100%', borderRadius: 4 },
  barValue:     { width: 32, textAlign: 'right', fontSize: 12, color: '#666' },
});