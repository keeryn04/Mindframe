import { create } from "zustand";
import { UserPreferences, defaultPreferences } from "../types/UserPreferences.types";
import { createUserPreferencesRepo } from "../db/repositories/userPreferencesRepo";

interface UserPreferencesStore {
  preferences: UserPreferences;
  isHydrated: boolean;
  initialize: (repo: ReturnType<typeof createUserPreferencesRepo>) => Promise<void>;
  updatePreferences: (patch: Partial<UserPreferences>) => Promise<void>;
}

let repoRef: ReturnType<typeof createUserPreferencesRepo> | null = null;

export const useUserPreferencesStore = create<UserPreferencesStore>((set, get) => ({
  preferences: { ...defaultPreferences },
  isHydrated: false,

  initialize: async (repo) => {
    repoRef = repo;
    const saved = await repo.load();
    set({ preferences: saved, isHydrated: true });
  },

  updatePreferences: async (patch) => {
    const merged: UserPreferences = { ...get().preferences, ...patch };
    console.log("Updating preferences with patch:", patch, "Merged result:", merged);
    set({ preferences: merged });
    console.log("Preferences after set:", get().preferences);

    if (repoRef) {
      await repoRef.save(merged);
      console.log("Preferences saved to repo:", merged);
    }
  },
}));