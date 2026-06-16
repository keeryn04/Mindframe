export type WorkStyle = "deep-focus" | "both" | "flexible";
export type EnergyPattern = "morning" | "afternoon" | "evening" | "inconsistent";
export type StressToleranceLevel = "low" | "medium" | "high";
export type RecommendationMode = "task" | "general";

export interface UserPreferences {
  // Display
  displayName: string;
  avatarColor: string;              // hex — chosen from a preset palette in the UI

  // Work behaviour
  workStyle: WorkStyle;             // how the user prefers to structure sessions
  energyPattern: EnergyPattern;     // when the user is naturally most productive

  // How sensitively to surface stress/energy warnings:
  //   low    → warnings appear sooner (lower threshold)
  //   medium → default thresholds
  //   high   → warnings are dampened (user tolerates more before being nudged)
  stressTolerance: StressToleranceLevel;

  // Recommendation display settings
  recommendationMode: RecommendationMode;
  maxRecommendations: number;       // 1–3; drives how many cards are shown at once
  enableActionableOnly: boolean;    // when true, only recs with an actionEvent are shown
}

export const defaultPreferences: UserPreferences = {
  displayName: "",
  avatarColor: "#6366f1",
  workStyle: "flexible",
  energyPattern: "inconsistent",
  stressTolerance: "medium",
  recommendationMode: "general",
  maxRecommendations: 1,
  enableActionableOnly: false,
};