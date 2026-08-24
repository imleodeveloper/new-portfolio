"use client";

import { useMousePosition } from "@/lib/hooks/use-mouse-position";

interface MouseGradientProps {
  children: React.ReactNode;
  className?: string;
}

export function MouseGradient({ children, className = "" }: MouseGradientProps) {
  const { ref, x, y } = useMousePosition();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        background: `radial-gradient(circle at ${x}% ${y}%, rgba(30, 144, 255, 0.08) 0%, transparent 50%)`,
      }}
    >
      {children}
    </div>
  );
}
