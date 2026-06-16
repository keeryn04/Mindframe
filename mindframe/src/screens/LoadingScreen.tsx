// src/screens/LoadingScreen.tsx
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Animated,
  StyleSheet,
  SafeAreaView,
} from "react-native";

export function LoadingScreen() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 400, useNativeDriver: true }),
          Animated.delay(800 - delay),
        ])
      );

    const a1 = pulse(dot1, 0);
    const a2 = pulse(dot2, 160);
    const a3 = pulse(dot3, 320);
    a1.start(); a2.start(); a3.start();

    return () => { a1.stop(); a2.stop(); a3.stop(); };
  }, []);

  const dotStyle = (anim: Animated.Value) => ({
    opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0.2, 1] }),
    transform: [{
      translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [0, -6] }),
    }],
  });

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.center}>

        {/* Wordmark */}
        <View style={s.wordmarkWrap}>
          <View style={s.wordmarkAccent} />
          <Text style={s.wordmark}>focus</Text>
        </View>

        {/* Dots */}
        <View style={s.dotsRow}>
          {[dot1, dot2, dot3].map((d, i) => (
            <Animated.View key={i} style={[s.dot, dotStyle(d)]} />
          ))}
        </View>

        <Text style={s.label}>Setting things up</Text>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: "#FAFAF8" },
  center:         { flex: 1, alignItems: "center", justifyContent: "center", gap: 28 },
  wordmarkWrap:   { flexDirection: "row", alignItems: "center", gap: 8 },
  wordmarkAccent: { width: 6, height: 32, borderRadius: 3, backgroundColor: "#534AB7" },
  wordmark:       { fontSize: 32, fontWeight: "700", color: "#1A1A18", letterSpacing: -1 },
  dotsRow:        { flexDirection: "row", gap: 8, height: 16, alignItems: "flex-end" },
  dot:            { width: 7, height: 7, borderRadius: 4, backgroundColor: "#534AB7" },
  label:          { fontSize: 13, color: "#888780", letterSpacing: 0.3 },
});