"use client";

import { Github, Linkedin, Mail, Instagram } from "lucide-react";
import { WhatsAppButton } from "./ui/whatsapp-button";
import { WhatsAppIcon } from "./ui/whatsapp-icon";
import { GsapAnim } from "./ui/gsap-anim";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-gray-900 mt-16">
      <GsapAnim direction="fade-up" delay={0.1} className="max-w-5xl mx-auto px-4 py-8 flex flex-col items-center gap-6">
        {/* Logo / Name */}
        <div className="text-center">
          <span className="text-lg font-extrabold uppercase italic">
            Leonardo Vieira
          </span>
          <p className="text-sm text-muted mt-1">
            Full-Stack Developer — Desenvolvimento de sites e sistemas
          </p>
        </div>

        {/* Social links */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/imleodeveloper/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-muted hover:text-foreground transition-colors"
            aria-label="GitHub"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/leonardovieiracarvalho-ti/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-muted hover:text-foreground transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href="https://instagram.com/vierca.digital"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-muted hover:text-foreground transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a
            href="mailto:imleodeveloper@gmail.com"
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-muted hover:text-foreground transition-colors"
            aria-label="Email"
          >
            <Mail className="w-5 h-5" />
          </a>
        </div>

        {/* WhatsApp CTA */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-muted">
            Tem um projeto em mente? Vamos conversar!
          </p>
          <WhatsAppButton variant="full" className="rounded-lg px-6">
            <WhatsAppIcon className="w-5 h-5 mr-2 relative z-[1]" />
            <span className="text-center font-bold uppercase text-black relative z-[1] whitespace-nowrap">
              Entrar em contato
            </span>
          </WhatsAppButton>
        </div>

        {/* Copyright */}
        <div className="text-xs text-muted text-center">
          &copy; {currentYear} Leonardo Vieira. Todos os direitos reservados.
        </div>
      </GsapAnim>
    </footer>
  );
}
