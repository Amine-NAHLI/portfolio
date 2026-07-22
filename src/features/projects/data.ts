import "server-only";

import { unstable_cache } from "next/cache";
import { projects as codeManagedProjects } from "@/content/portfolio";
import { hasSupabasePublicConfig } from "@/lib/env/supabase";
import { createPublicClient } from "@/lib/supabase/public";
import type { Locale } from "@/i18n/config";
import type { Json } from "@/types/database";
import type { PortfolioProject, ProjectCategory } from "@/types/content";

const allowedCategories = new Set<ProjectCategory>(["software", "cybersecurity", "artificial-intelligence", "embedded"]);

async function queryPublishedProjects(locale: Locale): Promise<PortfolioProject[]> {
  if (!hasSupabasePublicConfig()) return codeManagedProjects;
  const supabase = createPublicClient();

  try {
    const [settingsResult, projectsResult, translationsResult, relationsResult, skillsResult] = await Promise.all([
      supabase.from("site_settings").select("value").eq("key", "projects.source").eq("is_public", true).maybeSingle(),
      supabase.from("projects").select("*").order("sort_order", { ascending: true }).order("published_at", { ascending: false }),
      supabase.from("project_translations").select("*").eq("review_status", "validated"),
      supabase.from("project_skills").select("*"),
      supabase.from("skills").select("id, name"),
    ] as const);

    if (settingsResult.error || projectsResult.error || translationsResult.error || relationsResult.error || skillsResult.error) {
      return codeManagedProjects;
    }

    // Code-managed content remains the safe default until an administrator
    // explicitly confirms that the bilingual CMS collection is ready.
    if (settingsResult.data?.value !== "cms") return codeManagedProjects;

    const translationsByProject = new Map<string, Map<Locale, (typeof translationsResult.data)[number]>>();
    for (const translation of translationsResult.data ?? []) {
      const current = translationsByProject.get(translation.project_id) ?? new Map();
      current.set(translation.locale, translation);
      translationsByProject.set(translation.project_id, current);
    }

    const skillById = new Map((skillsResult.data ?? []).map((skill) => [skill.id, skill.name]));
    const skillIdsByProject = new Map<string, string[]>();
    for (const relation of relationsResult.data ?? []) {
      const current = skillIdsByProject.get(relation.project_id) ?? [];
      current.push(relation.skill_id);
      skillIdsByProject.set(relation.project_id, current);
    }

    return (projectsResult.data ?? []).flatMap((project) => {
      const translations = translationsByProject.get(project.id);
      const french = translations?.get("fr");
      const english = translations?.get("en");
      const selected = translations?.get(locale);
      if (!french || !english || !selected || !french.problem || !english.problem || !french.solution || !english.solution) return [];

      const technologies = (skillIdsByProject.get(project.id) ?? []).flatMap((skillId) => {
        const name = skillById.get(skillId);
        return name ? [name] : [];
      });
      if (technologies.length === 0 && project.primary_language) technologies.push(project.primary_language);

      return [{
        slug: project.slug,
        title: selected.title,
        subtitle: { fr: french.subtitle ?? "", en: english.subtitle ?? "" },
        summary: { fr: french.summary, en: english.summary },
        problem: { fr: french.problem, en: english.problem },
        objectives: localizeArray(french.objectives, english.objectives),
        solution: { fr: french.solution, en: english.solution },
        architecture: localizeArray(french.architecture, english.architecture),
        results: localizeArray(french.results, english.results),
        technologies,
        categories: project.categories.filter(isProjectCategory),
        featured: project.featured,
        githubUrl: project.github_url ?? undefined,
        demoUrl: project.demo_url ?? undefined,
      } satisfies PortfolioProject];
    });
  } catch {
    return codeManagedProjects;
  }
}

function localizeArray(french: Json, english: Json): Array<Record<Locale, string>> {
  const fr = toStringArray(french);
  const en = toStringArray(english);
  return fr.slice(0, Math.min(fr.length, en.length)).map((value, index) => ({ fr: value, en: en[index] }));
}

function toStringArray(value: Json): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0) : [];
}

function isProjectCategory(value: string): value is ProjectCategory {
  return allowedCategories.has(value as ProjectCategory);
}

const getFrenchProjects = unstable_cache(() => queryPublishedProjects("fr"), ["published-projects-fr"], { revalidate: 900, tags: ["projects"] });
const getEnglishProjects = unstable_cache(() => queryPublishedProjects("en"), ["published-projects-en"], { revalidate: 900, tags: ["projects"] });

export function getPublishedProjects(locale: Locale): Promise<PortfolioProject[]> {
  return locale === "fr" ? getFrenchProjects() : getEnglishProjects();
}

export async function getPublishedProject(locale: Locale, slug: string): Promise<PortfolioProject | null> {
  const projects = await getPublishedProjects(locale);
  return projects.find((project) => project.slug === slug) ?? null;
}
