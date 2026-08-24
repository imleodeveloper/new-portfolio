"use client";

import { useEffect, useState } from "react";
import { WhatsAppIcon } from "../ui/whatsapp-icon";

export function FloatingWhatsApp() {
  const [bubbleState, setBubbleState] = useState<"hidden" | "typing" | "message">("hidden");

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const runCycle = () => {
      setBubbleState("typing");
      
      timeoutId = setTimeout(() => {
        setBubbleState("message");
        
        timeoutId = setTimeout(() => {
          setBubbleState("hidden");
          
          timeoutId = setTimeout(() => {
            runCycle();
          }, 10000); // 10s hidden interval
        }, 5000); // 5s showing message
      }, 2000); // 2s typing
    };

    // Initial delay before first cycle
    timeoutId = setTimeout(runCycle, 2000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-end gap-2">
      {bubbleState !== "hidden" && (
        <div
          className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-xl rounded-2xl rounded-br-none p-3 px-4 border border-gray-200 dark:border-gray-700 flex items-center gap-2 max-w-[200px] animate-in fade-in slide-in-from-bottom-2 zoom-in-95 duration-300"
        >
          {bubbleState === "typing" ? (
            <div className="flex gap-1 items-center h-5">
              <span className="text-xs font-medium text-gray-500 mr-1">Digitando</span>
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          ) : (
            <span className="text-sm font-semibold">
              Fale comigo aqui! 👋
            </span>
          )}
        </div>
      )}

      <a
        href="https://wa.me/5511967381402"
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-green-500 hover:bg-green-400 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-green-500/30 transition-all duration-300 hover:-translate-y-1"
        aria-label="Abrir WhatsApp"
      >
        <WhatsAppIcon className="w-8 h-8" />
      </a>
    </div>
  );
}
