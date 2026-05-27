import { UserState } from "../../types/UserState.types";
import { AppEvent } from "../../types/AppEvent.types";
import {
  StateDelta,
  StateRule,
  RuleModifier,
  RuleTrace,
  EngineResult,
} from "../../types/RuleTypes.types";
 
const STATE_KEYS: (keyof UserState)[] = [
  "stressLevel",
  "energyLevel",
  "focusLevel",
  "momentum",
  "confidence",
];
 
/**
 * Merge two deltas additively. Both can contribute to the same field.
 */
function mergeDeltas(a: StateDelta, b: StateDelta): StateDelta {
  const result: StateDelta = { ...a };
  for (const key of Object.keys(b) as (keyof UserState)[]) {
    result[key] = (result[key] ?? 0) + (b[key] ?? 0);
  }
  return result;
}
 
/**
 * Apply a delta to a state, clamping all fields to [0, 100].
 */
function applyDelta(state: UserState, delta: StateDelta): UserState {
  const next = { ...state };
  for (const key of STATE_KEYS) {
    if (delta[key] !== undefined) {
      next[key] = Math.min(100, Math.max(0, state[key] + delta[key]!));
    }
  }
  return next;
}
 
/**
 * Scale every value in a delta by a multiplier.
 */
function scaleDelta(delta: StateDelta, multiplier: number): StateDelta {
  const result: StateDelta = {};
  for (const key of Object.keys(delta) as (keyof UserState)[]) {
    result[key] = (delta[key] ?? 0) * multiplier;
  }
  return result;
}
 
/**
 * Apply all matching modifiers to a rule's raw delta.
 * Returns the modified delta and the names of modifiers that fired.
 */
function applyModifiers(
  ruleName: string,
  rawDelta: StateDelta,
  state: UserState,
  modifiers: RuleModifier[]
): { modifiedDelta: StateDelta; modifiersApplied: string[] } {
  let delta = { ...rawDelta };
  const fired: string[] = [];
 
  for (const mod of modifiers) {
    const appliesToRule = mod.affects.length === 0 || mod.affects.includes(ruleName);
    if (appliesToRule && mod.condition(state)) {
      delta = scaleDelta(delta, mod.multiplier);
      fired.push(mod.name);
    }
  }
 
  return { modifiedDelta: delta, modifiersApplied: fired };
}
 
/**
 * Run all rules against an event, apply modifiers, merge deltas,
 * and produce the next state — with a full debug trace.
 */
export function runEngine(
  event: AppEvent,
  state: UserState,
  rules: StateRule[],
  modifiers: RuleModifier[] = []
): EngineResult {
  const traces: RuleTrace[] = [];
  let totalDelta: StateDelta = {};
 
  for (const rule of rules) {
    if (!rule.matches(event)) continue;
 
    const rawDelta = rule.apply(event, state);
    const { modifiedDelta, modifiersApplied } = applyModifiers(
      rule.name,
      rawDelta,
      state,
      modifiers
    );
 
    traces.push({ ruleName: rule.name, rawDelta, modifiedDelta, modifiersApplied });
    totalDelta = mergeDeltas(totalDelta, modifiedDelta);
  }
 
  const nextState = applyDelta(state, totalDelta);
 
  return { nextState, traces, totalDelta };
}