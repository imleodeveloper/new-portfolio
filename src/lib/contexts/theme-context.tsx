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

  // Sync dark class, html background and theme-color meta on every theme change
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    const isDarkNow = theme === "dark";

    if (isDarkNow) {
      root.classList.add("dark");
      root.style.backgroundColor = "#08081a";
    } else {
      root.classList.remove("dark");
      root.style.backgroundColor = "#ffffff";
    }

    const color = isDarkNow ? "#08081a" : "#ffffff";
    let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }
    meta.content = color;

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
