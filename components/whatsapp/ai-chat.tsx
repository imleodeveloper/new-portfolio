"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage, Lead, ServiceType } from "@/lib/types/lead";
import { AI_TEMPLATES, SERVICES } from "@/lib/constants/services";
import { ChatBubble } from "../ui/chat-bubble";
import { ThinkingIndicator } from "../ui/thinking-indicator";

interface AIChatProps {
  form: Partial<Lead>;
  onPrefill: (data: Partial<Lead>) => void;
  selectedServiceId: ServiceType | null;
}

type ConversationStage =
  | "greeting"
  | "askName"
  | "askPhone"
  | "askCompany"        // tem empresa? sim/não
  | "askCompanyName"    // qual o nome da empresa?
  | "askCompanyServices"// quais serviços presta?
  | "askService"
  | "askPreference"
  | "collectInfo"
  | "finalize";

// Ordem base — empresa pode ser pulada (ver getNextStage)
const STAGE_ORDER: ConversationStage[] = [
  "greeting", "askName", "askPhone",
  "askCompany", "askCompanyName", "askCompanyServices",
  "askService", "askPreference", "collectInfo", "finalize",
];

const QUICK_REPLIES: Partial<Record<ConversationStage, string[]>> = {
  greeting:      ["Quero uma Landing Page", "Preciso de um Site Institucional", "Quero um Sistema Próprio", "Preciso de um Marketplace", "Busco Freelancer", "Preciso de Suporte T.I"],
  askCompany:    ["Sim, tenho empresa", "Não tenho empresa"],
  askService:    ["Landing Page", "Site Institucional", "Sistema Próprio", "Marketplace", "Freelance", "Serviços de T.I", "Outro"],
  askPreference: ["WhatsApp", "Ligação Telefônica", "Ambos"],
};

const AI_MSGS: Partial<Record<ConversationStage, string[]>> = {
  askCompany:         ["Você representa uma empresa?", "Tem empresa? Me conta!", "É para pessoa física ou empresa?"],
  askCompanyName:     ["Qual o nome da empresa?", "Me diz o nome da sua empresa!", "Como se chama a empresa?"],
  askCompanyServices: ["E quais serviços ou produtos a empresa oferece?", "O que a empresa faz? Conta um pouco sobre o negócio!", "Quais são os serviços/produtos da empresa?"],
};

function pickRandom(arr: string[]): string { return arr[Math.floor(Math.random() * arr.length)]; }
function delay(ms: number) { return new Promise<void>((r) => setTimeout(r, ms)); }
let _uid = 0;
function nextId() { return `m${++_uid}`; }

function extractName(text: string): string {
  const stop = new Set(["meu","minha","nome","sou","chamo","ola","oi","é","me","olá"]);
  return text.replace(/[^\w\sÀ-ɏ]/g,"").trim().split(/\s+/)
    .filter((w) => !stop.has(w.toLowerCase())).slice(0,3).join(" ");
}

function extractPhone(text: string): string {
  const d = text.replace(/\D/g,"").slice(0,11);
  if (d.length >= 10) return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
  return text.trim();
}

function detectService(text: string): ServiceType | null {
  const l = text.toLowerCase();
  if (l.includes("landing"))                            return "landing-page";
  if (l.includes("institucional"))                      return "institutional-site";
  if (l.includes("sistema") || l.includes("próprio"))   return "custom-system";
  if (l.includes("marketplace"))                        return "marketplace";
  if (l.includes("freelance") || l.includes("freela"))  return "freelance";
  if (l.includes("t.i") || l.includes("suporte") || l.includes("manutenção")) return "it-services";
  if (l.includes("outro"))                              return "other";
  return null;
}

function detectPreference(text: string): Lead["contactPreference"] | null {
  const l = text.toLowerCase();
  if (l.includes("ligação") || l.includes("telefone")) return "phone-call";
  if (l.includes("whatsapp"))                          return "whatsapp";
  if (l.includes("ambos") || l.includes("tanto faz")) return "both";
  return null;
}

function hasCompanyAnswer(text: string): boolean {
  const l = text.toLowerCase();
  return !(l.includes("não") || l.includes("nao") || l.includes("pessoa física") || l.includes("nenhuma"));
}

function getNextBriefingQuestion(collectedData: Partial<Lead>): { label: string; key: string } | null {
  const svc = SERVICES.find((s) => s.id === collectedData.serviceType);
  if (!svc) return null;
  const answered = collectedData.briefingAnswers ?? {};
  return svc.briefingQuestions.find((q) => !answered[q.key]) ?? null;
}

function allBriefingAnswered(collectedData: Partial<Lead>): boolean {
  const svc = SERVICES.find((s) => s.id === collectedData.serviceType);
  if (!svc || svc.briefingQuestions.length === 0) return true;
  const answered = collectedData.briefingAnswers ?? {};
  return svc.briefingQuestions.every((q) => answered[q.key]);
}

function getAIReply(stage: ConversationStage, collectedData: Partial<Lead>): string {
  if (AI_MSGS[stage]) return pickRandom(AI_MSGS[stage]!);
  switch (stage) {
    case "askName":       return pickRandom(AI_TEMPLATES.askName);
    case "askPhone":      return pickRandom(AI_TEMPLATES.askPhone);
    case "askService":    return pickRandom(AI_TEMPLATES.askService);
    case "askPreference": return pickRandom(AI_TEMPLATES.askPreference);
    case "collectInfo": {
      const q = getNextBriefingQuestion(collectedData);
      return q ? q.label : pickRandom(AI_TEMPLATES.collectInfo);
    }
    case "finalize":      return pickRandom(AI_TEMPLATES.finalize);
    default:              return pickRandom(AI_TEMPLATES.greeting);
  }
}

function getCollectInfoReplies(collectedData: Partial<Lead>): string[] {
  const q = getNextBriefingQuestion(collectedData);
  if (!q) return [];
  const l = q.label.toLowerCase();
  const isBinary =
    l.startsWith("já ") || l.startsWith("tem ") || l.startsWith("precisa") ||
    l.includes("possui") || l.includes("precisa de") || l.includes("necessita");
  return isBinary ? ["Sim", "Não"] : [];
}

export function AIChat({ form, onPrefill }: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { id: nextId(), role: "assistant", content: pickRandom(AI_TEMPLATES.greeting), timestamp: Date.now() },
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [stage, setStage]           = useState<ConversationStage>("greeting");
  const [serviceId, setServiceId]   = useState<ServiceType | null>(null);

  const stageRef      = useRef<ConversationStage>("greeting");
  const isThinkingRef = useRef(false);
  const collected     = useRef<Partial<Lead>>({ briefingAnswers: {} });
  const hasCompanyRef = useRef<boolean | null>(null); // null = ainda não respondeu
  const onPrefillRef  = useRef(onPrefill);
  const formRef       = useRef(form);

  useEffect(() => { onPrefillRef.current = onPrefill; }, [onPrefill]);
  useEffect(() => { formRef.current = form; }, [form]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isThinking]);
  useEffect(() => { if (!isThinking) inputRef.current?.focus(); }, [isThinking]);

  const accumulate = useCallback((text: string, currentStage: ConversationStage) => {
    const t = text.trim();
    if (currentStage === "greeting" || currentStage === "askService") {
      const svc = detectService(t);
      if (svc) { collected.current.serviceType = svc; setServiceId(svc); }
    }
    if (currentStage === "askName") {
      const nome = extractName(t) || t;
      if (nome) collected.current.nome = nome;
    }
    if (currentStage === "askPhone") {
      const tel = extractPhone(t);
      if (tel) collected.current.telefone = tel;
    }
    if (currentStage === "askCompany") {
      hasCompanyRef.current = hasCompanyAnswer(t);
    }
    if (currentStage === "askCompanyName") {
      collected.current.companyName = t.slice(0, 120);
    }
    if (currentStage === "askCompanyServices") {
      collected.current.companyServices = t.slice(0, 500);
    }
    if (currentStage === "askPreference") {
      const pref = detectPreference(t);
      if (pref) collected.current.contactPreference = pref;
    }
    if (currentStage === "collectInfo") {
      const svcDef = SERVICES.find((s) => s.id === collected.current.serviceType);
      if (svcDef) {
        const answers = collected.current.briefingAnswers ?? {};
        const next = svcDef.briefingQuestions.find((q) => !answers[q.key]);
        if (next) collected.current.briefingAnswers = { ...answers, [next.key]: t };
      }
    }
  }, []);

  /** Decide o próximo stage — pula nome/serviços da empresa se usuário não tiver */
  const getNextStage = useCallback((current: ConversationStage): ConversationStage => {
    if (current === "collectInfo" && !allBriefingAnswered(collected.current)) {
      return "collectInfo";
    }
    // Pula etapas de empresa se usuário disse que não tem
    if (current === "askCompany" && hasCompanyRef.current === false) {
      return "askService";
    }
    if (current === "askCompanyName" && hasCompanyRef.current === false) {
      return "askService";
    }
    const idx = STAGE_ORDER.indexOf(current);
    return idx < STAGE_ORDER.length - 1 ? STAGE_ORDER[idx + 1] : "finalize";
  }, []);

  const sendText = useCallback(async (text: string) => {
    if (!text.trim() || isThinkingRef.current) return;
    isThinkingRef.current = true;
    setIsThinking(true);

    const currentStage = stageRef.current;

    setMessages((prev) => [
      ...prev,
      { id: nextId(), role: "user", content: text.trim(), timestamp: Date.now() },
    ]);

    accumulate(text.trim(), currentStage);

    await delay(1000 + Math.random() * 800);

    const nextStage = getNextStage(currentStage);
    stageRef.current = nextStage;
    setStage(nextStage);

    setMessages((prev) => [
      ...prev,
      { id: nextId(), role: "assistant", content: getAIReply(nextStage, collected.current), timestamp: Date.now() },
    ]);

    isThinkingRef.current = false;
    setIsThinking(false);

    if (nextStage === "finalize") {
      await delay(700);
      onPrefillRef.current({ ...formRef.current, ...collected.current });
    }
  }, [accumulate, getNextStage]);

  const handleSend = useCallback(() => {
    const text = inputValue.trim();
    if (!text) return;
    setInputValue("");
    void sendText(text);
  }, [inputValue, sendText]);

  const handleQuickReply = useCallback((text: string) => { void sendText(text); }, [sendText]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }, [handleSend]);

  const quickReplies: string[] = stage === "collectInfo"
    ? getCollectInfoReplies(collected.current)
    : (QUICK_REPLIES[stage] ?? []);

  return (
    <div className="flex flex-col flex-1">
      {/* Messages */}
      <div className="overflow-y-auto max-h-[260px] min-h-[180px] space-y-1 py-2">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} role={msg.role} content={msg.content} />
        ))}
        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-gray-700 rounded-2xl rounded-bl-sm px-4 py-3">
              <ThinkingIndicator label="Escrevendo..." />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick replies */}
      {!isThinking && stage !== "finalize" && quickReplies.length > 0 && (
        <div className="flex flex-wrap gap-1.5 py-2 border-t border-card-border">
          {quickReplies.map((reply) => (
            <button
              key={reply}
              type="button"
              onClick={() => handleQuickReply(reply)}
              className="text-xs px-3 py-1.5 rounded-full border border-green-500/40 bg-green-500/5 text-green-400 hover:bg-green-500/20 hover:border-green-400 transition-colors cursor-pointer whitespace-nowrap"
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2 pt-2 border-t border-card-border">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isThinking}
          placeholder={isThinking ? "Aguardando resposta..." : "Digite sua mensagem..."}
          className="flex-1 px-3 py-2 rounded-lg border border-card-border bg-transparent text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent transition-colors disabled:opacity-50"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={isThinking || !inputValue.trim()}
          className="px-4 py-2 rounded-lg bg-accent text-white font-semibold text-sm hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
