import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserPreferences, defaultPreferences } from "../../types/UserPreferences.types";

const KEY = "user_preferences";

export function createUserPreferencesRepo(_db?: unknown) {
  return {
    async load(): Promise<UserPreferences> {
      const raw = await AsyncStorage.getItem(KEY);
      return raw ? { ...defaultPreferences, ...JSON.parse(raw) } : { ...defaultPreferences };
    },
    async save(p: UserPreferences): Promise<void> {
      await AsyncStorage.setItem(KEY, JSON.stringify(p));
    },
  };
}

export type UserPreferencesRepo = ReturnType<typeof createUserPreferencesRepo>;