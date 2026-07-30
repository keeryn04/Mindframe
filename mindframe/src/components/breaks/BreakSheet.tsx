import React, { useMemo, useRef, useState } from "react";
import { Animated, PanResponder, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { breakActivities, BreakActivity } from "../../types/breaks/BreakActivity.types";
import { BreakActivityCategory } from "../../types/AppEvent.types";
import { useUserStateStore } from "../../store/useUserStateStore";
import { ActivityCard } from "../ui/ActivityCard";
import { IconButton } from "../ui/IconButton";
import { EmptyState } from "../ui/EmptyState";
import { ActiveActivitySession } from "./ActiveActivitySession";
import { CATEGORY_COLORS, CATEGORY_GLYPHS, CATEGORY_LABELS, CATEGORY_SOFT_COLORS } from "../../styling/breaksTheme";
import { colors } from "../../styling/theme";
import { styles } from "../../styling/components/breaks/BreakSheet.styles";

type CategoryFilter = "all" | BreakActivityCategory;

const ALL_CATEGORIES: BreakActivityCategory[] = ["breathing", "movement", "mindfulness", "social", "rest"];

interface BreakSheetProps {
  onClose: () => void;
}

function CategoryChip({
  filter,
  isActive,
  onPress,
}: {
  filter: CategoryFilter;
  isActive: boolean;
  onPress: () => void;
}) {
  const isAll = filter === "all";
  const accent = isAll ? colors.brand : CATEGORY_COLORS[filter];
  const soft = isAll ? colors.brandSoft : CATEGORY_SOFT_COLORS[filter];
  const glyph = isAll ? "✳" : CATEGORY_GLYPHS[filter];
  const label = isAll ? "All" : CATEGORY_LABELS[filter];

  return (
    <View
      onTouchEnd={onPress}
      style={[
        styles.chip,
        { backgroundColor: isActive ? accent : soft, borderColor: isActive ? accent : "transparent" },
      ]}
    >
      <Text style={[styles.chipGlyph, { color: isActive ? colors.inkOnBrand : accent }]}>{glyph}</Text>
      <Text style={[styles.chipLabel, { color: isActive ? colors.inkOnBrand : accent }]}>{label}</Text>
    </View>
  );
}

export function BreakSheet({ onClose }: BreakSheetProps) {
  const insets = useSafeAreaInsets();
  const dispatch = useUserStateStore((s) => s.dispatch);
  const [active, setActive] = useState<BreakActivity | null>(null);
  const [filter, setFilter] = useState<CategoryFilter>("all");

  // Drag-to-dismiss: the handle is the only pan-responder target, so
  // scrolling the activity list below it is unaffected. Dragging past
  // DISMISS_THRESHOLD and releasing closes the sheet; otherwise it
  // springs back to rest.
  const translateY = useRef(new Animated.Value(0)).current;
  const DISMISS_THRESHOLD = 120;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 4,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) translateY.setValue(gesture.dy);
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > DISMISS_THRESHOLD) {
          Animated.timing(translateY, {
            toValue: 800,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            onClose();
            translateY.setValue(0);
          });
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 6,
          }).start();
        }
      },
    })
  ).current;

  const filteredActivities = useMemo(
    () => (filter === "all" ? breakActivities : breakActivities.filter((a) => a.category === filter)),
    [filter]
  );

  function startActivity(activity: BreakActivity) {
    setActive(activity);
  }

  function completeActivity(actualMinutes: number) {
    if (!active) return;
    dispatch({
      type: "BREAK_TAKEN",
      durationMinutes: actualMinutes,
      activityType: active.category,
    });
    setActive(null);
    onClose();
  }

  function cancelActivity() {
    setActive(null);
  }

  return (
    <Animated.View
      style={[
        styles.root,
        { paddingTop: Math.max(insets.top, 12) },
        { transform: [{ translateY }] },
      ]}
    >
      {/* Drag handle — swipe down to dismiss */}
      <View style={styles.handleWrap} {...panResponder.panHandlers}>
        <View style={styles.handle} />
      </View>

      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Take a break</Text>
          <Text style={styles.subtitle}>
            {active ? active.title : "Pick something that fits how you're feeling right now."}
          </Text>
        </View>
        <IconButton glyph="✕" label="Close" onPress={onClose} />
      </View>

      {active ? (
        <View style={styles.sessionContainer}>
          <ActiveActivitySession
            activity={active}
            onComplete={completeActivity}
            onCancel={cancelActivity}
          />
        </View>
      ) : (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
            style={styles.chipScroll}
          >
            <CategoryChip filter="all" isActive={filter === "all"} onPress={() => setFilter("all")} />
            {ALL_CATEGORIES.map((cat) => (
              <CategoryChip key={cat} filter={cat} isActive={filter === cat} onPress={() => setFilter(cat)} />
            ))}
          </ScrollView>

          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            {filteredActivities.length === 0 ? (
              <EmptyState glyph="◌" title="Nothing here" subtitle="No activities in this category yet." />
            ) : (
              filteredActivities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} onPress={startActivity} />
              ))
            )}
          </ScrollView>
        </>
      )}
    </Animated.View>
  );
}
