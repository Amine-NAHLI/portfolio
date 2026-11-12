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
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#070A09] p-7 sm:p-10 shadow-2xl backdrop-blur-2xl"
    >
      {/* Subtle ambient light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-10%] top-0 h-[400px] w-[400px] rounded-full bg-[#8FB3A2]/8 blur-[120px]"
      />

      <div className="relative z-10">
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#8FB3A2] mb-2 block">
          {copy.eyebrow}
        </span>
        <h2 id="contact-form-title" className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#f3f1f7] mb-3">
          {copy.title}
        </h2>
        <p className="text-sm leading-relaxed text-[#797681] mb-8 max-w-lg">
          {copy.description}
        </p>

        <form ref={formRef} onSubmit={submit} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Name Input */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-semibold text-[#f3f1f7]/90 uppercase tracking-wider">
                {copy.name} <span className="text-[#8FB3A2]">*</span>
              </label>
              <input
                name="name"
                autoComplete="name"
                required
                minLength={2}
                maxLength={100}
                placeholder={copy.namePlaceholder}
                className="w-full rounded-xl border border-white/10 bg-[#060605] px-4 py-3.5 text-sm text-[#f3f1f7] placeholder:text-[#797681] focus:border-[#8FB3A2] focus:ring-1 focus:ring-[#8FB3A2] focus:outline-none transition-all"
              />
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-semibold text-[#f3f1f7]/90 uppercase tracking-wider">
                {copy.email} <span className="text-[#8FB3A2]">*</span>
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
                className="w-full rounded-xl border border-white/10 bg-[#060605] px-4 py-3.5 text-sm text-[#f3f1f7] placeholder:text-[#797681] focus:border-[#8FB3A2] focus:ring-1 focus:ring-[#8FB3A2] focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Subject Input */}
          <div className="space-y-2">
            <label className="block text-xs font-mono font-semibold text-[#f3f1f7]/90 uppercase tracking-wider">
              {copy.subject} <span className="text-[#8FB3A2]">*</span>
            </label>
            <input
              name="subject"
              required
              minLength={3}
              maxLength={160}
              placeholder={copy.subjectPlaceholder}
              className="w-full rounded-xl border border-white/10 bg-[#060605] px-4 py-3.5 text-sm text-[#f3f1f7] placeholder:text-[#797681] focus:border-[#8FB3A2] focus:ring-1 focus:ring-[#8FB3A2] focus:outline-none transition-all"
            />
          </div>

          {/* Message Input */}
          <div className="space-y-2">
            <label className="block text-xs font-mono font-semibold text-[#f3f1f7]/90 uppercase tracking-wider">
              {copy.message} <span className="text-[#8FB3A2]">*</span>
            </label>
            <textarea
              name="message"
              required
              minLength={15}
              maxLength={5000}
              rows={5}
              placeholder={copy.messagePlaceholder}
              className="w-full resize-y rounded-xl border border-white/10 bg-[#060605] px-4 py-3.5 text-sm text-[#f3f1f7] placeholder:text-[#797681] focus:border-[#8FB3A2] focus:ring-1 focus:ring-[#8FB3A2] focus:outline-none transition-all"
            />
          </div>

          {/* Honeypot field for bot protection */}
          <label className="absolute -left-[10000px] top-auto size-px overflow-hidden" aria-hidden="true">
            Website<input name="website" tabIndex={-1} autoComplete="off" />
          </label>

          {/* Alerts / Feedback */}
          {error && (
            <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs font-medium text-rose-300" role="alert">
              {error}
            </p>
          )}
          {success && (
            <p className="flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-medium text-emerald-300" role="status">
              <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
              <span>{copy.success}</span>
            </p>
          )}
          {notice && (
            <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs font-medium text-amber-300" role="status">
              {notice}
            </p>
          )}

          {/* Footer Controls */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#8FB3A2] px-8 py-3.5 font-mono text-xs font-bold text-[#000000] hover:bg-[#A8C8B9] transition-all hover:scale-[1.02] shadow-lg shadow-[#8FB3A2]/25 cursor-pointer disabled:opacity-50"
            >
              {submitting ? <LoaderCircle className="size-4 animate-spin" /> : <Send className="size-4" />}
              <span>{submitting ? copy.sending : copy.submit}</span>
            </button>

            <div className="flex items-center gap-2 text-[11px] text-[#797681]">
              <ShieldCheck className="size-4 text-emerald-400 shrink-0" />
              <span className="leading-snug">{copy.privacy}</span>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
