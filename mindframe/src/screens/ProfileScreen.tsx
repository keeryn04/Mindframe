import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserPreferencesStore } from "../store/useUserPreferencesStore";
import { PreferencesForm } from "../components/profile/PreferencesForm";
import { UserPreferences } from "../types/UserPreferences.types";

const AVATAR_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f97316",
  "#22c55e",
  "#06b6d4",
  "#eab308",
  "#ef4444",
];

type SaveStatus = "idle" | "saving" | "saved";

const SAVE_DEBOUNCE_MS = 500;
const SAVED_DISPLAY_MS = 1500;

export function ProfileScreen() {
  const { preferences, updatePreferences, isHydrated } =
    useUserPreferencesStore();

  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastTranslateY = useRef(new Animated.Value(20)).current;
  const [localName, setLocalName] = useState(preferences.displayName);

  useEffect(() => {
    setLocalName(preferences.displayName);
  }, [isHydrated]);

  useEffect(() => {
    if (saveStatus === "idle") return;

    // Animate IN
    Animated.parallel([
        Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
        }),
        Animated.timing(toastTranslateY, {
        toValue: 0,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
        }),
    ]).start();

    // Animate OUT when going idle
    if (saveStatus === "saved") {
        const timeout = setTimeout(() => {
        Animated.parallel([
            Animated.timing(toastOpacity, {
            toValue: 0,
            duration: 250,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
            }),
            Animated.timing(toastTranslateY, {
            toValue: 20,
            duration: 250,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
            }),
        ]).start();
        }, SAVED_DISPLAY_MS - 200); // fade slightly before disappearing

        return () => clearTimeout(timeout);
    }
  }, [saveStatus]);

  const handleChange = useCallback(
    (patch: Partial<UserPreferences>) => {
      setSaveStatus("saving");

      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);

      debounceRef.current = setTimeout(async () => {
        await updatePreferences(patch);
        setSaveStatus("saved");

        savedTimerRef.current = setTimeout(
          () => setSaveStatus("idle"),
          SAVED_DISPLAY_MS
        );

      }, SAVE_DEBOUNCE_MS);
    },
    [updatePreferences]
  );

  const handleNameBlur = () => {
    if (localName !== preferences.displayName) {
      handleChange({ displayName: localName });
    }
  };

  if (!isHydrated) {
    return (
      <View style={styles.loading}>
        <Text>Loading your profile…</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarRow}>
          {/* Avatar */}
          <View
            style={[
              styles.avatar,
              { backgroundColor: preferences.avatarColor },
            ]}
          >
            <Text style={styles.avatarText}>
              {preferences.displayName
                ? preferences.displayName.charAt(0).toUpperCase()
                : "?"}
            </Text>
          </View>

          {/* Name input */}
          <TextInput
            style={styles.input}
            value={localName}
            placeholder="Your name"
            maxLength={40}
            onChangeText={setLocalName}
            onBlur={handleNameBlur}
          />
        </View>

        {/* Color picker */}
        <View style={styles.colorPicker}>
          {AVATAR_COLORS.map((color) => {
            const selected = preferences.avatarColor === color;

            return (
              <Pressable
                key={color}
                onPress={() =>
                  handleChange({ avatarColor: color })
                }
                style={[
                  styles.colorSwatch,
                  { backgroundColor: color },
                  selected && styles.colorSelected,
                ]}
              />
            );
          })}
        </View>
      </View>

      {/* Preferences form */}
      <View style={styles.content}>
        <PreferencesForm
          preferences={preferences}
          onChange={handleChange}
        />
      </View>

        <Animated.View
            pointerEvents="none"
            style={[
                styles.toastContainer,
                {
                opacity: toastOpacity,
                transform: [{ translateY: toastTranslateY }],
                },
            ]}
            >
            <View style={styles.toast}>
                <Text
                style={[
                    styles.toastText,
                    saveStatus === "saving" && { color: "#ccc" },
                    saveStatus === "saved" && { color: "#22c55e" },
                ]}
                >
                {saveStatus === "saving" ? "Saving…" : "Saved"}
                </Text>
            </View>
        </Animated.View>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",},
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    gap: 16,
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
  },
  colorPicker: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  colorSwatch: {
    width: 32,
    height: 16,
    borderRadius: 16,
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: "#000",
  },
  saveStatus: {
    minHeight: 20,
  },
  toastContainer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: "center",
    pointerEvents: "none", // lets touches pass through
  },
  toast: {
    backgroundColor: "#111",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
    toastText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  content: {
    flex: 1,
  },
});