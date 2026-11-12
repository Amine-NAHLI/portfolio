"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Code2, ExternalLink, LayoutGrid, ListFilter, Search, Sparkles } from "lucide-react";
import PortfolioEmptyState from "@/components/ui/PortfolioEmptyState";
import { publicCopy } from "@/content/copy";
import { getCategoryLabel, normalizeProjectCategories } from "@/lib/project-categories";
import type { Locale } from "@/i18n/config";
import type { PortfolioProject } from "@/types/content";
import SkillIcon from "@/components/ui/SkillIcon";

type ProjectExplorerProps = {
  locale: Locale;
  projects: PortfolioProject[];
};

type ViewMode = "grid" | "table";

export default function ProjectExplorer({ locale, projects }: ProjectExplorerProps) {
  const copy = publicCopy[locale].projects;
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const normalizedProjects = useMemo(() => {
    return projects.map((p) => ({
      ...p,
      normalizedCategories: normalizeProjectCategories(p.categories),
    }));
  }, [projects]);

  const categories = useMemo(() => {
    return Array.from(new Set(normalizedProjects.flatMap((p) => p.normalizedCategories)));
  }, [normalizedProjects]);

  const visibleProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase(locale);

    return normalizedProjects
      .filter((project) => {
        const matchesCategory = category === "all" || project.normalizedCategories.includes(category);
        const searchable = [
          project.title,
          project.subtitle[locale],
          project.summary[locale],
          ...project.technologies,
          ...project.normalizedCategories.map((c) => getCategoryLabel(c, locale)),
        ].join(" ").toLocaleLowerCase(locale);
        return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
      })
      .toSorted((first, second) => Number(second.featured) - Number(first.featured));
  }, [category, locale, normalizedProjects, query]);

  if (projects.length === 0) {
    return <PortfolioEmptyState collection="projects" locale={locale} />;
  }

  return (
    <div className="space-y-10">
      {/* Control Bar: Categories Filter Tabs + Search + View Mode Switcher */}
      <div className="flex flex-col gap-6 rounded-3xl border border-border-strong bg-surface p-5 sm:p-6 shadow-xl backdrop-blur-xl">
        
        {/* Top: Category Pill Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setCategory("all")}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                category === "all"
                  ? "bg-accent text-text-on-accent shadow-lg shadow-accent/20"
                  : "border border-border-strong bg-text-primary/[0.04] text-text-secondary hover:text-text-primary hover:border-accent/40"
              }`}
            >
              {copy.allCategories} ({projects.length})
            </button>
            {categories.map((cat) => {
              const label = getCategoryLabel(cat, locale);
              const count = normalizedProjects.filter((p) => p.normalizedCategories.includes(cat)).length;
              const isSelected = category === cat;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-accent text-text-on-accent shadow-lg shadow-accent/20"
                      : "border border-border-strong bg-text-primary/[0.04] text-text-secondary hover:text-text-primary hover:border-accent/40"
                  }`}
                >
                  {label} ({count})
                </button>
              );
            })}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 rounded-full border border-border-strong bg-text-primary/[0.04] p-1 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              aria-label="Vue Grille"
              className={`rounded-full p-2 text-xs transition-colors cursor-pointer ${
                viewMode === "grid"
                  ? "bg-accent text-text-on-accent"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              aria-label="Vue Liste Technique"
              className={`rounded-full p-2 text-xs transition-colors cursor-pointer ${
                viewMode === "table"
                  ? "bg-accent text-text-on-accent"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <ListFilter className="size-4" />
            </button>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="relative">
          <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={copy.searchPlaceholder}
            className="w-full rounded-2xl border border-border-strong bg-bg-page pl-11 pr-4 py-3.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Results Count Strip */}
      <div className="flex items-center justify-between text-xs text-text-secondary px-2">
        <span>
          {visibleProjects.length} {visibleProjects.length > 1 ? "projets affichés" : "projet affiché"}
        </span>
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("all");
            }}
            className="text-accent hover:underline cursor-pointer"
          >
            Réinitialiser la recherche
          </button>
        )}
      </div>

      {/* Mode 1: High-End Showcase Grid */}
      {viewMode === "grid" ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleProjects.map((project) => (
            <article
              key={project.slug}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border-strong bg-surface transition-all duration-300 hover:border-accent/45 hover:-translate-y-1 hover:shadow-2xl hover:shadow-accent/10"
            >
              {/* Cover / Media Area */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-subtle border-b border-border">
                {project.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="size-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-surface-raised to-surface-subtle">
                    <Code2 className="size-8 text-accent/60 mb-1.5" />
                    <span className="font-mono text-[10px] text-text-muted">Architecture & Code</span>
                  </div>
                )}

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />

                {/* Categories Pills overlay */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1 z-10 max-w-[80%]">
                  {project.normalizedCategories.slice(0, 2).map((cat) => {
                    const label = getCategoryLabel(cat, locale);
                    return (
                      <span
                        key={cat}
                        className="rounded-full border border-border-strong bg-surface-raised/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-semibold text-accent"
                      >
                        {label}
                      </span>
                    );
                  })}
                </div>

                {project.featured && (
                  <div className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 rounded-full border border-accent/35 bg-accent px-2 py-0.5 text-[9px] font-mono font-semibold text-text-on-accent backdrop-blur-md">
                    <Sparkles className="size-2.5 text-text-on-accent" />
                    <span>FEATURED</span>
                  </div>
                )}
              </div>

              {/* Body Content */}
              <div className="flex flex-col flex-1 p-5 justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold tracking-tight text-text-primary group-hover:text-accent transition-colors line-clamp-2 mb-1.5 leading-snug">
                    {project.title}
                  </h3>

                  <p className="text-[11px] font-semibold text-accent uppercase tracking-wider line-clamp-1 mb-3">
                    {project.subtitle[locale]}
                  </p>

                  <p className="text-xs text-text-secondary leading-relaxed line-clamp-2 mb-4">
                    {project.summary[locale]}
                  </p>

                  {/* Tech stack pills with SkillIcon */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-1 rounded-md border border-border bg-text-primary/[0.03] px-2 py-0.5 text-[10px] text-text-primary/85"
                      >
                        <SkillIcon name={tech} className="text-[12px]" />
                        <span>{tech}</span>
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="rounded-md border border-border bg-text-primary/[0.03] px-1.5 py-0.5 text-[10px] text-text-muted">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Action Row */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <Link
                    href={`/${locale}/projects/${project.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-text-primary/[0.05] border border-border-strong px-3.5 py-1.5 text-xs font-semibold text-text-primary transition-all hover:bg-accent hover:border-accent hover:text-text-on-accent"
                  >
                    <span>{copy.viewProject}</span>
                    <ArrowUpRight className="size-3" />
                  </Link>

                  <div className="flex items-center gap-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        title={copy.sourceCode}
                        className="size-8 rounded-full border border-border-strong bg-text-primary/[0.03] flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-accent/40 transition-colors"
                      >
                        <Code2 className="size-3.5" />
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        title={copy.liveDemo}
                        className="size-9 rounded-full border border-border-strong bg-text-primary/[0.03] flex items-center justify-center text-text-secondary hover:text-accent hover:border-accent/40 transition-colors"
                      >
                        <ExternalLink className="size-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        /* Mode 2: High-Density Technical Table / Dossier Mode */
        <div className="overflow-hidden rounded-3xl border border-border-strong bg-surface shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-text-secondary">
              <thead className="border-b border-border bg-text-primary/[0.03] font-mono text-xs uppercase tracking-wider text-accent">
                <tr>
                  <th className="py-4 px-6 font-semibold">Projet</th>
                  <th className="py-4 px-6 font-semibold">Catégorie</th>
                  <th className="py-4 px-6 font-semibold hidden md:table-cell">Stack & Architecture</th>
                  <th className="py-4 px-6 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {visibleProjects.map((project) => (
                  <tr
                    key={project.slug}
                    className="group transition-colors hover:bg-text-primary/[0.02]"
                  >
                    <td className="py-4 px-6">
                      <Link
                        href={`/${locale}/projects/${project.slug}`}
                        className="font-display font-bold text-text-primary group-hover:text-accent transition-colors block"
                      >
                        {project.title}
                      </Link>
                      <span className="text-xs text-text-secondary line-clamp-1 mt-0.5">
                        {project.subtitle[locale]}
                      </span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      {project.normalizedCategories.slice(0, 2).map((cat) => (
                        <span
                          key={cat}
                          className="mr-1.5 rounded-full border border-border-strong bg-text-primary/[0.03] px-2.5 py-0.5 text-[11px] font-medium text-accent"
                        >
                          {getCategoryLabel(cat, locale)}
                        </span>
                      ))}
                    </td>
                    <td className="py-4 px-6 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1.5 max-w-md">
                        {project.technologies.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="rounded-md border border-border bg-text-primary/[0.03] px-2 py-0.5 text-xs text-text-primary/85"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <Link
                        href={`/${locale}/projects/${project.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-text-primary transition-colors"
                      >
                        <span>Étude de cas</span>
                        <ArrowUpRight className="size-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
