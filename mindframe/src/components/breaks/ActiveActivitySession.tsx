import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { BreakActivity } from "../../types/breaks/BreakActivity.types";
import { Button } from "../ui/Button";
import { colors } from "../../styling/theme";
import { styles } from "../../styling/components/breaks/ActiveActivitySession.styles";

interface ActiveActivitySessionProps {
  activity: BreakActivity;
  /** Called with the actual number of minutes spent once the session ends. */
  onComplete: (actualMinutes: number) => void;
  onCancel: () => void;
}

const DIAL_SIZE = 148;
const DIAL_STROKE = 8;
const DIAL_RADIUS = (DIAL_SIZE - DIAL_STROKE) / 2;
const DIAL_CIRCUMFERENCE = 2 * Math.PI * DIAL_RADIUS;

export function ActiveActivitySession({ activity, onComplete, onCancel }: ActiveActivitySessionProps) {
  const totalSeconds = activity.defaultDurationMinutes * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) {
      const actualMinutes = totalSeconds / 60;
      onComplete(actualMinutes);
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  function finishEarly() {
    const elapsedMinutes = Math.max(1, Math.round((totalSeconds - secondsLeft) / 60));
    onComplete(elapsedMinutes);
  }

  const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");
  const progress = totalSeconds === 0 ? 0 : 1 - secondsLeft / totalSeconds;
  const dashOffset = DIAL_CIRCUMFERENCE * (1 - progress);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{activity.title}</Text>

      <View style={styles.dialWrap}>
        <Svg width={DIAL_SIZE} height={DIAL_SIZE}>
          <Circle
            cx={DIAL_SIZE / 2}
            cy={DIAL_SIZE / 2}
            r={DIAL_RADIUS}
            stroke={colors.surfaceSunken}
            strokeWidth={DIAL_STROKE}
            fill="none"
          />
          <Circle
            cx={DIAL_SIZE / 2}
            cy={DIAL_SIZE / 2}
            r={DIAL_RADIUS}
            stroke={colors.energy}
            strokeWidth={DIAL_STROKE}
            strokeLinecap="round"
            strokeDasharray={DIAL_CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            fill="none"
            rotation={-90}
            origin={`${DIAL_SIZE / 2}, ${DIAL_SIZE / 2}`}
          />
        </Svg>
        <View style={styles.dialCenter}>
          <Text style={styles.timer}>{minutes}:{seconds}</Text>
        </View>
      </View>

      {activity.steps && (
        <View style={styles.steps}>
          {activity.steps.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={styles.stepDot} />
              <Text style={styles.step}>{step}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.actions}>
        <Button label="I'm done" onPress={finishEarly} />
        <Button label="Cancel" variant="ghost" onPress={onCancel} />
      </View>
    </View>
  );
}
