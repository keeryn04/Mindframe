import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { DatabaseProvider, useDb } from "../db/DatabaseContext";
import { createUserStateRepo } from "../db/repositories/userStateRepo";
import { useUserStateStore } from "../store/useUserStateStore";
import { createTaskRepo } from "../db/repositories/taskRepo";
import { useTaskStore } from "../store/useTaskStore";


interface Props {
  children: React.ReactNode;
}

function AppInitializer({ children }: Props) {
  const { db, ready } = useDb();
  const initializeUserStore = useUserStateStore((s) => s.initialize);
  const initializeTaskStore = useTaskStore((s) => s.initialize);
  const isHydrated = useUserStateStore((s) => s.isHydrated);

  useEffect(() => {
    if (!db || !ready) return;

    const userRepo = createUserStateRepo(db);
    const taskRepo = createTaskRepo(db);

    initializeUserStore(userRepo);
    initializeTaskStore(taskRepo);
  }, [db, ready]);

  if (!ready || !isHydrated) {
    return null;
  }

  return <>{children}</>;
}

export function AppProviders({ children }: Props) {
  return (
    <DatabaseProvider>
      <AppInitializer>
        <NavigationContainer>
          <StatusBar style="auto" />
          {children}
        </NavigationContainer>
      </AppInitializer>
    </DatabaseProvider>
  );
}