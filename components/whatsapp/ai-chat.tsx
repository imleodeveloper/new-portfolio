"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage, Lead, ServiceType } from "@/lib/types/lead";
import { AI_TEMPLATES } from "@/lib/constants/services";
import { ChatBubble } from "../ui/chat-bubble";
import { ThinkingIndicator } from "../ui/thinking-indicator";

interface AIChatProps {
  form: Partial<Lead>;
  onPrefill: (data: Partial<Lead>) => void;
  selectedServiceId: ServiceType | null;
}

function pickRandom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let messageId = 0;
function nextId(): string {
  return `msg_${++messageId}`;
}

// Conversation state machine
type ConversationStage =
  | "greeting"
  | "askName"
  | "askPhone"
  | "askService"
  | "askPreference"
  | "collectInfo"
  | "finalize";

export function AIChat({ form, onPrefill }: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: nextId(),
      role: "assistant",
      content: pickRandom(AI_TEMPLATES.greeting),
      timestamp: Date.now(),
    },
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [stage, setStage] = useState<ConversationStage>("greeting");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  // Focus input on mount and after each response
  useEffect(() => {
    if (!isThinking) {
      inputRef.current?.focus();
    }
  }, [isThinking]);

  const advanceStage = useCallback(
    (current: ConversationStage): ConversationStage => {
      const order: ConversationStage[] = [
        "greeting",
        "askName",
        "askPhone",
        "askService",
        "askPreference",
        "collectInfo",
        "finalize",
      ];
      const idx = order.indexOf(current);
      if (idx < order.length - 1) return order[idx + 1];
      return "finalize";
    },
    []
  );

  const extractName = useCallback((text: string): string => {
    // Simple name extraction: take first 2-3 words that aren't common words
    const words = text
      .replace(/[^\w\sÀ-ɏ]/g, "")
      .trim()
      .split(/\s+/)
      .filter(
        (w) =>
          !["meu", "minha", "nome", "sou", "chamo", "ola", "oi", "oii", "é"].includes(
            w.toLowerCase()
          )
      );
    return words.slice(0, 2).join(" ");
  }, []);

  const extractPhone = useCallback((text: string): string => {
    // Extract digits from text
    const digits = text.replace(/\D/g, "");
    if (digits.length >= 10) {
      // Apply mask
      const d = digits.slice(0, 11);
      return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    }
    return text;
  }, []);

  const detectService = useCallback((text: string): ServiceType | null => {
    const lower = text.toLowerCase();
    if (lower.includes("landing") || lower.includes("landing page")) return "landing-page";
    if (lower.includes("institucional") || lower.includes("site")) return "institutional-site";
    if (lower.includes("sistema") || lower.includes("próprio")) return "custom-system";
    if (lower.includes("marketplace")) return "marketplace";
    if (lower.includes("freelance") || lower.includes("freela")) return "freelance";
    if (lower.includes("t.i") || lower.includes("ti ") || lower.includes("suporte") || lower.includes("manutenção"))
      return "it-services";
    return null;
  }, []);

  const detectPreference = useCallback((text: string): string | null => {
    const lower = text.toLowerCase();
    if (lower.includes("ligação") || lower.includes("ligacao") || lower.includes("telefone")) return "phone-call";
    if (lower.includes("whatsapp") || lower.includes("whats")) return "whatsapp";
    if (lower.includes("ambos") || lower.includes("qualquer") || lower.includes("tanto faz")) return "both";
    return null;
  }, []);

  const buildPrefillData = useCallback(
    (text: string, currentStage: ConversationStage): Partial<Lead> => {
      const data: Partial<Lead> = {};

      if (currentStage === "askName" || stage === "askName") {
        data.nome = extractName(text) || text.trim();
      }
      if (currentStage === "askPhone" || stage === "askPhone") {
        data.telefone = extractPhone(text);
      }
      if (currentStage === "askService" || stage === "askService") {
        const svc = detectService(text);
        if (svc) data.serviceType = svc;
      }
      if (currentStage === "askPreference" || stage === "askPreference") {
        const pref = detectPreference(text);
        if (pref) data.contactPreference = pref as Lead["contactPreference"];
      }

      return data;
    },
    [stage, extractName, extractPhone, detectService, detectPreference]
  );

  const getAIResponse = useCallback(
    (userText: string, currentStage: ConversationStage): { text: string; nextStage: ConversationStage } => {
      const next = advanceStage(currentStage);

      switch (next) {
        case "askName":
          return { text: pickRandom(AI_TEMPLATES.askName), nextStage: next };
        case "askPhone":
          return { text: pickRandom(AI_TEMPLATES.askPhone), nextStage: next };
        case "askService":
          return { text: pickRandom(AI_TEMPLATES.askService), nextStage: next };
        case "askPreference":
          return { text: pickRandom(AI_TEMPLATES.askPreference), nextStage: next };
        case "collectInfo":
          return { text: pickRandom(AI_TEMPLATES.collectInfo), nextStage: next };
        case "finalize":
          return { text: pickRandom(AI_TEMPLATES.finalize), nextStage: next };
        default:
          return { text: pickRandom(AI_TEMPLATES.collectInfo), nextStage: next };
      }
    },
    [advanceStage]
  );

  const handleSend = useCallback(async () => {
    const text = inputValue.trim();
    if (!text || isThinking) return;

    setInputValue("");

    // Append user message
    const userMsg: ChatMessage = {
      id: nextId(),
      role: "user",
      content: text,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);

    // Start thinking
    setIsThinking(true);

    // Random delay 1.5-3s
    await delay(1500 + Math.random() * 1500);

    const { text: aiText, nextStage } = getAIResponse(text, stage);

    // Append AI response
    const aiMsg: ChatMessage = {
      id: nextId(),
      role: "assistant",
      content: aiText,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, aiMsg]);
    setStage(nextStage);
    setIsThinking(false);

    // If finalizing, prefill form data after a short delay
    if (nextStage === "finalize") {
      await delay(1000);
      const prefillData = buildPrefillData(text, stage);
      // Merge with existing form data
      onPrefill({ ...form, ...prefillData });
    }
  }, [inputValue, isThinking, stage, getAIResponse, buildPrefillData, form, onPrefill]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <div className="flex flex-col flex-1">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto max-h-[350px] min-h-[280px] space-y-1 py-2">
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

      {/* Input area */}
      <div className="flex gap-2 pt-3 border-t border-card-border">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isThinking}
          placeholder={
            isThinking ? "Aguardando resposta..." : "Digite sua mensagem..."
          }
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
