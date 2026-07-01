import { create } from "zustand";

const RE_PROMPT_AFTER_MS = 10 * 60 * 1000; // re-show 10 minutes after dismissal

interface BreakPromptStore {
  dismissedAt: number | null;
  dismiss: () => void;
  reset: () => void;
  canShow: () => boolean;
}

/**
 * This is deliberately separate from useUserStateStore: dismissedAt is
 * a transient UI concern (not persisted, not domain state), but it
 * still needs to be readable from anywhere in the app since the prompt
 * is mounted once at the navigation root.
 */
export const useBreakPromptStore = create<BreakPromptStore>((set, get) => ({
  dismissedAt: null,

  dismiss: () => set({ dismissedAt: Date.now() }),

  reset: () => set({ dismissedAt: null }),

  canShow: () => {
    const { dismissedAt } = get();
    if (!dismissedAt) return true;
    return Date.now() - dismissedAt > RE_PROMPT_AFTER_MS;
  },
}));