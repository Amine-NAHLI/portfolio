import Link from "next/link";
import { CheckCircle2, CircleAlert } from "lucide-react";
import { requireAdminPage } from "@/lib/auth/admin";

export const metadata = { title: "Contrôle SEO" };

export default async function AdminSeoPage() {
  const context = await requireAdminPage();
  const [{ data: projectTranslations }, { data: blogTranslations }] = await Promise.all([
    context.supabase.from("project_translations").select("id, project_id, locale, title, seo_title, seo_description, review_status"),
    context.supabase.from("blog_post_translations").select("id, blog_post_id, locale, title, seo_title, seo_description, review_status"),
  ]);
  const groups = [
    { label: "Projets", href: "/admin/project-translations", items: (projectTranslations ?? []).map((item) => ({ ...item, parentId: item.project_id })) },
    { label: "Articles", href: "/admin/blog-translations", items: (blogTranslations ?? []).map((item) => ({ ...item, parentId: item.blog_post_id })) },
  ];

  return (
    <div>
      <header className="max-w-3xl"><p className="eyebrow">Visibilité organique</p><h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Contrôle SEO</h1><p className="mt-3 leading-7 text-text-secondary">Vérifiez les métadonnées localisées avant publication. Les titres recommandés restent sous 60 caractères et les descriptions sous 160.</p></header>
      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        {groups.map((group) => <section key={group.label} className="surface-card p-5 sm:p-6"><div className="flex items-center justify-between gap-4"><h2 className="text-xl font-semibold">{group.label}</h2><Link className="text-sm font-semibold text-accent" href={group.href}>Modifier</Link></div>{group.items.length ? <ul className="mt-5 grid gap-3">{group.items.map((item) => {
          const complete = Boolean(item.seo_title && item.seo_title.length <= 60 && item.seo_description && item.seo_description.length <= 160 && item.review_status === "validated");
          return <li key={item.id} className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4">{complete ? <CheckCircle2 aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-success" /> : <CircleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-warning" />}<div className="min-w-0"><p className="truncate font-semibold text-text-primary">{item.title}</p><p className="mt-1 truncate font-mono text-xs text-text-muted">{item.locale.toUpperCase()} · {item.parentId}</p><p className={`mt-2 text-xs ${complete ? "text-success" : "text-warning"}`}>{complete ? "Prêt" : "Métadonnées ou validation à compléter"}</p></div></li>;
        })}</ul> : <p className="mt-5 text-sm text-text-muted">Aucun contenu.</p>}</section>)}
      </div>
    </div>
  );
}
