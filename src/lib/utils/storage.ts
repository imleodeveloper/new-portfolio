import type { Lead } from "../types/lead";

const KEYS = {
  theme: "theme",
  contactLeads: "contactLeads",
  contactFormDraft: "contactFormDraft",
} as const;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getItem<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function setItem<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota exceeded or other storage error — silently fail
  }
}

export function removeItem(key: string): void {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(key);
  } catch {
    // Silently fail
  }
}

// --- Theme ---
export type Theme = "light" | "dark";

export function getTheme(): Theme {
  return getItem<Theme>(KEYS.theme, "dark");
}

export function setTheme(theme: Theme): void {
  setItem(KEYS.theme, theme);
}

// --- Contact Leads ---
export function getContactLeads(): Lead[] {
  return getItem<Lead[]>(KEYS.contactLeads, []);
}

export function addContactLead(lead: Lead): void {
  const leads = getContactLeads();
  leads.push(lead);
  setItem(KEYS.contactLeads, leads);
}

// --- Form Draft ---
export function getFormDraft(): Partial<Lead> | null {
  return getItem<Partial<Lead> | null>(KEYS.contactFormDraft, null);
}

export function setFormDraft(draft: Partial<Lead>): void {
  setItem(KEYS.contactFormDraft, draft);
}

export function clearFormDraft(): void {
  removeItem(KEYS.contactFormDraft);
}
