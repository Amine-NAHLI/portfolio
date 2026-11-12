"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { CheckCircle2, LoaderCircle, Send, ShieldCheck } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { trackAnalyticsEvent } from "@/components/analytics/PrivacyAnalytics";

const labels = {
  fr: {
    eyebrow: "Canal de communication direct",
    title: "Envoyer un message",
    description:
      "Le message est enregistré de façon sécurisée dans l'espace d'administration et une notification est immédiatement transmise à Amine.",
    name: "Votre Nom",
    namePlaceholder: "Ex: Alex Martin",
    email: "Adresse e-mail",
    emailPlaceholder: "alex.martin@example.com",
    subject: "Objet du message",
    subjectPlaceholder: "Proposition de stage, projet d'ingénierie, audit...",
    message: "Message détaillé",
    messagePlaceholder: "Présentez brièvement vos besoins, contraintes techniques ou calendrier...",
    submit: "Envoyer le message",
    sending: "Envoi en cours…",
    success: "Message transmis avec succès ! Amine vous répondra dans les plus brefs délais.",
    genericError: "Le message n'a pas pu être transmis. Vous pouvez contacter Amine directement par e-mail.",
    privacy: "Protection anti-spam chiffrée sans cookie. Vos données restent strictement confidentielles.",
  },
  en: {
    eyebrow: "Direct communication channel",
    title: "Send a message",
    description:
      "Your message is recorded securely in the administration system and an instant notification is routed directly to Amine.",
    name: "Your Name",
    namePlaceholder: "e.g. Alex Martin",
    email: "Email address",
    emailPlaceholder: "alex.martin@example.com",
    subject: "Subject",
    subjectPlaceholder: "Engineering opportunity, internship, security audit...",
    message: "Detailed Message",
    messagePlaceholder: "Briefly outline your project requirements, technical scope or timeline...",
    submit: "Send message",
    sending: "Transmitting…",
    success: "Message successfully transmitted! Amine will get back to you shortly.",
    genericError: "Could not send the message. Please feel free to reach out via direct email.",
    privacy: "Encrypted cookie-free spam protection. Your data remains strictly confidential.",
  },
} as const;

export function ContactForm({ locale }: { locale: Locale }) {
  const copy = labels[locale];
  const startedAt = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setSuccess(false);
    setNotice(null);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
      website: formData.get("website"),
      locale,
      startedAt: startedAt.current,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { error?: string; message?: string; notification?: "sent" | "not_sent" };
      if (!response.ok) throw new Error(result.error ?? copy.genericError);

      formRef.current?.reset();
      startedAt.current = Date.now();
      setSuccess(true);
      if (result.notification === "not_sent") setNotice(result.message ?? copy.genericError);
      trackAnalyticsEvent("contact_submit", locale);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : copy.genericError);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      aria-labelledby="contact-form-title"
      className="relative overflow-hidden rounded-3xl border border-border-strong bg-surface p-5 sm:p-7 shadow-2xl backdrop-blur-2xl"
    >
      {/* Subtle ambient light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-10%] top-0 h-[360px] w-[360px] rounded-full bg-accent/8 blur-[110px]"
      />

      <div className="relative z-10">
        <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-accent mb-1.5 block">
          {copy.eyebrow}
        </span>
        <h2 id="contact-form-title" className="font-display text-xl sm:text-2xl font-bold tracking-tight text-text-primary mb-1.5">
          {copy.title}
        </h2>
        <p className="text-xs sm:text-sm leading-relaxed text-text-secondary mb-5 max-w-lg">
          {copy.description}
        </p>

        <form ref={formRef} onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono font-semibold text-text-primary/90 uppercase tracking-wider">
                {copy.name} <span className="text-accent">*</span>
              </label>
              <input
                name="name"
                autoComplete="name"
                required
                minLength={2}
                maxLength={100}
                placeholder={copy.namePlaceholder}
                className="w-full rounded-xl border border-border-strong bg-bg-page px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none transition-all"
              />
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono font-semibold text-text-primary/90 uppercase tracking-wider">
                {copy.email} <span className="text-accent">*</span>
              </label>
              <input
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                minLength={5}
                maxLength={254}
                placeholder={copy.emailPlaceholder}
                className="w-full rounded-xl border border-border-strong bg-bg-page px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Subject Input */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono font-semibold text-text-primary/90 uppercase tracking-wider">
              {copy.subject} <span className="text-accent">*</span>
            </label>
            <input
              name="subject"
              required
              minLength={3}
              maxLength={160}
              placeholder={copy.subjectPlaceholder}
              className="w-full rounded-xl border border-border-strong bg-bg-page px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none transition-all"
            />
          </div>

          {/* Message Input */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono font-semibold text-text-primary/90 uppercase tracking-wider">
              {copy.message} <span className="text-accent">*</span>
            </label>
            <textarea
              name="message"
              required
              minLength={15}
              maxLength={5000}
              rows={3}
              placeholder={copy.messagePlaceholder}
              className="w-full resize-y min-h-[82px] rounded-xl border border-border-strong bg-bg-page px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none transition-all"
            />
          </div>

          {/* Honeypot field for bot protection */}
          <label className="absolute -left-[10000px] top-auto size-px overflow-hidden" aria-hidden="true">
            Website<input name="website" tabIndex={-1} autoComplete="off" />
          </label>

          {/* Alerts / Feedback */}
          {error && (
            <p className="rounded-xl border border-danger/35 bg-danger/10 p-4 text-xs font-medium text-danger" role="alert">
              {error}
            </p>
          )}
          {success && (
            <p className="flex items-center gap-2.5 rounded-xl border border-success/35 bg-success/10 p-4 text-xs font-medium text-success" role="status">
              <CheckCircle2 className="size-4 shrink-0 text-success" />
              <span>{copy.success}</span>
            </p>
          )}
          {notice && (
            <p className="rounded-xl border border-warning/35 bg-warning/10 p-4 text-xs font-medium text-warning" role="status">
              {notice}
            </p>
          )}

          {/* Footer Controls */}
          <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2.5 whitespace-nowrap shrink-0 rounded-full bg-accent px-7 py-3 font-mono text-xs font-bold text-text-on-accent hover:bg-accent-hover transition-all hover:scale-[1.02] shadow-lg shadow-accent/25 cursor-pointer disabled:opacity-50"
            >
              {submitting ? <LoaderCircle className="size-4 animate-spin" /> : <Send className="size-4" />}
              <span>{submitting ? copy.sending : copy.submit}</span>
            </button>

            <div className="flex items-center gap-2 text-[11px] text-text-secondary">
              <ShieldCheck className="size-4 text-accent shrink-0" />
              <span className="leading-snug">{copy.privacy}</span>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
