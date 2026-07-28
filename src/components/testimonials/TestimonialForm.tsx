"use client";

import { useState, useTransition } from "react";
import { MessageSquarePlus, X, Send, CheckCircle2 } from "lucide-react";
import { submitTestimonial } from "@/app/[locale]/testimonials/actions";
import type { Locale } from "@/i18n/config";

export default function TestimonialForm({ locale }: { locale: Locale }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success?: boolean; error?: string; message?: string } | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("locale", locale);

    startTransition(async () => {
      const response = await submitTestimonial(null, formData);
      setResult(response);
      if (response.success) {
        setTimeout(() => {
          setIsOpen(false);
          setResult(null);
        }, 3000);
      }
    });
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2 rounded-full bg-accent px-5 py-3 font-mono text-xs font-bold uppercase tracking-widest text-text-on-accent shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <MessageSquarePlus className="size-5" />
        <span className="hidden sm:inline">
          {locale === "fr" ? "Laisser un avis" : "Leave a review"}
        </span>
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative w-full max-w-lg overflow-hidden rounded-md border border-border bg-surface shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border bg-surface-raised px-6 py-4">
              <h3 className="font-display text-xl font-semibold text-text-primary">
                {locale === "fr" ? "Votre avis compte" : "Your feedback matters"}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-sm text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-6">
              {result?.success ? (
                <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in">
                  <CheckCircle2 className="size-16 text-success mb-4" />
                  <p className="text-lg font-medium text-text-primary">{result.message}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="grid gap-5">
                  {result?.error && (
                    <div className="rounded-sm border border-danger/50 bg-danger/10 px-4 py-3 text-sm text-danger">
                      {result.error}
                    </div>
                  )}

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <label htmlFor="firstName" className="font-mono text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                        {locale === "fr" ? "Prénom *" : "First Name *"}
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        className="rounded-sm border border-border bg-surface-deep px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="lastName" className="font-mono text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                        {locale === "fr" ? "Nom *" : "Last Name *"}
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                        className="rounded-sm border border-border bg-surface-deep px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <label htmlFor="role" className="font-mono text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                        {locale === "fr" ? "Rôle / Profession" : "Role / Profession"}
                      </label>
                      <input
                        type="text"
                        id="role"
                        name="role"
                        placeholder={locale === "fr" ? "ex: Professeur, Développeur..." : "e.g. Professor, Developer..."}
                        className="rounded-sm border border-border bg-surface-deep px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="company" className="font-mono text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                        {locale === "fr" ? "Entreprise / École" : "Company / School"}
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        className="rounded-sm border border-border bg-surface-deep px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="message" className="font-mono text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                      {locale === "fr" ? "Votre avis *" : "Your Review *"}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      className="resize-none rounded-sm border border-border bg-surface-deep px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="button-primary mt-2 flex w-full items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isPending ? (
                      <span className="size-4 animate-spin rounded-full border-2 border-text-on-accent border-r-transparent" />
                    ) : (
                      <Send className="size-4" />
                    )}
                    {locale === "fr" ? "Envoyer l'avis" : "Submit Review"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
