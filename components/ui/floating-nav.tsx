"use client";

import { Brain, Briefcase, Code, Home, PhoneCall, Wrench } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const NAV_ITEMS = [
  { icon: Briefcase,   label: "Carreira", sectionId: "section-carreira" },
  { icon: Brain,       label: "Skills",   sectionId: "section-skills"   },
  { icon: Code,        label: "Projetos", sectionId: "section-projetos" },
  { icon: PhoneCall,   label: "Contato",  sectionId: "section-contato"  },
  { icon: Wrench,      label: "Serviços", sectionId: "section-servicos" },
];

/** Arc offsets that bow gently inward to the left for 5 items */
const ARC_X: number[] = [6, -6, -14, -6, 6];

export function FloatingNav() {
  const [isFading, setIsFading]         = useState(false);
  const [careerLoaded, setCareerLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("section-carreira");
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Fade nav out while the warp animation runs
  useEffect(() => {
    const handleStart = () => setIsFading(true);
    window.addEventListener("start-about-transition", handleStart);
    return () => window.removeEventListener("start-about-transition", handleStart);
  }, []);

  // Career page is mounted → bring the nav back and wire IntersectionObserver
  useEffect(() => {
    const handleReady = () => {
      setCareerLoaded(true);
      setIsFading(false);

      // Small delay so sections are painted before observing
      setTimeout(() => {
        observerRef.current?.disconnect();

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setActiveSection(entry.target.id);
              }
            });
          },
          // Active zone: middle 20% of the viewport
          { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
        );

        NAV_ITEMS.forEach(({ sectionId }) => {
          const el = document.getElementById(sectionId);
          if (el) observer.observe(el);
        });

        observerRef.current = observer;
      }, 300);
    };

    window.addEventListener("career-ready", handleReady);
    return () => {
      window.removeEventListener("career-ready", handleReady);
      observerRef.current?.disconnect();
    };
  }, []);

  const handleClick = (e: React.MouseEvent, sectionId: string, label: string) => {
    if (!careerLoaded && label === "Carreira") {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent("start-about-transition"));
      return;
    }

    if (careerLoaded) {
      e.preventDefault();
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleGoHome = () => {
    observerRef.current?.disconnect();
    setCareerLoaded(false);
    setActiveSection("section-carreira");
    window.dispatchEvent(new CustomEvent("go-home"));
  };

  return (
    <nav
      className={`fixed right-3 top-28 z-30 flex flex-col gap-2.5 transition-opacity duration-[5000ms] ease-in-out ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Home button — only when on the career/landpage, sits right above Carreira */}
      {careerLoaded && (
        <button
          onClick={handleGoHome}
          aria-label="Voltar ao início"
          className="group relative flex items-center justify-center w-10 h-10 rounded-full backdrop-blur-sm bg-gray-800/60 text-gray-400 hover:bg-white/20 hover:text-white hover:scale-110 hover:shadow-[0_0_12px_rgba(255,255,255,0.3)] transition-all duration-300"
          style={{ transform: `translateX(${ARC_X[0]}px)` }}
        >
          <Home className="w-4 h-4" />
          <span className="absolute right-12 px-2 py-1 rounded text-[11px] font-medium bg-gray-900/90 backdrop-blur-sm text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap border border-gray-700/50">
            Início
          </span>
        </button>
      )}

      {NAV_ITEMS.map((item, i) => {
        const isActive = careerLoaded && activeSection === item.sectionId;

        return (
          <a
            key={item.label}
            href={`#${item.sectionId}`}
            onClick={(e) => handleClick(e, item.sectionId, item.label)}
            aria-label={item.label}
            className={`group relative flex items-center justify-center w-10 h-10 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 ${
              isActive
                ? "bg-[#1e90ff] text-white shadow-[0_0_14px_rgba(30,144,255,0.6)] scale-110"
                : "bg-gray-800/60 text-gray-400 hover:bg-[#1e90ff] hover:text-white hover:shadow-[0_0_12px_rgba(30,144,255,0.4)]"
            }`}
            style={{ transform: `translateX(${ARC_X[i]}px) ${isActive ? "scale(1.1)" : ""}` }}
          >
            <item.icon className="w-4 h-4" />
            <span className="absolute right-12 px-2 py-1 rounded text-[11px] font-medium bg-gray-900/90 backdrop-blur-sm text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap border border-gray-700/50">
              {item.label}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
