// src/screens/ErrorScreen.tsx
import React from "react";
import { View, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Updates from "expo-updates";
import { RootStackParamList } from "../navigators/RootNavigator";
import { ROUTES } from "../navigators/routes";
import { Button } from "../components/ui/Button";
import { styles } from "../styling/screens/ErrorScreen.styles";

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

  async function handleRestart() {
    try {
      await Updates.reloadAsync();
    } catch (e) {
      Alert.alert(
        "Couldn't restart automatically",
        "Please close the app fully and reopen it."
      );
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>

        {/* Icon */}
        <View style={styles.iconWrap}>
          <View style={styles.iconRing} />
          <Text style={styles.iconGlyph}>!</Text>
        </View>

        {/* Copy */}
        <View style={styles.textBlock}>
          <Text style={styles.title}>Couldn't start</Text>
          <Text style={styles.hint}>{hint}</Text>
        </View>

        {/* Error detail — collapsed, for developers */}
        <View style={styles.errorBox}>
          <Text style={styles.errorLabel}>ERROR DETAIL</Text>
          <Text style={styles.errorMessage} numberOfLines={4}>{message}</Text>
        </View>

        {/* Retry */}
        <View style={styles.retryWrap}>
          <Button
            label="Restart app"
            fullWidth={false}
            onPress={handleRestart}
          />
        </View>

      </View>
    </SafeAreaView>
  );
}
