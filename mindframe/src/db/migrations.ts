import { SQLiteDatabase } from "expo-sqlite";

/**
 * Each migration is a self-contained async function that receives the db
 * handle and runs exactly the SQL needed for that version bump.
 *
 * Rules:
 *   - Never edit a migration that has already shipped. Add a new one.
 *   - Each migration must be idempotent where possible (IF NOT EXISTS,
 *     INSERT OR IGNORE, etc.) so a crash mid-run can be safely retried.
 *   - The user_version PRAGMA is the source of truth for schema version.
 *     It is set at the END of each migration, after all statements succeed.
 */
const migrations: ((db: SQLiteDatabase) => Promise<void>)[] = [
  // ── v1: initial schema ───────────────────────────────────────────────────
  async (db) => {
    await db.execAsync(`
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

      CREATE TABLE IF NOT EXISTS user_preferences (
        id                     INTEGER PRIMARY KEY DEFAULT 1,
        display_name           TEXT,
        avatar_color           TEXT    NOT NULL DEFAULT '#6366f1',
        work_style             TEXT    NOT NULL DEFAULT 'flexible',
        energy_pattern         TEXT    NOT NULL DEFAULT 'inconsistent',
        stress_tolerance       TEXT    NOT NULL DEFAULT 'medium',
        recommendation_mode    TEXT    NOT NULL DEFAULT 'general',
        max_recommendations    INTEGER NOT NULL DEFAULT 1,
        enable_actionable_only INTEGER NOT NULL DEFAULT 0,
        updated_at             TEXT    NOT NULL DEFAULT (datetime('now'))
      );

      -- INSERT OR IGNORE is the correct idiom for "seed if not exists".
      -- It relies on the PRIMARY KEY constraint to detect the conflict,
      -- which is atomic and works correctly in WAL mode.
      INSERT OR IGNORE INTO user_preferences (id) VALUES (1);
    `);
  },

  // ── v2: example of how to add a column in a future release ──────────────
  // async (db) => {
  //   await db.execAsync(`
  //     ALTER TABLE user_preferences ADD COLUMN some_new_field TEXT;
  //   `);
  // },
];

/**
 * Runs any migrations that haven't been applied to this database yet.
 *
 * SQLite's user_version PRAGMA is an integer stored in the database header.
 * It starts at 0 on a fresh database and is only updated here, at the end
 * of each successful migration. If a migration throws, user_version is not
 * advanced, so the next app launch retries from the same point.
 */
export async function runMigrations(db: SQLiteDatabase): Promise<void> {
  // WAL mode and foreign keys are connection-level settings, not schema
  // changes, so they're set here rather than inside a versioned migration.
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
  `);

  const result = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version"
  );
  let currentVersion = result?.user_version ?? 0;

  const pending = migrations.slice(currentVersion);

  if (pending.length === 0) return;

  for (const migrate of pending) {
    await migrate(db);
    currentVersion += 1;
    // Pragma can't be set via a bound parameter — the interpolation here is
    // safe because currentVersion is an integer we control, not user input.
    await db.execAsync(`PRAGMA user_version = ${currentVersion}`);
  }
}