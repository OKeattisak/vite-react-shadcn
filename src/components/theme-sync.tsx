import { useEffect } from "react";
import { usePreferencesStore } from "@/stores/preferences-store";

export function ThemeSync() {
  const theme = usePreferencesStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const resolvedTheme =
        theme === "system" ? (mediaQuery.matches ? "dark" : "light") : theme;

      root.classList.toggle("dark", resolvedTheme === "dark");
      root.classList.toggle("light", resolvedTheme === "light");
      root.style.colorScheme = resolvedTheme;
    };

    applyTheme();

    if (theme === "system") {
      mediaQuery.addEventListener("change", applyTheme);

      return () => {
        mediaQuery.removeEventListener("change", applyTheme);
      };
    }
  }, [theme]);

  return null;
}
