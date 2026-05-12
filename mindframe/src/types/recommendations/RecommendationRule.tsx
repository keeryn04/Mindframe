import { UserState } from "../UserState";
import { Recommendation } from "./Recommendation";

/**
 * A RecommendationRule checks the current state and returns a
 * Recommendation if its condition is met, or null if not.
 */
export type RecommendationRule = {
  id: string;
  condition: (state: UserState) => boolean;
  build: (state: UserState) => Recommendation;
};

//Recovery

const criticalEnergy: RecommendationRule = {
  id: "critical-energy",
  condition: s => s.energyLevel < 15,
  build: s => ({
    id: "critical-energy",
    category: "recovery",
    priority: "urgent",
    headline: "You're running on empty",
    detail: `Your energy is low — continuing now risks mistakes and a much longer recovery. Step away for at least 20 minutes.`,
    action: "Log a break",
    actionEvent: "BREAK_TAKEN",
  }),
};

const lowEnergy: RecommendationRule = {
  id: "low-energy",
  condition: s => s.energyLevel >= 15 && s.energyLevel < 35,
  build: s => ({
    id: "low-energy",
    category: "recovery",
    priority: "high",
    headline: "Energy getting low",
    detail: `You're at a low energy level. A short break now will cost you 10 minutes but save you an hour of degraded focus later.`,
    action: "Take a break",
    actionEvent: "BREAK_TAKEN",
  }),
};

const highStressCritical: RecommendationRule = {
  id: "high-stress-critical",
  condition: s => s.stressLevel > 85,
  build: s => ({
    id: "high-stress-critical",
    category: "warning",
    priority: "urgent",
    headline: "Stress is at a critical level",
    detail: `You're very stressed at the moment, your decision quality and retention drop significantly. Completing more tasks right now will likely cost you more than stopping.`,
    action: "Take a break",
    actionEvent: "BREAK_TAKEN",
  }),
};

const elevatedStress: RecommendationRule = {
  id: "elevated-stress",
  condition: s => s.stressLevel >= 65 && s.stressLevel <= 85,
  build: s => ({
    id: "elevated-stress",
    category: "warning",
    priority: "high",
    headline: "Stress is climbing",
    detail: `You're feeling stressed. Try switching to an easier task to get a win and bring it down before tackling harder work.`,
  }),
};

//Focus

const inFlowState: RecommendationRule = {
  id: "in-flow",
  condition: s => s.focusLevel > 78 && s.momentum > 68,
  build: s => ({
    id: "in-flow",
    category: "focus",
    priority: "normal",
    headline: "You're in flow — protect it",
    detail: `You're in a great state right now. This is your best window for hard problems. Block distractions and take on your most demanding task.`,
  }),
};

const lowFocus: RecommendationRule = {
  id: "low-focus",
  condition: s => s.focusLevel < 30 && s.energyLevel > 40,
  build: s => ({
    id: "low-focus",
    category: "focus",
    priority: "high",
    headline: "Focus is fragmented",
    detail: `You're having trouble focusing. Start with a single small, completable task to rebuild concentration.`,
  }),
};

const recoveredFocus: RecommendationRule = {
  id: "recovered-focus",
  condition: s => s.focusLevel >= 55 && s.focusLevel <= 78 && s.energyLevel > 50,
  build: () => ({
    id: "recovered-focus",
    category: "focus",
    priority: "low",
    headline: "Good focus window opening",
    detail: "Your focus and energy are in a solid range. This is a good time for medium-difficulty work that needs sustained attention.",
  }),
};

//Motivation

const lowConfidence: RecommendationRule = {
  id: "low-confidence",
  condition: s => s.confidence < 28,
  build: s => ({
    id: "low-confidence",
    category: "motivation",
    priority: "high",
    headline: "Pick an easy win",
    detail: `You're feeling uncertain right now. Don't push into hard tasks right now — choose something you know you can finish. A completed task will do more for you than an ambitious failure.`,
  }),
};

const highMomentum: RecommendationRule = {
  id: "high-momentum",
  condition: s => s.momentum > 80 && s.confidence > 65,
  build: s => ({
    id: "high-momentum",
    category: "celebrate",
    priority: "normal",
    headline: "You're on a roll",
    detail: `You're locked in! You've built a strong streak — this is the time to attempt something you've been putting off.`,
  }),
};

const lostMomentum: RecommendationRule = {
  id: "lost-momentum",
  condition: s => s.momentum < 20 && s.stressLevel < 70,
  build: () => ({
    id: "lost-momentum",
    category: "motivation",
    priority: "normal",
    headline: "Restart with something familiar",
    detail: "Momentum has stalled. Pick a task you've done before — finishing it quickly will restart your streak without adding pressure.",
  }),
};

//Celebrate

const peakState: RecommendationRule = {
  id: "peak-state",
  condition: s =>
    s.energyLevel > 70 &&
    s.focusLevel > 70 &&
    s.confidence > 70 &&
    s.stressLevel < 40,
  build: () => ({
    id: "peak-state",
    category: "celebrate",
    priority: "normal",
    headline: "Peak condition right now",
    detail: "All your indicators are in the green. Use this window for your highest-value, most creative, or most difficult work.",
  }),
};

//Balanced

const steadyState: RecommendationRule = {
  id: "steady-state",
  condition: s =>
    s.stressLevel < 65 &&
    s.energyLevel > 35 &&
    s.focusLevel > 30,
  build: () => ({
    id: "steady-state",
    category: "focus",
    priority: "low",
    headline: "Steady — keep going",
    detail: "Your state is balanced. No urgent signals. Work at your normal pace and check in again after a few more tasks.",
  }),
};

export const recommendationRules: RecommendationRule[] = [
  criticalEnergy,
  highStressCritical,
  lowEnergy,
  elevatedStress,
  lowConfidence,
  lowFocus,
  inFlowState,
  highMomentum,
  peakState,
  recoveredFocus,
  lostMomentum,
  steadyState,
];