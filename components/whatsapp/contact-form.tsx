"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ContactPreference, Lead } from "@/lib/types/lead";
import { SERVICES } from "@/lib/constants/services";
import { addContactLead, getFormDraft, setFormDraft, clearFormDraft } from "@/lib/utils/storage";
import { ServiceCard } from "../ui/service-card";
import { AIChat } from "./ai-chat";

type FormMode = "manual" | "ai";

interface FormErrors {
  nome?: string;
  telefone?: string;
  contactPreference?: string;
  serviceType?: string;
}

const INITIAL_FORM: Partial<Lead> = {
  nome: "",
  telefone: "",
  contactPreference: undefined,
  serviceType: undefined,
  companyName: "",
  companyServices: "",
  briefingAnswers: {},
};

export function ContactForm({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<FormMode>("manual");
  const [form, setForm] = useState<Partial<Lead>>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [pulsingField, setPulsingField] = useState<keyof FormErrors | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submittedLead, setSubmittedLead] = useState<Lead | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Refs para scroll e foco nos campos com erro
  const nomeRef          = useRef<HTMLInputElement>(null);
  const telefoneRef      = useRef<HTMLInputElement>(null);
  const contactPrefRef   = useRef<HTMLDivElement>(null);
  const serviceTypeRef   = useRef<HTMLDivElement>(null);

  const fieldRefs: Record<keyof FormErrors, React.RefObject<HTMLElement | null>> = {
    nome:              nomeRef,
    telefone:          telefoneRef,
    contactPreference: contactPrefRef,
    serviceType:       serviceTypeRef,
  };

  // Restore draft from localStorage on mount
  useEffect(() => {
    const draft = getFormDraft();
    if (draft) {
      setForm(draft);
    }
  }, []);

  // Auto-save draft on field change (debounced 500ms)
  useEffect(() => {
    if (submitted) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      // Only save if there's something meaningful
      if (form.nome || form.telefone || form.serviceType) {
        setFormDraft(form);
      }
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [form, submitted]);

  const updateField = useCallback(
    <K extends keyof Partial<Lead>>(key: K, value: Partial<Lead>[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      // Clear error for this field
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    },
    []
  );

  const updateBriefingAnswer = useCallback(
    (key: string, value: string) => {
      setForm((prev) => ({
        ...prev,
        briefingAnswers: { ...prev.briefingAnswers, [key]: value },
      }));
    },
    []
  );

  const handlePhoneChange = useCallback(
    (value: string) => {
      // Apply Brazilian phone mask: (XX) XXXXX-XXXX
      const digits = value.replace(/\D/g, "").slice(0, 11);
      let masked = digits;
      if (digits.length > 2) {
        masked = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
      }
      if (digits.length > 7) {
        masked = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
      }
      updateField("telefone", masked);
    },
    [updateField]
  );

  const scrollToFirstError = useCallback((errs: FormErrors) => {
    const order: (keyof FormErrors)[] = ["nome", "telefone", "contactPreference", "serviceType"];
    const firstKey = order.find((k) => errs[k]);
    if (!firstKey) return;
    const ref = fieldRefs[firstKey];
    ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (firstKey === "nome") nomeRef.current?.focus();
    if (firstKey === "telefone") telefoneRef.current?.focus();
    // Pulsa 3x e remove a classe
    setPulsingField(firstKey);
    setTimeout(() => setPulsingField(null), 2200);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    const nome = (form.nome || "").trim();
    const nomeWords = nome.split(/\s+/).filter((w) => w.length >= 2);
    if (!nome || nome.length < 4) {
      newErrors.nome = "Nome é obrigatório.";
    } else if (nomeWords.length < 2) {
      newErrors.nome = "Informe seu nome completo (nome e sobrenome).";
    }

    const phoneDigits = (form.telefone || "").replace(/\D/g, "");
    if (!phoneDigits || phoneDigits.length < 10) {
      newErrors.telefone = "Telefone válido é obrigatório.";
    }

    if (!form.contactPreference) {
      newErrors.contactPreference = "Selecione uma preferência de contato.";
    }

    if (!form.serviceType) {
      newErrors.serviceType = "Selecione um tipo de serviço.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      scrollToFirstError(newErrors);
      return false;
    }
    return true;
  }, [form, scrollToFirstError]);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!validate()) return;

    const payload = {
      nome:              form.nome!.trim(),
      telefone:          form.telefone!,
      contactPreference: form.contactPreference!,
      serviceType:       form.serviceType!,
      companyName:       form.companyName || undefined,
      companyServices:   form.companyServices || undefined,
      briefingAnswers:   form.briefingAnswers || {},
    };

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/leads", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        const backendErrors = data?.errors ?? {};
        const fieldKeys: (keyof FormErrors)[] = ["nome","telefone","contactPreference","serviceType"];
        const fieldErrs: FormErrors = {};
        let hasFieldError = false;
        for (const k of fieldKeys) {
          if (typeof backendErrors[k] === "string") {
            fieldErrs[k] = backendErrors[k];
            hasFieldError = true;
          }
        }
        if (hasFieldError) {
          setErrors(fieldErrs);
          scrollToFirstError(fieldErrs);
        } else {
          const msg = Object.values(backendErrors).find((v): v is string => typeof v === "string");
          setSubmitError(msg ?? "Erro ao enviar. Tente novamente.");
        }
        return;
      }

      // Sucesso — salva localmente só para o log visual e limpa o draft
      const lead: Lead = {
        id: "",
        ...payload,
        createdAt: new Date().toISOString(),
      };
      addContactLead(lead);
      clearFormDraft();
      setSubmittedLead(lead);
      setSubmitted(true);
    } catch {
      setSubmitError("Não foi possível conectar ao servidor. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }, [form, validate]);

  const handleAiPrefill = useCallback(
    (filledData: Partial<Lead>) => {
      setForm((prev) => ({ ...prev, ...filledData }));
      setMode("manual");
    },
    []
  );

  const selectedService = SERVICES.find((s) => s.id === form.serviceType);

  if (submitted && submittedLead) {
    return (
      <div className="flex flex-col gap-6 p-6">
        {/* Thank you header */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">Obrigado, {submittedLead.nome.split(" ")[0]}!</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Briefing recebido com sucesso. Entraremos em contato em breve pelo {submittedLead.contactPreference === "phone-call" ? "telefone" : "WhatsApp"} informado.
            </p>
          </div>
        </div>

        {/* Payload log */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Payload — log do backend</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 font-bold uppercase">Preview</span>
          </div>
          <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 font-mono">POST /api/leads</span>
            </div>
            <pre className="text-xs font-mono p-4 bg-gray-950 text-green-400 overflow-x-auto whitespace-pre leading-relaxed max-h-64 overflow-y-auto">
              {JSON.stringify(submittedLead, null, 2)}
            </pre>
          </div>
        </div>

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-lg bg-green-600 text-white font-bold text-sm uppercase hover:bg-green-500 transition-colors cursor-pointer shadow-lg shadow-green-500/20"
        >
          Fechar
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 text-gray-900 dark:text-gray-100">
      {/* Mode toggle */}
      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setMode("manual")}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
            mode === "manual"
              ? "bg-green-600 text-white"
              : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          Preencher Manualmente
        </button>
        <button
          type="button"
          onClick={() => setMode("ai")}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
            mode === "ai"
              ? "bg-green-600 text-white"
              : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          Preencher com I.A
        </button>
      </div>

      {mode === "manual" ? (
        <div className="flex flex-col gap-5">
          {/* Basic fields */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Nome <span className="text-error">*</span>
              </label>
              <input
                ref={nomeRef}
                type="text"
                value={form.nome || ""}
                onChange={(e) => updateField("nome", e.target.value)}
                placeholder="Seu nome completo"
                className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                  errors.nome ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                } ${pulsingField === "nome" ? "error-pulse" : ""}`}
              />
              {errors.nome && (
                <p className="text-red-500 text-xs mt-1">{errors.nome}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Telefone <span className="text-red-500">*</span>
              </label>
              <input
                ref={telefoneRef}
                type="tel"
                value={form.telefone || ""}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="(11) 99999-9999"
                className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                  errors.telefone ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                } ${pulsingField === "telefone" ? "error-pulse" : ""}`}
              />
              {errors.telefone && (
                <p className="text-red-500 text-xs mt-1">{errors.telefone}</p>
              )}
            </div>
          </div>

          {/* Contact preference */}
          <div ref={contactPrefRef} className={pulsingField === "contactPreference" ? "error-pulse rounded-lg p-1 -m-1" : ""}>
            <label className="block text-sm font-semibold mb-2">
              Preferência de Contato <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col gap-2">
              {(
                [
                  { value: "phone-call", label: "Ligação Telefônica" },
                  { value: "whatsapp", label: "WhatsApp" },
                  { value: "both", label: "Ambos" },
                ] as { value: ContactPreference; label: string }[]
              ).map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    form.contactPreference === opt.value
                      ? "border-green-500 bg-green-50 dark:bg-green-500/10"
                      : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-transparent"
                  }`}
                >
                  <input
                    type="radio"
                    name="contactPreference"
                    value={opt.value}
                    checked={form.contactPreference === opt.value}
                    onChange={() => updateField("contactPreference", opt.value)}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      form.contactPreference === opt.value
                        ? "border-green-500"
                        : "border-gray-400 dark:border-gray-500"
                    }`}
                  >
                    {form.contactPreference === opt.value && (
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    )}
                  </div>
                  <span className="text-sm">{opt.label}</span>
                </label>
              ))}
            </div>
            {errors.contactPreference && (
              <p className="text-red-500 text-xs mt-1">{errors.contactPreference}</p>
            )}
          </div>

          {/* Company briefing (optional) */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Briefing da Empresa <span className="text-gray-500 dark:text-gray-400 text-xs">(opcional)</span>
            </label>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={form.companyName || ""}
                onChange={(e) => updateField("companyName", e.target.value)}
                placeholder="Nome da empresa"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
              />
              <input
                type="text"
                value={form.companyServices || ""}
                onChange={(e) => updateField("companyServices", e.target.value)}
                placeholder="Quais serviços sua empresa presta?"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
              />
            </div>
          </div>

          {/* Service selection */}
          <div ref={serviceTypeRef} className={pulsingField === "serviceType" ? "error-pulse rounded-lg p-1 -m-1" : ""}>
            <label className="block text-sm font-semibold mb-2">
              Tipo de Serviço <span className="text-error">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SERVICES.map((service) => (
                <ServiceCard
                  key={service.id}
                  id={service.id}
                  label={service.label}
                  description={service.description}
                  icon={service.icon}
                  isSelected={form.serviceType === service.id}
                  onClick={() => updateField("serviceType", service.id)}
                />
              ))}
            </div>
            {errors.serviceType && (
              <p className="text-error text-xs mt-1">{errors.serviceType}</p>
            )}
          </div>

          {/* Service-specific briefing questions */}
          {selectedService && selectedService.briefingQuestions.length > 0 && (
            <div className="animate-slide-down">
              <label className="block text-sm font-semibold mb-2">
                Detalhes do Serviço — {selectedService.label}
              </label>
              <div className="flex flex-col gap-3">
                {selectedService.briefingQuestions.map((q) => (
                  <div key={q.key}>
                    <label className="block text-xs text-muted mb-1">
                      {q.label}{" "}
                      {!q.required && (
                        <span className="text-muted">(opcional)</span>
                      )}
                    </label>
                    <input
                      type="text"
                      value={form.briefingAnswers?.[q.key] || ""}
                      onChange={(e) => updateBriefingAnswer(q.key, e.target.value)}
                      placeholder={q.label}
                      className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                        q.required && !form.briefingAnswers?.[q.key]
                          ? "border-gray-300 dark:border-gray-700"
                          : "border-gray-300 dark:border-gray-700"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit error */}
          {submitError && (
            <p className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg px-4 py-2">
              {submitError}
            </p>
          )}

          {/* Submit button */}
          <button
            type="button"
            onClick={() => { void handleSubmit(); }}
            disabled={isSubmitting}
            className="w-full py-3 mt-4 rounded-lg bg-green-600 text-white font-bold text-sm uppercase hover:bg-green-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-lg shadow-green-500/20"
          >
            {isSubmitting ? "Enviando..." : "Enviar Briefing"}
          </button>
        </div>
      ) : (
        <div className="min-h-[400px] flex flex-col">
          <AIChat
            form={form}
            onPrefill={handleAiPrefill}
            selectedServiceId={form.serviceType || null}
          />
        </div>
      )}
    </div>
  );
}
