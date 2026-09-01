"use client";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { GsapAnim } from "../ui/gsap-anim";
import { FakeIDE } from "../ui/fake-ide";
import { WhatsAppIcon } from "../ui/whatsapp-icon";
import { ProjectModal, type ProjectData } from "./project-modal";

const PROJECTS: Record<string, ProjectData> = {
  agendoaki: {
    id: "agendo-aki",
    name: "Agendo Aki",
    description: "SaaS de agendamento para salões de beleza, profissionais autônomos e negócios que precisam organizar horários, clientes e serviços.",
    detailedDescription: "Utilizamos a API oficial do WhatsApp e a biblioteca Baileys para conexões não oficiais (disparos e automação de agendamentos).",
    stacks: ["Next.js", "TypeScript", "TailwindCSS", "PHP", "MySQL", "Baileys", "WhatsApp API"],
    url: "agendoaki.com",
    logo: "/agendoaki-logo-escrita.webp",
  },
  dispareija: {
    id: "disparei-ja",
    name: "Disparei Já",
    description: "SaaS de agendamento de mensagens para WhatsApp e Telegram, com integração oficial e não oficial e API do Telegram/BotFather.",
    detailedDescription: "Totalmente focado em performance de disparos. Hospedado na Vercel com Supabase. Conta com integrações robustas usando GramJS e Telethon.",
    stacks: ["Next.js", "TypeScript", "TailwindCSS", "Supabase", "Vercel", "GramJS", "Telethon", "BotFather API", "WhatsApp API", "Baileys"],
    url: "dispareija.com",
    logo: "/icon-disparei-ja.webp",
  },
  crmorbis: {
    id: "viercrm",
    name: "VierCRM",
    description: "CRM completo com kanban, controle de leads, gestão financeira e organização de processos comerciais.",
    detailedDescription: "Em desenvolvimento ativo. CRM da VierCa com kanban, gestão de leads e controle financeiro para fluxos internos de vendas.",
    stacks: ["React (Vite)", "TypeScript", "TailwindCSS", "PHP", "MySQL"],
    url: "crm.vierca.com",
    logo: "/icon-vierca-svg.svg",
    inDevelopment: true,
  }
};

export function HomePage() {
  const [isSection, setIsSection] = useState("Sobre");
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  return (
    <article className="w-full flex justify-center items-center container">
      <section className="max-w-5xl w-full grid grid-cols-1 items-center">
        <div className="w-full h-80 relative justify-center items-center flex">
          <FakeIDE />
        </div>
        <div className="w-full relative grid grid-cols-1 lg:grid-cols-[0.65fr_2fr] px-4 items-center gap-16">
          <GsapAnim direction="fade-right" className="relative w-full">
            <div className="w-full mt-36 lg:mt-0 lg:absolute lg:-top-42 lg:w-64 flex flex-col justify-start items-center bg-white/80 dark:bg-gray-900 backdrop-blur-md shadow-lg border border-gray-200 dark:border-transparent gap-4 p-4 rounded-xs transition-colors duration-300">
              <div className="relative w-full min-h-26 flex justify-center items-center">
                <div className="w-full absolute -top-24 flex justify-center items-center">
                  <div className="w-[180px] h-[180px] rounded-full overflow-hidden relative shadow-lg border-2 border-gray-200 dark:border-gray-800 transition-colors duration-300">
                    <Image
                      src="/leo-foto.webp"
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center gap-3 flex-wrap">
                <div className="flex flex-col items-center gap-0.5">
                  <div className="w-8 h-8 relative rounded-md overflow-hidden bg-[#3178C6]/10 border border-[#3178C6]/30 p-0.5">
                    <Image
                      src="/tech-icons/typescript.svg"
                      alt="TypeScript"
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                  </div>
                  <span className="text-[9px] text-gray-400 font-medium">TS</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <div className="w-8 h-8 relative rounded-md overflow-hidden bg-[#4479A1]/10 border border-[#4479A1]/30 p-0.5">
                    <Image
                      src="/tech-icons/mysql.svg"
                      alt="MySQL"
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                  </div>
                  <span className="text-[9px] text-gray-400 font-medium">MySQL</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <div className="w-8 h-8 relative rounded-md overflow-hidden bg-[#4169E1]/10 border border-[#4169E1]/30 p-0.5">
                    <Image
                      src="/tech-icons/postgresql.svg"
                      alt="PostgreSQL"
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                  </div>
                  <span className="text-[9px] text-gray-400 font-medium">Postgres</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <div className="w-8 h-8 relative rounded-md overflow-hidden bg-[#777BB4]/10 border border-[#777BB4]/30 p-0.5">
                    <Image
                      src="/tech-icons/php.svg"
                      alt="PHP"
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                  </div>
                  <span className="text-[9px] text-gray-400 font-medium">PHP</span>
                </div>
              </div>
              <div className="flex justify-center items-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 text-white py-1.5 px-4 font-bold text-lg shadow-md">
                Leonardo
              </div>
              <div className="flex flex-col justify-center items-center gap-2">
                <a href="mailto:imleodeveloper@gmail.com" className="text-gray-600 dark:text-gray-400 text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400">
                  imleodeveloper@gmail.com
                </a>
                <a href="https://wa.me/5511967381402" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm font-medium transition-colors hover:text-green-600 dark:hover:text-green-400">
                  <WhatsAppIcon className="w-4 h-4" />
                  (11) 96738-1402
                </a>
              </div>
            </div>
          </GsapAnim>
          <GsapAnim direction="fade-left" delay={0.2} className="w-full relative grid grid-cols-1 gap-4 items-center mt-4">
            <div className="w-full grid grid-cols-2 items-center">
              <button
                className={`text-center rounded-l-xs font-semibold py-2 cursor-pointer transition-colors duration-300 ${
                  isSection === "Sobre"
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-600 dark:hover:bg-gray-900 dark:text-white"
                }`}
                onClick={() => setIsSection("Sobre")}
              >
                Sobre Mim
              </button>
              <button
                className={`text-center rounded-r-xs font-semibold py-2 cursor-pointer transition-colors duration-300 ${
                  isSection === "Projetos"
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-600 dark:hover:bg-gray-900 dark:text-white"
                }`}
                onClick={() => setIsSection("Projetos")}
              >
                Principais Projetos
              </button>
            </div>
            <div className="w-full bg-white/80 dark:bg-gray-900 backdrop-blur-md shadow-lg border border-gray-200 dark:border-transparent p-4 rounded-xs flex flex-col justify-start items-start gap-4 transition-colors duration-300">
              {isSection === "Sobre" && (
                <>
                  <div className="overflow-y-auto max-h-[320px] pr-1 space-y-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300 transition-colors">
                    <p>
                      Desenvolvedor Full-Stack com mais de 4 anos de experiência em T.I — comecei em suporte técnico e hardware, evoluí para desenvolvimento web e hoje fundei minha própria empresa. Trabalho com PHP, TypeScript, JavaScript, MySQL, PostgreSQL, Next.js, React e TailwindCSS.
                    </p>
                    <p>
                      Tenho experiência em sistemas web escaláveis, SaaS, CRMs, landing pages de alta conversão, integrações com WhatsApp API (oficial + Baileys), Telegram (GramJS, Telethon), deploy em VPS com Linux/Nginx e SEO técnico para tráfego orgânico.
                    </p>
                    <p>
                      Minha trajetória começou na <strong className="text-blue-700 dark:text-white">Strong Tech</strong> (mai–set 2022) como Estagiário de T.I, montando desktops do zero. Depois fui para a <strong className="text-blue-700 dark:text-white">Allugga</strong> (set 2022 – jun 2024), onde virei Analista de Suporte T.I Jr., liderando suporte remoto e logística da empresa.
                    </p>
                    <p>
                      Em junho de 2024, fundei a <strong className="text-blue-700 dark:text-white">VierCa</strong>, minha empresa de desenvolvimento de software e aplicativos — onde atuo até hoje. Em 2025, trabalhei como desenvolvedor na <strong className="text-blue-700 dark:text-white">INFOLAB MARKETING</strong> (jun 2025 – jul 2026), construindo CRMs, área de membros, landing pages e automações com WhatsApp e Telegram.
                    </p>
                  </div>
                </>
              )}
              {isSection === "Projetos" && (
                <>
                  <div className="w-full grid grid-cols-1 items-center gap-2">
                    <div className="w-full grid grid-cols-1 lg:grid-cols-3 items-center gap-4">
                      {/* Agendo Aki */}
                      <div className="flex flex-col justify-center items-center gap-2 border border-gray-200 dark:border-gray-800 pb-1 rounded-xs hover:border-[#1e90ff]/50 dark:hover:border-[#1e90ff]/50 transition-colors">
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-xs w-full h-36 relative flex justify-center items-center overflow-hidden p-4">
                          <Image src="/agendoaki-logo-escrita.webp" alt="Agendo Aki" fill className="object-contain p-4 opacity-80 group-hover:opacity-100 transition-opacity drop-shadow-md" />
                        </div>
                        <div className="w-full flex flex-col gap-1 px-2">
                          <span className="font-bold text-sm text-gray-900 dark:text-white">Agendo Aki</span>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                            SaaS de agendamento para salões de beleza, profissionais autônomos e negócios que precisam organizar horários, clientes e serviços.
                          </p>
                          <div className="w-full flex justify-between items-center mt-1">
                            <button
                              onClick={() => setSelectedProject(PROJECTS.agendoaki)}
                              className="w-full rounded-xs text-xs text-center py-1 px-2 border border-[#1e90ff] text-[#1e90ff] dark:text-white font-semibold hover:bg-[#1e90ff] hover:text-white dark:hover:text-black transition-all duration-300 flex items-center justify-center gap-1 cursor-pointer"
                            >
                              Ver Mais <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                      {/* Disparei Já */}
                      <div className="flex flex-col justify-center items-center gap-2 border border-gray-200 dark:border-gray-800 pb-1 rounded-xs hover:border-[#1e90ff]/50 dark:hover:border-[#1e90ff]/50 transition-colors">
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-xs w-full h-36 relative flex justify-center items-center overflow-hidden p-4">
                          <Image src="/icon-disparei-ja.webp" alt="Disparei Já" fill className="object-contain p-6 opacity-80 group-hover:opacity-100 transition-opacity drop-shadow-md" />
                        </div>
                        <div className="w-full flex flex-col gap-1 px-2">
                          <span className="font-bold text-sm text-gray-900 dark:text-white">Disparei Já</span>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                            SaaS de agendamento de mensagens para WhatsApp e Telegram, com integração oficial e não oficial e API do Telegram/BotFather.
                          </p>
                          <div className="w-full flex justify-between items-center mt-1">
                            <button
                              onClick={() => setSelectedProject(PROJECTS.dispareija)}
                              className="w-full rounded-xs text-xs text-center py-1 px-2 border border-[#1e90ff] text-[#1e90ff] dark:text-white font-semibold hover:bg-[#1e90ff] hover:text-white dark:hover:text-black transition-all duration-300 flex items-center justify-center gap-1 cursor-pointer"
                            >
                              Ver Mais <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                      {/* VierCRM */}
                      <div className="flex flex-col justify-center items-center gap-2 border border-gray-200 dark:border-gray-800 pb-1 rounded-xs hover:border-[#1e90ff]/50 dark:hover:border-[#1e90ff]/50 transition-colors">
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-xs w-full h-36 relative flex justify-center items-center overflow-hidden p-4">
                          <Image src="/icon-vierca-svg.svg" alt="VierCRM" fill className="object-contain p-6 opacity-80 group-hover:opacity-100 transition-opacity drop-shadow-md" />
                        </div>
                        <div className="w-full flex flex-col gap-1 px-2">
                          <span className="font-bold text-sm text-gray-900 dark:text-white">VierCRM</span>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                            CRM completo com kanban, controle de leads, gestão financeira e organização de processos comerciais.
                          </p>
                          <div className="w-full flex justify-between items-center mt-1">
                            <button
                              onClick={() => setSelectedProject(PROJECTS.crmorbis)}
                              className="w-full rounded-xs text-xs text-center py-1 px-2 border border-[#1e90ff] text-[#1e90ff] dark:text-white font-semibold hover:bg-[#1e90ff] hover:text-white dark:hover:text-black transition-all duration-300 flex items-center justify-center gap-1 cursor-pointer"
                            >
                              Ver Mais <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full flex justify-center items-center">
                      <button
                        onClick={() => window.dispatchEvent(new CustomEvent("start-about-transition"))}
                        className="w-full bg-blue-600 font-semibold p-2 text-center rounded-xs cursor-pointer hover:bg-blue-700 text-white transition-colors"
                      >
                        Mais Projetos
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </GsapAnim>
        </div>
      </section>

      <ProjectModal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
      />
    </article>
  );
}
