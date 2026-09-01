export type ServiceType =
  | "landing-page"
  | "institutional-site"
  | "custom-system"
  | "marketplace"
  | "freelance"
  | "it-services"
  | "other";

export type ContactPreference = "phone-call" | "whatsapp" | "both";

export interface Lead {
  id: string;
  nome: string;
  telefone: string;
  contactPreference: ContactPreference;
  serviceType: ServiceType;
  /** Nome da empresa */
  companyName?: string;
  /** Quais serviços a empresa presta */
  companyServices?: string;
  /** Service-specific briefing answers */
  briefingAnswers: Record<string, string>;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface ServiceDefinition {
  id: ServiceType;
  label: string;
  icon: string;
  description: string;
  briefingQuestions: BriefingQuestion[];
}

export interface BriefingQuestion {
  key: string;
  label: string;
  required: boolean;
}
