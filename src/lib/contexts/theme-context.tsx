"use client";

import { createContext, useCallback, useEffect, useState } from "react";
import { getTheme, setTheme, type Theme } from "../utils/storage";

interface ThemeContextValue {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  isDark: true,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  // Hydrate theme from localStorage on mount
  useEffect(() => {
    const stored = getTheme();
    setThemeState(stored);
    setMounted(true);
  }, []);

  // Sync dark class on <html> whenever theme changes
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    setTheme(theme);
  }, [theme, mounted]);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const isDark = theme === "dark";

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
