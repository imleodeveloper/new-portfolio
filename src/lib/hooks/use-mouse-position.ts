"use client";

import { useEffect, useRef, useState } from "react";

export function useMousePosition() {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
    };

    el.addEventListener("mousemove", handleMouseMove);
    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return { ref, ...position };
}
