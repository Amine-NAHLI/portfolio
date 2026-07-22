"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import ProjectSummaryCard from "@/components/projects/ProjectSummaryCard";
import { projectCategoryLabels, publicCopy } from "@/content/copy";
import type { Locale } from "@/i18n/config";
import type { PortfolioProject, ProjectCategory } from "@/types/content";

type ProjectExplorerProps = {
  locale: Locale;
  projects: PortfolioProject[];
};

type CategoryFilter = "all" | ProjectCategory;
type SortMode = "featured" | "alphabetical";

export default function ProjectExplorer({ locale, projects }: ProjectExplorerProps) {
  const copy = publicCopy[locale].projects;
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [sort, setSort] = useState<SortMode>("featured");

  const visibleProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase(locale);

    return projects
      .filter((project) => {
        const matchesCategory = category === "all" || project.categories.includes(category);
        const searchable = [
          project.title,
          project.subtitle[locale],
          project.summary[locale],
          ...project.technologies,
        ].join(" ").toLocaleLowerCase(locale);
        return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
      })
      .toSorted((first, second) => {
        if (sort === "alphabetical") return first.title.localeCompare(second.title, locale);
        return Number(second.featured) - Number(first.featured);
      });
  }, [category, locale, projects, query, sort]);

  function resetFilters() {
    setQuery("");
    setCategory("all");
    setSort("featured");
  }

  return (
    <div>
      <div className="grid gap-4 rounded-2xl border border-border bg-surface-subtle p-4 sm:grid-cols-2 lg:grid-cols-[1fr_15rem_14rem] lg:p-5">
        <label className="grid gap-2 text-sm font-medium text-text-primary">
          {copy.searchLabel}
          <span className="relative">
            <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={copy.searchPlaceholder}
              className="min-h-12 pl-10 pr-4 text-sm"
            />
          </span>
        </label>

        <label className="grid gap-2 text-sm font-medium text-text-primary">
          {copy.categoryLabel}
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value as CategoryFilter)}
            className="min-h-12 px-3 text-sm"
          >
            <option value="all">{copy.allCategories}</option>
            {(Object.keys(projectCategoryLabels) as ProjectCategory[]).map((value) => (
              <option key={value} value={value}>{projectCategoryLabels[value][locale]}</option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-medium text-text-primary sm:col-span-2 lg:col-span-1">
          {copy.sortLabel}
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortMode)}
            className="min-h-12 px-3 text-sm"
          >
            <option value="featured">{copy.sortFeatured}</option>
            <option value="alphabetical">{copy.sortAlphabetical}</option>
          </select>
        </label>
      </div>

      <p className="mt-6 text-sm text-text-muted" aria-live="polite">{copy.resultCount(visibleProjects.length)}</p>

      {visibleProjects.length > 0 ? (
        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleProjects.map((project) => (
            <ProjectSummaryCard key={project.slug} project={project} locale={locale} cta={copy.viewProject} />
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-border bg-surface p-8 text-center" role="status">
          <p className="text-text-secondary">{copy.empty}</p>
          <button type="button" className="button-secondary mt-5" onClick={resetFilters}>{copy.reset}</button>
        </div>
      )}
    </div>
  );
}

