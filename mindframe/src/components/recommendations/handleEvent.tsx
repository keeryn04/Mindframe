import { AppEvent } from "../../types/AppEvent";
import { EngineResult } from "../../types/RuleTypes";
import { UserState } from "../../types/UserState";
import { runEngine } from "./ruleEngine";
import { taskRules } from "../../types/TaskRules";
import { modifiers } from "../../types/Modifiers";

/**
 * Primary entry point. Takes an event and current state,
 * returns the next state plus a full debug trace.
 *
 * Usage:
 *   const { nextState } = handleEvent(event, state);
 *
 * For debugging:
 *   const { nextState, traces, totalDelta } = handleEvent(event, state);
 */
export function handleEvent(event: AppEvent, state: UserState): EngineResult {
  return runEngine(event, state, taskRules, modifiers);
}

/**
 * Convenience wrapper that returns only the next state.
 */
export function applyEvent(event: AppEvent, state: UserState): UserState {
  return handleEvent(event, state).nextState;
}
 
/**
 * Replay a sequence of events from an initial state.
 * Returns the final state and all intermediate states for each step.
 */
export function replayEvents(
  events: AppEvent[],
  initialState: UserState
): { states: UserState[]; final: UserState } {
  const states: UserState[] = [initialState];
  let current = initialState;
 
  for (const event of events) {
    current = applyEvent(event, current);
    states.push(current);
  }
 
  return { states, final: current };
}
 