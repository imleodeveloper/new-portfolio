"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Bot, Building2, Calendar, ChevronLeft, ChevronRight, Cpu,
  ExternalLink, FileText, Globe,
  MessageCircle, Send, X, Zap,
} from "lucide-react";
import { ContactChat } from "./contact-chat";
import { GsapAnim } from "../ui/gsap-anim";
import { FakeIDE } from "../ui/fake-ide";
import { WhatsAppIcon } from "../ui/whatsapp-icon";
import { ProjectModal, type ProjectData } from "../home/project-modal";
import { IconCloud } from "../ui/interactive-icon-cloud";
import { useWhatsAppModal } from "@/lib/hooks/use-whatsapp-modal";

// ─── TYPES ───────────────────────────────────────────────────────────────────

type SiteProject = {
  id: string;
  name: string;
  initial: string;
  color: string;
  bg?: string;
  logo: string | null;
  description: string;
  longDescription: string;
  stacks: string[];
  url?: string;
  screenshot?: string;
  inDevelopment?: boolean;
};

// ─── DATA ────────────────────────────────────────────────────────────────────

const SKILL_ICONS: Record<string, string> = {
  "TypeScript":    "/tech-icons/typescript.svg",
  "JavaScript":    "/tech-icons/javascript.svg",
  "PHP":           "/tech-icons/php.svg",
  "MySQL":         "/tech-icons/mysql.svg",
  "PostgreSQL":    "/tech-icons/postgresql.svg",
  "Next.js":       "/tech-icons/nextjs.svg",
  "React":         "/tech-icons/react.svg",
  "TailwindCSS":   "/tech-icons/tailwindcss.svg",
  "WhatsApp API":  "/tech-icons/whatsapp.svg",
  "Baileys":       "/tech-icons/whatsapp.svg",
  "Telegram":      "/tech-icons/telegram.svg",
  "GramJS":        "/tech-icons/telegram.svg",
  "Telethon":      "/tech-icons/telegram.svg",
  "VPS":           "/tech-icons/vps.svg",
  "SEO":           "/tech-icons/seo.svg",
  "Suporte":       "/tech-icons/suporte.svg",
  "Hardware":      "/tech-icons/hardware.svg",
  "Notebooks":     "/tech-icons/notebooks.svg",
  "Redes":         "/tech-icons/redes.svg",
  "Liderança":     "/tech-icons/lideranca.svg",
  "Desktop":       "/tech-icons/desktop.svg",
  "Manutenção":    "/tech-icons/manutencao.svg",
};

const CAREER = [
  {
    company: "VierCa",
    role: "Fundador & Full-Stack Developer",
    period: "Jun 2024 – Presente",
    duration: "Atual",
    logo: "/icon-vierca-svg.svg",
    color: "#1e90ff",
    description: "Fundei a VierCa em 2024 — empresa de desenvolvimento de software, sites e aplicativos web e mobile para Android e iOS.",
    details: [
      "Sites institucionais, landing pages e sistemas SaaS",
      "Aplicativos web e mobile (Android e iOS)",
      "Deploy e gerenciamento de VPS Linux/Nginx",
      "SEO técnico para tráfego orgânico",
      "Segurança de sistemas e boas práticas de desenvolvimento",
    ],
    skills: ["Next.js", "TypeScript", "PHP", "PostgreSQL", "VPS", "SEO"],
  },
  {
    company: "INFOLAB MARKETING",
    role: "Desenvolvedor Full-Stack",
    period: "Jun 2025 – Jul 2026",
    duration: "1 ano e 1 mês",
    logo: null as string | null,
    color: "#10b981",
    description: "Desenvolvedor focado em sistemas internos, CRM, área de membros, landing pages, automações e integrações de API.",
    details: [
      "Desenvolvimento de CRM, área de membros e sistemas internos",
      "Landing pages de alta conversão",
      "Automações e integrações: WhatsApp oficial, Baileys, Telegram, Telethon",
      "Design de artes e materiais digitais",
      "Integração com diversas APIs externas",
    ],
    skills: ["Next.js", "TypeScript", "PHP", "WhatsApp API", "Telegram"],
  },
  {
    company: "Allugga",
    role: "Assistente → Analista de Suporte T.I Jr.",
    period: "Set 2022 – Jun 2024",
    duration: "1 ano e 9 meses",
    logo: null as string | null,
    color: "#f59e0b",
    description: "Iniciou como Assistente de Suporte (até fev/2023), evoluindo para Analista Jr. Suporte presencial, remoto e linha de produção de notebooks.",
    details: [
      "Suporte técnico presencial e remoto a usuários internos",
      "Linha de produção: montagem, desmontagem e manutenção de notebooks (troca de tela, hardware completo)",
      "Líder do suporte remoto — todos os chamados passavam por mim",
      "Líder da logística interna da empresa",
      "Promoção de Assistente para Analista Jr. em fevereiro de 2023",
    ],
    skills: ["Suporte", "Hardware", "Notebooks", "Redes", "Liderança"],
  },
  {
    company: "Strong Tech",
    role: "Estagiário de T.I",
    period: "Mai 2022 – Set 2022",
    duration: "4 meses",
    logo: null as string | null,
    color: "#3b82f6",
    description: "Primeiro contato com T.I corporativa. Montagem de desktops do zero e manutenção de hardware e infraestrutura.",
    details: [
      "Montagem de desktops do zero: carcaça, placa-mãe, fonte, memória RAM e todos os componentes",
      "Manutenção e configuração de hardware e periféricos",
      "Suporte técnico presencial a usuários internos",
      "Gerenciamento de redes LAN/WLAN",
    ],
    skills: ["Hardware", "Desktop", "Suporte", "Redes", "Manutenção"],
  },
];

const ICON_SLUGS = [
  "typescript", "javascript", "php",
  "react", "nextdotjs", "nodedotjs",
  "tailwindcss", "html5", "css3",
  "mysql", "postgresql", "supabase",
  "git", "github", "nginx", "vercel",
  "linux", "visualstudiocode",
];

const SISTEMAS: ProjectData[] = [
  {
    id: "agendo-aki",
    name: "Agendo Aki",
    description: "SaaS de agendamento para salões, profissionais autônomos e negócios.",
    detailedDescription: "API oficial do WhatsApp e Baileys para automação de agendamentos e disparos.",
    stacks: ["Next.js", "TypeScript", "TailwindCSS", "PHP", "MySQL", "Baileys", "WhatsApp API"],
    url: "agendoaki.com",
    logo: "/agendoaki-logo-escrita.webp",
    images: [
      "/projects/web-systems/agendoaki/hero-section-client.webp",
      "/projects/web-systems/agendoaki/appoint-panel.webp",
    ],
    mobileImages: [
      "/projects/web-systems/agendoaki/hero-section-client-mobile.webp",
      "/projects/web-systems/agendoaki/appoint-panel-mobile.webp",
    ],
  },
  {
    id: "disparei-ja",
    name: "Disparei Já",
    description: "SaaS de disparos massivos para WhatsApp e Telegram.",
    detailedDescription: "Focado em performance. Vercel + Supabase. GramJS e Telethon para Telegram.",
    stacks: ["Next.js", "TypeScript", "TailwindCSS", "Supabase", "Vercel", "GramJS", "Telethon", "WhatsApp API"],
    url: "dispareija.com",
    logo: "/icon-disparei-ja.webp",
    images: [
      "/projects/web-systems/dispareija/hero-dispareija.webp",
      "/projects/web-systems/dispareija/dash-dispareija.webp",
    ],
    mobileImages: [
      "/projects/web-systems/dispareija/hero-dispareija-mobile.webp",
      "/projects/web-systems/dispareija/dash-dispareija-mobile.webp",
    ],
  },
  {
    id: "viercrm",
    name: "VierCRM",
    description: "CRM completo com kanban, gestão de leads, financeiro e processos comerciais.",
    detailedDescription: "Em desenvolvimento ativo. Sistema de CRM da VierCa com kanban, gestão de leads e controle financeiro.",
    stacks: ["React (Vite)", "TypeScript", "TailwindCSS", "PHP", "MySQL"],
    url: "crm.vierca.com",
    logo: "/icon-vierca-svg.svg",
    images: [
      "/projects/web-systems/crm-vierca/crm-dash.webp",
      "/projects/web-systems/crm-vierca/crm-kanban.webp",
      "/projects/web-systems/crm-vierca/hero-orbis.webp",
    ],
    inDevelopment: true,
  },
];

const SERVICES = [
  {
    Icon: FileText, label: "Landing Pages", color: "#1e90ff", tags: ["Next.js", "SEO", "TailwindCSS"],
    desc: "Páginas de conversão com foco em resultados. Carregamento rápido e design moderno.",
    details: ["Design mobile-first com animações", "SEO técnico e Core Web Vitals", "Integração WhatsApp e Analytics", "Formulários e captura de leads"],
  },
  {
    Icon: Cpu, label: "Sistemas Web", color: "#8b5cf6", tags: ["TypeScript", "MySQL", "PHP"],
    desc: "SaaS, CRMs e ERPs com autenticação, banco de dados e painéis completos.",
    details: ["Autenticação e controle de acesso", "CRUD com painel admin completo", "Banco de dados relacional", "APIs REST e integrações externas"],
  },
  {
    Icon: Globe, label: "Sites Institucionais", color: "#10b981", tags: ["Next.js", "SEO"],
    desc: "Presença digital profissional com UX, acessibilidade e SEO orgânico.",
    details: ["Design responsivo e acessível", "SEO on-page e performance", "Blog e CMS opcional", "Deploy otimizado na Vercel"],
  },
  {
    Icon: Bot, label: "Chatbots com IA", color: "#f59e0b", tags: ["IA", "LLM", "API"],
    desc: "Atendimento automatizado 24/7, captura de leads e integração com LLMs.",
    details: ["Integração com GPT, Gemini e DeepSeek", "Funil de vendas automatizado", "Respostas contextuais sobre seu negócio", "Coleta de dados e CRM integrado"],
  },
  {
    Icon: MessageCircle, label: "WhatsApp API", color: "#25d366", tags: ["Baileys", "Oficial", "CRM"],
    desc: "Disparo massivo, automações e CRM integrado ao WhatsApp Business.",
    details: ["API Oficial do WhatsApp Business", "Baileys multi-sessão não oficial", "Disparo em massa e agendamento", "Chatbot e integração com CRM"],
  },
  {
    Icon: Send, label: "Telegram", color: "#0088cc", tags: ["GramJS", "Telethon", "BotFather"],
    desc: "Bots, disparos em massa e automações via Telegram.",
    details: ["BotFather + webhooks via API", "GramJS e Telethon multi-conta", "Disparos em grupos e canais", "Automações e notificações"],
  },
  {
    Icon: Zap, label: "Automações & Webhooks", color: "#ef4444", tags: ["Webhooks", "Node.js", "API"],
    desc: "Fluxos entre sistemas, webhooks e integrações automáticas entre plataformas.",
    details: ["Webhooks entre plataformas", "Pipelines de dados automáticos", "Integrações REST e GraphQL", "Monitoramento e alertas"],
  },
];

const SITE_PROJECTS: SiteProject[] = [
  {
    id: "vierca",
    name: "VierCa",
    initial: "V",
    color: "#1e90ff",
    logo: "/icon-vierca-svg.svg",
    description: "Site institucional da VierCa com portfólio de serviços e soluções digitais.",
    longDescription: "Site da VierCa apresentando serviços, portfólio e contato. Next.js no front-end com TailwindCSS v4, SEO técnico e deploy otimizado.",
    stacks: ["Next.js", "TailwindCSS v4", "TypeScript"],
    url: "vierca.com",
    screenshot: "/projects/web-systems/vierca.png",
  },
  {
    id: "meca-importacoes",
    name: "Meca Importações",
    initial: "M",
    color: "#0059ff",
    bg: "linear-gradient(90deg, #191919 0%, #212121 47%, #191919 100%)",
    logo: "https://mecaimportacoes.com.br/Logo-Horizontal.webp",
    description: "Site institucional para empresa de importações com catálogo de produtos.",
    longDescription: "Desenvolvido com React + Vite, o site da Meca Importações apresenta catálogo de produtos, página institucional e formulário de contato.",
    stacks: ["React", "Vite", "CSS"],
    url: "mecaimportacoes.com.br",
    screenshot: "/projects/web-systems/mecaimportacoes.png",
  },
  {
    id: "lustra-omega",
    name: "Lustra Ômega",
    initial: "L",
    color: "#f59e0b",
    bg: "#ffffff",
    logo: "https://lustraomega.com.br/public/logo_lustra.webp",
    description: "Landing page para empresa de lustração e polimento automotivo premium.",
    longDescription: "Desenvolvida em JavaScript puro sem frameworks. HTML semântico, CSS vanilla e JS nativo para animações e interatividade.",
    stacks: ["HTML", "CSS", "JavaScript"],
    url: "lustraomega.com.br",
    screenshot: "/projects/web-systems/lustraomega.png",
  },
  {
    id: "fabio-silva-contabilidade",
    name: "Fabio Silva Contabilidade",
    initial: "F",
    color: "#2f4f66",
    bg: "linear-gradient(90deg, #2f4f66 0%, #426885 73%)",
    logo: "https://www.fabiosilvacontabilidade.com.br/images/logo-header-.webp",
    description: "Site profissional para escritório de contabilidade.",
    longDescription: "Site institucional em JavaScript puro. Layout responsivo com CSS Grid e Flexbox, animações nativas e SEO otimizado.",
    stacks: ["HTML", "CSS", "JavaScript"],
    url: "fabiosilvacontabilidade.com.br",
    screenshot: "/projects/web-systems/fabiosilvacontabilidade.png",
  },
  {
    id: "vizsil-contabilidade",
    name: "Vizsil Contabilidade",
    initial: "Z",
    color: "#8b5cf6",
    bg: "#ffffff",
    logo: "/vizsil-contabilidade.webp",
    description: "Site moderno para escritório de contabilidade com design clean e profissional.",
    longDescription: "Desenvolvido com Next.js e TailwindCSS v4. Design system próprio e componentes reutilizáveis. Deploy na Vercel.",
    stacks: ["Next.js", "TailwindCSS v4", "TypeScript"],
    url: "vizsil.com.br",
    inDevelopment: true,
  },
  {
    id: "negos-socios",
    name: "Negos Socios",
    initial: "N",
    color: "#f97316",
    logo: "/logo-negosocios.webp",
    description: "Loja de roupas de time com painel admin, banco de dados e catálogo completo.",
    longDescription: "E-commerce de roupas de time com painel administrativo completo para gestão de produtos, pedidos e clientes. Sem gateway de pagamento integrado.",
    stacks: ["Next.js", "TypeScript", "TailwindCSS", "PHP", "MySQL"],
    url: "negossocios.store",
    screenshot: "/projects/web-systems/negossocios.png",
  },
  {
    id: "adega-da-garagem",
    name: "Adega da Garagem",
    initial: "A",
    color: "#fbbf24",
    bg: "#ffffff",
    logo: "/adega-da-garagem.png",
    description: "Landing page para adega de bebidas premium com catálogo e contato via WhatsApp.",
    longDescription: "Landing page com design dark e moderno. Catálogo de produtos com animações e botão de contato direto via WhatsApp. Next.js com TailwindCSS.",
    stacks: ["Next.js", "TypeScript", "TailwindCSS"],
    inDevelopment: true,
  },
  {
    id: "orbis-landing",
    name: "Group Orbis Digital",
    initial: "O",
    color: "#ff7a00",
    bg: "linear-gradient(135deg, #020817 0%, #030c1f 100%)",
    logo: "/crm-orbis.webp",
    description: "Landing page institucional da Group Orbis Digital apresentando a empresa.",
    longDescription: "Landing page premium com animações 3D (orbit diagram), vídeo de fundo e design exclusivo. Desenvolvida com React + Vite e TailwindCSS v4.",
    stacks: ["React (Vite)", "TypeScript", "TailwindCSS v4"],
    url: "grouporbis.com.br",
  },
];

// ─── CAREER DETAIL MODAL ─────────────────────────────────────────────────────

function CareerDetailModal({ entry, onClose }: { entry: typeof CAREER[0]; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center sm:p-4 bg-black/75 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col"
        style={{ background: "#0d0d18", border: `1px solid ${entry.color}22` }}
        onClick={e => e.stopPropagation()}
      >
        {/* Barra colorida no topo */}
        <div className="h-1 w-full rounded-t-3xl sm:rounded-t-2xl flex-shrink-0" style={{ background: `linear-gradient(90deg, ${entry.color}, ${entry.color}55)` }} />

        {/* Header */}
        <div className="px-6 pt-5 pb-5 flex items-start justify-between gap-4 border-b flex-shrink-0" style={{ borderColor: entry.color + "18" }}>
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden relative"
              style={{ backgroundColor: entry.color + "18", border: `1px solid ${entry.color}30` }}
            >
              {entry.logo
                ? <Image src={entry.logo} alt={entry.company} fill className="object-contain p-2" />
                : <Building2 className="w-6 h-6" style={{ color: entry.color }} />
              }
            </div>
            {/* Info */}
            <div className="min-w-0">
              <p className="font-black text-lg text-white leading-tight">{entry.company}</p>
              <p className="text-sm font-semibold mt-0.5" style={{ color: entry.color }}>{entry.role}</p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Calendar className="w-3 h-3" />{entry.period}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: entry.color + "20", color: entry.color }}>
                  {entry.duration}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors cursor-pointer flex-shrink-0 mt-0.5"
            style={{ background: "#ffffff0a" }}
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-6">
          {/* Descrição */}
          <p className="text-sm text-gray-300 leading-relaxed">{entry.description}</p>

          {/* Responsabilidades */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.15em] mb-3" style={{ color: entry.color + "aa" }}>Responsabilidades</p>
            <ul className="flex flex-col gap-2.5">
              {entry.details.map((d, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-300 leading-snug">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: entry.color }} />
                  {d}
                </li>
              ))}
            </ul>
          </div>

          {/* Stack */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.15em] mb-3" style={{ color: entry.color + "aa" }}>Stack</p>
            <div className="flex flex-wrap gap-2">
              {entry.skills.map(s => {
                const icon = SKILL_ICONS[s];
                return (
                  <span key={s} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ backgroundColor: entry.color + "15", color: entry.color, border: `1px solid ${entry.color}25` }}>
                    {icon && <Image src={icon} alt={s} width={12} height={12} className="object-contain opacity-90" />}
                    {s}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SITE MODAL ──────────────────────────────────────────────────────────────

function SiteModal({ project, onClose }: { project: SiteProject; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 pt-5 pb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {project.logo ? (
              <div className="w-14 h-14 rounded-xl overflow-hidden relative bg-gray-100 dark:bg-gray-800 flex-shrink-0 border border-gray-200 dark:border-gray-700 p-1">
                <Image src={project.logo} alt={project.name} fill className="object-contain p-1" />
              </div>
            ) : (
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-2xl font-extrabold shadow-inner"
                style={{ backgroundColor: project.color }}
              >
                {project.initial}
              </div>
            )}
            <div>
              <p className="font-bold text-gray-900 dark:text-white text-base">{project.name}</p>
              {project.url && (
                <a
                  href={`https://${project.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs flex items-center gap-1 mt-0.5"
                  style={{ color: project.color }}
                >
                  {project.url} <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {project.inDevelopment && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30 inline-block mt-1">
                  Em desenvolvimento
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer flex-shrink-0">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-5">
          {project.screenshot && (
            <div className="w-full h-44 relative rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
              <Image src={project.screenshot} alt={`${project.name} screenshot`} fill className="object-cover object-top" />
            </div>
          )}
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{project.longDescription}</p>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Stack utilizada</p>
            <div className="flex flex-wrap gap-2">
              {project.stacks.map(s => (
                <span
                  key={s}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full border"
                  style={{ backgroundColor: project.color + "15", color: project.color, borderColor: project.color + "40" }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
          {project.url && (
            <a
              href={`https://${project.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl text-sm font-bold text-center text-white flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
              style={{ backgroundColor: project.color }}
            >
              Visitar Site <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── CAREER PAGE ─────────────────────────────────────────────────────────────

export function CareerPage() {
  const [expandedCareer, setExpandedCareer]   = useState<typeof CAREER[0] | null>(null);
  const [projectTab, setProjectTab]           = useState<"sistemas" | "sites">("sistemas");
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [selectedSite, setSelectedSite]       = useState<SiteProject | null>(null);
  const [sitePage, setSitePage]               = useState(0);
  const [slideDir, setSlideDir]               = useState<"next" | "prev">("next");
  const { openModal } = useWhatsAppModal();

  const CARDS_PER_PAGE = 6;
  const sitePages: SiteProject[][] = [];
  for (let i = 0; i < SITE_PROJECTS.length; i += CARDS_PER_PAGE) {
    sitePages.push(SITE_PROJECTS.slice(i, i + CARDS_PER_PAGE));
  }
  const currentSites = sitePages[sitePage] ?? [];

  const goSitePage = (dir: "next" | "prev") => {
    setSlideDir(dir);
    setSitePage(p => dir === "next" ? Math.min(p + 1, sitePages.length - 1) : Math.max(p - 1, 0));
  };

  return (
    <div className="career-page">

      {/* ═══════════════════ CARREIRA ═══════════════════ */}
      <section id="section-carreira" className="min-h-screen w-full px-4 pt-28 pb-20 flex flex-col justify-center">
        <div className="max-w-5xl mx-auto w-full flex flex-col gap-12">

          <GsapAnim direction="fade-up">
            <h1 className="text-gray-900 dark:text-white text-7xl md:text-9xl uppercase leading-none" style={{ fontFamily: "var(--font-protest-strike)" }}>
              Carreira
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-3 text-base font-medium">
              4+ anos em T.I · De estagiário a fundador
            </p>
          </GsapAnim>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

            {/* ── Timeline ── */}
            <div className="relative flex flex-col gap-0">
              <div className="absolute left-[9px] top-3 bottom-6 w-0.5 bg-gradient-to-b from-blue-500 via-blue-400/40 to-transparent" />

              {CAREER.map((entry, i) => (
                <GsapAnim key={entry.company} direction="fade-right" delay={i * 0.08} className="relative flex gap-5 pb-6">
                  <div
                    className="w-[18px] h-[18px] rounded-full flex-shrink-0 mt-1 ring-2 ring-white dark:ring-gray-950 z-10"
                    style={{ backgroundColor: entry.color, boxShadow: `0 0 10px ${entry.color}60` }}
                  />
                  <div className="flex-1 bg-white/80 dark:bg-gray-900 backdrop-blur-md shadow-sm border border-gray-200 dark:border-transparent rounded-xs p-4 hover:border-blue-400/40 dark:hover:border-blue-500/30 transition-all duration-300 group">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2.5">
                        {entry.logo ? (
                          <div className="w-8 h-8 rounded-lg overflow-hidden relative bg-gray-100 dark:bg-gray-800 flex-shrink-0 border border-gray-200 dark:border-gray-700">
                            <Image src={entry.logo} alt={entry.company} fill className="object-contain p-1" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: entry.color + "20" }}>
                            <Building2 className="w-4 h-4" style={{ color: entry.color }} />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white text-sm">{entry.company}</p>
                          <p className="text-xs font-medium" style={{ color: entry.color }}>{entry.role}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-[10px] text-gray-400 flex items-center gap-1 justify-end">
                          <Calendar className="w-2.5 h-2.5" />{entry.period}
                        </p>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full mt-0.5 inline-block" style={{ backgroundColor: entry.color + "15", color: entry.color }}>
                          {entry.duration}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2.5 leading-relaxed line-clamp-2">
                      {entry.description}
                    </p>
                    <div className="flex items-center justify-between mt-3 flex-wrap gap-1.5">
                      <div className="flex flex-wrap gap-1">
                        {entry.skills.slice(0, 4).map(s => {
                          const icon = SKILL_ICONS[s];
                          return (
                            <span key={s} className="flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                              {icon && <Image src={icon} alt={s} width={10} height={10} className="object-contain opacity-80" />}
                              {s}
                            </span>
                          );
                        })}
                        {entry.skills.length > 4 && <span className="text-[9px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400">+{entry.skills.length - 4}</span>}
                      </div>
                      <button
                        onClick={() => setExpandedCareer(entry)}
                        className="text-[10px] font-bold flex items-center gap-0.5 cursor-pointer opacity-60 group-hover:opacity-100 transition-opacity"
                        style={{ color: entry.color }}
                      >
                        Detalhes <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </GsapAnim>
              ))}
            </div>

            {/* ── FakeIDE ── */}
            <GsapAnim direction="fade-left" delay={0.2} className="flex flex-col gap-3 lg:sticky lg:top-28">
              <FakeIDE />
              <p className="text-[10px] text-gray-400 dark:text-gray-600 font-mono text-center tracking-wider">
                {`// minha trajetória em código`}
              </p>
            </GsapAnim>
          </div>
        </div>
      </section>

      {/* ═══════════════════ SKILLS ═══════════════════ */}
      <section id="section-skills" className="min-h-screen w-full px-4 pt-24 pb-20 flex flex-col justify-center">
        <div className="max-w-5xl mx-auto w-full flex flex-col gap-10">

          <GsapAnim direction="fade-up">
            <h2 className="text-gray-900 dark:text-white text-6xl md:text-8xl uppercase leading-none" style={{ fontFamily: "var(--font-protest-strike)" }}>
              Stack
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3 text-base font-medium">
              Linguagens, frameworks, ferramentas e bibliotecas
            </p>
          </GsapAnim>

          <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6 items-center">

            {/* Photo card */}
            <GsapAnim direction="fade-right" delay={0.1}>
              <div className="w-full lg:w-56 flex flex-col items-center bg-white/80 dark:bg-gray-900 backdrop-blur-md shadow-lg border border-gray-200 dark:border-transparent gap-4 p-4 rounded-xs transition-colors duration-300">
                <div className="relative w-full flex justify-center items-center pt-4">
                  <div className="w-[140px] h-[140px] rounded-full overflow-hidden relative shadow-lg border-2 border-gray-200 dark:border-gray-800">
                    <Image src="/leo-foto.webp" alt="Leonardo Vieira" fill className="object-cover" />
                  </div>
                </div>
                <div className="flex justify-center items-center gap-2 flex-wrap">
                  {[
                    { src: "/tech-icons/typescript.svg", alt: "TypeScript", color: "#3178C6", label: "TS" },
                    { src: "/tech-icons/mysql.svg",       alt: "MySQL",      color: "#4479A1", label: "MySQL" },
                    { src: "/tech-icons/postgresql.svg",  alt: "PostgreSQL", color: "#4169E1", label: "PG" },
                    { src: "/tech-icons/php.svg",         alt: "PHP",        color: "#777BB4", label: "PHP" },
                  ].map(icon => (
                    <div key={icon.alt} className="flex flex-col items-center gap-0.5">
                      <div
                        className="w-8 h-8 rounded-md overflow-hidden relative p-0.5 border"
                        style={{ backgroundColor: icon.color + "15", borderColor: icon.color + "40" }}
                      >
                        <Image src={icon.src} alt={icon.alt} width={28} height={28} className="object-contain" />
                      </div>
                      <span className="text-[9px] text-gray-400 font-medium">{icon.label}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center items-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 text-white py-1.5 px-4 font-bold text-base shadow-md w-full text-center">
                  Leonardo
                </div>
                <div className="flex flex-col items-center gap-1.5 w-full">
                  <a href="mailto:imleodeveloper@gmail.com" className="text-gray-500 dark:text-gray-400 text-xs font-medium text-center hover:text-blue-500 transition-colors">
                    imleodeveloper@gmail.com
                  </a>
                  <a href="https://wa.me/5511967381402" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs font-medium hover:text-green-500 transition-colors">
                    <WhatsAppIcon className="w-3.5 h-3.5" />
                    (11) 96738-1402
                  </a>
                </div>
              </div>
            </GsapAnim>

            {/* Icon Cloud */}
            <GsapAnim direction="fade-left" delay={0.15}>
              <div className="h-[420px] flex items-center justify-center bg-white/80 dark:bg-gray-900 backdrop-blur-md shadow-lg border border-gray-200 dark:border-transparent rounded-xs overflow-hidden">
                <IconCloud iconSlugs={ICON_SLUGS} />
              </div>
            </GsapAnim>
          </div>
        </div>
      </section>

      {/* ═══════════════════ PROJETOS ═══════════════════ */}
      <section id="section-projetos" className="min-h-screen w-full px-4 pt-24 pb-20 flex flex-col justify-center">
        <div className="max-w-5xl mx-auto w-full flex flex-col gap-10">

          <GsapAnim direction="fade-up">
            <h2 className="text-gray-900 dark:text-white text-6xl md:text-8xl uppercase leading-none" style={{ fontFamily: "var(--font-protest-strike)" }}>
              Projetos
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3 text-base font-medium">
              Sistemas web que desenvolvi e mantenho ativamente
            </p>
          </GsapAnim>

          {/* Tab */}
          <div className="w-full grid grid-cols-2 max-w-xs">
            {(["sistemas", "sites"] as const).map((tab, i) => (
              <button
                key={tab}
                onClick={() => setProjectTab(tab)}
                className={`text-center font-semibold py-2 text-sm cursor-pointer transition-colors duration-300 ${i === 0 ? "rounded-l-xs" : "rounded-r-xs"} ${
                  projectTab === tab
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
                }`}
              >
                {tab === "sistemas" ? "Sistemas Web" : "Sites"}
              </button>
            ))}
          </div>

          {/* Sistemas */}
          {projectTab === "sistemas" && (
            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4">
              {SISTEMAS.map((project, i) => (
                <GsapAnim key={project.id} direction="fade-up" delay={i * 0.1}>
                  <div className="flex flex-col gap-2 border border-gray-200 dark:border-gray-800 pb-1 rounded-xs hover:border-[#1e90ff]/50 dark:hover:border-[#1e90ff]/50 transition-colors bg-white/80 dark:bg-gray-900 backdrop-blur-md shadow-sm">
                    <div className="rounded-xs w-full h-36 relative overflow-hidden">
                      <Image src={project.logo} alt={project.name} fill className="object-contain p-4 opacity-90 drop-shadow-md" />
                      {project.inDevelopment && (
                        <span className="absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30">Em dev</span>
                      )}
                    </div>
                    <div className="w-full flex flex-col gap-1 px-3 pb-1">
                      <span className="font-bold text-sm text-gray-900 dark:text-white">{project.name}</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{project.description}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(project.stacks ?? []).slice(0, 3).map(s => (
                          <span key={s} className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">{s}</span>
                        ))}
                      </div>
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="w-full mt-1 rounded-xs text-xs text-center py-1.5 border border-[#1e90ff] text-[#1e90ff] font-semibold hover:bg-[#1e90ff] hover:text-white transition-all duration-300 flex items-center justify-center gap-1 cursor-pointer"
                      >
                        Ver Mais <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </GsapAnim>
              ))}
            </div>
          )}

          {/* Sites */}
          {projectTab === "sites" && (
            <div className="flex flex-col gap-4">
              {/* 3D Slider grid */}
              <div className="overflow-hidden">
                <div
                  key={sitePage}
                  className={`w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${slideDir === "next" ? "site-slide-next" : "site-slide-prev"}`}
                >
                  {currentSites.map((project) => (
                    <div
                      key={project.id}
                      className="flex flex-col gap-2 border border-gray-200 dark:border-gray-800 pb-1 rounded-xs hover:border-[#1e90ff]/50 dark:hover:border-[#1e90ff]/50 transition-colors bg-white/80 dark:bg-gray-900 backdrop-blur-md shadow-sm"
                    >
                      <div
                        className="w-full h-36 relative flex items-center justify-center rounded-xs overflow-hidden"
                        style={project.bg
                          ? { background: project.bg }
                          : { backgroundColor: project.color + "18" }
                        }
                      >
                        {project.logo ? (
                          <Image src={project.logo} alt={project.name} fill className="object-contain p-5 opacity-90 drop-shadow-md" />
                        ) : (
                          <span className="text-7xl font-extrabold select-none opacity-20" style={{ color: project.color }}>
                            {project.initial}
                          </span>
                        )}
                        {project.inDevelopment && (
                          <span className="absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30">
                            Em dev
                          </span>
                        )}
                      </div>

                      <div className="w-full flex flex-col gap-1 px-3 pb-1">
                        <span className="font-bold text-sm text-gray-900 dark:text-white">{project.name}</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{project.description}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {project.stacks.slice(0, 3).map(s => (
                            <span key={s} className="text-[9px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: project.color + "15", color: project.color }}>
                              {s}
                            </span>
                          ))}
                          {project.stacks.length > 3 && (
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400">
                              +{project.stacks.length - 3}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => setSelectedSite(project)}
                          className="w-full mt-1 rounded-xs text-xs text-center py-1.5 border font-semibold transition-all duration-300 flex items-center justify-center gap-1 cursor-pointer hover:text-white"
                          style={{ borderColor: project.color, color: project.color }}
                          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = project.color; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = project.color; }}
                        >
                          Ver Mais <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Slider navigation */}
              {sitePages.length > 1 && (
                <div className="flex items-center justify-center gap-4 mt-1">
                  <button
                    onClick={() => goSitePage("prev")}
                    disabled={sitePage === 0}
                    className="p-2 rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex gap-2 items-center">
                    {sitePages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => { setSlideDir(i > sitePage ? "next" : "prev"); setSitePage(i); }}
                        className={`rounded-full transition-all duration-300 cursor-pointer ${i === sitePage ? "w-6 h-2 bg-blue-600" : "w-2 h-2 bg-gray-300 dark:bg-gray-600 hover:bg-blue-400"}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => goSitePage("next")}
                    disabled={sitePage === sitePages.length - 1}
                    className="p-2 rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════ CONTATO ═══════════════════ */}
      <section id="section-contato" className="min-h-screen w-full px-4 pt-24 pb-20 flex flex-col justify-center">
        <div className="max-w-5xl mx-auto w-full flex flex-col gap-10">

          <GsapAnim direction="fade-up">
            <h2 className="text-gray-900 dark:text-white text-6xl md:text-8xl uppercase leading-none" style={{ fontFamily: "var(--font-protest-strike)" }}>
              Contato
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3 text-base font-medium">
              Fale com meu assistente ou escolha um canal de contato direto.
            </p>
          </GsapAnim>

          <GsapAnim direction="fade-up" delay={0.1}>
            <ContactChat />
          </GsapAnim>
        </div>
      </section>

      {/* ═══════════════════ SERVIÇOS ═══════════════════ */}
      <section id="section-servicos" className="min-h-screen w-full pt-24 pb-28">
        <div className="px-6 md:px-12 max-w-[2240px] mx-auto w-full">

          {/* Header + CTAs sempre visíveis */}
          <GsapAnim direction="fade-up">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
              <div>
                <h2 className="text-gray-900 dark:text-white text-6xl md:text-8xl uppercase leading-none" style={{ fontFamily: "var(--font-protest-strike)" }}>
                  Serviços
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-3 text-base font-medium">
                  O que posso construir para você
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <button
                  onClick={openModal}
                  className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-black text-sm text-white bg-gradient-to-r from-[#1e90ff] to-blue-800 hover:brightness-110 transition-all duration-300 shadow-lg shadow-blue-500/20 whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4" />
                  Solicitar orçamento
                </button>
                <a
                  href="https://wa.me/5511967381402"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-black text-sm text-white bg-[#25D366] hover:brightness-110 transition-all duration-300 shadow-lg shadow-green-500/20 whitespace-nowrap"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  Falar no WhatsApp
                </a>
              </div>
            </div>
          </GsapAnim>

          {/* Grid de cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES.map((service, i) => {
              const { Icon, label, color, tags, desc, details } = service;
              return (
                <GsapAnim key={label} direction="fade-up" delay={i * 0.07}>
                  <div className="group relative flex flex-col gap-5 p-6 rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] hover:dark:bg-white/[0.06] hover:border-gray-300 dark:hover:border-white/10 transition-all duration-300 h-full overflow-hidden">
                    {/* Top accent bar on hover */}
                    <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: color }} />

                    {/* Number + Icon */}
                    <div className="flex items-center justify-between">
                      <span className="text-4xl font-black leading-none select-none transition-colors duration-300" style={{ color: color + "28" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110" style={{ backgroundColor: color + "18" }}>
                        <Icon className="w-5 h-5" style={{ color }} />
                      </div>
                    </div>

                    {/* Title + Desc */}
                    <div className="flex-1">
                      <h3 className="font-black text-lg text-gray-900 dark:text-white leading-tight mb-2">{label}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
                    </div>

                    {/* Detail bullets */}
                    <ul className="flex flex-col gap-1.5">
                      {details.map(d => (
                        <li key={d} className="flex items-start gap-2 text-xs text-gray-400 dark:text-gray-500 leading-snug">
                          <span className="w-1 h-1 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: color }} />
                          {d}
                        </li>
                      ))}
                    </ul>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-4 border-t border-gray-100 dark:border-white/5">
                      {tags.map(t => (
                        <span key={t} className="text-[10px] font-bold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: color + "15", color }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </GsapAnim>
              );
            })}
          </div>

          {/* CTA Banner inferior */}
          <GsapAnim direction="fade-up" delay={0.3}>
            <div className="mt-10 rounded-2xl p-7 md:p-9 border border-[#1e90ff]/20 bg-gradient-to-r from-[#1e90ff]/5 via-transparent to-blue-800/5 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <p className="font-black text-xl text-gray-900 dark:text-white">Pronto para começar um projeto?</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Entre em contato e receba uma proposta personalizada.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0 w-full md:w-auto">
                <button
                  onClick={openModal}
                  className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-black text-sm text-white bg-gradient-to-r from-[#1e90ff] to-blue-800 hover:brightness-110 transition-all duration-300 shadow-lg shadow-blue-500/20 whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4" />
                  Solicitar orçamento
                </button>
                <a
                  href="https://wa.me/5511967381402"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-black text-sm text-white bg-[#25D366] hover:brightness-110 transition-all duration-300 shadow-lg shadow-green-500/20 whitespace-nowrap"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  Falar no WhatsApp
                </a>
              </div>
            </div>
          </GsapAnim>

        </div>
      </section>

      {/* ═══════════════════ MODALS ═══════════════════ */}
      {expandedCareer && (
        <CareerDetailModal entry={expandedCareer} onClose={() => setExpandedCareer(null)} />
      )}
      {selectedSite && (
        <SiteModal project={selectedSite} onClose={() => setSelectedSite(null)} />
      )}
      <ProjectModal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
      />
    </div>
  );
}
