"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { CheckCircle2, LoaderCircle, Send } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { trackAnalyticsEvent } from "@/components/analytics/PrivacyAnalytics";

const labels = {
  fr: {
    title: "Envoyer un message", description: "Le message est enregistré de façon sécurisée dans l’administration, puis une notification est envoyée à l’équipe du portfolio.",
    name: "Nom", email: "Adresse e-mail", subject: "Objet", message: "Message", submit: "Envoyer le message", sending: "Envoi…",
    success: "Merci. Votre message a bien été enregistré.", genericError: "Le message n’a pas pu être envoyé. Vous pouvez utiliser l’adresse e-mail directe.", privacy: "Protection anti-spam sans cookie : une empreinte réseau hachée et non réversible sert uniquement à limiter les abus.",
  },
  en: {
    title: "Send a message", description: "Your message is stored securely in the administration area, then a notification is sent to the portfolio team.",
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
      name: formData.get("name"), email: formData.get("email"), subject: formData.get("subject"), message: formData.get("message"),
      website: formData.get("website"), locale, startedAt: startedAt.current,
    };
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json() as { error?: string; message?: string; notification?: "not_sent" };
      if (!response.ok) throw new Error(result.error ?? copy.genericError);
      
      const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
      if (accessKey) {
        await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: accessKey,
            subject: `[Portfolio] ${payload.subject}`,
            name: payload.name,
            email: payload.email,
            message: payload.message,
          }),
        }).catch((e) => console.error("Web3Forms error:", e));
      }

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
    <section aria-labelledby="contact-form-title" className="p-8 sm:p-10 rounded-[2.5rem] bg-surface-subtle/30 border border-border/30 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="relative z-10">
        <p className="font-mono text-[10px] text-accent uppercase tracking-[0.2em] mb-3">{"// Secure channel"}</p>
        <h2 id="contact-form-title" className="text-3xl font-display font-bold text-text-primary mb-2">{copy.title}</h2>
        <p className="text-sm leading-relaxed text-text-secondary mb-10 max-w-md">{copy.description}</p>
        
        <form ref={formRef} onSubmit={submit} className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
          
          <div className="relative group">
            <label className="block text-xs font-mono font-semibold text-text-secondary uppercase tracking-widest mb-2 transition-colors group-focus-within:text-accent">{copy.name}</label>
            <input name="name" autoComplete="name" required minLength={2} maxLength={100} className="w-full bg-transparent border-0 border-b-2 border-border/40 pb-3 text-base text-text-primary focus:ring-0 focus:border-accent focus:outline-none transition-colors placeholder:text-text-muted/30" placeholder="John Doe" />
          </div>

          <div className="relative group">
            <label className="block text-xs font-mono font-semibold text-text-secondary uppercase tracking-widest mb-2 transition-colors group-focus-within:text-accent">{copy.email}</label>
            <input name="email" type="email" inputMode="email" autoComplete="email" required minLength={5} maxLength={254} className="w-full bg-transparent border-0 border-b-2 border-border/40 pb-3 text-base text-text-primary focus:ring-0 focus:border-accent focus:outline-none transition-colors placeholder:text-text-muted/30" placeholder="john@example.com" />
          </div>

          <div className="relative group sm:col-span-2">
            <label className="block text-xs font-mono font-semibold text-text-secondary uppercase tracking-widest mb-2 transition-colors group-focus-within:text-accent">{copy.subject}</label>
            <input name="subject" required minLength={3} maxLength={160} className="w-full bg-transparent border-0 border-b-2 border-border/40 pb-3 text-base text-text-primary focus:ring-0 focus:border-accent focus:outline-none transition-colors placeholder:text-text-muted/30" placeholder="Let's build something together" />
          </div>

          <div className="relative group sm:col-span-2">
            <label className="block text-xs font-mono font-semibold text-text-secondary uppercase tracking-widest mb-2 transition-colors group-focus-within:text-accent">{copy.message}</label>
            <textarea name="message" required minLength={20} maxLength={5000} rows={5} className="w-full resize-y bg-transparent border-0 border-b-2 border-border/40 pb-3 text-base text-text-primary focus:ring-0 focus:border-accent focus:outline-none transition-colors placeholder:text-text-muted/30" placeholder="Tell me about your project..." />
          </div>

          <label className="absolute -left-[10000px] top-auto size-px overflow-hidden" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
          
          <div className="sm:col-span-2 mt-4">
            {error ? <p className="mb-6 rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger" role="alert">{error}</p> : null}
            {success ? <p className="mb-6 flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 p-4 text-sm text-success" role="status"><CheckCircle2 aria-hidden="true" className="size-5" />{copy.success}</p> : null}
            {notice ? <p className="mb-6 rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm text-warning" role="status">{notice}</p> : null}
            
            <div className="flex items-center justify-between flex-wrap gap-4">
              <button type="submit" className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-accent px-8 py-4 font-mono text-sm font-semibold text-bg-page transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(var(--color-accent-rgb),0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50 disabled:pointer-events-none" disabled={submitting}>
                <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300 ease-out" />
                <span className="relative z-10 flex items-center gap-2">
                  {submitting ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : <Send aria-hidden="true" className="size-4" />}
                  {submitting ? copy.sending : copy.submit}
                </span>
              </button>
              
              <p className="max-w-[250px] text-[10px] uppercase tracking-wider text-text-muted/60 text-right leading-relaxed">{copy.privacy}</p>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
