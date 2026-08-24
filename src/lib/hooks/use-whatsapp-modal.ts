"use client";

import { useContext } from "react";
import { WhatsAppModalContext } from "../contexts/whatsapp-modal-context";

export function useWhatsAppModal() {
  const context = useContext(WhatsAppModalContext);
  return context;
}
