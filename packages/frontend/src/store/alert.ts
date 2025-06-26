import { create } from "zustand";

interface AlertStore {
  show: boolean;
  message: string | null;
  type: "success" | "error" | null;

  setAlert: (message: string, type: "success" | "error") => void;
  clearAlert: () => void;
}

export const alertStore = create<AlertStore>((set, get) => ({
  show: false,
  message: null,
  type: null,

  setAlert: (message, type) => {
    set({ show: true, message, type });
  },
  clearAlert: () => {
    set({ show: false, message: null, type: null });
  },
}));
