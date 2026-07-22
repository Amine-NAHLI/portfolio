import Link from "next/link";
import { adminResources } from "@/features/admin/resources";
import { listAdminRecords } from "@/lib/admin/content-repository";
import { requireAdminPage } from "@/lib/auth/admin";

export const metadata = { title: "Traductions" };

export default async function AdminTranslationsPage() {
  const context = await requireAdminPage();
  const [projectResult, blogResult] = await Promise.all([
    listAdminRecords(context, adminResources["project-translations"]),
    listAdminRecords(context, adminResources["blog-translations"]),
  ]);

  return (
    <div>
      <header className="max-w-3xl">
        <p className="eyebrow">Qualité bilingue</p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Traductions</h1>
        <p className="mt-3 leading-7 text-text-secondary">Comparez les versions française et anglaise avant de les marquer comme validées. Un statut validé atteste une relecture humaine.</p>
      </header>
      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <TranslationGroup label="Projets" records={projectResult.records} parentField="project_id" href="/admin/project-translations" />
        <TranslationGroup label="Articles" records={blogResult.records} parentField="blog_post_id" href="/admin/blog-translations" />
      </div>
    </div>
  );
}

function TranslationGroup({ label, records, parentField, href }: { label: string; records: Record<string, unknown>[]; parentField: string; href: string }) {
  const groups = Map.groupBy(records, (record) => String(record[parentField] ?? "sans-parent"));
  return (
    <section className="surface-card p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">{label}</h2>
        <Link href={href} className="text-sm font-semibold text-accent hover:text-accent-hover">Modifier</Link>
      </div>
      {groups.size === 0 ? <p className="mt-5 text-sm text-text-muted">Aucune traduction.</p> : (
        <ul className="mt-5 grid gap-3">
          {[...groups].map(([parentId, translations]) => {
            const locales = new Map(translations.map((item) => [item.locale, item]));
            return (
              <li key={parentId} className="rounded-xl border border-border bg-surface p-4">
                <p className="truncate font-mono text-xs text-text-muted" title={parentId}>{parentId}</p>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {(["fr", "en"] as const).map((locale) => {
                    const translation = locales.get(locale);
                    return (
                      <div key={locale} className="rounded-lg border border-border px-3 py-3">
                        <p className="text-xs font-bold uppercase text-text-muted">{locale}</p>
                        <p className="mt-1 line-clamp-2 text-sm font-semibold text-text-primary">{String(translation?.title ?? "Manquant")}</p>
                        <p className={`mt-2 text-xs ${translation?.review_status === "validated" ? "text-success" : "text-warning"}`}>{String(translation?.review_status ?? "À créer")}</p>
                      </div>
                    );
                  })}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
