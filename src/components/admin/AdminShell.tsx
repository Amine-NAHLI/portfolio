import Link from "next/link";
import type { ReactNode } from "react";
import { ExternalLink, LogOut, ShieldCheck } from "lucide-react";
import { signOutAdmin } from "@/app/admin/(protected)/actions";

const navigation = [
  {
    label: "Vue d’ensemble",
    items: [{ href: "/admin/dashboard", label: "Tableau de bord" }],
  },
  {
    label: "Portfolio",
    items: [
      { href: "/admin/projects", label: "Projets" },
      { href: "/admin/project-translations", label: "Traductions projets" },
      { href: "/admin/project-skills", label: "Technologies des projets" },
      { href: "/admin/skills", label: "Compétences" },
      { href: "/admin/certifications", label: "Certifications" },
      { href: "/admin/experiences", label: "Expériences" },
      { href: "/admin/education", label: "Formations" },
      { href: "/admin/timeline", label: "Timeline" },
      { href: "/admin/now", label: "Maintenant" },
      { href: "/admin/translations", label: "Comparaison des traductions" },
    ],
  },
  {
    label: "Publication",
    items: [
      { href: "/admin/blog", label: "Articles" },
      { href: "/admin/blog-translations", label: "Traductions blog" },
      { href: "/admin/categories", label: "Catégories" },
      { href: "/admin/tags", label: "Tags" },
      { href: "/admin/blog-tags", label: "Tags des articles" },
      { href: "/admin/seo", label: "Contrôle SEO" },
      { href: "/admin/media", label: "Médiathèque" },
      { href: "/admin/ai-jobs", label: "Brouillons assistés" },
      { href: "/admin/github", label: "Importer depuis GitHub" },
    ],
  },
  {
    label: "Opérations",
    items: [
      { href: "/admin/messages", label: "Messages" },
      { href: "/admin/analytics", label: "Analytics agrégés" },
      { href: "/admin/settings", label: "Paramètres" },
      { href: "/admin/audit-logs", label: "Journal d’audit" },
    ],
  },
] as const;

type AdminShellProps = {
  children: ReactNode;
  email: string | null;
};

export function AdminShell({ children, email }: AdminShellProps) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
      <a className="skip-link" href="#admin-content">Aller au contenu</a>
      <aside className="border-b border-border bg-surface-subtle lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:border-b-0 lg:border-r">
        <div className="flex min-h-16 items-center justify-between gap-4 border-b border-border px-5 lg:min-h-20">
          <Link href="/admin/dashboard" className="inline-flex min-h-11 items-center gap-3 rounded-lg font-semibold text-text-primary">
            <span className="grid size-9 place-items-center rounded-lg bg-accent text-text-on-accent">
              <ShieldCheck aria-hidden="true" className="size-4" />
            </span>
            Administration
          </Link>
          <details className="relative lg:hidden">
            <summary className="button-secondary list-none px-4">Menu</summary>
            <nav aria-label="Administration mobile" className="absolute right-0 top-14 z-30 max-h-[70vh] w-[min(20rem,calc(100vw-2rem))] overflow-y-auto rounded-xl border border-border bg-surface-raised p-4 shadow-2xl">
              <AdminNavigation />
            </nav>
          </details>
        </div>

        <nav aria-label="Administration" className="hidden space-y-6 p-5 lg:block">
          <AdminNavigation />
        </nav>

        <div className="hidden border-t border-border p-5 lg:block">
          <p className="truncate text-xs text-text-muted" title={email ?? undefined}>{email ?? "Compte administrateur"}</p>
          <div className="mt-3 grid gap-2">
            <Link href="/fr" target="_blank" rel="noreferrer" className="button-secondary justify-between px-4 text-xs">
              Voir le site <ExternalLink aria-hidden="true" className="size-3.5" />
            </Link>
            <form action={signOutAdmin}>
              <button className="button-secondary w-full justify-between px-4 text-xs" type="submit">
                Se déconnecter <LogOut aria-hidden="true" className="size-3.5" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      <main id="admin-content" className="min-w-0 px-4 py-8 sm:px-6 lg:px-10 lg:py-10" tabIndex={-1}>
        <div className="mx-auto w-full max-w-[90rem]">{children}</div>
      </main>
    </div>
  );
}

function AdminNavigation() {
  return navigation.map((group) => (
    <div key={group.label}>
      <p className="mb-2 px-3 font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-text-muted">{group.label}</p>
      <ul className="grid gap-1">
        {group.items.map((item) => (
          <li key={item.href}>
            <Link className="flex min-h-10 items-center rounded-lg px-3 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-raised hover:text-text-primary" href={item.href}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  ));
}
