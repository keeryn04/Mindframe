import { AppEvent } from "./AppEvent.types";
import { UserState } from "./UserState.types";
 
/**
 * A delta is a partial state where each field is a *signed change*,
 * not an absolute value. Positive = increase, negative = decrease.
 */
export type StateDelta = Partial<Record<keyof UserState, number>>;
 
/**
 * A rule responds to matching events and returns a delta to apply.
 */
export interface StateRule {
  name: string;
  description: string;
  matches: (event: AppEvent) => boolean;
  apply: (event: AppEvent, state: UserState) => StateDelta;
}
 
/**
 * A modifier amplifies or dampens specific rules when a state
 * condition is met. Applied multiplicatively to delta values.
 */
export interface RuleModifier {
  name: string;
  description: string;
  condition: (state: UserState) => boolean;
  /** Which rule names this modifier applies to. Empty = all rules. */
  affects: string[];
  /** Multiplier applied to every delta field the rule produces. */
  multiplier: number;
}
 
/**
 * Debug trace of a single rule execution, including modifier effects.
 */
export interface RuleTrace {
  ruleName: string;
  rawDelta: StateDelta;
  modifiedDelta: StateDelta;
  modifiersApplied: string[];
}
 
export interface EngineResult {
  nextState: UserState;
  traces: RuleTrace[];
  totalDelta: StateDelta;
}