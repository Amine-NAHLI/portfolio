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
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw new Error("AUTH_FAILED");

      const verification = await fetch("/api/admin/session", {
        method: "GET",
        cache: "no-store",
        headers: { Accept: "application/json" },
      });

      if (!verification.ok) {
        await supabase.auth.signOut();
        throw new Error("NOT_ALLOWED");
      }

      router.replace("/admin/dashboard");
      router.refresh();
    } catch {
      setErrorMessage(labels.error);
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <div className="grid size-12 place-items-center rounded-xl border border-border bg-surface-raised text-accent">
          <LockKeyhole aria-hidden="true" className="size-5" />
        </div>
        <h1 className="mt-6 text-3xl font-semibold text-text-primary">{labels.title}</h1>
        <p className="mt-2 text-sm leading-6 text-text-secondary">{labels.description}</p>
      </div>

      {!configured ? (
        <div className="rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm leading-6 text-warning" role="alert">
          La configuration Supabase serveur est absente. Consultez <code>.env.example</code> avant d’utiliser l’administration.
        </div>
      ) : null}

      <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
        <label className="grid gap-2 text-sm font-semibold text-text-primary">
          {labels.email}
          <span className="relative">
            <Mail aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
            <input
              type="email"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="username"
              inputMode="email"
              required
              disabled={!configured || submitting}
              className="min-h-12 pl-10 pr-4 text-sm disabled:opacity-60"
            />
          </span>
        </label>

        <label className="grid gap-2 text-sm font-semibold text-text-primary">
          {labels.password}
          <span className="relative">
            <LockKeyhole aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
            <input
              type="password"
              name="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              disabled={!configured || submitting}
              className="min-h-12 pl-10 pr-4 text-sm disabled:opacity-60"
            />
          </span>
        </label>

        {errorMessage ? <p className="rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm text-danger" role="alert">{errorMessage}</p> : null}

        <button type="submit" disabled={!configured || submitting || !email.trim() || !password} className="button-primary w-full disabled:opacity-50">
          {submitting ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin motion-reduce:animate-none" /> : null}
          {submitting ? labels.submitting : labels.submit}
        </button>
      </form>

      <Link href={`/${locale}`} className="mt-7 inline-flex min-h-11 items-center rounded-lg text-sm font-semibold text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
        {labels.home}
      </Link>
    </div>
  );
}

