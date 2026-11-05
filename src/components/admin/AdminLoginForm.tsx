"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoaderCircle, LockKeyhole, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const copy = {
  fr: {
    title: "Administration",
    description: "Connectez-vous avec le compte administrateur autorisé.",
    email: "Adresse e-mail",
    password: "Mot de passe",
    submit: "Se connecter",
    submitting: "Connexion…",
    error: "Connexion impossible. Vérifiez vos identifiants et votre autorisation.",
    home: "Retour au portfolio",
  },
  en: {
    title: "Administration",
    description: "Sign in with the authorized administrator account.",
    email: "Email address",
    password: "Password",
    submit: "Sign in",
    submitting: "Signing in…",
    error: "Sign-in failed. Check your credentials and authorization.",
    home: "Back to the portfolio",
  },
} as const;

type AdminLoginFormProps = {
  locale?: "fr" | "en";
  configured: boolean;
};

export default function AdminLoginForm({ locale = "fr", configured }: AdminLoginFormProps) {
  const router = useRouter();
  const labels = copy[locale];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!configured || submitting) return;

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
      if (error) throw new Error("AUTH_FAILED");

      // Give mobile browsers (especially WebKit) a moment to write the cookies
      // before sending the fetch request.
      await new Promise((resolve) => setTimeout(resolve, 300));

      const verification = await fetch("/api/admin/session", {
        method: "GET",
        cache: "no-store",
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (!verification.ok) {
        await supabase.auth.signOut();
        throw new Error("NOT_ALLOWED");
      }

      router.replace("/admin/dashboard");
      router.refresh();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : labels.error);
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-surface/70 p-8 sm:p-10 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute -top-20 -right-20 size-48 rounded-full bg-accent/10 blur-3xl" />
      
      <div className="mb-8 relative z-10">
        <div className="grid size-12 place-items-center rounded-2xl border border-accent/30 bg-accent/15 text-accent shadow-md shadow-accent/10">
          <LockKeyhole aria-hidden="true" className="size-6" />
        </div>
        <h1 className="mt-5 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">{labels.title}</h1>
        <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-text-secondary">{labels.description}</p>
      </div>

      {!configured ? (
        <div className="rounded-xl border border-warning/30 bg-warning/10 p-4 text-xs leading-6 text-warning" role="alert">
          La configuration Supabase serveur est absente. Consultez <code>.env.example</code> avant d’utiliser l’administration.
        </div>
      ) : null}

      <form className="mt-6 space-y-4 relative z-10" onSubmit={handleSubmit} noValidate>
        <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary">
          {labels.email}
          <span className="relative">
            <Mail aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
            <input
              type="email"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="username"
              inputMode="email"
              autoCapitalize="none"
              autoCorrect="off"
              required
              disabled={!configured || submitting}
              className="h-11 w-full rounded-xl border border-white/10 bg-bg-page/60 pl-11 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-60 transition-all"
            />
          </span>
        </label>

        <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary">
          {labels.password}
          <span className="relative">
            <LockKeyhole aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
            <input
              type="password"
              name="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              autoCapitalize="none"
              autoCorrect="off"
              required
              disabled={!configured || submitting}
              className="h-11 w-full rounded-xl border border-white/10 bg-bg-page/60 pl-11 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-60 transition-all"
            />
          </span>
        </label>

        {errorMessage ? <p className="rounded-xl border border-danger/30 bg-danger/10 p-3 text-xs font-medium text-danger" role="alert">{errorMessage}</p> : null}

        <button 
          type="submit" 
          disabled={!configured || submitting || !email.trim() || !password} 
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-accent text-xs font-semibold uppercase tracking-wider text-text-on-accent shadow-lg shadow-accent/20 transition-all hover:bg-accent-hover disabled:opacity-50 mt-2"
        >
          {submitting ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : null}
          {submitting ? labels.submitting : labels.submit}
        </button>
      </form>

      <div className="mt-6 pt-4 border-t border-white/5 text-center relative z-10">
        <Link 
          href={`/${locale}`} 
          className="inline-flex items-center text-xs font-medium text-text-secondary hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          ← {labels.home}
        </Link>
      </div>
    </div>
  );
}

