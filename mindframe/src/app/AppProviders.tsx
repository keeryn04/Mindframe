import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DatabaseProvider, useDb } from "../db/DatabaseContext";
import { createUserStateRepo } from "../db/repositories/userStateRepo";
import { useUserStateStore } from "../store/useUserStateStore";
import { createTaskRepo } from "../db/repositories/taskRepo";
import { useTaskStore } from "../store/useTaskStore";
import { useUserPreferencesStore } from "../store/useUserPreferencesStore";
import { createUserPreferencesRepo } from "../db/repositories/userPreferencesRepo";
import { navigationTheme } from "../styling/navigationTheme";

interface Props {
  children: React.ReactNode;
}

function AppInitializer({ children }: Props) {
  const { db, ready } = useDb();
  const initializeUserStore = useUserStateStore((s) => s.initialize);
  const initializeTaskStore = useTaskStore((s) => s.initialize);
  const initializePreferencesStore = useUserPreferencesStore((s) => s.initialize);

  const [allReady, setAllReady] = useState(false);

  useEffect(() => {
    if (!ready) return;

    async function initAll() {
      const userRepo = createUserStateRepo(db as any);
      const taskRepo = createTaskRepo(db as any);
      const preferencesRepo = createUserPreferencesRepo(db as any);

      await initializeUserStore(userRepo);
      await initializeTaskStore(taskRepo);
      await initializePreferencesStore(preferencesRepo);

      setAllReady(true);
    }

    initAll().catch((err) => {
      console.error("App initialization failed:", err);
    });
  }, [db, ready]);

  if (!ready || !allReady) {
    return null;
  }

  return <>{children}</>;
}

export function AppProviders({ children }: Props) {
  return (
    <SafeAreaProvider>
      <DatabaseProvider>
        <AppInitializer>
          <NavigationContainer theme={navigationTheme}>
            <StatusBar style="dark" />
            {children}
          </NavigationContainer>
        </AppInitializer>
      </DatabaseProvider>
    </SafeAreaProvider>
  );
}