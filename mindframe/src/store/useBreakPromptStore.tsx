import { create } from "zustand";

const RE_PROMPT_AFTER_MS = 10 * 60 * 1000;

interface BreakPromptStore {
  dismissedAt: number | null;
  dismiss: () => void;
  reset: () => void;
  canShow: () => boolean;

  modalVisible: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useBreakPromptStore = create<BreakPromptStore>((set, get) => ({
  dismissedAt: null,
  dismiss: () => set({ dismissedAt: Date.now() }),
  reset: () => set({ dismissedAt: null }),
  canShow: () => {
    const { dismissedAt } = get();
    if (!dismissedAt) return true;
    return Date.now() - dismissedAt > RE_PROMPT_AFTER_MS;
  },

  modalVisible: false,
  openModal: () => set({ modalVisible: true }),
  closeModal: () => set({ modalVisible: false }),
}));