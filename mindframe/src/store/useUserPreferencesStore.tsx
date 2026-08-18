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

    try {
      const saved = await repo.load();
      set({ preferences: saved, isHydrated: true });
    } catch (e) {
      // Fall back to defaults rather than leaving ProfileScreen stuck on
      // its loading state if the saved preferences can't be read.
      console.error("useUserPreferencesStore: failed to load preferences", e);
      set({ preferences: { ...defaultPreferences }, isHydrated: true });
    }
  },

  updatePreferences: async (patch) => {
    const merged: UserPreferences = { ...get().preferences, ...patch };
    set({ preferences: merged });

    if (repoRef) {
      try {
        await repoRef.save(merged);
      } catch (e) {
        // Preferences already updated in memory; log rather than throw so
        // a storage hiccup can't crash the settings screen.
        console.error("useUserPreferencesStore: failed to save preferences", e);
      }
    }
  },
}));
