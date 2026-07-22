import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { requireAdminPage } from "@/lib/auth/admin";
import type { Json } from "@/types/database";

type ProjectPreviewPageProps = { params: Promise<{ id: string }> };

export const metadata = { title: "Prévisualisation du projet" };

export default async function ProjectPreviewPage({ params }: ProjectPreviewPageProps) {
  const { id } = await params;
  const context = await requireAdminPage();
  const { data: project, error } = await context.supabase.from("projects").select("*").eq("id", id).maybeSingle();
  if (error || !project) notFound();
  const { data: translations } = await context.supabase.from("project_translations").select("*").eq("project_id", id).order("locale");

  return (
    <div>
      <Link href="/admin/projects" className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-semibold text-text-secondary hover:text-text-primary">
        <ArrowLeft aria-hidden="true" className="size-4" /> Retour aux projets
      </Link>
      <header className="mt-6 border-b border-border pb-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-warning/30 bg-warning/10 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-warning">Prévisualisation privée</span>
          <span className="rounded-full border border-border px-3 py-1 text-xs text-text-muted">{project.publication_status}</span>
        </div>
        <h1 className="mt-5 text-4xl font-semibold sm:text-5xl">{project.slug}</h1>
        <p className="mt-3 max-w-3xl text-text-secondary">Cette vue présente les deux versions avant publication. Elle n’est ni indexée ni accessible sans autorisation.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          {project.github_url ? <a href={project.github_url} target="_blank" rel="noreferrer" className="button-secondary">GitHub <ExternalLink aria-hidden="true" className="size-4" /></a> : null}
          {project.demo_url ? <a href={project.demo_url} target="_blank" rel="noreferrer" className="button-secondary">Démonstration <ExternalLink aria-hidden="true" className="size-4" /></a> : null}
        </div>
      </header>

      {!translations?.length ? (
        <div className="mt-8 rounded-xl border border-warning/30 bg-warning/10 p-5 text-warning">Aucune traduction n’est encore disponible.</div>
      ) : (
        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          {translations.map((translation) => (
            <article key={translation.id} lang={translation.locale} className="surface-card p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <p className="eyebrow">{translation.locale === "fr" ? "Français" : "English"}</p>
                <span className="text-xs text-text-muted">{translation.review_status}</span>
              </div>
              <h2 className="mt-4 text-3xl font-semibold">{translation.title}</h2>
              {translation.subtitle ? <p className="mt-2 text-lg text-accent">{translation.subtitle}</p> : null}
              <p className="mt-5 whitespace-pre-line leading-7 text-text-secondary">{translation.summary}</p>
              {translation.solution ? <section className="mt-7"><h3 className="font-semibold">Solution</h3><p className="mt-2 whitespace-pre-line text-sm leading-6 text-text-secondary">{translation.solution}</p></section> : null}
              <StructuredPreview title="Architecture" value={translation.architecture} />
              <StructuredPreview title="Résultats" value={translation.results} />
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function StructuredPreview({ title, value }: { title: string; value: Json }) {
  const entries = Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  if (!entries.length) return null;
  return (
    <section className="mt-7">
      <h3 className="font-semibold">{title}</h3>
      <ul className="mt-2 grid gap-2 text-sm leading-6 text-text-secondary">
        {entries.map((entry) => <li key={entry} className="flex gap-2"><span aria-hidden="true" className="text-accent">—</span>{entry}</li>)}
      </ul>
    </section>
  );
}
