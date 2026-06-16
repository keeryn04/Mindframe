import { create } from "zustand";
import { AppEvent } from "../types/AppEvent.types";
import { initialState, UserState } from "../types/UserState.types";
import { handleEvent } from "../components/recommendations/handleEvent";
import { EngineResult, RuleTrace, StateDelta } from "../types/RuleTypes.types";
import { getRecommendations } from "../components/recommendations/recEngine";
import { Recommendation } from "../types/recommendations/Recommendation.types";
import { createUserStateRepo } from "../db/repositories/userStateRepo";
import { useUserPreferencesStore } from "./useUserPreferencesStore";
import { defaultPreferences } from "../types/UserPreferences.types";

interface UserStateStore {
  state: UserState;
  lastTrace: RuleTrace[];
  lastDelta: StateDelta;
  recommendations: Recommendation[];
  isHydrated: boolean;
  initialize: (repo: ReturnType<typeof createUserStateRepo>) => Promise<void>;
  dispatch: (event: AppEvent) => void;
}

let repoRef: ReturnType<typeof createUserStateRepo> | null = null;

export const useUserStateStore = create<UserStateStore>((set, get) => ({
  state: initialState,
  lastTrace: [],
  lastDelta: {},
  // Initial recommendations use defaultPreferences — preferences store may
  // not be hydrated yet. They'll be recalculated on the first dispatch.
  recommendations: getRecommendations(initialState, defaultPreferences),
  isHydrated: false,

  initialize: async (repo) => {
    repoRef = repo;

    const savedState = await repo.load();
    const preferences = useUserPreferencesStore.getState().preferences;

    set({
      state: savedState,
      recommendations: getRecommendations(savedState, preferences),
      isHydrated: true,
    });
  },

  dispatch: async (event) => {
    const { nextState, traces, totalDelta }: EngineResult = handleEvent(
      event,
      get().state
    );

    const preferences = useUserPreferencesStore.getState().preferences;

    set({
      state: nextState,
      lastTrace: traces,
      lastDelta: totalDelta,
      recommendations: getRecommendations(nextState, preferences, event),
    });

    if (repoRef) {
      await repoRef.save(nextState);
    }
  },
}));