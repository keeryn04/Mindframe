import { BreakActivityCategory } from "../AppEvent.types";

/**
 * A single break activity the user can choose to take.
 * This is static catalog data (like taskRules / recommendationRules),
 * not user data — it doesn't need a repo or DB table.
 */
export interface BreakActivity {
  id: string;
  title: string;
  description: string;
  category: BreakActivityCategory;
  defaultDurationMinutes: number;
  /** Optional guided steps shown during the activity session. */
  steps?: string[];
}

export const breakActivities: BreakActivity[] = [
  {
    id: "box-breathing",
    title: "Box breathing",
    description: "Slow, structured breathing to bring stress down fast.",
    category: "breathing",
    defaultDurationMinutes: 3,
    steps: ["Inhale for 4 seconds", "Hold for 4 seconds", "Exhale for 4 seconds", "Hold for 4 seconds"],
  },
  {
    id: "short-walk",
    title: "Short walk",
    description: "Step away and move — resets energy and momentum.",
    category: "movement",
    defaultDurationMinutes: 10,
  },
  {
    id: "stretch",
    title: "Stretch break",
    description: "Loosen up with a few minutes of light stretching.",
    category: "movement",
    defaultDurationMinutes: 5,
  },
  {
    id: "body-scan",
    title: "Body scan",
    description: "A guided mindfulness pass to clear mental clutter.",
    category: "mindfulness",
    defaultDurationMinutes: 5,
    steps: ["Close your eyes", "Notice your feet, then legs", "Move attention slowly up your body", "Notice your breath"],
  },
  {
    id: "message-a-friend",
    title: "Message a friend",
    description: "A quick social check-in to rebuild momentum.",
    category: "social",
    defaultDurationMinutes: 5,
  },
  {
    id: "just-rest",
    title: "Just rest",
    description: "No agenda — sit and do nothing for a bit.",
    category: "rest",
    defaultDurationMinutes: 10,
  },
];

export function getBreakActivity(id: string): BreakActivity | undefined {
  return breakActivities.find((a) => a.id === id);
}