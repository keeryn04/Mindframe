export interface UserState {
  stressLevel: number;   //0–100
  energyLevel: number;   //0–100
  focusLevel: number;    //0–100
  momentum: number;      //0–100 — streaks, flow state
  confidence: number;    //0–100 — success/failure history
}
 
export const initialState: UserState = {
  stressLevel: 0,
  energyLevel: 100,
  focusLevel: 100,
  momentum: 50,
  confidence: 50,
};

/**
 * Shared thresholds for "the user needs to step away" type checks.
 * These power both the recommendation rules (criticalEnergy,
 * highStressCritical, etc.) and the BreakPromptModal trigger condition.
 * Keeping a single source of truth means the popup and the
 * recommendation cards can never silently disagree on the cutoffs.
 */
export const THRESHOLDS = {
  criticalEnergy: 15,
  lowEnergy: 35,
  highStressCritical: 85,
  elevatedStress: 65,
} as const;