import { useSyncExternalStore } from "react";
import { MoonIcon, SunIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { usePreferencesStore } from "@/stores/preferences-store";

function subscribeToSystemTheme(callback: () => void) {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  mediaQuery.addEventListener("change", callback);

  return () => {
    mediaQuery.removeEventListener("change", callback);
  };
}

function getSystemThemeSnapshot() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function ThemeSwitcher() {
  const theme = usePreferencesStore((state) => state.theme);
  const setTheme = usePreferencesStore((state) => state.setTheme);

  const systemIsDark = useSyncExternalStore(
    subscribeToSystemTheme,
    getSystemThemeSnapshot,
    () => false,
  );

  const isDark = theme === "system" ? systemIsDark : theme === "dark";

  function toggleTheme() {
    setTheme(isDark ? "light" : "dark");
  }

  return (
    <Button type="button" variant="ghost" size="icon" onClick={toggleTheme}>
      {isDark ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
}
