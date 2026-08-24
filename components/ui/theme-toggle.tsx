"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/hooks/use-theme";

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={!isDark}
      aria-label={isDark ? "Mudar para modo claro" : "Mudar para modo escuro"}
      onClick={toggleTheme}
      className="h-full flex flex-col justify-center items-center gap-1 overflow-hidden border-r border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer px-4 transition-colors duration-300"
    >
      <div className="relative w-12 h-6 rounded-full bg-gray-700 transition-colors duration-300">
        <div
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 flex items-center justify-center ${
            !isDark ? "translate-x-6" : "translate-x-0"
          }`}
        >
          {!isDark ? (
            <Sun className="w-3 h-3 text-yellow-500" />
          ) : (
            <Moon className="w-3 h-3 text-gray-800" />
          )}
        </div>
      </div>
      <span className="text-xs italic font-semibold">
        {isDark ? "Light" : "Dark"}
      </span>
    </button>
  );
}
