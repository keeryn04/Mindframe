// src/screens/ErrorScreen.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigators/RootNavigator";
import { ROUTES } from "../navigators/routes";

type Props = NativeStackScreenProps<RootStackParamList, typeof ROUTES.ERROR>;

export function ErrorScreen({ route }: Props) {
  const { message } = route.params;

  // Categorise the message so we can give a more useful hint
  const isDbError     = message.toLowerCase().includes("database") ||
                        message.toLowerCase().includes("sqlite");
  const isStorageErr  = message.toLowerCase().includes("storage") ||
                        message.toLowerCase().includes("disk") ||
                        message.toLowerCase().includes("permission");

  const hint = isDbError
    ? "The database couldn't be initialised. Try restarting the app. If this keeps happening, reinstalling will reset it."
    : isStorageErr
    ? "There may be a storage permission issue. Check that the app has permission to write to your device."
    : "An unexpected error occurred during startup. Restarting usually resolves this.";

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.center}>

        {/* Icon */}
        <View style={s.iconWrap}>
          <View style={s.iconRing} />
          <Text style={s.iconGlyph}>!</Text>
        </View>

        {/* Copy */}
        <View style={s.textBlock}>
          <Text style={s.title}>Couldn't start</Text>
          <Text style={s.hint}>{hint}</Text>
        </View>

        {/* Error detail — collapsed, for developers */}
        <View style={s.errorBox}>
          <Text style={s.errorLabel}>ERROR DETAIL</Text>
          <Text style={s.errorMessage} numberOfLines={4}>{message}</Text>
        </View>

        {/* Retry */}
        <TouchableOpacity
          style={s.retryBtn}
          activeOpacity={0.8}
          onPress={() => {
            // RootNavigator re-mounts useDatabase on re-render.
            // The cleanest retry is a full JS reload via expo-updates,
            // or simply ask the user to force-quit and reopen.
            // Replace with Updates.reloadAsync() if using expo-updates.
          }}
        >
          <Text style={s.retryText}>Restart app</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: "#FAFAF8" },
  center:       { flex: 1, alignItems: "center", justifyContent: "center",
                  paddingHorizontal: 32, gap: 24 },

  iconWrap:     { width: 64, height: 64, alignItems: "center", justifyContent: "center" },
  iconRing:     { position: "absolute", width: 64, height: 64, borderRadius: 32,
                  borderWidth: 2, borderColor: "#A32D2D", opacity: 0.3 },
  iconGlyph:    { fontSize: 30, fontWeight: "700", color: "#A32D2D", lineHeight: 34 },

  textBlock:    { alignItems: "center", gap: 8 },
  title:        { fontSize: 22, fontWeight: "700", color: "#1A1A18", letterSpacing: -0.4 },
  hint:         { fontSize: 14, color: "#555", lineHeight: 21, textAlign: "center" },

  errorBox:     { width: "100%", backgroundColor: "#F3F1EE", borderRadius: 10,
                  padding: 14, gap: 6 },
  errorLabel:   { fontSize: 9, fontWeight: "800", color: "#888780", letterSpacing: 1 },
  errorMessage: { fontSize: 12, color: "#444", lineHeight: 18, fontFamily: "monospace" },

  retryBtn:     { paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12,
                  backgroundColor: "#534AB7" },
  retryText:    { fontSize: 15, fontWeight: "600", color: "#fff" },
});