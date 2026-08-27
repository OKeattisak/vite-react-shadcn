import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark" | "system";

type PreferencesState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: "system",
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "vite-ui-preferences",
    },
  ),
);
