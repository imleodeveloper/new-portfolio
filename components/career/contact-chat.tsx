"use client";

import { useState, useRef, useEffect } from "react";
import { ExternalLink, Mail, Mic, MicOff, Phone, Send, Sparkles } from "lucide-react";

// ─── BRAND SVG ICONS ─────────────────────────────────────────────────────────

type IconProps = { className?: string; style?: React.CSSProperties };

function WhatsAppSVG({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 448 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M380.9 97.1c-41.9-42-97.7-65.1-157-65.1-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480 117.7 449.1c32.4 17.7 68.9 27 106.1 27l.1 0c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3 18.6-68.1-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1s56.2 81.2 56.1 130.5c0 101.8-84.9 184.6-186.6 184.6zM325.1 300.5c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8s-14.3 18-17.6 21.8c-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7s-12.5-30.1-17.1-41.2c-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2s-9.7 1.4-14.8 6.9c-5.1 5.6-19.4 19-19.4 46.3s19.9 53.7 22.6 57.4c2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4s4.6-24.1 3.2-26.4c-1.3-2.5-5-3.9-10.5-6.6z"/>
    </svg>
  );
}

function LinkedInSVG({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function GitHubSVG({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  );
}

function VierCaLogo({ className }: IconProps) {
  return (
    <img src="/ViercaTech-Sfundo.png" alt="VierCa Tech" className={className} style={{ objectFit: "contain" }} />
  );
}

function OrbisLogo({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/>
      <ellipse cx="12" cy="12" rx="4.5" ry="10" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="4.5" y1="6" x2="19.5" y2="6" stroke="currentColor" strokeWidth="1.2"/>
      <line x1="4.5" y1="18" x2="19.5" y2="18" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  );
}

// ─── TYPES ───────────────────────────────────────────────────────────────────

type CardIcon = React.ComponentType<IconProps>;

type ContactCardData = {
  key: string;
  Icon: CardIcon;
  label: string;
  value: string;
  href: string;
  color: string;
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  cards?: ContactCardData[];
  isStreaming?: boolean;
};

// ─── DATA ────────────────────────────────────────────────────────────────────

const CONTACT_CARDS: Record<string, ContactCardData> = {
  email:    { key: "email",    Icon: Mail,        label: "E-mail",              value: "imleodeveloper@gmail.com",           href: "mailto:imleodeveloper@gmail.com",            color: "#1e90ff" },
  phone:    { key: "phone",    Icon: Phone,       label: "Telefone",            value: "(11) 96738-1402",                    href: "tel:+5511967381402",                        color: "#10b981" },
  whatsapp: { key: "whatsapp", Icon: WhatsAppSVG, label: "WhatsApp",            value: "(11) 96738-1402",                    href: "https://wa.me/5511967381402",               color: "#25d366" },
  github:   { key: "github",   Icon: GitHubSVG,   label: "GitHub",              value: "Leonardo-Vieira-Dev",                href: "https://github.com/Leonardo-Vieira-Dev",    color: "#6366f1" },
  linkedin: { key: "linkedin", Icon: LinkedInSVG, label: "LinkedIn",            value: "leonardovieiradev",                  href: "https://linkedin.com/in/leonardovieiradev/", color: "#0a66c2" },
  vierca:   { key: "vierca",   Icon: VierCaLogo,  label: "VierCa Tech",         value: "viercatech.com.br",                  href: "https://viercatech.com.br",                 color: "#f59e0b" },
  orbis:    { key: "orbis",    Icon: OrbisLogo,   label: "Group Orbis Digital", value: "grouporbis.com.br",                  href: "https://grouporbis.com.br",                 color: "#8b5cf6" },
};

const QUICK_REPLIES = [
  { label: "E-mail",      Icon: Mail,        message: "Qual é o seu e-mail de contato?",       cardKey: "email",    color: "#1e90ff" },
  { label: "Telefone",    Icon: Phone,       message: "Qual é o seu telefone?",                 cardKey: "phone",    color: "#10b981" },
  { label: "WhatsApp",    Icon: WhatsAppSVG, message: "Quero entrar em contato pelo WhatsApp",  cardKey: "whatsapp", color: "#25d366" },
  { label: "GitHub",      Icon: GitHubSVG,   message: "Quero ver o seu perfil no GitHub",       cardKey: "github",   color: "#6366f1" },
  { label: "LinkedIn",    Icon: LinkedInSVG, message: "Quero ver o seu LinkedIn",               cardKey: "linkedin", color: "#0a66c2" },
  { label: "VierCa Tech", Icon: VierCaLogo,  message: "Quero conhecer a VierCa Tech",           cardKey: "vierca",   color: "#f59e0b" },
  { label: "Group Orbis", Icon: OrbisLogo,   message: "Me conte sobre o Group Orbis Digital",   cardKey: "orbis",    color: "#8b5cf6" },
];

const WELCOME: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content: "Olá! 👋 Sou o VierBot, assistente de Leonardo Vieira. Posso te apresentar os serviços, projetos e formas de contato dele. Use os atalhos abaixo ou me faça qualquer pergunta!",
};

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

function BotAvatar({ size = "sm" }: { size?: "sm" | "md" }) {
  const px = size === "md" ? "w-10 h-10" : "w-8 h-8";
  return (
    <img
      src="/vierbot.webp"
      alt="VierBot"
      className={`${px} object-cover flex-shrink-0`}
      style={{ borderRadius: 0 }}
    />
  );
}

function TypingDots() {
  return (
    <div className="flex items-end gap-2">
      <BotAvatar size="sm" />
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-bl-sm px-4 py-3.5 shadow-sm">
        <div className="flex gap-1.5 items-center h-4">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-blue-400"
              style={{
                animation: "bounce 0.8s ease-in-out infinite",
                animationDelay: `${i * 0.18}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniCard({ card }: { card: ContactCardData }) {
  return (
    <a
      href={card.href}
      target={card.href.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      className="group flex items-center gap-3 p-2.5 rounded-xl border transition-all duration-200 hover:scale-[1.02] hover:shadow-sm bg-white dark:bg-gray-900 overflow-hidden"
      style={{ borderColor: card.color + "50" }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: card.color + "18" }}
      >
        <card.Icon className="w-4 h-4" style={{ color: card.color }} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: card.color }}>
          {card.label}
        </p>
        <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{card.value}</p>
      </div>
      <ExternalLink className="w-3 h-3 text-gray-300 group-hover:text-gray-400 transition-colors flex-shrink-0" />
    </a>
  );
}

// Renders a subset of Markdown: **bold**, *italic*, [link](url), line breaks.
// Used only for assistant messages — user messages are plain text.
function renderMarkdown(text: string): React.ReactNode[] {
  // Split into lines first to handle \n as <br/>
  const lines = text.split("\n");
  const nodes: React.ReactNode[] = [];

  lines.forEach((line, li) => {
    if (li > 0) nodes.push(<br key={`br-${li}`} />);

    // Tokenise inline: **bold**, *italic*, [label](url)
    const pattern = /(\*\*(.+?)\*\*|\*(.+?)\*|_(.+?)_|\[([^\]]+)\]\((https?:\/\/[^\)]+)\))/g;
    let last = 0;
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(line)) !== null) {
      if (match.index > last) {
        nodes.push(line.slice(last, match.index));
      }
      if (match[2] !== undefined) {
        nodes.push(<strong key={`${li}-${match.index}`}>{match[2]}</strong>);
      } else if (match[3] !== undefined) {
        nodes.push(<em key={`${li}-${match.index}`}>{match[3]}</em>);
      } else if (match[4] !== undefined) {
        nodes.push(<em key={`${li}-${match.index}`}>{match[4]}</em>);
      } else if (match[5] !== undefined) {
        nodes.push(
          <a key={`${li}-${match.index}`} href={match[6]} target="_blank" rel="noopener noreferrer"
            className="underline underline-offset-2 hover:opacity-80 transition-opacity">
            {match[5]}
          </a>
        );
      }
      last = match.index + match[0].length;
    }

    if (last < line.length) nodes.push(line.slice(last));
  });

  return nodes;
}

function Bubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";
  return (
    <div
      className={`flex items-end gap-2 ${isUser ? "flex-row-reverse ml-auto" : "mr-auto"}`}
      style={{ maxWidth: "82%" }}
    >
      {!isUser && <BotAvatar size="sm" />}
      <div className="flex flex-col gap-2 min-w-0">
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm break-words ${
            isUser
              ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-sm"
              : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-sm"
          }`}
        >
          {isUser ? msg.content : renderMarkdown(msg.content)}
          {msg.isStreaming && (
            <span
              className="inline-block w-0.5 h-3.5 bg-current ml-0.5 align-middle"
              style={{ animation: "pulse 1s ease-in-out infinite" }}
            />
          )}
        </div>
        {msg.cards && msg.cards.length > 0 && (
          <div className="flex flex-col gap-1.5">
            {msg.cards.map(c => (
              <MiniCard key={c.key} card={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export function ContactChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<unknown>(null);
  const loadingRef = useRef(false);

  // Scroll only the inner messages container — never the page body
  useEffect(() => {
    const hasUserMessage = messages.some(m => m.role === "user");
    if (!hasUserMessage && !isLoading) return;
    const el = messagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isLoading]);

  const sendMessage = async (text: string, cardKey?: string) => {
    const trimmed = text.trim();
    if (!trimmed || loadingRef.current) return;

    loadingRef.current = true;
    const card = cardKey ? CONTACT_CARDS[cardKey] : null;
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: "user", content: trimmed };
    const assistantId = `a-${Date.now() + 1}`;

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    const history = [...messages, userMsg]
      .slice(-10)
      .map(m => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({ error: "Erro desconhecido." }));
        throw new Error(err.error || "Erro na API.");
      }

      setIsLoading(false);
      setMessages(prev => [
        ...prev,
        { id: assistantId, role: "assistant", content: "", isStreaming: true },
      ]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let content = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") break;
          try {
            const json = JSON.parse(data);
            const delta: string = json.choices?.[0]?.delta?.content ?? "";
            if (delta) {
              content += delta;
              setMessages(prev =>
                prev.map(m => (m.id === assistantId ? { ...m, content } : m))
              );
            }
          } catch {}
        }
      }

      setMessages(prev =>
        prev.map(m =>
          m.id === assistantId
            ? {
                ...m,
                content: content || "Desculpe, não consegui gerar uma resposta.",
                isStreaming: false,
                cards: card ? [card] : [],
              }
            : m
        )
      );
    } catch (err: unknown) {
      setIsLoading(false);
      const msg = err instanceof Error ? err.message : "Erro desconhecido.";
      setMessages(prev => [
        ...prev.filter(m => m.id !== assistantId),
        {
          id: assistantId,
          role: "assistant",
          content: `Ops! ${msg} Tente novamente em instantes. 😅`,
        },
      ]);
    } finally {
      loadingRef.current = false;
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      (recognitionRef.current as { stop: () => void } | null)?.stop();
      setIsRecording(false);
      return;
    }

    const SpeechRec =
      (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;

    if (!SpeechRec) {
      alert("Reconhecimento de voz não disponível neste navegador. Tente no Chrome.");
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rec = new (SpeechRec as any)();
    rec.lang = "pt-BR";
    rec.continuous = false;
    rec.interimResults = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => {
      setInput(e.results[0][0].transcript as string);
      setIsRecording(false);
      inputRef.current?.focus();
    };
    rec.onerror = () => setIsRecording(false);
    rec.onend = () => setIsRecording(false);

    recognitionRef.current = rec;
    rec.start();
    setIsRecording(true);
  };

  const isFirstMessage = messages.length === 1;

  return (
    <div
      className="w-full flex flex-col rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-md"
      style={{ height: "600px" }}
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex-shrink-0">
        <div className="relative">
          <BotAvatar size="md" />
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-950" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-gray-900 dark:text-white leading-none">VierBot</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Sparkles className="w-2.5 h-2.5 text-blue-400" />
            <span className="text-[11px] text-blue-400 font-medium">Assistente de Leonardo · Online</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-400" style={{ animation: "pulse 2s ease-in-out infinite" }} />
          <span className="text-[10px] text-gray-400 font-medium">ativo</span>
        </div>
      </div>

      {/* ── Messages ── */}
      <div ref={messagesRef} className="flex-1 min-h-0 overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50/40 dark:bg-gray-950/20">
        {messages.map(msg => (
          <Bubble key={msg.id} msg={msg} />
        ))}

        {/* Quick replies — initial large chips */}
        {isFirstMessage && (
          <div className="ml-10 flex flex-wrap gap-1.5 mt-1">
            {QUICK_REPLIES.map(r => (
              <button
                key={r.label}
                onClick={() => sendMessage(r.message, r.cardKey)}
                disabled={loadingRef.current}
                className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-800/60 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                <r.Icon className="w-3.5 h-3.5" style={{ color: r.color }} />
                {r.label}
              </button>
            ))}
          </div>
        )}

        {isLoading && <TypingDots />}
      </div>

      {/* ── Compact quick replies (after first message) ── */}
      {!isFirstMessage && (
        <div className="px-4 py-2 flex flex-wrap gap-1.5 border-t border-gray-100 dark:border-gray-800/60 flex-shrink-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
          {QUICK_REPLIES.map(r => (
            <button
              key={r.label}
              onClick={() => sendMessage(r.message, r.cardKey)}
              disabled={isLoading}
              className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
            >
              <r.Icon className="w-3 h-3" style={{ color: r.color }} />
              {r.label}
            </button>
          ))}
        </div>
      )}

      {/* ── Input ── */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex-shrink-0">
        <button
          onClick={toggleRecording}
          title={isRecording ? "Parar gravação" : "Gravar mensagem de voz"}
          className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 cursor-pointer ${
            isRecording
              ? "bg-red-500 text-white shadow-lg shadow-red-500/40"
              : "bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400"
          }`}
          style={isRecording ? { animation: "pulse 1s ease-in-out infinite" } : undefined}
        >
          {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage(input);
            }
          }}
          placeholder={isRecording ? "🎤 Ouvindo sua voz..." : "Escreva uma mensagem..."}
          disabled={isLoading || isRecording}
          className="flex-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2.5 outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500/30 transition-all disabled:opacity-60"
        />

        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isLoading}
          className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center flex-shrink-0 transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-blue-500/30 active:scale-95"
        >
          <Send className="w-4 h-4 text-white ml-0.5" />
        </button>
      </div>
    </div>
  );
}
