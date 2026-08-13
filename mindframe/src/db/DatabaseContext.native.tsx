import React, { createContext, useContext, useEffect, useState } from "react";
import { openDatabaseAsync, SQLiteDatabase } from "expo-sqlite";
import { runMigrations } from "./migrations";

interface DatabaseContextValue {
  db: SQLiteDatabase | null;
  ready: boolean;
  error: Error | null;
}

const DatabaseContext = createContext<DatabaseContextValue>({
  db: null,
  ready: false,
  error: null,
});

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<SQLiteDatabase | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    openDatabaseAsync("app.db")
      .then(async (database) => {
        await runMigrations(database);
        setDb(database);
        setReady(true);
      })
      .catch((e) =>
        setError(e instanceof Error ? e : new Error(String(e)))
      );
  }, []);

  return (
    <DatabaseContext.Provider value={{ db, ready, error }}>
      {children}
    </DatabaseContext.Provider>
  );
}

// Hook to use DB
export function useDb() {
  return useContext(DatabaseContext);
}