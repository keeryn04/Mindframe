// src/db/useDatabase.ts
import { useEffect, useState } from "react";
import { openDatabaseAsync } from "expo-sqlite";
import { runMigrations } from "./migrations";

interface DatabaseState {
  ready: boolean;
  error: Error | null;
}

export function useDatabase(): DatabaseState {
  const [state, setState] = useState<DatabaseState>({ ready: false, error: null });

  useEffect(() => {
    openDatabaseAsync("app.db")
      .then((db) => runMigrations(db))
      .then(() => setState({ ready: true, error: null }))
      .catch((e) => setState({ ready: false, error: e instanceof Error ? e : new Error(String(e)) }));
  }, []);

  return state;
}