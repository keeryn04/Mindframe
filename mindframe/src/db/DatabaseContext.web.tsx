import React, { createContext, useContext } from "react";

interface DatabaseContextValue {
  db: null;
  ready: boolean;
  error: Error | null;
}

const DatabaseContext = createContext<DatabaseContextValue>({
  db: null,
  ready: true,
  error: null,
});

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  // Web repos use AsyncStorage directly and don't need a db handle,
  // so there's nothing to wait on — report ready immediately.
  return (
    <DatabaseContext.Provider value={{ db: null, ready: true, error: null }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDb() {
  return useContext(DatabaseContext);
}