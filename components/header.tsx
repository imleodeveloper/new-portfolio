"use client";
import {
  Crown, Github, Linkedin, Sun, Moon
} from "lucide-react";
import Image from "next/image";
import { useLayoutEffect, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ThemeToggle } from "./ui/theme-toggle";
import { WhatsAppButton } from "./ui/whatsapp-button";
import { FakeCursor } from "./ui/fake-cursor";
import { useWhatsAppModal } from "@/lib/hooks/use-whatsapp-modal";
import { useTheme } from "@/lib/hooks/use-theme";
import { WhatsAppIcon } from "./ui/whatsapp-icon";

export function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { openModal } = useWhatsAppModal();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [headerHidden, setHeaderHidden] = useState(false);

  useLayoutEffect(() => {
    if (!headerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".header-animate",
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
      );
    }, headerRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const onHide = () => setHeaderHidden(true);
    const onShow = () => setHeaderHidden(false);
    window.addEventListener("start-about-transition", onHide);
    window.addEventListener("career-ready", onShow);
    return () => {
      window.removeEventListener("start-about-transition", onHide);
      window.removeEventListener("career-ready", onShow);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className={`w-full grid grid-cols-1 justify-between items-center fixed z-[60] backdrop-blur-md bg-white/10 dark:bg-black/10 border-b border-white/20 dark:border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] text-black dark:text-white transition-colors duration-300 transition-[transform,opacity] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${headerHidden ? "-translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"}`}
    >
      <nav className="header-animate flex justify-between items-center h-16 transition-colors duration-300">
        <div className="grid grid-cols-[1fr_2fr] items-center h-full">
          <div className="flex justify-center items-center p-4">
            <span className="text-center italic uppercase font-extrabold text-lg/4 text-gray-900 dark:text-white">
              Leonardo <br />
              Vieira
            </span>
          </div>
          <div className="shadow-[inset_0_-3px_10px_rgba(212,175,55,0.4)] gap-2 flex justify-center px-6 items-center h-full">
            <div className="w-full flex flex-col justify-center items-center gap-1">
              <Crown className="text-[rgb(212,175,55)]"></Crown>
              <span className="text-xs font-extrabold uppercase text-center">
                4 Years EXP
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center relative h-full">
          <a
            href="https://www.viercatech.com.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex flex-col relative justify-center items-center overflow-hidden border-x border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 h-full px-4 transition-colors duration-300"
          >
            <div className="h-10 w-10 relative">
              <Image src={isDark ? "/icon-white.svg" : "/icon-vierca-svg.svg"} alt="VierCa" fill className="object-contain" />
            </div>
          </a>
          
          <div className="hidden md:flex h-full">
            <WhatsAppButton variant="icon-only" className="border-r border-gray-200 dark:border-gray-700 px-4 transition-colors duration-300" />
          </div>
          
          <div className="hidden sm:flex h-full">
            <ThemeToggle />
          </div>

          <div ref={menuRef} className="relative h-full flex items-center">
            <div 
               className={`h-full px-6 bg-gradient-to-r from-[#1e90ff] to-blue-800 cursor-pointer hover:brightness-110 flex justify-center items-center flex-col gap-1 overflow-hidden border-x border-gray-200 dark:border-gray-700 relative transition-all duration-150 shadow-md ${menuOpen ? "scale-95 shadow-[inset_0_3px_10px_rgba(0,0,0,0.5)]" : "active:scale-95 active:shadow-[inset_0_3px_10px_rgba(0,0,0,0.5)]"}`}
               onClick={() => setMenuOpen(!menuOpen)}
            >
              <FakeCursor />
              <div className="relative h-8 w-8 flex justify-center items-center rounded-full overflow-hidden pointer-events-none">
                <Image src="/leo-foto.webp" alt="" fill className="object-cover" />
              </div>
              <span className="text-xs font-bold text-black uppercase pointer-events-none">
                Developer
              </span>
            </div>

            {/* Menu Dropdown */}
            <div className={`absolute top-full right-0 w-64 bg-black/80 backdrop-blur-xl border border-gray-800 shadow-[0_10px_40px_rgba(30,144,255,0.1)] hover:shadow-[0_10px_40px_rgba(30,144,255,0.3)] rounded-bl-xl overflow-hidden transition-all duration-300 transform origin-top z-50 ${menuOpen ? "scale-y-100 opacity-100 translate-y-0" : "scale-y-0 opacity-0 -translate-y-4"}`}>
              <div className="flex flex-col w-full">
                <a href="https://github.com/Leonardo-Vieira-Dev" target="_blank" rel="noopener noreferrer" className="w-full h-14 flex items-center justify-start px-4 hover:bg-white/10 transition-colors border-b border-gray-800/50 gap-3">
                  <Github className="w-5 h-5 text-gray-300" />
                  <span className="font-semibold text-sm text-gray-200">GitHub</span>
                </a>
                <a href="https://www.linkedin.com/in/leonardovieiradev/" target="_blank" rel="noopener noreferrer" className="w-full h-14 flex items-center justify-start px-4 hover:bg-white/10 transition-colors border-b border-gray-800/50 gap-3">
                  <Linkedin className="w-5 h-5 text-[#0A66C2]" />
                  <span className="font-semibold text-sm text-gray-200">LinkedIn</span>
                </a>
                
                <a href="https://www.viercatech.com.br/" target="_blank" rel="noopener noreferrer" className="lg:hidden w-full h-14 flex items-center justify-start px-4 hover:bg-white/10 transition-colors border-b border-gray-800/50 gap-3">
                  <div className="w-5 h-5 relative">
                    <Image src={isDark ? "/icon-white.svg" : "/icon-vierca-svg.svg"} alt="VierCa" fill className="object-contain" />
                  </div>
                  <span className="font-semibold text-sm text-gray-200">Minha Empresa</span>
                </a>

                <button onClick={openModal} className="md:hidden w-full h-14 flex items-center justify-start px-4 hover:bg-white/10 transition-colors border-b border-gray-800/50 gap-3">
                  <WhatsAppIcon className="w-5 h-5 text-green-500" />
                  <span className="font-semibold text-sm text-gray-200">Contratar Serviços</span>
                </button>
                
                <button onClick={toggleTheme} className="sm:hidden w-full h-14 flex items-center justify-start px-4 hover:bg-white/10 transition-colors gap-3">
                  {!isDark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-300" />}
                  <span className="font-semibold text-sm text-gray-200">Tema ({isDark ? 'Light' : 'Dark'})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
