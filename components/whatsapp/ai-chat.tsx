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
  | "askCompany"
  | "askService"
  | "askPreference"
  | "collectInfo"
  | "finalize";

const STAGE_ORDER: ConversationStage[] = [
  "greeting", "askName", "askPhone", "askCompany",
  "askService", "askPreference", "collectInfo", "finalize",
];

const QUICK_REPLIES: Partial<Record<ConversationStage, string[]>> = {
  greeting:      ["Quero uma Landing Page", "Preciso de um Site Institucional", "Quero um Sistema Próprio", "Preciso de um Marketplace", "Busco Freelancer", "Preciso de Suporte T.I"],
  askCompany:    ["Sim, tenho empresa", "Não tenho empresa"],
  askService:    ["Landing Page", "Site Institucional", "Sistema Próprio", "Marketplace", "Freelance", "Serviços de T.I", "Outro"],
  askPreference: ["WhatsApp", "Ligação Telefônica", "Ambos"],
};

const AI_COMPANY_Q = [
  "Você representa uma empresa? Se sim, qual o nome e o que ela faz?",
  "Tem empresa? Me conta o nome e o segmento que ela atua!",
  "É pra pessoa física ou tem empresa? Se tiver, qual o nome e ramo?",
];

function pickRandom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}
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
  if (l.includes("landing"))                               return "landing-page";
  if (l.includes("institucional"))                         return "institutional-site";
  if (l.includes("sistema") || l.includes("próprio"))      return "custom-system";
  if (l.includes("marketplace"))                           return "marketplace";
  if (l.includes("freelance") || l.includes("freela"))     return "freelance";
  if (l.includes("t.i") || l.includes("suporte") || l.includes("manutenção")) return "it-services";
  if (l.includes("outro"))                                 return "other";
  return null;
}

function detectPreference(text: string): Lead["contactPreference"] | null {
  const l = text.toLowerCase();
  if (l.includes("ligação") || l.includes("telefone")) return "phone-call";
  if (l.includes("whatsapp"))                          return "whatsapp";
  if (l.includes("ambos") || l.includes("tanto faz")) return "both";
  return null;
}

function getAIReply(stage: ConversationStage): string {
  switch (stage) {
    case "askName":       return pickRandom(AI_TEMPLATES.askName);
    case "askPhone":      return pickRandom(AI_TEMPLATES.askPhone);
    case "askCompany":    return pickRandom(AI_COMPANY_Q);
    case "askService":    return pickRandom(AI_TEMPLATES.askService);
    case "askPreference": return pickRandom(AI_TEMPLATES.askPreference);
    case "collectInfo":   return pickRandom(AI_TEMPLATES.collectInfo);
    case "finalize":      return pickRandom(AI_TEMPLATES.finalize);
    default:              return pickRandom(AI_TEMPLATES.collectInfo);
  }
}

export function AIChat({ form, onPrefill }: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { id: nextId(), role: "assistant", content: pickRandom(AI_TEMPLATES.greeting), timestamp: Date.now() },
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [stage, setStage]           = useState<ConversationStage>("greeting");
  const [serviceId, setServiceId]   = useState<ServiceType | null>(null);

  // Refs que sempre têm o valor atual — evitam stale closure em qualquer callback
  const stageRef      = useRef<ConversationStage>("greeting");
  const isThinkingRef = useRef(false);
  const collected     = useRef<Partial<Lead>>({ briefingAnswers: {} });
  const serviceIdRef  = useRef<ServiceType | null>(null);
  const onPrefillRef  = useRef(onPrefill);
  const formRef       = useRef(form);

  // Mantém refs sincronizados com props/state
  useEffect(() => { onPrefillRef.current = onPrefill; }, [onPrefill]);
  useEffect(() => { formRef.current = form; }, [form]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  useEffect(() => {
    if (!isThinking) inputRef.current?.focus();
  }, [isThinking]);

  /** Acumula dado do usuário para o stage atual — usa stageRef (sempre atual) */
  const accumulate = useCallback((text: string, currentStage: ConversationStage) => {
    const t = text.trim();

    if (currentStage === "greeting" || currentStage === "askService") {
      const svc = detectService(t);
      if (svc) { collected.current.serviceType = svc; serviceIdRef.current = svc; setServiceId(svc); }
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
      const lower = t.toLowerCase();
      if (!lower.includes("não") && !lower.includes("nao") && !lower.includes("pessoa física")) {
        // Tenta extrair nome da empresa do texto
        const match = t.match(/(?:chama[- ]se?|é a?|nome[: ]+|empresa[: ]+|sim[,. ]+)(.+)/i);
        const companyName = (match ? match[1] : t).trim().slice(0, 120);
        if (companyName) collected.current.companyName = companyName;
      }
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

  /** Núcleo de envio — recebe texto diretamente, não depende de inputValue */
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

    await delay(1100 + Math.random() * 900);

    const idx = STAGE_ORDER.indexOf(currentStage);
    const nextStage: ConversationStage =
      idx < STAGE_ORDER.length - 1 ? STAGE_ORDER[idx + 1] : "finalize";

    stageRef.current = nextStage;
    setStage(nextStage);

    setMessages((prev) => [
      ...prev,
      { id: nextId(), role: "assistant", content: getAIReply(nextStage), timestamp: Date.now() },
    ]);

    isThinkingRef.current = false;
    setIsThinking(false);

    if (nextStage === "finalize") {
      await delay(700);
      onPrefillRef.current({ ...formRef.current, ...collected.current });
    }
  }, [accumulate]);

  const handleSend = useCallback(() => {
    const text = inputValue.trim();
    if (!text) return;
    setInputValue("");
    void sendText(text);
  }, [inputValue, sendText]);

  const handleQuickReply = useCallback((text: string) => {
    void sendText(text);
  }, [sendText]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }, [handleSend]);

  // Quick replies dinâmicos para o stage atual
  const quickReplies: string[] = (() => {
    if (stage === "collectInfo" && serviceId) {
      const svc = SERVICES.find((s) => s.id === serviceId);
      const answered = collected.current.briefingAnswers ?? {};
      return svc?.briefingQuestions.filter((q) => !answered[q.key]).map((q) => q.label) ?? [];
    }
    return QUICK_REPLIES[stage] ?? [];
  })();

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
