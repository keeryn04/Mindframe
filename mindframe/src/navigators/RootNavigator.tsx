// src/navigators/RootNavigator.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useDatabase } from "../db/useDatabase";
import { TabNavigator } from "./TabNavigator";
import { LoadingScreen } from "../screens/LoadingScreen";
import { ErrorScreen } from "../screens/ErrorScreen";
import { BreakPromptModal } from "../components/breaks/BreakPromptModal";
import { ROUTES } from "./routes";
import { colors } from "../styling/theme";

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
    <>
      <Stack.Navigator
        initialRouteName={initialRoute()}
        screenOptions={{
          headerShown: false,
          animation: "fade",
          contentStyle: { backgroundColor: colors.bg },
        }}
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