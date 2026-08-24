"use client";

import { useEffect, useState, ReactNode } from "react";
import gsap from "gsap";
import { CareerPage } from "../career/career-page";

export function AppContent({ homeContent }: { homeContent: ReactNode }) {
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    const handleTransition = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });

      gsap.to(".transition-fade-target", {
        opacity: 0,
        duration: 5,
        ease: "power2.inOut",
      });

      setTimeout(() => {
        setShowAbout(true);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            window.dispatchEvent(new CustomEvent("career-ready"));
          });
        });
      }, 5000);
    };

    const handleGoHome = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Fade career page out, fade home back in
      gsap.to(".career-fade-target", {
        opacity: 0,
        duration: 0.6,
        ease: "power2.inOut",
        onComplete: () => {
          setShowAbout(false);
          // Fade home content back in
          requestAnimationFrame(() => {
            gsap.fromTo(
              ".transition-fade-target",
              { opacity: 0 },
              { opacity: 1, duration: 0.8, ease: "power2.out" }
            );
          });
        },
      });
    };

    window.addEventListener("start-about-transition", handleTransition);
    window.addEventListener("go-home", handleGoHome);
    return () => {
      window.removeEventListener("start-about-transition", handleTransition);
      window.removeEventListener("go-home", handleGoHome);
    };
  }, []);

  return (
    <>
      <div className={`transition-fade-target ${showAbout ? "hidden" : ""}`}>
        {homeContent}
      </div>

      {showAbout && (
        <div className="career-fade-target relative z-10 w-full pointer-events-auto">
          <CareerPage />
        </div>
      )}
    </>
  );
}
