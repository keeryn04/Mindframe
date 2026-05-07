import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, ScrollView, TouchableOpacity } from 'react-native';
import { useUserStateStore } from './src/store/useUserStateStore';

const TASK = {
  easy:   { id: '1', cognitiveLoad: 2,  durationMinutes: 15,  difficulty: 'low'    as const, isRepeat: false },
  medium: { id: '2', cognitiveLoad: 5,  durationMinutes: 30,  difficulty: 'medium' as const, isRepeat: false },
  hard:   { id: '3', cognitiveLoad: 9,  durationMinutes: 90,  difficulty: 'high'   as const, isRepeat: false },
};

function StateBar({ label, value, invert = false }: { label: string; value: number; invert?: boolean }) {
  const hue = invert
    ? value < 50 ? '#4caf50' : '#f44336'
    : value > 50 ? '#4caf50' : '#f44336';
  return (
    <View style={styles.barRow}>
      <Text style={styles.barLabel}>{label}</Text>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${value}%`, backgroundColor: hue }]} />
      </View>
      <Text style={styles.barValue}>{Math.round(value)}</Text>
    </View>
  );
}

export default function App() {
  const { state, lastTrace, lastDelta, dispatch } = useUserStateStore();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style="auto" />

      <Text style={styles.heading}>User state</Text>
      <StateBar label="Stress"     value={state.stressLevel}  invert />
      <StateBar label="Energy"     value={state.energyLevel} />
      <StateBar label="Focus"      value={state.focusLevel} />
      <StateBar label="Momentum"   value={state.momentum} />
      <StateBar label="Confidence" value={state.confidence} />

      <Text style={styles.heading}>Events</Text>

      <Text style={styles.subheading}>Complete task</Text>
      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.btn} onPress={() => dispatch({ type: 'TASK_COMPLETED', task: TASK.easy })}>
          <Text style={styles.btnText}>Easy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => dispatch({ type: 'TASK_COMPLETED', task: TASK.medium })}>
          <Text style={styles.btnText}>Medium</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={() => dispatch({ type: 'TASK_COMPLETED', task: TASK.hard })}>
          <Text style={[styles.btnText, styles.btnTextPrimary]}>Hard</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subheading}>Fail task</Text>
      <View style={styles.btnRow}>
        <TouchableOpacity style={[styles.btn, styles.btnDanger]} onPress={() => dispatch({ type: 'TASK_FAILED', task: TASK.easy })}>
          <Text style={[styles.btnText, styles.btnTextPrimary]}>Easy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnDanger]} onPress={() => dispatch({ type: 'TASK_FAILED', task: TASK.medium })}>
          <Text style={[styles.btnText, styles.btnTextPrimary]}>Medium</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnDanger]} onPress={() => dispatch({ type: 'TASK_FAILED', task: TASK.hard })}>
          <Text style={[styles.btnText, styles.btnTextPrimary]}>Hard</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.btn} onPress={() => dispatch({ type: 'TASK_INTERRUPTED', task: TASK.medium })}>
          <Text style={styles.btnText}>Interrupt</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => dispatch({ type: 'BREAK_TAKEN', durationMinutes: 15 })}>
          <Text style={styles.btnText}>Break 15m</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => dispatch({ type: 'SESSION_STARTED' })}>
          <Text style={styles.btnText}>Start session</Text>
        </TouchableOpacity>
      </View>

      {lastTrace.length > 0 && (
        <>
          <Text style={styles.heading}>Last trace</Text>
          {lastTrace.map((t) => (
            <View key={t.ruleName} style={styles.traceRow}>
              <Text style={styles.traceName}>{t.ruleName}</Text>
              {t.modifiersApplied.length > 0 && (
                <Text style={styles.traceMod}>via {t.modifiersApplied.join(', ')}</Text>
              )}
              <Text style={styles.traceDelta}>
                {Object.entries(t.modifiedDelta)
                  .map(([k, v]) => `${k} ${v! >= 0 ? '+' : ''}${Math.round(v! * 10) / 10}`)
                  .join('  ')}
              </Text>
            </View>
          ))}

          <View style={styles.traceRow}>
            <Text style={[styles.traceName, { fontWeight: '600' }]}>Net delta</Text>
            <Text style={styles.traceDelta}>
              {Object.entries(lastDelta)
                .map(([k, v]) => `${k} ${v! >= 0 ? '+' : ''}${Math.round(v! * 10) / 10}`)
                .join('  ')}
            </Text>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:       { padding: 24, paddingTop: 60, backgroundColor: '#fff' },
  heading:         { fontSize: 16, fontWeight: '600', marginTop: 24, marginBottom: 10 },
  subheading:      { fontSize: 13, color: '#666', marginTop: 10, marginBottom: 6 },
  barRow:          { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  barLabel:        { width: 80, fontSize: 13, color: '#333' },
  barTrack:        { flex: 1, height: 8, backgroundColor: '#eee', borderRadius: 4, overflow: 'hidden' },
  barFill:         { height: '100%', borderRadius: 4 },
  barValue:        { width: 32, textAlign: 'right', fontSize: 12, color: '#666' },
  btnRow:          { flexDirection: 'row', gap: 8, marginBottom: 8 },
  btn:             { flex: 1, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', alignItems: 'center' },
  btnPrimary:      { backgroundColor: '#534AB7', borderColor: '#534AB7' },
  btnDanger:       { backgroundColor: '#c0392b', borderColor: '#c0392b' },
  btnText:         { fontSize: 13, color: '#333' },
  btnTextPrimary:  { color: '#fff' },
  traceRow:        { backgroundColor: '#f8f8f8', borderRadius: 8, padding: 10, marginBottom: 6 },
  traceName:       { fontSize: 12, fontWeight: '500', color: '#222' },
  traceMod:        { fontSize: 11, color: '#7c6fc4', marginTop: 2 },
  traceDelta:      { fontSize: 11, color: '#555', marginTop: 3 },
});