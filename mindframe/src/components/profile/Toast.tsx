import React, { useEffect, useRef } from "react";
import { Animated, Easing, Text } from "react-native";
import { styles } from "../../styling/components/profile/Toast.styles";

export type ToastStatus = "idle" | "saving" | "saved";

interface ToastProps {
  status: ToastStatus;
  savingLabel?: string;
  savedLabel?: string;
  visibleDurationMs?: number;
}

export function Toast({
  status,
  savingLabel = "Saving…",
  savedLabel = "Saved",
  visibleDurationMs = 1500,
}: ToastProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (status === "idle") return;

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    if (status === "saved") {
      const timeout = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 250,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 20,
            duration: 250,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
        ]).start();
      }, visibleDurationMs - 200);

      return () => clearTimeout(timeout);
    }
  }, [status]);

  if (status === "idle") return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.container, { opacity, transform: [{ translateY }] }]}
    >
      <Animated.View style={styles.pill}>
        <Text
          style={[
            styles.text,
            status === "saving" && styles.textSaving,
            status === "saved" && styles.textSaved,
          ]}
        >
          {status === "saving" ? savingLabel : savedLabel}
        </Text>
      </Animated.View>
    </Animated.View>
  );
}