import { create } from "zustand";
import { AppEvent } from "../types/AppEvent";
import { initialState, UserState } from "../types/UserState";
import { handleEvent } from "../rec_engine/handleEvent";
import { EngineResult, RuleTrace, StateDelta } from "../types/RuleTypes";

interface UserStateStore {
  state: UserState;
  lastTrace: RuleTrace[];
  lastDelta: StateDelta;
  dispatch: (event: AppEvent) => void;
}

export const useUserStateStore = create<UserStateStore>((set, get) => ({
  state: initialState,
  lastTrace: [],
  lastDelta: {},

  dispatch: (event) => {
    const { nextState, traces, totalDelta }: EngineResult = handleEvent(
      event,
      get().state
    );
    set({ state: nextState, lastTrace: traces, lastDelta: totalDelta });
  },
}));