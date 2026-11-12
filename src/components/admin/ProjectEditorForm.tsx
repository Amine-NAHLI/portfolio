"use client";

import Link from "next/link";
import { useState, type ChangeEvent, type KeyboardEvent, type RefObject } from "react";
import { CheckCircle2, FileUp, GitBranch, Images, Languages, Loader2, Sparkles } from "lucide-react";
import ProjectCategoriesSelector from "@/components/admin/ProjectCategoriesSelector";
import type { GeneratedProjectDraft, GitHubProjectExtractionResult } from "@/lib/github-project-extractor";

export type ProjectFormValues = Record<string, unknown>;

interface ProjectEditorFormProps {
  values: ProjectFormValues;
  setField: (key: string, value: string | number) => void;
  patchValues: (patch: ProjectFormValues) => void;
  translateAllFrToEn: () => Promise<void>;
  translating: string | null;
  generateCategories: () => Promise<void>;
  generatingCategories: boolean;
  galleryRef: RefObject<HTMLInputElement | null>;
  galleryFiles: File[];
  setGalleryFiles: (files: File[]) => void;
}

function countNonEmptyLines(value: unknown): number {
  if (typeof value !== "string") return 0;
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean).length;
}

function LineCountBadge({ value, idealLabel }: { value: unknown; idealLabel: string }) {
  const count = countNonEmptyLines(value);
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] font-medium text-text-muted">
      {count} · {idealLabel}
    </span>
  );
}

function draftToFormPatch(draft: GeneratedProjectDraft): ProjectFormValues {
  return {
    title: draft.title,
    subtitle_fr: draft.subtitle_fr,
    subtitle_en: draft.subtitle_en,
    description_fr: draft.description_fr,
    description_en: draft.description_en,
    problem_fr: draft.problem_fr,
    problem_en: draft.problem_en,
    objectives_fr: draft.objectives_fr.join("\n"),
    objectives_en: draft.objectives_en.join("\n"),
    solution_fr: draft.solution_fr,
    solution_en: draft.solution_en,
    architecture_fr: draft.architecture_fr.join("\n"),
    architecture_en: draft.architecture_en.join("\n"),
    results_fr: draft.results_fr.join("\n"),
    results_en: draft.results_en.join("\n"),
    categories: draft.categories.join(", "),
    technologies: draft.technologies.join(", "),
    github_url: draft.github_url,
    demo_url: draft.demo_url,
  };
}

export default function ProjectEditorForm({
  values,
  setField,
  patchValues,
  translateAllFrToEn,
  translating,
  generateCategories,
  generatingCategories,
  galleryRef,
  galleryFiles,
  setGalleryFiles,
}: ProjectEditorFormProps) {
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [extractMeta, setExtractMeta] = useState<GitHubProjectExtractionResult["meta"] | null>(null);

  async function handleExtractFromGitHub() {
    const githubUrl = String(values.github_url ?? "").trim();
    if (!githubUrl) {
      setExtractError("Entrez d'abord un lien GitHub (ex: https://github.com/Amine-NAHLI/projet).");
      return;
    }

    setExtracting(true);
    setExtractError(null);

    try {
      const response = await fetch("/api/admin/analyze-github-project", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ githubUrl }),
      });

      const payload = (await response.json()) as Partial<GitHubProjectExtractionResult> & { error?: string };
      if (!response.ok || !payload.draft || !payload.meta) {
        throw new Error(payload.error || "L'extraction GitHub et la génération IA ont échoué.");
      }

      patchValues(draftToFormPatch(payload.draft));
      setExtractMeta(payload.meta);
    } catch (caught) {
      setExtractError(caught instanceof Error ? caught.message : "Erreur lors de l'analyse GitHub.");
    } finally {
      setExtracting(false);
    }
  }

  function handleGitHubInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      void handleExtractFromGitHub();
    }
  }

  return (
    <div className="grid gap-6 sm:col-span-2">
      {/* Top Bar: GitHub URL Extractor & Skill-Driven AI Auto-Fill */}
      <section className="rounded-2xl border border-[#C8F122]/30 bg-[#C8F122]/[0.06] p-4 sm:p-5 space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#C8F122] font-semibold">
              <GitBranch className="size-3.5" />
              <span>Import GitHub + Skill IA (Chatbot AI)</span>
            </div>
            <p className="mt-1 text-xs text-text-secondary max-w-3xl leading-relaxed">
              Collez le lien du dépôt GitHub pour extraire le README, l&apos;arborescence et les manifests, puis générer automatiquement le projet FR/EN selon le format calibré (4 objectifs, 4–5 couches d&apos;architecture, 4 résultats).
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="url"
            value={String(values.github_url ?? "")}
            onChange={(event) => setField("github_url", event.target.value)}
            onKeyDown={handleGitHubInputKeyDown}
            placeholder="https://github.com/Amine-NAHLI/nom-du-projet"
            className="min-h-11 flex-1 rounded-xl border border-white/15 bg-surface px-3.5 text-sm font-normal text-text-primary placeholder:text-text-muted focus:border-[#C8F122]/60 focus:outline-none"
            aria-label="Lien GitHub du projet"
          />
          <button
            type="button"
            onClick={() => void handleExtractFromGitHub()}
            disabled={extracting}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#C8F122] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#000000] shadow-lg shadow-[#C8F122]/20 transition-all hover:bg-[#a1c4b4] disabled:opacity-60 cursor-pointer"
          >
            {extracting ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            <span>{extracting ? "Extraction & IA en cours…" : "Extraire & Remplir avec l'IA"}</span>
          </button>
        </div>

        {extractError ? (
          <p className="rounded-xl border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-xs font-medium text-danger" role="alert">
            {extractError}
          </p>
        ) : null}

        {extractMeta ? (
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[#C8F122]/30 bg-surface/70 px-3.5 py-2.5 text-xs text-text-secondary">
            <CheckCircle2 className="size-4 shrink-0 text-[#C8F122]" />
            <span>
              <strong className="text-text-primary">{extractMeta.repoFullName}</strong> extrait ({extractMeta.readmeChars.toLocaleString("fr-FR")} car. README, {extractMeta.inspectedManifests.length} manifest(s)) via{" "}
              <span className="font-mono text-[#C8F122]">{extractMeta.provider}</span>. Vérifiez et modifiez les sections ci-dessous avant d&apos;enregistrer.
            </span>
          </div>
        ) : null}
      </section>

      {/* Shared Project Title */}
      <label className="grid gap-2 text-sm font-semibold text-text-primary">
        <span>
          Titre du projet<span className="text-danger"> *</span>
        </span>
        <input
          required
          type="text"
          value={String(values.title ?? "")}
          onChange={(event) => setField("title", event.target.value)}
          placeholder="Ex: Smart Network Mapper — Plateforme d'audit réseau"
          className="min-h-11 px-3.5 font-normal"
        />
      </label>

      {/* Bilingual Split Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Contenu bilingue côte à côte</h3>
          <p className="text-xs text-text-muted">Éditez et comparez simultanément la version française et la version anglaise.</p>
        </div>
        <button
          type="button"
          onClick={() => void translateAllFrToEn()}
          disabled={Boolean(translating)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#C8F122]/30 bg-[#C8F122]/10 px-3.5 py-2 text-xs font-semibold text-[#C8F122] hover:bg-[#C8F122]/20 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <Languages className="size-3.5" />
          <span>{translating ? "Traduction en cours…" : "Traduire FR → EN avec l'IA"}</span>
        </button>
      </div>

      {/* Split Screen: French Pane | English Pane */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* FRENCH SECTION */}
        <section className="grid content-start gap-4 rounded-2xl border border-white/10 bg-surface/55 p-4 sm:p-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#C8F122]">
              <span className="size-2 rounded-full bg-[#C8F122]" />
              Section Française (FR)
            </span>
          </div>

          <label className="grid gap-1.5 text-sm font-semibold text-text-primary">
            <span>Sous-titre FR</span>
            <input
              type="text"
              value={String(values.subtitle_fr ?? "")}
              onChange={(event) => setField("subtitle_fr", event.target.value)}
              className="min-h-10 px-3 font-normal text-sm"
            />
          </label>

          <label className="grid gap-1.5 text-sm font-semibold text-text-primary">
            <span>
              Résumé court FR<span className="text-danger"> *</span>
            </span>
            <textarea
              required
              rows={3}
              value={String(values.description_fr ?? "")}
              onChange={(event) => setField("description_fr", event.target.value)}
              className="resize-y px-3 py-2 text-sm font-normal"
            />
          </label>

          <label className="grid gap-1.5 text-sm font-semibold text-text-primary">
            <span>Le Problème FR</span>
            <textarea
              rows={3}
              value={String(values.problem_fr ?? "")}
              onChange={(event) => setField("problem_fr", event.target.value)}
              className="resize-y px-3 py-2 text-sm font-normal"
            />
          </label>

          <label className="grid gap-1.5 text-sm font-semibold text-text-primary">
            <span className="flex items-center justify-between gap-2">
              <span>Objectifs FR (1 par ligne)</span>
              <LineCountBadge value={values.objectives_fr} idealLabel="cible: 4" />
            </span>
            <textarea
              rows={4}
              value={String(values.objectives_fr ?? "")}
              onChange={(event) => setField("objectives_fr", event.target.value)}
              className="resize-y px-3 py-2 text-sm font-normal"
            />
          </label>

          <label className="grid gap-1.5 text-sm font-semibold text-text-primary">
            <span>La Solution FR</span>
            <textarea
              rows={3}
              value={String(values.solution_fr ?? "")}
              onChange={(event) => setField("solution_fr", event.target.value)}
              className="resize-y px-3 py-2 text-sm font-normal"
            />
          </label>

          <label className="grid gap-1.5 text-sm font-semibold text-text-primary">
            <span className="flex items-center justify-between gap-2">
              <span>Architecture FR (1 couche par ligne)</span>
              <LineCountBadge value={values.architecture_fr} idealLabel="cible: 4–5" />
            </span>
            <textarea
              rows={5}
              value={String(values.architecture_fr ?? "")}
              onChange={(event) => setField("architecture_fr", event.target.value)}
              className="resize-y px-3 py-2 text-sm font-normal"
            />
          </label>

          <label className="grid gap-1.5 text-sm font-semibold text-text-primary">
            <span className="flex items-center justify-between gap-2">
              <span>Résultats FR (1 par ligne)</span>
              <LineCountBadge value={values.results_fr} idealLabel="cible: 4" />
            </span>
            <textarea
              rows={4}
              value={String(values.results_fr ?? "")}
              onChange={(event) => setField("results_fr", event.target.value)}
              className="resize-y px-3 py-2 text-sm font-normal"
            />
          </label>
        </section>

        {/* ENGLISH SECTION */}
        <section className="grid content-start gap-4 rounded-2xl border border-white/10 bg-surface/55 p-4 sm:p-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-sky-300">
              <span className="size-2 rounded-full bg-sky-300" />
              English Section (EN)
            </span>
          </div>

          <label className="grid gap-1.5 text-sm font-semibold text-text-primary">
            <span>Subtitle EN</span>
            <input
              type="text"
              value={String(values.subtitle_en ?? "")}
              onChange={(event) => setField("subtitle_en", event.target.value)}
              className="min-h-10 px-3 font-normal text-sm"
            />
          </label>

          <label className="grid gap-1.5 text-sm font-semibold text-text-primary">
            <span>Short Summary EN</span>
            <textarea
              rows={3}
              value={String(values.description_en ?? "")}
              onChange={(event) => setField("description_en", event.target.value)}
              className="resize-y px-3 py-2 text-sm font-normal"
            />
          </label>

          <label className="grid gap-1.5 text-sm font-semibold text-text-primary">
            <span>The Problem EN</span>
            <textarea
              rows={3}
              value={String(values.problem_en ?? "")}
              onChange={(event) => setField("problem_en", event.target.value)}
              className="resize-y px-3 py-2 text-sm font-normal"
            />
          </label>

          <label className="grid gap-1.5 text-sm font-semibold text-text-primary">
            <span className="flex items-center justify-between gap-2">
              <span>Objectives EN (1 per line)</span>
              <LineCountBadge value={values.objectives_en} idealLabel="target: 4" />
            </span>
            <textarea
              rows={4}
              value={String(values.objectives_en ?? "")}
              onChange={(event) => setField("objectives_en", event.target.value)}
              className="resize-y px-3 py-2 text-sm font-normal"
            />
          </label>

          <label className="grid gap-1.5 text-sm font-semibold text-text-primary">
            <span>The Solution EN</span>
            <textarea
              rows={3}
              value={String(values.solution_en ?? "")}
              onChange={(event) => setField("solution_en", event.target.value)}
              className="resize-y px-3 py-2 text-sm font-normal"
            />
          </label>

          <label className="grid gap-1.5 text-sm font-semibold text-text-primary">
            <span className="flex items-center justify-between gap-2">
              <span>Architecture EN (1 layer per line)</span>
              <LineCountBadge value={values.architecture_en} idealLabel="target: 4–5" />
            </span>
            <textarea
              rows={5}
              value={String(values.architecture_en ?? "")}
              onChange={(event) => setField("architecture_en", event.target.value)}
              className="resize-y px-3 py-2 text-sm font-normal"
            />
          </label>

          <label className="grid gap-1.5 text-sm font-semibold text-text-primary">
            <span className="flex items-center justify-between gap-2">
              <span>Results EN (1 per line)</span>
              <LineCountBadge value={values.results_en} idealLabel="target: 4" />
            </span>
            <textarea
              rows={4}
              value={String(values.results_en ?? "")}
              onChange={(event) => setField("results_en", event.target.value)}
              className="resize-y px-3 py-2 text-sm font-normal"
            />
          </label>
        </section>
      </div>

      {/* Shared Technical Metadata & Media */}
      <div className="grid gap-5 sm:grid-cols-2 border-t border-white/10 pt-4">
        <ProjectCategoriesSelector
          value={String(values.categories ?? "")}
          onChange={(val) => setField("categories", val)}
          onGenerate={generateCategories}
          isGenerating={generatingCategories}
        />

        <label className="grid gap-2 text-sm font-semibold text-text-primary sm:col-span-2">
          <span>Technologies (séparées par des virgules)</span>
          <input
            type="text"
            value={String(values.technologies ?? "")}
            onChange={(event) => setField("technologies", event.target.value)}
            placeholder="Next.js, TypeScript, Supabase, Tailwind CSS"
            className="min-h-11 px-3 font-normal"
          />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-text-primary">
          <span>Lien Démo (URL)</span>
          <input
            type="text"
            value={String(values.demo_url ?? "")}
            onChange={(event) => setField("demo_url", event.target.value)}
            placeholder="https://..."
            className="min-h-11 px-3 font-normal"
          />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-text-primary">
          <span>
            Ordre d&apos;affichage<span className="text-danger"> *</span>
          </span>
          <input
            required
            type="number"
            value={String(values.sort_order ?? 1)}
            onChange={(event) => setField("sort_order", Number(event.target.value))}
            className="min-h-11 px-3 font-normal"
          />
        </label>

        <label className="flex items-center gap-2 text-sm font-semibold text-text-primary sm:col-span-2">
          <input
            type="checkbox"
            checked={Boolean(values.featured)}
            onChange={(event) => setField("featured", event.target.checked ? 1 : 0)}
            className="size-4 rounded-sm border-border text-accent focus:ring-accent"
          />
          Mettre en avant sur la page d&apos;accueil
        </label>

        <div className="grid gap-2 text-sm font-semibold text-text-primary sm:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span>Galerie d&apos;images</span>
            {typeof values.id === "string" && values.id ? (
              <Link
                href={`/admin/project-gallery?project=${values.id}`}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
              >
                <Images className="size-3.5" />
                Voir &amp; ordonner toutes les photos
              </Link>
            ) : null}
          </div>
          <input
            ref={galleryRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(event: ChangeEvent<HTMLInputElement>) => setGalleryFiles(Array.from(event.target.files ?? []))}
            className="sr-only"
          />
          <button
            type="button"
            className="button-secondary w-fit"
            onClick={() => galleryRef.current?.click()}
          >
            <FileUp className="size-4" />
            {galleryFiles.length ? `${galleryFiles.length} image(s) sélectionnée(s)` : "Ajouter des images"}
          </button>
          <span className="text-xs font-normal text-text-muted">
            Les nouvelles images seront ajoutées à la galerie existante (5 Mo max par image). Utilisez « Galerie Photos Projets » pour choisir leur ordre d&apos;affichage.
          </span>
        </div>
      </div>
    </div>
  );
}

