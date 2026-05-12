import { create } from "zustand";
import { AppEvent } from "../types/AppEvent";
import { initialState, UserState } from "../types/UserState";
import { handleEvent } from "../components/recommendations/handleEvent";
import { EngineResult, RuleTrace, StateDelta } from "../types/RuleTypes";
import { getRecommendations } from "../components/recommendations/recEngine";
import { Recommendation } from "../types/recommendations/Recommendation";

interface UserStateStore {
  state: UserState;
  lastTrace: RuleTrace[];
  lastDelta: StateDelta;
  recommendations: Recommendation[];
  dispatch: (event: AppEvent) => void;
}

export const useUserStateStore = create<UserStateStore>((set, get) => ({
  state: initialState,
  lastTrace: [],
  lastDelta: {},
  recommendations: getRecommendations(initialState),

  dispatch: (event) => {
    const { nextState, traces, totalDelta }: EngineResult = handleEvent(
      event,
      get().state
    );
    set({ state: nextState, lastTrace: traces, lastDelta: totalDelta, recommendations: getRecommendations(nextState) });
  },
}));