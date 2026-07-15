// src/screens/LoadingScreen.tsx
import React, { useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../styling/screens/LoadingScreen.styles";

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
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>

        {/* Wordmark */}
        <View style={styles.wordmarkWrap}>
          <View style={styles.wordmarkAccent} />
          <Text style={styles.wordmark}>focus</Text>
        </View>

        {/* Dots */}
        <View style={styles.dotsRow}>
          {[dot1, dot2, dot3].map((d, i) => (
            <Animated.View key={i} style={[styles.dot, dotStyle(d)]} />
          ))}
        </View>

        <Text style={styles.label}>Setting things up</Text>
      </View>
    </SafeAreaView>
  );
}