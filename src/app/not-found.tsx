import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="text-center space-y-6 max-w-md">
        <p className="section-label">404 — Page Not Found</p>
        <h1 className="text-6xl md:text-7xl font-semibold tracking-tight gradient-text">
          Lost?
        </h1>
        <p className="text-text-secondary font-mono text-sm">
          This page doesn&apos;t exist or was moved somewhere else.
        </p>
        <Link
          href="/"
          className="inline-flex px-6 py-2.5 rounded-xl bg-accent-cyan text-bg font-semibold text-sm hover:-translate-y-0.5 transition-transform duration-[250ms] shadow-[0_0_24px_rgba(6,182,212,0.25)]"
        >
          Go Home
        </Link>
      </div>
    </main>
  );
}
