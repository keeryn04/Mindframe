// src/navigation/RootNavigator.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useDatabase } from "../db/useDatabase";
import { TabNavigator } from "./TabNavigator";
import { LoadingScreen } from "../screens/LoadingScreen";
import { ErrorScreen } from "../screens/ErrorScreen";
import { BreakPromptModal } from "../components/breaks/BreakPromptModal";
import { ROUTES } from "./routes";

export type RootStackParamList = {
  [ROUTES.LOADING]: undefined;
  [ROUTES.ERROR]: { message: string };
  [ROUTES.MAIN]: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { ready, error } = useDatabase();

  // Derive which screen to show as the initial route
  const initialRoute = (): keyof RootStackParamList => {
    if (error) return ROUTES.ERROR;
    if (ready) return ROUTES.MAIN;
    return ROUTES.LOADING;
  };

  return (
    // BreakPromptModal is a sibling of the Stack.Navigator, not a screen
    // inside it — React Native's <Modal> already renders as a top-level
    // overlay, so this lets the prompt appear over any screen (including
    // the Breaks screen itself, where it should just stay hidden).
    <>
      <Stack.Navigator
        initialRouteName={initialRoute()}
        screenOptions={{ headerShown: false, animation: "fade" }}
      >
        {!ready && !error && (
          <Stack.Screen name={ROUTES.LOADING} component={LoadingScreen} />
        )}
        {error && (
          <Stack.Screen
            name={ROUTES.ERROR}
            component={ErrorScreen}
            initialParams={{ message: error.message }}
          />
        )}
        {ready && (
          <>
            <Stack.Screen name={ROUTES.MAIN} component={TabNavigator} />
          </>
        )}
      </Stack.Navigator>
      {ready && <BreakPromptModal />}
    </>
  );
}