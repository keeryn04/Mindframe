import { RuleModifier } from "./RuleTypes.types";
 
/**
 * When the user is exhausted (energy < 20), all negative effects
 * hit harder — failures are more demoralising, interruptions more
 * disruptive.
 */
const exhaustedAmplifier: RuleModifier = {
  name: "exhausted-amplifier",
  description: "Amplifies negative effects when energy is very low",
  condition: (s) => s.energyLevel < 20,
  affects: [
    "task-failed-stress",
    "task-failed-focus-momentum-loss",
    "task-failed-confidence-drop",
    "task-interrupted-penalty",
  ],
  multiplier: 1.5,
};
 
/**
 * When in flow state (high focus + high momentum), positive effects
 * are boosted — the user is in the zone and capitalises on it.
 */
const flowStateBooster: RuleModifier = {
  name: "flow-state-booster",
  description: "Boosts positive effects when in flow (high focus + momentum)",
  condition: (s) => s.focusLevel > 75 && s.momentum > 70,
  affects: [
    "task-completed-focus-boost",
    "task-completed-momentum",
    "task-completed-confidence",
    "task-completed-stress-relief",
  ],
  multiplier: 1.4,
};
 
/**
 * When already highly stressed, additional stress effects are
 * dampened — the user is already at capacity, diminishing returns.
 */
const stressSaturationDampener: RuleModifier = {
  name: "stress-saturation-dampener",
  description: "Diminishes additional stress when already near max",
  condition: (s) => s.stressLevel > 80,
  affects: ["task-failed-stress", "task-interrupted-penalty"],
  multiplier: 0.5,
};
 
/**
 * Low confidence makes failures sting more — the user already
 * doubts themselves.
 */
const lowConfidenceVulnerability: RuleModifier = {
  name: "low-confidence-vulnerability",
  description: "Magnifies negative confidence and focus hits when confidence is low",
  condition: (s) => s.confidence < 30,
  affects: ["task-failed-confidence-drop", "task-failed-focus-momentum-loss"],
  multiplier: 1.6,
};
 
/**
 * High confidence provides resilience — setbacks don't cut as deep.
 */
const highConfidenceResilience: RuleModifier = {
  name: "high-confidence-resilience",
  description: "Reduces damage from failures when confidence is high",
  condition: (s) => s.confidence > 75,
  affects: [
    "task-failed-stress",
    "task-failed-confidence-drop",
    "task-failed-focus-momentum-loss",
  ],
  multiplier: 0.65,
};
 
/**
 * Well-rested users (high energy) get more out of break recovery.
 * They snap back faster.
 */
const wellRestedRecovery: RuleModifier = {
  name: "well-rested-recovery",
  description: "Well-rested users recover more efficiently from breaks",
  condition: (s) => s.energyLevel > 70,
  affects: ["break-taken-recovery"],
  multiplier: 0.8,
};
 
export const modifiers: RuleModifier[] = [
  exhaustedAmplifier,
  flowStateBooster,
  stressSaturationDampener,
  lowConfidenceVulnerability,
  highConfidenceResilience,
  wellRestedRecovery,
];