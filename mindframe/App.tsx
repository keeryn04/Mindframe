import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useUserStateStore } from './src/store/useUserStateStore';
import { Recommendation, RecommendationCategory } from './src/types/recommendations/Recommendation.types';
import { CalendarScreen } from './src/screens/CalendarScreen';
 
const TASK = {
  easy:   { id: '1', cognitiveLoad: 2,  durationMinutes: 15, difficulty: 'low'    as const, isRepeat: false },
  medium: { id: '2', cognitiveLoad: 5,  durationMinutes: 30, difficulty: 'medium' as const, isRepeat: false },
  hard:   { id: '3', cognitiveLoad: 9,  durationMinutes: 90, difficulty: 'high'   as const, isRepeat: false },
};
 
const CATEGORY_STYLE: Record<RecommendationCategory, { bg: string; accent: string; label: string }> = {
  recovery:   { bg: '#E1F5EE', accent: '#0F6E56', label: 'Recovery'   },
  focus:      { bg: '#EEEDFE', accent: '#534AB7', label: 'Focus'      },
  motivation: { bg: '#FEF3E2', accent: '#854F0B', label: 'Motivation' },
  warning:    { bg: '#FCEBEB', accent: '#A32D2D', label: 'Warning'    },
  celebrate:  { bg: '#E8F4FD', accent: '#1565A8', label: 'Nice work'  },
};
 
function RecommendationCard({ rec }: { rec: Recommendation }) {
  const style = CATEGORY_STYLE[rec.category];
  return (
    <View style={[styles.card, { backgroundColor: style.bg, borderLeftColor: style.accent }]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTag, { color: style.accent }]}>{style.label.toUpperCase()}</Text>
        {rec.priority === 'urgent' && (
          <Text style={styles.urgentBadge}>URGENT</Text>
        )}
      </View>
      <Text style={[styles.cardHeadline, { color: style.accent }]}>{rec.headline}</Text>
      <Text style={styles.cardDetail}>{rec.detail}</Text>
    </View>
  );
}
 
function StateBar({ label, value, invert = false }: { label: string; value: number; invert?: boolean }) {
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
 
export default function App() {
  const { state, recommendations, dispatch } = useUserStateStore();
 
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style="auto" />
 
      <Text style={styles.heading}>State</Text>
      <StateBar label="Stress"     value={state.stressLevel}  invert />
      <StateBar label="Energy"     value={state.energyLevel} />
      <StateBar label="Focus"      value={state.focusLevel} />
      <StateBar label="Momentum"   value={state.momentum} />
      <StateBar label="Confidence" value={state.confidence} />
 
      <Text style={styles.heading}>Recommendations</Text>
      {recommendations.length === 0
        ? <Text style={styles.empty}>No recommendations right now.</Text>
        : recommendations.map(r => <RecommendationCard key={r.id} rec={r} />)
      }

      <CalendarScreen />
 
        <TouchableOpacity style={styles.btn}
          onPress={() => dispatch({ type: 'BREAK_TAKEN', durationMinutes: 15 })}>
          <Text style={styles.btnText}>Break 15m</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn}
          onPress={() => dispatch({ type: 'SESSION_STARTED' })}>
          <Text style={styles.btnText}>Start session</Text>
        </TouchableOpacity>
    </ScrollView>
  );
}
 
const styles = StyleSheet.create({
  container:    { padding: 24, paddingTop: 60, backgroundColor: '#fff' },
  heading:      { fontSize: 16, fontWeight: '600', marginTop: 24, marginBottom: 10, color: '#111' },
  subheading:   { fontSize: 13, color: '#666', marginTop: 8, marginBottom: 6 },
  barRow:       { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  barLabel:     { width: 80, fontSize: 13, color: '#333' },
  barTrack:     { flex: 1, height: 8, backgroundColor: '#eee', borderRadius: 4, overflow: 'hidden' },
  barFill:      { height: '100%', borderRadius: 4 },
  barValue:     { width: 32, textAlign: 'right', fontSize: 12, color: '#666' },
  card:         { borderLeftWidth: 4, borderRadius: 10, padding: 14, marginBottom: 10 },
  cardHeader:   { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  cardTag:      { fontSize: 10, fontWeight: '700', letterSpacing: 0.8 },
  urgentBadge:  { marginLeft: 8, fontSize: 10, fontWeight: '700', color: '#A32D2D',
                  backgroundColor: '#FCEBEB', paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4 },
  cardHeadline: { fontSize: 15, fontWeight: '600', marginBottom: 4 },
  cardDetail:   { fontSize: 13, color: '#444', lineHeight: 19 },
  btnRow:       { flexDirection: 'row', gap: 8, marginBottom: 6 },
  btn:          { flex: 1, paddingVertical: 10, borderRadius: 8, borderWidth: 1,
                  borderColor: '#ddd', alignItems: 'center' },
  btnDanger:    { backgroundColor: '#c0392b', borderColor: '#c0392b' },
  btnText:      { fontSize: 13, color: '#333' },
  empty:        { fontSize: 13, color: '#999', fontStyle: 'italic' },
});