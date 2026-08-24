"use client";

import { MessageCirclePlus } from "lucide-react";
import { useWhatsAppModal } from "@/lib/hooks/use-whatsapp-modal";
import { WhatsAppIcon } from "./whatsapp-icon";

interface WhatsAppButtonProps {
  children?: React.ReactNode;
  variant?: "icon-only" | "full";
  className?: string;
}

export function WhatsAppButton({
  children,
  variant = "full",
  className = "",
}: WhatsAppButtonProps) {
  const { openModal } = useWhatsAppModal();

  if (variant === "icon-only") {
    return (
      <button
        type="button"
        onClick={openModal}
        className={`h-full flex flex-col relative justify-center items-center gap-1 text-black bg-green-600 hover:bg-green-300 cursor-pointer overflow-hidden animate-shine ${className}`}
      >
        <WhatsAppIcon className="h-8 w-8 relative z-[1]" />
        <span className="text-xs italic font-semibold relative z-[1]">WhatsApp</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={openModal}
      className={`flex justify-center items-center p-4 text-base/4 bg-green-600 cursor-pointer hover:bg-green-300 animate-shine ${className}`}
    >
      {children || (
        <>
          <MessageCirclePlus className="w-5 h-5 mr-2 relative z-[1]" />
          <span className="text-center font-bold uppercase text-black relative z-[1]">
            Contatar <br />
            Agora
          </span>
        </>
      )}
    </button>
  );
}
