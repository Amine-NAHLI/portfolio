"use client";

import { useState, useTransition, useEffect } from "react";
import { createPortal } from "react-dom";
import { MessageSquarePlus, X, Send, CheckCircle2 } from "lucide-react";
import { submitTestimonial } from "@/app/[locale]/testimonials/actions";
import type { Locale } from "@/i18n/config";

export default function TestimonialForm({ locale, inline = false }: { locale: Locale; inline?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success?: boolean; error?: string; message?: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("locale", locale);

    startTransition(async () => {
      try {
        const response = await submitTestimonial(null, formData);
        setResult(response);
        if (response.success) {
          setTimeout(() => {
            setIsOpen(false);
            setResult(null);
          }, 3000);
        }
      } catch {
        setResult({ success: false, error: "Une erreur s'est produite lors de la connexion au serveur." });
      }
    });
  };

  const formContent = (
    <div className="relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-border/50 bg-surface/95 backdrop-blur-xl shadow-[0_0_50px_-12px_rgba(var(--color-accent-rgb),0.15)] animate-in zoom-in-95 duration-300">
      <div className="flex items-center justify-between border-b border-border/40 bg-surface-subtle/60 px-8 py-6">
        <h3 className="font-display text-xl sm:text-2xl font-semibold text-text-primary">
          {locale === "fr" ? "Votre avis compte" : "Your feedback matters"}
        </h3>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="rounded-full p-2.5 bg-surface-raised/50 text-text-secondary transition-all hover:bg-surface-raised hover:text-text-primary hover:scale-110 focus-visible:outline-none"
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="p-8">
        {result?.success ? (
          <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in">
            <div className="rounded-full bg-success/10 p-4 mb-5">
              <CheckCircle2 className="size-16 text-success" />
            </div>
            <p className="text-xl font-medium text-text-primary">{result.message}</p>
            <p className="text-sm text-text-secondary mt-2">Merci pour votre contribution !</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-6 text-left">
            {result?.error && (
              <div className="rounded-xl border border-danger/50 bg-danger/10 px-5 py-4 text-sm text-danger flex items-center gap-3">
                <span className="size-2 rounded-full bg-danger animate-pulse" />
                {result.error}
              </div>
            )}

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="grid gap-2.5">
                <label htmlFor="firstName" className="font-mono text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                  {locale === "fr" ? "Prénom *" : "First Name *"}
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  className="rounded-xl border border-border/60 bg-surface-deep/50 px-4 py-3 text-sm text-text-primary transition-colors focus:border-accent focus:bg-surface-deep focus:outline-none focus:ring-1 focus:ring-accent/50"
                />
              </div>
              <div className="grid gap-2.5">
                <label htmlFor="lastName" className="font-mono text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                  {locale === "fr" ? "Nom *" : "Last Name *"}
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  className="rounded-xl border border-border/60 bg-surface-deep/50 px-4 py-3 text-sm text-text-primary transition-colors focus:border-accent focus:bg-surface-deep focus:outline-none focus:ring-1 focus:ring-accent/50"
                />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="grid gap-2.5">
                <label htmlFor="role" className="font-mono text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                  {locale === "fr" ? "Rôle / Profession" : "Role / Profession"}
                </label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  placeholder={locale === "fr" ? "ex: Développeur..." : "e.g. Developer..."}
                  className="rounded-xl border border-border/60 bg-surface-deep/50 px-4 py-3 text-sm text-text-primary transition-colors focus:border-accent focus:bg-surface-deep focus:outline-none focus:ring-1 focus:ring-accent/50"
                />
              </div>
              <div className="grid gap-2.5">
                <label htmlFor="company" className="font-mono text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                  {locale === "fr" ? "Entreprise / École" : "Company / School"}
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  className="rounded-xl border border-border/60 bg-surface-deep/50 px-4 py-3 text-sm text-text-primary transition-colors focus:border-accent focus:bg-surface-deep focus:outline-none focus:ring-1 focus:ring-accent/50"
                />
              </div>
            </div>

            <div className="grid gap-2.5">
              <label htmlFor="message" className="font-mono text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                {locale === "fr" ? "Votre avis *" : "Your Review *"}
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                className="resize-none rounded-xl border border-border/60 bg-surface-deep/50 px-4 py-3 text-sm text-text-primary transition-colors focus:border-accent focus:bg-surface-deep focus:outline-none focus:ring-1 focus:ring-accent/50"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="button-primary mt-4 flex w-full items-center justify-center gap-3 py-4 text-sm rounded-xl disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isPending ? (
                <span className="size-5 animate-spin rounded-full border-2 border-text-on-accent border-r-transparent" />
              ) : (
                <Send className="size-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              )}
              {locale === "fr" ? "Envoyer l'avis" : "Submit Review"}
            </button>
          </form>
        )}
      </div>
    </div>
  );

  const portalContainer = isOpen && mounted ? createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-page/60 p-4 sm:p-6 backdrop-blur-md animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 to-transparent pointer-events-none" />
      {formContent}
    </div>,
    document.body
  ) : null;

  return (
    <>
      {inline ? (
        <div className="relative flex flex-col">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="button-primary flex w-full sm:w-auto items-center justify-center gap-2"
          >
            <MessageSquarePlus className="size-4" />
            {locale === "fr" ? "Rédiger un avis sur mon profil" : "Write a review about me"}
          </button>
          {portalContainer}
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="fixed bottom-6 left-6 z-40 flex items-center gap-2 rounded-full bg-accent px-5 py-3 font-mono text-xs font-bold uppercase tracking-widest text-text-on-accent shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <MessageSquarePlus className="size-5" />
            <span className="hidden sm:inline">
              {locale === "fr" ? "Laisser un avis" : "Leave a review"}
            </span>
          </button>
          {portalContainer}
        </>
      )}
    </>
  );
}
