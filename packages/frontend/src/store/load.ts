import { create } from "zustand";

interface LoadState {
  load: boolean;
  setLoad: () => void;
}

export const loadStore = create<LoadState>((set, get) => ({
  load: false,
  setLoad: () => {
    const { load } = get();
    set({ load: !load });
  },
}));
