import { SQLiteDatabase } from "expo-sqlite";

export async function runMigrations(db: SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS user_state (
      id            INTEGER PRIMARY KEY DEFAULT 1,
      stress_level  INTEGER NOT NULL DEFAULT 0,
      energy_level  INTEGER NOT NULL DEFAULT 100,
      focus_level   INTEGER NOT NULL DEFAULT 100,
      momentum      INTEGER NOT NULL DEFAULT 50,
      confidence    INTEGER NOT NULL DEFAULT 50,
      updated_at    TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id               TEXT    PRIMARY KEY,
      title            TEXT    NOT NULL,
      start_date_time  TEXT    NOT NULL,
      end_date_time    TEXT    NOT NULL,
      color            TEXT    NOT NULL,
      priority         TEXT    NOT NULL,
      status           TEXT    NOT NULL,
      is_recommended   INTEGER NOT NULL DEFAULT 0,
      cognitive_load   INTEGER NOT NULL DEFAULT 5,
      duration_minutes INTEGER NOT NULL DEFAULT 30,
      difficulty       TEXT    NOT NULL DEFAULT 'medium',
      is_repeat        INTEGER NOT NULL DEFAULT 0,
      subtasks         TEXT,
      created_at       TEXT    NOT NULL DEFAULT (datetime('now'))
    );
  `);
}