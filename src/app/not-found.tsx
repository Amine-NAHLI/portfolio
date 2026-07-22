import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto grid min-h-screen max-w-2xl place-content-center px-5 py-20 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 text-3xl font-semibold text-text-primary sm:text-4xl">Page introuvable · Page not found</h1>
      <p className="mt-4 leading-7 text-text-secondary">Cette page n’existe pas ou a été déplacée. This page does not exist or has moved.</p>
      <Link href="/fr" className="button-primary mx-auto mt-8">Revenir à l’accueil · Return home</Link>
    </main>
  );
}
