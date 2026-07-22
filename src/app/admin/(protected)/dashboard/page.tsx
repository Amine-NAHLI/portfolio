import Link from "next/link";
import { ArrowRight, Database, FileText, FolderKanban, Inbox } from "lucide-react";
import { adminResources } from "@/features/admin/resources";
import { listAdminRecords } from "@/lib/admin/content-repository";
import { requireAdminPage } from "@/lib/auth/admin";

export const metadata = { title: "Tableau de bord" };

export default async function AdminDashboardPage() {
  const context = await requireAdminPage();
  const resources = [adminResources.projects, adminResources.blog, adminResources.messages, adminResources.media] as const;
  const results = await Promise.all(resources.map((config) => listAdminRecords(context, config)));
  const cards = [
    { label: "Projets", href: "/admin/projects", icon: FolderKanban, result: results[0] },
    { label: "Articles", href: "/admin/blog", icon: FileText, result: results[1] },
    { label: "Messages", href: "/admin/messages", icon: Inbox, result: results[2] },
    { label: "Médias", href: "/admin/media", icon: Database, result: results[3] },
  ];

  return (
    <div>
      <header className="max-w-3xl">
        <p className="eyebrow">Pilotage éditorial</p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Tableau de bord</h1>
        <p className="mt-3 text-sm leading-6 text-text-secondary sm:text-base">Gérez les contenus, leurs traductions et leur validation. Une publication reste toujours une décision humaine.</p>
      </header>

      <section aria-labelledby="content-overview" className="mt-10">
        <h2 id="content-overview" className="text-lg font-semibold">Vue d’ensemble</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(({ label, href, icon: Icon, result }) => (
            <Link key={href} href={href} className="surface-card group min-h-36 p-5 transition-colors hover:border-border-strong">
              <div className="flex items-start justify-between gap-4">
                <Icon aria-hidden="true" className="size-5 text-accent" />
                <ArrowRight aria-hidden="true" className="size-4 text-text-muted transition-transform group-hover:translate-x-1" />
              </div>
              <p className="mt-6 text-3xl font-semibold text-text-primary">{result.error ? "—" : result.records.length}</p>
              <p className="mt-1 text-sm text-text-secondary">{label}{result.records.length === 200 ? " (200+)" : ""}</p>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="admin-principles" className="mt-10 grid gap-4 lg:grid-cols-3">
        <h2 id="admin-principles" className="sr-only">Règles de publication</h2>
        {[
          ["Brouillon d’abord", "Toute donnée incomplète reste privée tant qu’elle n’est pas validée."],
          ["Deux langues", "Les contenus publics doivent être relus en français et en anglais."],
          ["Faits vérifiables", "N’ajoutez aucune métrique, expérience ou certification non vérifiée."],
        ].map(([title, description]) => (
          <article key={title} className="rounded-xl border border-border bg-surface p-5">
            <h3 className="text-sm font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-text-muted">{description}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
