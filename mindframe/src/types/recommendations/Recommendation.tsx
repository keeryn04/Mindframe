export type RecommendationCategory =
  | "recovery"
  | "focus"
  | "motivation"
  | "warning"
  | "celebrate";
 
export type RecommendationPriority = "urgent" | "high" | "normal" | "low";
 
export interface Recommendation {
  id: string;
  category: RecommendationCategory;
  priority: RecommendationPriority;
  headline: string;         //short sentence - shown in list
  detail: string;           //full sentence - shown expanded
  action?: string;          //optional CTA label e.g. "Take a break"
  actionEvent?: string;     //event type to dispatch when CTA tapped
}