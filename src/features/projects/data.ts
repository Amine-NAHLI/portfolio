import "server-only";

import { unstable_cache } from "next/cache";
import { hasSupabasePublicConfig } from "@/lib/env/supabase";
import { createPublicClient } from "@/lib/supabase/public";
import type { Locale } from "@/i18n/config";
import type { Json } from "@/types/database";
import type { PortfolioProject, ProjectCategory } from "@/types/content";

const allowedCategories = new Set<ProjectCategory>(["software", "cybersecurity", "artificial-intelligence", "embedded"]);

async function queryPublishedProjects(locale: Locale): Promise<PortfolioProject[]> {
  if (!hasSupabasePublicConfig()) return [];
  const supabase = createPublicClient();

  try {
    const [projectsResult, translationsResult] = await Promise.all([
      supabase.from("projects").select("*").order("sort_order", { ascending: true }).order("published_at", { ascending: false }),
      supabase.from("project_translations").select("*").eq("review_status", "validated"),
    ] as const);

    if (projectsResult.error || translationsResult.error) {
      return [];
    }

    const translationsByProject = new Map<string, Map<Locale, (typeof translationsResult.data)[number]>>();
    for (const translation of translationsResult.data ?? []) {
      const current = translationsByProject.get(translation.project_id) ?? new Map();
      current.set(translation.locale, translation);
      translationsByProject.set(translation.project_id, current);
    }

    const projects = (projectsResult.data ?? []).flatMap((project) => {
      const translations = translationsByProject.get(project.id);
      const french = translations?.get("fr");
      const english = translations?.get("en");
      const selected = translations?.get(locale);
      if (!french || !english || !selected || !french.problem || !english.problem || !french.solution || !english.solution) return [];

      const technologies = Array.isArray(project.technologies) ? project.technologies.filter((t): t is string => typeof t === "string") : [];
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
    return projects;
  } catch {
    return [];
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

export async function getProjectGallery(slug: string) {
  if (!hasSupabasePublicConfig()) return [];
  const supabase = createPublicClient();
  try {
    const { data: project } = await supabase.from('projects').select('id').eq('slug', slug).single();
    if (!project) return [];

    const { data, error } = await supabase
      .from('project_media')
      .select('media_id, media_assets(storage_path, alt_fr, alt_en)')
      .eq('project_id', project.id)
      .order('sort_order', { ascending: true });
    
    if (error || !data) return [];

    interface MediaAssets { storage_path: string; alt_fr?: string | null; alt_en?: string | null; }
    interface ProjectMediaItem { media_id: string; media_assets: MediaAssets | MediaAssets[] | null; }

    return (data as unknown as ProjectMediaItem[]).map(item => {
      const assets = Array.isArray(item.media_assets) ? item.media_assets[0] : item.media_assets;
      const storagePath = assets?.storage_path;
      const { data: publicUrlData } = supabase.storage.from('portfolio-media').getPublicUrl(storagePath || "");
      return {
        mediaId: item.media_id,
        storagePath,
        url: publicUrlData.publicUrl,
        altFr: assets?.alt_fr ?? null,
        altEn: assets?.alt_en ?? null
      };
    }).filter(item => item.storagePath);
  } catch {
    return [];
  }
}

