import { RecommendationRule, recommendationRules } from "../../types/recommendations/RecommendationRule.types";
import { Recommendation, RecommendationPriority } from "../../types/recommendations/Recommendation.types";
import { UserState } from "../../types/UserState.types";
 
const PRIORITY_ORDER: Record<RecommendationPriority, number> = {
  urgent: 0,
  high:   1,
  normal: 2,
  low:    3,
};

export function getRecommendations(
  state: UserState,
  rules: RecommendationRule[] = recommendationRules,
  maxResults = 1
): Recommendation[] {
  return rules
    .filter(rule => rule.condition(state))
    .map(rule => rule.build(state))
    .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])
    .slice(0, maxResults);
}

export function getTopRecommendation(state: UserState): Recommendation | null {
  return getRecommendations(state, recommendationRules, 1)[0] ?? null;
}