export type ServiceType =
  | "landing-page"
  | "institutional-site"
  | "custom-system"
  | "marketplace"
  | "freelance"
  | "it-services"
  | "other";

export type ContactPreference = "phone-call" | "whatsapp" | "both";

export interface LeadPayload {
  nome:              string;
  telefone:          string;
  contactPreference: ContactPreference;
  serviceType:       ServiceType;
  companyName?:      string;
  companyServices?:  string;
  briefingAnswers:   Record<string, string>;
}

export interface ValidationResult {
  ok:      boolean;
  errors:  Record<string, string>;
  cleaned: LeadPayload | null;
}

const VALID_CONTACT_PREFS = new Set<ContactPreference>(["phone-call", "whatsapp", "both"]);
const VALID_SERVICE_TYPES  = new Set<ServiceType>([
  "landing-page", "institutional-site", "custom-system",
  "marketplace", "freelance", "it-services", "other",
]);

// DDDs válidos no Brasil (Anatel)
const VALID_DDDS = new Set([
  11,12,13,14,15,16,17,18,19,
  21,22,24,27,28,
  31,32,33,34,35,37,38,
  41,42,43,44,45,46,47,48,49,
  51,53,54,55,
  61,62,63,64,65,66,67,68,69,
  71,73,74,75,77,79,
  81,82,83,84,85,86,87,88,89,
  91,92,93,94,95,96,97,98,99,
]);

export function validatePhone(raw: string): { digits: string; error?: string } {
  const digits = raw.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 11)
    return { digits, error: "Telefone inválido. Informe DDD + número (10 ou 11 dígitos)." };
  const ddd = Number(digits.slice(0, 2));
  if (!VALID_DDDS.has(ddd))
    return { digits, error: "DDD inválido." };
  if (digits.length === 11 && digits[2] !== "9")
    return { digits, error: "Número de celular inválido (deve começar com 9 após o DDD)." };
  return { digits };
}

/** Pelo menos dois tokens com 2+ chars — rejeita "João" sem sobrenome */
export function isFullName(name: string): boolean {
  return name.trim().split(/\s+/).filter((p) => p.length >= 2).length >= 2;
}

/** Normaliza nome de empresa para comparação de duplicidade */
export function normalizeCompanyName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, "");
}

function trimStr(v: unknown, max: number): string | undefined {
  if (typeof v !== "string") return undefined;
  return v.trim().slice(0, max) || undefined;
}

export function validateLeadPayload(body: unknown): ValidationResult {
  const errors: Record<string, string> = {};
  if (typeof body !== "object" || body === null)
    return { ok: false, errors: { _body: "Payload inválido." }, cleaned: null };

  const b = body as Record<string, unknown>;

  const nome = trimStr(b.nome, 120) ?? "";
  if (!nome || nome.length < 4)          errors.nome = "Nome é obrigatório (mín. 4 caracteres).";
  else if (!isFullName(nome))            errors.nome = "Informe seu nome completo (nome e sobrenome).";

  const rawTelefone = trimStr(b.telefone, 20) ?? "";
  const phone = validatePhone(rawTelefone);
  if (phone.error)                       errors.telefone = phone.error;

  const contactPreference = b.contactPreference as ContactPreference;
  if (!VALID_CONTACT_PREFS.has(contactPreference))
    errors.contactPreference = "Preferência de contato inválida.";

  const serviceType = b.serviceType as ServiceType;
  if (!VALID_SERVICE_TYPES.has(serviceType))
    errors.serviceType = "Tipo de serviço inválido.";

  const companyName     = trimStr(b.companyName, 120);
  const companyServices = trimStr(b.companyServices, 500);

  let briefingAnswers: Record<string, string> = {};
  if (typeof b.briefingAnswers === "object" && b.briefingAnswers !== null) {
    for (const [k, v] of Object.entries(b.briefingAnswers as Record<string, unknown>)) {
      if (typeof v === "string" && k.length <= 80 && v.trim())
        briefingAnswers[k.slice(0, 80)] = v.trim().slice(0, 1000);
    }
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors, cleaned: null };

  return {
    ok: true,
    errors: {},
    cleaned: { nome, telefone: phone.digits, contactPreference, serviceType, companyName, companyServices, briefingAnswers },
  };
}
