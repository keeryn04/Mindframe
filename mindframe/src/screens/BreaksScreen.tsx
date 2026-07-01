import React from "react";
import { FlatList, StatusBar, StyleSheet, Text, View } from "react-native";
import { breakActivities, BreakActivity } from "../types/breaks/BreakActivity.types";
import { useUserStateStore } from "../store/useUserStateStore";
import { ActivityCard } from "../components/ui/ActivityCard";
import { ActiveActivitySession } from "../components/breaks/ActiveActivitySession";

export function BreaksScreen() {
  const dispatch = useUserStateStore((s) => s.dispatch);
  const [active, setActive] = React.useState<BreakActivity | null>(null);

  function startActivity(activity: BreakActivity) {
    setActive(activity);
  }

  function completeActivity(actualMinutes: number) {
    if (!active) return;

    // Same dispatch path useTaskStore's emitTaskEvent already uses —
    // called directly here since a break isn't a task.
    dispatch({
      type: "BREAK_TAKEN",
      durationMinutes: actualMinutes,
      activityType: active.category,
    });

    setActive(null);
  }

  function cancelActivity() {
    setActive(null);
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />

      {/* Page header — fixed paddingTop clears the notch/status bar,
          same pattern as StatsScreen's pageHeader. */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Take a break</Text>
        <Text style={styles.pageSubtitle}>
          {active ? active.title : "Pick something that fits how you're feeling right now."}
        </Text>
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
        <FlatList
          style={styles.list}
          data={breakActivities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ActivityCard activity={item} onPress={startActivity} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F1EFE8",   // page background (c-gray-50), matches StatsScreen
  },
  pageHeader: {
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2C2C2A",
  },
  pageSubtitle: {
    fontSize: 14,
    color: "#888780",
    marginTop: 4,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 32,
  },
  sessionContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
});