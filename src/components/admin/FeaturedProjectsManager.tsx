"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Check,
  FolderKanban,
  Layers,
  Loader2,
  Plus,
  RotateCcw,
  Save,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { saveFeaturedHomeProjects } from "@/app/admin/(protected)/featured-projects/actions";

export interface AdminProjectOption {
  id: string;
  slug: string;
  titleFr: string;
  titleEn: string;
  summaryFr?: string | null;
  categories: string[];
  technologies: string[];
  featured: boolean;
  coverImage?: string | null;
}

interface FeaturedProjectsManagerProps {
  allProjects: AdminProjectOption[];
  initialFeaturedSlugs: string[];
}

export function FeaturedProjectsManager({
  allProjects,
  initialFeaturedSlugs,
}: FeaturedProjectsManagerProps) {
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(initialFeaturedSlugs);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Map to quickly retrieve project metadata by slug
  const projectMap = new Map(allProjects.map((p) => [p.slug, p]));

  // Get all unique categories for filtering
  const allCategories = Array.from(
    new Set(allProjects.flatMap((p) => p.categories || []))
  ).filter(Boolean);

  const handleAddProject = (slug: string) => {
    if (selectedSlugs.includes(slug)) return;
    if (selectedSlugs.length >= 4) {
      setStatus({
        type: "error",
        message: "Vous avez déjà sélectionné 4 projets. Retirez-en un pour en ajouter un autre.",
      });
      return;
    }
    setSelectedSlugs([...selectedSlugs, slug]);
    setStatus(null);
  };

  const handleRemoveSlot = (index: number) => {
    const updated = selectedSlugs.filter((_, idx) => idx !== index);
    setSelectedSlugs(updated);
    setStatus(null);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...selectedSlugs];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setSelectedSlugs(updated);
    setStatus(null);
  };

  const handleMoveDown = (index: number) => {
    if (index >= selectedSlugs.length - 1) return;
    const updated = [...selectedSlugs];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setSelectedSlugs(updated);
    setStatus(null);
  };

  const handleReset = () => {
    setSelectedSlugs(initialFeaturedSlugs);
    setStatus(null);
  };

  const handleSave = () => {
    startTransition(async () => {
      setStatus(null);
      const res = await saveFeaturedHomeProjects(selectedSlugs);
      if (res.error) {
        setStatus({ type: "error", message: res.error });
      } else {
        setStatus({
          type: "success",
          message: "✓ Configuration enregistrée ! Les 4 projets sélectionnés sont maintenant en direct sur la page d'accueil.",
        });
      }
    });
  };

  // Filter available projects for the catalog
  const filteredProjects = allProjects.filter((p) => {
    const matchesQuery =
      searchQuery.trim() === "" ||
      p.titleFr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "all" || p.categories.includes(selectedCategory);

    return matchesQuery && matchesCategory;
  });

  return (
    <div className="space-y-10">
      {/* Top Banner with Stats & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-surface/70 p-5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-accent/15 border border-accent/30 text-accent">
            <Layers className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-sm font-bold uppercase tracking-wider text-text-primary">
                Cartes Empilées Accueil
              </h2>
              <span
                className={`rounded-full px-2.5 py-0.5 font-mono text-[11px] font-bold ${
                  selectedSlugs.length === 4
                    ? "border border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
                    : "border border-amber-500/30 bg-amber-500/15 text-amber-300"
                }`}
              >
                {selectedSlugs.length} / 4 Sélectionnés
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              Glissez ou ordonnez les 4 cartes dans l&apos;ordre exact de leur empilement cinématique.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-surface-raised px-4 py-2.5 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-white/10 transition-all disabled:opacity-50"
          >
            <RotateCcw className="size-3.5" />
            <span>Réinitialiser</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-xs font-bold text-text-on-accent shadow-lg shadow-accent/25 hover:bg-accent/90 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            <span>Enregistrer la Sélection</span>
          </button>
        </div>
      </div>

      {/* Status Feedback Alerts */}
      {status?.type === "error" && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-medium text-red-300 animate-in fade-in">
          {status.message}
        </div>
      )}
      {status?.type === "success" && (
        <div className="flex items-center justify-between rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-medium text-emerald-300 animate-in fade-in">
          <span>{status.message}</span>
          <Link
            href="/fr#work"
            target="_blank"
            className="inline-flex items-center gap-1 font-mono text-xs font-bold uppercase tracking-wider text-emerald-400 hover:underline ml-4"
          >
            <span>Voir en direct</span>
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      )}

      {/* The 4 Stacking Slots */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-text-muted flex items-center gap-2">
            <Sparkles className="size-3.5 text-accent" />
            <span>Ordre des 4 Cartes (De haut en bas)</span>
          </h3>
          <span className="font-mono text-[11px] text-text-muted">
            Slot 01 = Première carte au-dessus · Slot 04 = Dernière carte en bas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((slotIndex) => {
            const slug = selectedSlugs[slotIndex];
            const project = slug ? projectMap.get(slug) : null;

            if (project) {
              return (
                <div
                  key={`slot-${slotIndex}-${slug}`}
                  className="group relative flex flex-col justify-between rounded-2xl border border-accent/40 bg-surface/90 p-4 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-accent hover:shadow-accent/10"
                >
                  <div>
                    {/* Slot Header with Controls */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                      <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-accent">
                        <span className="grid size-5 place-items-center rounded-md bg-accent/20 text-[10px]">
                          0{slotIndex + 1}
                        </span>
                        <span className="text-[11px] uppercase tracking-wider">
                          {slotIndex === 0 ? "Dessus" : slotIndex === 3 ? "Fond" : `Slot 0${slotIndex + 1}`}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveUp(slotIndex)}
                          disabled={slotIndex === 0}
                          title="Déplacer vers le haut"
                          className="grid size-7 place-items-center rounded-lg border border-white/10 bg-surface-raised text-text-secondary hover:text-white hover:bg-white/10 transition-colors disabled:opacity-25"
                        >
                          <ArrowUp className="size-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveDown(slotIndex)}
                          disabled={slotIndex === selectedSlugs.length - 1}
                          title="Déplacer vers le bas"
                          className="grid size-7 place-items-center rounded-lg border border-white/10 bg-surface-raised text-text-secondary hover:text-white hover:bg-white/10 transition-colors disabled:opacity-25"
                        >
                          <ArrowDown className="size-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveSlot(slotIndex)}
                          title="Retirer de l'accueil"
                          className="grid size-7 place-items-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors ml-1"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    </div>

                    {/* Cover Thumbnail / Placeholder */}
                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-surface-deep border border-white/5 mb-3 flex items-center justify-center">
                      {project.coverImage ? (
                        <Image
                          src={project.coverImage}
                          alt={project.titleFr}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 280px"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center p-3 text-text-muted">
                          <FolderKanban className="size-6 text-accent/60 mb-1" />
                          <span className="font-mono text-[10px] uppercase">
                            {project.categories[0] || "Projet"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Title & Slug */}
                    <h4 className="font-display text-sm font-bold text-text-primary line-clamp-2 leading-snug">
                      {project.titleFr}
                    </h4>
                    <p className="font-mono text-[10px] text-text-muted truncate mt-1">
                      /{project.slug}
                    </p>
                  </div>

                  {/* Categories Strip */}
                  <div className="flex flex-wrap gap-1.5 pt-3 mt-3 border-t border-white/5">
                    {project.categories.slice(0, 3).map((cat) => (
                      <span
                        key={cat}
                        className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-text-secondary"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              );
            }

            // Empty Slot State
            return (
              <div
                key={`empty-slot-${slotIndex}`}
                className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/15 bg-surface/30 p-6 text-center transition-all hover:border-accent/40 hover:bg-surface/50 min-h-[220px]"
              >
                <div className="grid size-9 place-items-center rounded-xl border border-white/10 bg-surface-raised text-text-muted mb-2 font-mono text-xs font-bold">
                  0{slotIndex + 1}
                </div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-text-primary">
                  Emplacement Libre
                </span>
                <p className="text-[11px] text-text-muted max-w-[180px] mt-1 leading-normal">
                  Cliquez sur &quot;Ajouter&quot; sur un projet ci-dessous pour remplir ce slot.
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Available Projects Library Section */}
      <div className="space-y-6 pt-4 border-t border-white/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-lg font-bold uppercase tracking-tight text-text-primary">
              Bibliothèque des Projets Publiés ({allProjects.length})
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Sélectionnez les projets que vous souhaitez propulser sur la vitrine cinématique.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-text-muted" />
            <input
              type="text"
              placeholder="Rechercher un projet, techno..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-surface/70 pl-10 pr-4 py-2 text-xs text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`rounded-full px-3 py-1 font-mono text-xs font-semibold transition-all ${
              selectedCategory === "all"
                ? "bg-accent text-text-on-accent shadow-md shadow-accent/20"
                : "border border-white/10 bg-surface-raised text-text-secondary hover:text-text-primary hover:bg-white/10"
            }`}
          >
            Tous ({allProjects.length})
          </button>
          {allCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3 py-1 font-mono text-xs font-semibold capitalize transition-all ${
                selectedCategory === cat
                  ? "bg-accent text-text-on-accent shadow-md shadow-accent/20"
                  : "border border-white/10 bg-surface-raised text-text-secondary hover:text-text-primary hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => {
            const isSelected = selectedSlugs.includes(project.slug);
            const slotIndex = selectedSlugs.indexOf(project.slug);

            return (
              <div
                key={project.id}
                className={`relative flex flex-col justify-between rounded-2xl border p-4 backdrop-blur-xl transition-all duration-300 ${
                  isSelected
                    ? "border-accent/60 bg-accent/[0.04] shadow-lg shadow-accent/5 ring-1 ring-accent/30"
                    : "border-white/10 bg-surface/70 hover:border-white/20 hover:bg-surface-raised/80"
                }`}
              >
                <div>
                  {/* Top Bar with Status Badge & Quick Action */}
                  <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 font-mono text-[11px] font-bold text-emerald-400">
                          <Check className="size-3" />
                          <span>Slot 0{slotIndex + 1} Actif</span>
                        </span>
                      ) : (
                        <span className="font-mono text-[11px] text-text-muted uppercase">
                          Disponible
                        </span>
                      )}
                    </div>

                    {isSelected ? (
                      <button
                        type="button"
                        onClick={() => handleRemoveSlot(slotIndex)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X className="size-3.5" />
                        <span>Retirer</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleAddProject(project.slug)}
                        disabled={selectedSlugs.length >= 4}
                        className="inline-flex items-center gap-1 rounded-lg bg-accent/20 border border-accent/40 px-2.5 py-1 font-mono text-xs font-bold text-accent hover:bg-accent hover:text-text-on-accent transition-all disabled:opacity-30 disabled:pointer-events-none"
                      >
                        <Plus className="size-3.5" />
                        <span>Choisir</span>
                      </button>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h4 className="font-display text-sm font-bold text-text-primary leading-snug">
                    {project.titleFr}
                  </h4>
                  {project.summaryFr && (
                    <p className="text-xs text-text-secondary line-clamp-2 mt-1.5 leading-relaxed">
                      {project.summaryFr}
                    </p>
                  )}
                </div>

                {/* Tags & Tech Footer */}
                <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1">
                    {project.categories.map((c) => (
                      <span
                        key={c}
                        className="rounded border border-white/10 bg-white/[0.02] px-1.5 py-0.5 font-mono text-[9px] uppercase text-text-muted"
                      >
                        {c}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/fr/projects/${project.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 font-mono text-[10px] text-text-muted hover:text-accent transition-colors"
                  >
                    <span>Fiche</span>
                    <ArrowUpRight className="size-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

