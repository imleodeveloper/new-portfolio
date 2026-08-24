"use client";

import { useRef, useLayoutEffect, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type AnimationDirection = "fade-up" | "fade-down" | "fade-left" | "fade-right";

interface GsapAnimProps {
  children: ReactNode;
  direction?: AnimationDirection;
  delay?: number;
  duration?: number;
  className?: string;
}

export function GsapAnim({
  children,
  direction = "fade-up",
  delay = 0,
  duration = 0.6,
  className = "",
}: GsapAnimProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const getFromVars = (): gsap.TweenVars => {
      const base = { opacity: 0 };
      switch (direction) {
        case "fade-up":
          return { ...base, y: 30 };
        case "fade-down":
          return { ...base, y: -30 };
        case "fade-left":
          return { ...base, x: 30 };
        case "fade-right":
          return { ...base, x: -30 };
        default:
          return base;
      }
    };

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        getFromVars(),
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration,
          delay,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [direction, delay, duration]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
