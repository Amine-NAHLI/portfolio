"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, LoaderCircle, TriangleAlert } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import type { RepositoryAnalysis } from "@/features/github/types";

type EditableDraft = { slug: string; titleFr: string; titleEn: string; summaryFr: string; summaryEn: string };

export function GitHubWorkbench() {
  const [url, setUrl] = useState("");
  const [jobId, setJobId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<RepositoryAnalysis | null>(null);
  const [existingProjectId, setExistingProjectId] = useState<string | null>(null);
  const [draft, setDraft] = useState<EditableDraft | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);

  async function analyze(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAnalyzing(true);
    setError(null);
    setAnalysis(null);
    setProjectId(null);
    try {
      const response = await fetch("/api/admin/github/analyze", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ url }) });
      const result = await response.json() as { error?: string; jobId?: string; analysis?: RepositoryAnalysis; existingProjectId?: string | null };
      if (!response.ok || !result.jobId || !result.analysis) throw new Error(result.error ?? "Analyse impossible.");
      setJobId(result.jobId);
      setAnalysis(result.analysis);
      setExistingProjectId(result.existingProjectId ?? null);
      setDraft({
        slug: result.analysis.draft.slug,
        titleFr: result.analysis.draft.titleFr,
        titleEn: result.analysis.draft.titleEn,
        summaryFr: result.analysis.draft.summaryFr,
        summaryEn: result.analysis.draft.summaryEn,
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Analyse impossible.");
    } finally {
      setAnalyzing(false);
    }
  }

  async function syncExistingProject() {
    if (!jobId || !existingProjectId) return;
    setImporting(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/github/sync", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ jobId }) });
      const result = await response.json() as { error?: string; projectId?: string };
      if (!response.ok || !result.projectId) throw new Error(result.error ?? "Synchronisation impossible.");
      setProjectId(result.projectId);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Synchronisation impossible.");
    } finally {
      setImporting(false);
    }
  }

  async function importDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!jobId || !draft) return;
    setImporting(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/github/import", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ jobId, draft }) });
      const result = await response.json() as { error?: string; projectId?: string };
      if (!response.ok || !result.projectId) throw new Error(result.error ?? "Création du brouillon impossible.");
      setProjectId(result.projectId);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Création du brouillon impossible.");
    } finally {
      setImporting(false);
    }
  }

  function updateDraft(field: keyof EditableDraft, value: string) {
    setDraft((current) => current ? { ...current, [field]: value } : current);
  }

  return (
    <div>
      <header className="max-w-3xl"><p className="eyebrow">Source vérifiable</p><h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Importer depuis GitHub</h1><p className="mt-3 leading-7 text-text-secondary">Analysez un dépôt public via l’API officielle. Les données extraites restent un brouillon privé et rien n’est publié automatiquement.</p></header>

      <form onSubmit={analyze} className="mt-8 flex flex-col gap-3 rounded-xl border border-border bg-surface p-5 sm:flex-row sm:items-end">
        <label className="grid flex-1 gap-2 text-sm font-semibold text-text-primary">URL HTTPS du dépôt GitHub<input type="url" inputMode="url" autoComplete="url" required value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://github.com/proprietaire/depot" className="min-h-12 px-4 font-normal" /></label>
        <button type="submit" className="button-primary min-h-12" disabled={analyzing || !url.trim()}>{analyzing ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin motion-reduce:animate-none" /> : <GithubIcon size={16} />}{analyzing ? "Analyse…" : "Analyser"}</button>
      </form>
      <p className="mt-3 text-xs leading-5 text-text-muted">Sans token, GitHub applique sa limite publique gratuite. Un token personnel optionnel augmente cette limite sans rendre le site dépendant d’un service payant.</p>
      {error ? <p className="mt-5 rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger" role="alert">{error}</p> : null}

      {analysis && draft ? (
        <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(22rem,0.8fr)]">
          <div className="grid gap-6">
            <section className="surface-card p-5 sm:p-6"><div className="flex items-center gap-3"><CheckCircle2 aria-hidden="true" className="size-5 text-success" /><h2 className="text-xl font-semibold">Faits collectés</h2></div><p className="mt-2 text-sm text-text-muted">Chaque fait conserve sa source. Aucune métrique n’est interprétée comme un résultat personnel.</p><dl className="mt-5 grid gap-3">{analysis.facts.map((fact) => <div key={fact.label} className="rounded-xl border border-border bg-surface p-4"><dt className="text-sm font-semibold text-text-primary">{fact.label}</dt><dd className="mt-1 break-words text-sm text-text-secondary">{formatValue(fact.value)}</dd><dd className="mt-2 text-xs text-text-muted">Source : {fact.source}</dd></div>)}</dl></section>
            <section className="surface-card p-5 sm:p-6"><div className="flex items-center gap-3"><TriangleAlert aria-hidden="true" className="size-5 text-warning" /><h2 className="text-xl font-semibold">À vérifier manuellement</h2></div>{analysis.inferences.length ? <ul className="mt-5 grid gap-3">{analysis.inferences.map((item) => <li key={item.label} className="rounded-xl border border-warning/20 bg-warning/5 p-4"><p className="font-semibold text-text-primary">{item.label} <span className="text-xs font-normal text-warning">Confiance {item.confidence}</span></p><p className="mt-1 text-sm text-text-secondary">{formatValue(item.value)}</p><p className="mt-2 text-xs text-text-muted">Base : {item.basis}</p></li>)}</ul> : null}<ul className="mt-5 grid gap-2 text-sm text-text-secondary">{analysis.missingInformation.map((item) => <li key={item} className="flex gap-2"><span aria-hidden="true" className="text-warning">—</span>{item}</li>)}</ul></section>
          </div>

          <form onSubmit={importDraft} className="surface-card h-fit p-5 sm:p-6 xl:sticky xl:top-8">
            <p className="eyebrow">Correction humaine obligatoire</p><h2 className="mt-2 text-xl font-semibold">{existingProjectId ? "Projet déjà associé" : "Préparer le brouillon privé"}</h2><p className="mt-2 text-sm leading-6 text-text-muted">{existingProjectId ? "La synchronisation explicite ne met à jour que l’URL GitHub, la démonstration et le langage principal. Elle ne remplace aucun contenu éditorial." : "Les résumés ne sont jamais générés à partir d’hypothèses. Rédigez les deux versions à partir de faits que vous pouvez défendre."}</p>
            <div className="mt-5 grid gap-4">
              <DraftField label="Slug" value={draft.slug} onChange={(value) => updateDraft("slug", value)} maxLength={100} />
              <DraftField label="Titre français" value={draft.titleFr} onChange={(value) => updateDraft("titleFr", value)} maxLength={180} />
              <DraftArea label="Résumé français" value={draft.summaryFr} onChange={(value) => updateDraft("summaryFr", value)} maxLength={1200} />
              <DraftField label="English title" value={draft.titleEn} onChange={(value) => updateDraft("titleEn", value)} maxLength={180} />
              <DraftArea label="English summary" value={draft.summaryEn} onChange={(value) => updateDraft("summaryEn", value)} maxLength={1200} />
            </div>
            {projectId ? <div className="mt-5 rounded-xl border border-success/30 bg-success/10 p-4 text-sm text-success" role="status"><p>{existingProjectId ? "Métadonnées factuelles synchronisées. Le contenu éditorial est inchangé." : "Brouillon créé. Il reste privé jusqu’à validation des deux traductions."}</p><Link href={`/admin/preview/projects/${projectId}`} className="mt-3 inline-flex min-h-11 items-center gap-2 font-semibold">Prévisualiser <ArrowRight aria-hidden="true" className="size-4" /></Link></div> : existingProjectId ? <button type="button" onClick={() => void syncExistingProject()} className="button-primary mt-6 w-full" disabled={importing}>{importing ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin motion-reduce:animate-none" /> : null}{importing ? "Synchronisation…" : "Synchroniser les métadonnées factuelles"}</button> : <button type="submit" className="button-primary mt-6 w-full" disabled={importing || !draft.summaryFr.trim() || !draft.summaryEn.trim()}>{importing ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin motion-reduce:animate-none" /> : null}{importing ? "Création…" : "Créer le brouillon"}</button>}
          </form>
        </div>
      ) : null}
    </div>
  );
}

function DraftField({ label, value, onChange, maxLength }: { label: string; value: string; onChange: (value: string) => void; maxLength: number }) {
  return <label className="grid gap-2 text-sm font-semibold text-text-primary">{label}<input required value={value} onChange={(event) => onChange(event.target.value)} maxLength={maxLength} className="min-h-11 px-3 font-normal" /></label>;
}

function DraftArea({ label, value, onChange, maxLength }: { label: string; value: string; onChange: (value: string) => void; maxLength: number }) {
  return <label className="grid gap-2 text-sm font-semibold text-text-primary">{label}<textarea required value={value} onChange={(event) => onChange(event.target.value)} maxLength={maxLength} rows={5} className="resize-y px-3 py-2 font-normal" /><span className="text-right text-xs font-normal text-text-muted">{value.length}/{maxLength}</span></label>;
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "Non disponible";
  if (Array.isArray(value)) return value.length ? value.map((item) => typeof item === "object" ? JSON.stringify(item) : String(item)).join(", ") : "Aucun";
  if (typeof value === "object") return Object.keys(value as Record<string, unknown>).join(", ") || "Aucun";
  if (typeof value === "boolean") return value ? "Oui" : "Non";
  return String(value);
}
