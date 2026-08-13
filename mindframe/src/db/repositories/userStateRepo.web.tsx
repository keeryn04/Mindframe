import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserState, initialState } from "../../types/UserState.types";

const KEY = "user_state";

export function createUserStateRepo(_db?: unknown) {
  return {
    async load(): Promise<UserState> {
      const raw = await AsyncStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : initialState;
    },
    async save(state: UserState): Promise<void> {
      await AsyncStorage.setItem(KEY, JSON.stringify(state));
    },
  };
}