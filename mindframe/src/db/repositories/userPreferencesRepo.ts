import { SQLiteDatabase } from "expo-sqlite";
import { UserPreferences, defaultPreferences } from "../../types/UserPreferences.types";

export function createUserPreferencesRepo(db: SQLiteDatabase) {
  return {
    async load(): Promise<UserPreferences> {
      const row = await db.getFirstAsync<any>(
        "SELECT * FROM user_preferences WHERE id = 1"
      );
      if (!row) return { ...defaultPreferences };

      return {
        displayName:           row.display_name ?? defaultPreferences.displayName,
        avatarColor:           row.avatar_color ?? defaultPreferences.avatarColor,
        workStyle:             row.work_style ?? defaultPreferences.workStyle,
        energyPattern:         row.energy_pattern ?? defaultPreferences.energyPattern,
        stressTolerance:       row.stress_tolerance ?? defaultPreferences.stressTolerance,
        recommendationMode:    row.recommendation_mode ?? defaultPreferences.recommendationMode,
        maxRecommendations:    row.max_recommendations ?? defaultPreferences.maxRecommendations,
        enableActionableOnly:  row.enable_actionable_only === 1,
      };
    },

    async save(p: UserPreferences): Promise<void> {
      await db.runAsync(`
        INSERT INTO user_preferences (
          id, display_name, avatar_color, work_style, energy_pattern,
          stress_tolerance, recommendation_mode, max_recommendations,
          enable_actionable_only, updated_at
        )
        VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        ON CONFLICT(id) DO UPDATE SET
          display_name           = excluded.display_name,
          avatar_color           = excluded.avatar_color,
          work_style             = excluded.work_style,
          energy_pattern         = excluded.energy_pattern,
          stress_tolerance       = excluded.stress_tolerance,
          recommendation_mode    = excluded.recommendation_mode,
          max_recommendations    = excluded.max_recommendations,
          enable_actionable_only = excluded.enable_actionable_only,
          updated_at             = excluded.updated_at
      `, [
        p.displayName,
        p.avatarColor,
        p.workStyle,
        p.energyPattern,
        p.stressTolerance,
        p.recommendationMode,
        p.maxRecommendations,
        p.enableActionableOnly ? 1 : 0,
      ]);
    },
  };
}

export type UserPreferencesRepo = ReturnType<typeof createUserPreferencesRepo>;