"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useWhatsAppModal } from "@/lib/hooks/use-whatsapp-modal";

type IDEStage =
  | "intro"
  | "hello"
  | "thinking"
  | "ask"
  | "simulating_click"
  | "experience"
  | "projects_code"
  | "cta"
  | "resetting";

const HELLO_LINES = [
  'console.log("Hello World 👋");',
  '',
  'const dev: FullStackDeveloper = {',
  '  nome: "Leonardo Vieira",',
  '  cargo: "Dev Full-Stack",',
  '  stack: ["PHP", "TypeScript", "React",',
  '          "Next.js", "MySQL", "PostgreSQL"],',
  '  experiencia: "4+ anos em T.I",',
  '  empresa: "VierCa",',
  '};',
];

const EXPERIENCE_LINES = [
  '// 📋 Experiencia Profissional (recente → antigo)',
  '',
  'const trajetoria = [',
  '  {',
  '    empresa: "VierCa (fundador)",',
  '    cargo: "Full-Stack Dev & CEO",',
  '    periodo: "jun/2024 - presente",',
  '    desc: [',
  '      "Sites, SaaS e apps Android/iOS",',
  '      "Deploy em VPS Linux com Nginx",',
  '      "SEO tecnico e seguranca web",',
  '    ],',
  '  },',
  '  {',
  '    empresa: "INFOLAB MARKETING",',
  '    cargo: "Dev Full-Stack",',
  '    periodo: "jun/2025 - jul/2026",',
  '    desc: [',
  '      "CRM interno e area de membros",',
  '      "Landing pages e design digital",',
  '      "WhatsApp Oficial, Baileys, GramJS",',
  '    ],',
  '  },',
  '  {',
  '    empresa: "Allugga",',
  '    cargo: "Assistente → Analista T.I Jr.",',
  '    periodo: "set/2022 - jun/2024",',
  '    desc: [',
  '      "Suporte presencial e remoto",',
  '      "Manutencao e producao de notebooks",',
  '      "Lider de suporte e logistica interna",',
  '    ],',
  '  },',
  '  {',
  '    empresa: "Strong Tech",',
  '    cargo: "Estagiario de T.I",',
  '    periodo: "mai/2022 - set/2022",',
  '    desc: [',
  '      "Montagem de desktops do zero",',
  '      "Manutencao de hardware",',
  '      "Suporte tecnico e redes LAN/WLAN",',
  '    ],',
  '  },',
  '];',
  '',
  '// 🎯 Especialidades:',
  '// • SaaS, CRMs, Landing Pages',
  '// • APIs REST, WhatsApp & Telegram',
  '// • Deploy, VPS Linux/Nginx, SEO',
];

const PROJECTS_LINES = [
  '// 🚀 Principais Projetos',
  '',
  'const projetos = [',
  '  {',
  '    nome: "Agendo Aki",',
  '    tipo: "SaaS",',
  '    url: "https://agendoaki.com",',
  '    desc: "Agendamento para saloes e',
  '          profissionais autonomos",',
  '  },',
  '  {',
  '    nome: "Disparei Ja",',
  '    tipo: "SaaS",',
  '    url: "https://dispareija.com",',
  '    desc: "Mensagens WhatsApp e Telegram,',
  '          API oficial e nao-oficial",',
  '  },',
  '  {',
  '    nome: "CRM Group Orbis",',
  '    tipo: "CRM Empresarial",',
  '    url: "https://crm.grouporbis.com",',
  '    desc: "Kanban, leads, financeiro e',
  '          processos comerciais",',
  '  },',
  '];',
];

const STATUS_MESSAGES: Partial<Record<IDEStage, string>> = {
  thinking: "🔍 Analisando perfil de Leonardo Vieira...",
  hello: "⌨️  Gerando apresentacao...",
  experience: "⌨️  Carregando experiencia profissional...",
  projects_code: "⌨️  Listando projetos...",
  ask: "🤖 Aguardando confirmacao...",
  simulating_click: "✅ Confirmado! Buscando mais dados...",
  cta: "📩 Pronto para conectar!",
  resetting: "",
};

function typeLines(
  lines: string[],
  baseIndex: number,
  onUpdate: (displayed: string[], lineIdx: number, charIdx: number) => void,
  onComplete: () => void,
  speedMs = 25
): () => void {
  let lineIdx = 0;
  let charIdx = 0;
  const displayed: string[] = [];
  let cancelled = false;

  const tick = () => {
    if (cancelled) return;

    if (lineIdx >= lines.length) {
      onComplete();
      return;
    }

    const currentLine = lines[lineIdx];

    if (charIdx < currentLine.length) {
      if (displayed.length <= lineIdx) displayed.push("");
      displayed[lineIdx] = currentLine.slice(0, charIdx + 1);
      charIdx += 1;
      onUpdate([...displayed], lineIdx + baseIndex, charIdx);
      const s = speedMs + Math.random() * 10;
      setTimeout(tick, s);
    } else {
      displayed[lineIdx] = currentLine;
      lineIdx += 1;
      charIdx = 0;
      onUpdate([...displayed], (lineIdx - 1) + baseIndex, charIdx);
      const pause = currentLine === "" ? 50 : 15 + Math.random() * 20;
      setTimeout(tick, pause);
    }
  };

  tick();

  return () => {
    cancelled = true;
  };
}

export function FakeIDE() {
  const [stage, setStage] = useState<IDEStage>("hello");
  const [historyLines, setHistoryLines] = useState<string[]>([]);
  const [currentTypingLines, setCurrentTypingLines] = useState<string[]>([]);
  const [chatMessage, setChatMessage] = useState<string>("");
  const [showSimOption, setShowSimOption] = useState(false);
  const [simHighlighted, setSimHighlighted] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);
  const [introText, setIntroText] = useState("");
  const [introFading, setIntroFading] = useState(false);
  
  const codeAreaRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const cancelTypingRef = useRef<(() => void) | null>(null);
  const { openModal } = useWhatsAppModal();

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    cancelTypingRef.current?.();
    cancelTypingRef.current = null;
  }, []);

  const schedule = useCallback(
    (fn: () => void, ms: number) => {
      const t = setTimeout(fn, ms);
      timersRef.current.push(t);
      return t;
    },
    []
  );

  const startTyping = useCallback(
    (
      lines: string[],
      baseIndex: number,
      onComplete: (typedLines: string[]) => void,
      speedMs?: number
    ) => {
      cancelTypingRef.current?.();
      let finalLines: string[] = [];
      const cancel = typeLines(
        lines,
        baseIndex,
        (displayed) => {
          finalLines = displayed;
          setCurrentTypingLines(displayed);
          if (codeAreaRef.current) {
            codeAreaRef.current.scrollTop = codeAreaRef.current.scrollHeight + 200;
          }
        },
        () => {
          onComplete(finalLines);
        },
        speedMs
      );
      cancelTypingRef.current = cancel;
    },
    []
  );

  const reset = useCallback(() => {
    clearTimers();
    setHistoryLines([]);
    setCurrentTypingLines([]);
    setChatMessage("");
    setShowSimOption(false);
    setSimHighlighted(false);
    setShowCta(false);
    setCtaVisible(false);
    setIntroText("");
    setIntroFading(false);
    if (codeAreaRef.current) codeAreaRef.current.scrollTop = 0;
  }, [clearTimers]);

  const startCtaSequence = useCallback(() => {
    setStage("cta");
    setChatMessage("💬 Preparando contato...");
    schedule(() => {
      setShowCta(true);
      schedule(() => {
        setCtaVisible(true);
        if (codeAreaRef.current) {
          codeAreaRef.current.scrollTop = codeAreaRef.current.scrollHeight;
        }
      }, 200);
    }, 400);
  }, [schedule]);

  const startExperienceSequence = useCallback((currentHistory: string[]) => {
    setStage("simulating_click");
    setSimHighlighted(true);
    schedule(() => {
      setShowSimOption(false);
      setSimHighlighted(false);
      setChatMessage("");
      setStage("experience");
      
      // Append a gap before experience
      const baseForExp = [...currentHistory, "", ""];
      setHistoryLines(baseForExp);
      
      startTyping(
        EXPERIENCE_LINES,
        baseForExp.length,
        (typedExpLines) => {
          schedule(() => {
            setStage("projects_code");
            setCurrentTypingLines([]);
            
            const baseForProj = [...baseForExp, ...typedExpLines, "", ""];
            setHistoryLines(baseForProj);
            
            startTyping(
              PROJECTS_LINES,
              baseForProj.length,
              (typedProjLines) => {
                setCurrentTypingLines([]);
                setHistoryLines([...baseForProj, ...typedProjLines, "", ""]);
                schedule(startCtaSequence, 400);
              },
              5 // ultra fast
            );
          }, 300);
        },
        5 // ultra fast
      );
    }, 400);
  }, [schedule, startTyping, startCtaSequence]);

  const skipToCta = useCallback((currentHistory: string[]) => {
    setShowSimOption(false);
    setSimHighlighted(false);
    // Add gap before CTA
    setHistoryLines([...currentHistory, "", ""]);
    startCtaSequence();
  }, [startCtaSequence]);

  // Full cycle orchestration
  useEffect(() => {
    reset();
    setStage("intro");

    const INTRO_WORD = "DEVELOPER";
    let charIdx = 0;

    const typeIntroChar = () => {
      if (charIdx <= INTRO_WORD.length) {
        setIntroText(INTRO_WORD.slice(0, charIdx));
        charIdx++;
        const t = setTimeout(typeIntroChar, charIdx === 1 ? 200 : 110 + Math.random() * 60);
        timersRef.current.push(t);
      } else {
        const t1 = setTimeout(() => {
          setIntroFading(true);
          const t2 = setTimeout(() => {
            setStage("hello");
            setIntroText("");
            setIntroFading(false);

            startTyping(HELLO_LINES, 0, (typedHelloLines) => {
              schedule(() => {
                setStage("thinking");
                setCurrentTypingLines([]);
                setHistoryLines([...typedHelloLines, "", ""]);

                const thinkingText = "🔍 Analisando perfil de Leonardo Vieira...";
                let ci = 0;
                const typeThinking = () => {
                  if (ci <= thinkingText.length) {
                    setChatMessage(thinkingText.slice(0, ci));
                    ci++;
                    if (codeAreaRef.current) {
                      codeAreaRef.current.scrollTop = codeAreaRef.current.scrollHeight;
                    }
                    schedule(typeThinking, 20);
                  } else {
                    schedule(() => {
                      setStage("ask");
                      setChatMessage("Permitir ir para a próxima etapa?");
                      schedule(() => {
                        setShowSimOption(true);
                        if (codeAreaRef.current) {
                          codeAreaRef.current.scrollTop = codeAreaRef.current.scrollHeight + 100;
                        }
                      }, 300);
                    }, 400);
                  }
                };
                typeThinking();
              }, 200);
            }, 5);
          }, 550);
          timersRef.current.push(t2);
        }, 700);
        timersRef.current.push(t1);
      }
    };

    const t0 = setTimeout(typeIntroChar, 300);
    timersRef.current.push(t0);

    return () => {
      clearTimers();
      cancelTypingRef.current?.();
    };
  }, [reset, schedule, startTyping, clearTimers]);

  const handleCtaClick = useCallback(() => {
    openModal();
  }, [openModal]);

  const statusText = STATUS_MESSAGES[stage] || "";
  
  // The complete list of lines currently visible
  const allLines = [...historyLines, ...currentTypingLines];

  return (
    <div
      className="w-full h-80"
      style={{ perspective: "600px" }}
    >
      <div
        className="w-full h-full rounded-lg p-0.5 neon-terminal"
        style={{
          transform: "translateZ(8px)",
          background: "rgba(10, 10, 18, 0.95)",
        }}
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
            </div>
            <span className="text-[10px] text-gray-500 ml-2 font-mono">
              leonardo-vieira.dev
            </span>
          </div>
          <span
            className={`text-[10px] font-mono transition-colors duration-500 truncate max-w-[120px] sm:max-w-none ${
              stage === "thinking"
                ? "text-blue-400 status-pulse"
                : stage === "hello" || stage === "experience" || stage === "projects_code"
                ? "text-green-400"
                : stage === "ask"
                ? "text-yellow-400"
                : stage === "simulating_click"
                ? "text-green-400 status-pulse"
                : stage === "cta"
                ? "text-[#1e90ff] status-pulse"
                : "text-gray-500"
            }`}
          >
            {statusText}
          </span>
        </div>

        {/* Main Area */}
        <div
          ref={codeAreaRef}
          className="relative p-3 font-mono text-xs leading-relaxed overflow-y-auto h-[calc(100%-32px)] pb-10"
        >
          {/* ---- INTRO ANIMATION ---- */}
          {stage === "intro" && (
            <div
              className="absolute inset-0 flex items-center justify-center z-20 rounded-b-lg transition-opacity duration-500"
              style={{
                background: "rgba(10, 10, 18, 0.99)",
                opacity: introFading ? 0 : 1,
              }}
            >
              <div className="flex items-center">
                <span
                  style={{
                    fontFamily: "'Pixelify Sans', monospace",
                    fontSize: "clamp(1.6rem, 6vw, 2.8rem)",
                    color: "#1e90ff",
                    letterSpacing: "0.18em",
                    textShadow: "0 0 24px rgba(30,144,255,0.7), 0 0 60px rgba(30,144,255,0.25)",
                  }}
                >
                  {introText}
                </span>
                {!introFading && (
                  <span
                    className="ml-1 inline-block bg-[#1e90ff]"
                    style={{
                      width: "clamp(0.15rem, 0.5vw, 0.2rem)",
                      height: "clamp(1.6rem, 6vw, 2.8rem)",
                      opacity: 0.9,
                      animation: "pulse 0.8s ease-in-out infinite",
                      boxShadow: "0 0 10px rgba(30,144,255,0.8)",
                    }}
                  />
                )}
              </div>
            </div>
          )}

          {/* ---- ALL HISTORY AND CURRENT TYPING LINES ---- */}
          <div className="text-green-400/90 mb-2">
            {allLines.map((line, i) => (
              <div key={i} className="whitespace-pre">
                <span className="text-gray-600 select-none mr-2">
                  {String(i + 1).padStart(2, " ")}
                </span>
                <span
                  className={
                    line.startsWith("//")
                      ? "text-gray-500 italic"
                      : line.startsWith("console.log")
                      ? "text-yellow-400"
                      : line.includes('"') && !line.startsWith("//")
                      ? "text-[#c3e88d]"
                      : line.startsWith("const") || line.startsWith("  const")
                      ? "text-[#82aaff]"
                      : line.includes(":") && !line.startsWith("//")
                      ? "text-[#ffcb6b]"
                      : ""
                  }
                >
                  {line}
                </span>
              </div>
            ))}
            {(stage === "hello" || stage === "experience" || stage === "projects_code") && (
              <span className="inline-block w-2 h-3.5 bg-green-400 ml-7 align-middle opacity-100" />
            )}
          </div>

          {/* ---- INTERACTIVE UI AT BOTTOM OF TERMINAL ---- */}
          
          {/* THINKING MODE */}
          {stage === "thinking" && (
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-center gap-2 text-blue-400/60">
                <span className="inline-block w-3 h-3 border-2 border-blue-400/40 border-t-blue-400 rounded-full animate-spin" />
                <span className="text-[11px]">
                  {chatMessage || "Analisando..."}
                </span>
              </div>
              <div className="text-gray-600 text-[11px] animate-pulse">
                ██████████████████████████████
              </div>
              <div className="text-gray-500 text-[10px] mt-1">
                $ whois LeonardoVieira
              </div>
              <div className="text-gray-600 text-[10px]">
                consulting database...
              </div>
            </div>
          )}

          {/* ASK / SIMULATING CLICK MODE */}
          {(stage === "ask" || stage === "simulating_click") && (
            <div className="flex flex-col gap-3 mt-2">
              {/* Terminal-style message */}
              <div className="bg-gray-800/60 rounded-lg rounded-bl-sm px-3 py-2 max-w-[90%] border border-gray-600/50">
                <p className="text-[#e0e0e0] text-[11px] leading-relaxed font-mono">
                  {chatMessage}
                </p>
              </div>

              {/* Sim/Nao buttons - Terminal style */}
              {showSimOption && (
                <div className="flex flex-wrap gap-2 mt-1 pointer-events-auto relative z-20">
                  <button
                    onClick={() => startExperienceSequence(allLines)}
                    className={`text-[10px] sm:text-[11px] px-2 sm:px-3 py-1 rounded border font-mono transition-all duration-200 cursor-pointer whitespace-nowrap ${
                      simHighlighted
                        ? "bg-green-600 border-green-400 text-black shadow-[0_0_10px_rgba(34,197,94,0.4)] scale-105"
                        : "bg-gray-800 border-gray-600 text-green-400 hover:bg-green-900/40 hover:border-green-400"
                    }`}
                  >
                    [Y] Yes, Allow
                  </button>
                  <button
                    onClick={() => skipToCta(allLines)}
                    className={`text-[10px] sm:text-[11px] px-2 sm:px-3 py-1 rounded border font-mono transition-all duration-200 cursor-pointer whitespace-nowrap ${
                      simHighlighted
                        ? "bg-gray-800/30 border-gray-700 text-gray-600"
                        : "bg-gray-800 border-gray-600 text-red-400 hover:bg-red-900/40 hover:border-red-400"
                    }`}
                  >
                    [N] No, Deny
                  </button>
                </div>
              )}
            </div>
          )}

          {/* CTA MODE */}
          {stage === "cta" && (
            <div className="flex flex-col items-center gap-3 mt-8 w-full pb-4">
              {!showCta ? (
                <div className="flex items-center gap-2 text-[#1e90ff] status-pulse">
                  <span className="inline-block w-3 h-3 border-2 border-[#1e90ff]/40 border-t-[#1e90ff] rounded-full animate-spin" />
                  <span className="text-xs font-mono">
                    {chatMessage}
                  </span>
                </div>
              ) : (
                <div
                  className={`flex flex-col items-center gap-4 transition-all duration-500 ${
                    ctaVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                >
                  <p className="text-[#e0e0e0] text-sm font-mono text-center">
                    💬 Deseja entrar em contato agora?
                  </p>
                  <button
                    onClick={handleCtaClick}
                    className="px-6 py-2 rounded-md bg-green-600 hover:bg-green-500 text-black font-bold text-sm cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(34,197,94,0.4)] z-10 relative pointer-events-auto flex items-center gap-2"
                  >
                    <span className="text-lg">🤖</span> Falar com I.A de Briefing
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
