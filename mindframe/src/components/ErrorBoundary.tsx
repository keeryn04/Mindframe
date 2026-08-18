// src/components/ErrorBoundary.tsx
//
// Catches render-time exceptions anywhere below it in the tree and shows a
// minimal recovery screen instead of a blank/white app. This is separate
// from ErrorScreen (which only handles the database-failed-to-open case
// surfaced by RootNavigator) — this is the last line of defence for
// anything else that throws during render.

import React from "react";
import { View, Text, Alert } from "react-native";
import * as Updates from "expo-updates";
import { Button } from "./ui/Button";
import { colors } from "../styling/theme";

interface Props {
  children: React.ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Swap for your crash reporter (Sentry, Bugsnag, etc.) once configured.
    console.error("Unhandled render error:", error, info.componentStack);
  }

  handleRestart = async () => {
    try {
      await Updates.reloadAsync();
    } catch (e) {
      Alert.alert(
        "Couldn't restart automatically",
        "Please close the app fully and reopen it."
      );
    }
  };

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    return (
      <View style={styles.center}>
        <Text style={styles.title}>Something went wrong</Text>
        <Text style={styles.detail}>
          The app hit an unexpected error and needs to restart.
        </Text>
        <View style={styles.retryWrap}>
          <Button label="Restart app" fullWidth={false} onPress={this.handleRestart} />
        </View>
      </View>
    );
  }
}

const styles = {
  center: {
    flex: 1,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    paddingHorizontal: 32,
    backgroundColor: colors.bg,
  },
  title: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: colors.ink,
    marginBottom: 8,
    textAlign: "center" as const,
  },
  detail: {
    fontSize: 14,
    color: colors.inkMuted,
    textAlign: "center" as const,
    marginBottom: 24,
  },
  retryWrap: {
    minWidth: 160,
  },
};
