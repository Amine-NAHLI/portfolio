import { BarChart3, Eye, FileText, MessageSquare, ScrollText } from "lucide-react";
import { requireAdminPage } from "@/lib/auth/admin";

export const metadata = { title: "Analytics" };

const eventLabels: Record<string, string> = {
  page_view: "Pages vues", project_view: "Projets consultés", article_view: "Articles lus", github_click: "Clics GitHub",
  demo_click: "Clics démo", cv_open: "Ouvertures du CV", contact_submit: "Messages envoyés", language_change: "Changements de langue",
};

export default async function AdminAnalyticsPage() {
  const context = await requireAdminPage();
  const [{ data: rows, error }, { count: unreadMessages }] = await Promise.all([
    context.supabase.from("analytics_daily").select("*").order("event_date", { ascending: false }).limit(1000),
    context.supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("status", "new"),
  ]);
  const totals = new Map<string, number>();
  const paths = new Map<string, number>();
  for (const row of rows ?? []) {
    totals.set(row.event_name, (totals.get(row.event_name) ?? 0) + row.event_count);
    if (row.event_name === "page_view") paths.set(row.path, (paths.get(row.path) ?? 0) + row.event_count);
  }
  const popularPaths = [...paths].sort((left, right) => right[1] - left[1]).slice(0, 10);
  const maxPathCount = Math.max(1, ...popularPaths.map((item) => item[1]));
  const cards = [
    { label: "Pages vues", value: totals.get("page_view") ?? 0, icon: Eye },
    { label: "Projets consultés", value: totals.get("project_view") ?? 0, icon: FileText },
    { label: "Articles lus", value: totals.get("article_view") ?? 0, icon: ScrollText },
    { label: "Nouveaux messages", value: unreadMessages ?? 0, icon: MessageSquare },
  ];

  return (
    <div>
      <header className="max-w-3xl"><p className="eyebrow">Données disponibles</p><h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Analytics agrégés</h1><p className="mt-3 leading-7 text-text-secondary">Compteurs internes sans cookie, identifiant visiteur ni donnée sensible. La collecte est désactivée tant que la variable dédiée n’est pas activée.</p></header>
      {error ? <p className="mt-8 rounded-xl border border-warning/30 bg-warning/10 p-4 text-warning" role="alert">Appliquez la migration analytics pour afficher ces données.</p> : null}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(({ label, value, icon: Icon }) => <article key={label} className="surface-card p-5"><Icon aria-hidden="true" className="size-5 text-accent" /><p className="mt-5 text-3xl font-semibold text-text-primary">{value.toLocaleString("fr-FR")}</p><p className="mt-1 text-sm text-text-muted">{label}</p></article>)}</div>
      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section className="surface-card p-5 sm:p-6"><h2 className="flex items-center gap-2 text-xl font-semibold"><BarChart3 aria-hidden="true" className="size-5 text-accent" />Pages populaires</h2>{popularPaths.length ? <ol className="mt-5 grid gap-4">{popularPaths.map(([path, count]) => <li key={path}><div className="flex justify-between gap-4 text-sm"><span className="truncate text-text-secondary">{path}</span><span className="font-semibold text-text-primary">{count}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-raised"><div className="h-full rounded-full bg-accent" style={{ width: `${Math.max(3, count / maxPathCount * 100)}%` }} /></div></li>)}</ol> : <p className="mt-5 text-sm text-text-muted">Aucune donnée collectée.</p>}</section>
        <section className="surface-card p-5 sm:p-6"><h2 className="text-xl font-semibold">Événements</h2><dl className="mt-5 grid gap-3">{[...totals].sort((left, right) => right[1] - left[1]).map(([name, count]) => <div key={name} className="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface px-4 py-3"><dt className="text-sm text-text-secondary">{eventLabels[name] ?? name}</dt><dd className="font-semibold text-text-primary">{count.toLocaleString("fr-FR")}</dd></div>)}</dl>{totals.size === 0 ? <p className="text-sm text-text-muted">Aucun événement.</p> : null}</section>
      </div>
    </div>
  );
}
