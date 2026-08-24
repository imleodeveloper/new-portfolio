"use client";

import { createContext, useCallback, useState } from "react";
import dynamic from "next/dynamic";

const WhatsAppContactModal = dynamic(
  () => import("../../../components/whatsapp/whatsapp-contact-modal").then((m) => ({ default: m.WhatsAppContactModal })),
  { ssr: false }
);

interface WhatsAppModalContextValue {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const WhatsAppModalContext = createContext<WhatsAppModalContextValue>({
  isOpen: false,
  openModal: () => {},
  closeModal: () => {},
});

export function WhatsAppModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <WhatsAppModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
      <WhatsAppContactModal isOpen={isOpen} onClose={closeModal} />
    </WhatsAppModalContext.Provider>
  );
}
