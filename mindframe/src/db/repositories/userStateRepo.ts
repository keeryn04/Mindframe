import { SQLiteDatabase } from "expo-sqlite";
import { UserState, initialState } from "../../types/UserState.types";

export function createUserStateRepo(db: SQLiteDatabase) {
  return {
    async load(): Promise<UserState> {
      const row = await db.getFirstAsync<any>(
        "SELECT * FROM user_state WHERE id = 1"
      );
      if (!row) return initialState;
      return {
        stressLevel: row.stress_level,
        energyLevel: row.energy_level,
        focusLevel:  row.focus_level,
        momentum:    row.momentum,
        confidence:  row.confidence,
      };
    },

    async save(state: UserState): Promise<void> {
      await db.runAsync(`
        INSERT INTO user_state (id, stress_level, energy_level, focus_level, momentum, confidence, updated_at)
        VALUES (1, ?, ?, ?, ?, ?, datetime('now'))
        ON CONFLICT(id) DO UPDATE SET
          stress_level = excluded.stress_level,
          energy_level = excluded.energy_level,
          focus_level  = excluded.focus_level,
          momentum     = excluded.momentum,
          confidence   = excluded.confidence,
          updated_at   = excluded.updated_at
      `, [state.stressLevel, state.energyLevel, state.focusLevel, state.momentum, state.confidence]);
    },
  };
}