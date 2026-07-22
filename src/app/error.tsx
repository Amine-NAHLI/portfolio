"use client";

import Link from "next/link";
import { useEffect } from "react";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Unhandled application error", error);
  }, [error]);

  return (
    <main className="mx-auto grid min-h-screen max-w-2xl place-content-center px-5 py-20 text-center">
      <p className="eyebrow">Erreur · Error</p>
      <h1 className="mt-4 text-3xl font-semibold text-text-primary sm:text-4xl">Le contenu n’a pas pu être chargé.</h1>
      <p className="mt-4 leading-7 text-text-secondary">The content could not be loaded. You can try again or return home.</p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <button type="button" className="button-primary" onClick={reset}>Réessayer · Try again</button>
        <Link href="/fr" className="button-secondary">Accueil · Home</Link>
      </div>
    </main>
  );
}
