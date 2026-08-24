"use client";

import { X } from "lucide-react";
import { Modal } from "../ui/modal";
import { MouseGradient } from "../ui/mouse-gradient";
import { ContactForm } from "./contact-form";

interface WhatsAppContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WhatsAppContactModal({
  isOpen,
  onClose,
}: WhatsAppContactModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <MouseGradient className="rounded-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2 text-gray-900 dark:text-white flex-shrink-0">
          <h2 className="text-xl font-bold">Entrar em Contato</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable form */}
        <div className="overflow-y-auto flex-1">
          <ContactForm onClose={onClose} />
        </div>
      </MouseGradient>
    </Modal>
  );
}
