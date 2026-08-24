"use client";

import { useTheme } from "@/lib/hooks/use-theme";
import { Starfield } from "./starfield";
import { DaySky } from "./day-sky";

export function BackgroundManager() {
  const { isDark } = useTheme();

  return isDark ? <Starfield /> : <DaySky />;
}
