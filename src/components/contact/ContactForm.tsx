"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { CheckCircle2, LoaderCircle, Send } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { trackAnalyticsEvent } from "@/components/analytics/PrivacyAnalytics";

const labels = {
  fr: {
    title: "Envoyer un message", description: "Le message est stocké de façon sécurisée dans l’administration. Aucune donnée n’est transmise à un service d’e-mail.",
    name: "Nom", email: "Adresse e-mail", subject: "Objet", message: "Message", submit: "Envoyer le message", sending: "Envoi…",
    success: "Merci. Votre message a bien été enregistré.", genericError: "Le message n’a pas pu être envoyé. Vous pouvez utiliser l’adresse e-mail directe.", privacy: "Protection anti-spam sans cookie : une empreinte réseau hachée et non réversible sert uniquement à limiter les abus.",
  },
  en: {
    title: "Send a message", description: "Your message is stored securely in the administration area. No data is sent to an email service.",
    name: "Name", email: "Email address", subject: "Subject", message: "Message", submit: "Send message", sending: "Sending…",
    success: "Thank you. Your message has been saved.", genericError: "The message could not be sent. You can use the direct email address instead.", privacy: "Cookie-free spam protection: a non-reversible network fingerprint is used solely to rate-limit abuse.",
  },
} as const;

export function ContactForm({ locale }: { locale: Locale }) {
  const copy = labels[locale];
  const startedAt = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setSuccess(false);
    setError(null);
    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get("name"), email: formData.get("email"), subject: formData.get("subject"), message: formData.get("message"),
      website: formData.get("website"), locale, startedAt: startedAt.current,
    };
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json() as { error?: string; message?: string };
      if (!response.ok) throw new Error(result.error ?? copy.genericError);
      formRef.current?.reset();
      startedAt.current = Date.now();
      setSuccess(true);
      trackAnalyticsEvent("contact_submit", locale);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : copy.genericError);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section aria-labelledby="contact-form-title" className="surface-card p-6 sm:p-8">
      <h2 id="contact-form-title" className="text-2xl font-semibold">{copy.title}</h2>
      <p className="mt-2 text-sm leading-6 text-text-secondary">{copy.description}</p>
      <form ref={formRef} onSubmit={submit} className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-text-primary">{copy.name}<input name="name" autoComplete="name" required minLength={2} maxLength={100} className="min-h-12 px-4 font-normal" /></label>
        <label className="grid gap-2 text-sm font-semibold text-text-primary">{copy.email}<input name="email" type="email" inputMode="email" autoComplete="email" required minLength={5} maxLength={254} className="min-h-12 px-4 font-normal" /></label>
        <label className="grid gap-2 text-sm font-semibold text-text-primary sm:col-span-2">{copy.subject}<input name="subject" required minLength={3} maxLength={160} className="min-h-12 px-4 font-normal" /></label>
        <label className="grid gap-2 text-sm font-semibold text-text-primary sm:col-span-2">{copy.message}<textarea name="message" required minLength={20} maxLength={5000} rows={7} className="resize-y px-4 py-3 font-normal" /></label>
        <label className="absolute -left-[10000px] top-auto size-px overflow-hidden" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
        <div className="sm:col-span-2">
          {error ? <p className="mb-4 rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger" role="alert">{error}</p> : null}
          {success ? <p className="mb-4 flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 p-4 text-sm text-success" role="status"><CheckCircle2 aria-hidden="true" className="size-5" />{copy.success}</p> : null}
          <button type="submit" className="button-primary w-full sm:w-auto" disabled={submitting}>{submitting ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin motion-reduce:animate-none" /> : <Send aria-hidden="true" className="size-4" />}{submitting ? copy.sending : copy.submit}</button>
          <p className="mt-4 max-w-2xl text-xs leading-5 text-text-muted">{copy.privacy}</p>
        </div>
      </form>
    </section>
  );
}
