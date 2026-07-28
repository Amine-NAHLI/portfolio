import Link from "next/link";
import type { ReactNode } from "react";
import { ExternalLink, LogOut, ShieldCheck } from "lucide-react";
import { signOutAdmin } from "@/app/admin/(protected)/actions";

const navigation = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/projects", label: "Projets" },
  { href: "/admin/journey", label: "Parcours" },
  { href: "/admin/skills", label: "Compétences" },
  { href: "/admin/certifications", label: "Certifications" },
  { href: "/admin/testimonials", label: "Avis" },
  { href: "/admin/messages", label: "Messages" },
] as const;

type AdminShellProps = { children: ReactNode; email: string | null };

export function AdminShell({ children, email }: AdminShellProps) {
  return <div className="admin-control min-h-screen bg-bg-page lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
    <a className="skip-link" href="#admin-content">Aller au contenu</a>
    <aside className="border-b border-border bg-surface-subtle/80 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:border-b-0 lg:border-r">
      <div className="flex min-h-16 items-center justify-between gap-4 border-b border-border px-5 lg:min-h-20"><Link href="/admin/dashboard" className="inline-flex min-h-11 items-center gap-3 rounded-sm font-semibold text-text-primary"><span className="grid size-9 place-items-center border border-accent bg-accent text-text-on-accent"><ShieldCheck aria-hidden="true" className="size-4" /></span><span>Administration<span className="ml-2 font-mono text-[.62rem] font-medium tracking-[.12em] text-text-muted">{"// CTRL"}</span></span></Link><details className="relative lg:hidden"><summary className="button-secondary list-none px-4">Menu</summary><nav aria-label="Administration mobile" className="absolute right-0 top-14 z-30 max-h-[70vh] w-[min(20rem,calc(100vw-2rem))] overflow-y-auto border border-border bg-surface-raised p-4 shadow-2xl"><AdminNavigation /></nav></details></div>
      <nav aria-label="Administration" className="hidden p-5 lg:block"><AdminNavigation /></nav>
      <div className="hidden border-t border-border p-5 lg:block"><p className="truncate text-xs text-text-muted" title={email ?? undefined}>{email ?? "Compte administrateur"}</p><div className="mt-3 grid gap-2"><Link href="/fr" target="_blank" rel="noreferrer" className="button-secondary justify-between px-4 text-xs">Voir le site <ExternalLink aria-hidden="true" className="size-3.5" /></Link><form action={signOutAdmin}><button className="button-secondary w-full justify-between px-4 text-xs" type="submit">Se déconnecter <LogOut aria-hidden="true" className="size-3.5" /></button></form></div></div>
    </aside>
    <main id="admin-content" className="min-w-0 px-4 py-8 sm:px-6 lg:px-10 lg:py-10" tabIndex={-1}><div className="mx-auto w-full max-w-[90rem] border-x border-border/60 px-0 sm:px-6">{children}</div></main>
  </div>;
}

function AdminNavigation() {
  return <div><p className="mb-2 px-3 font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-text-muted">Administration</p><ul className="grid gap-1">{navigation.map((item, index) => <li key={item.href}><Link className="flex min-h-10 items-center gap-3 border-l border-transparent px-3 font-mono text-xs font-medium uppercase tracking-[.06em] text-text-secondary transition-colors hover:border-accent hover:bg-surface-raised hover:text-text-primary" href={item.href}><span className="text-text-muted">{String(index + 1).padStart(2, "0")}</span>{item.label}</Link></li>)}</ul></div>;
}
