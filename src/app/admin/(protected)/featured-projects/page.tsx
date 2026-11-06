import { requireAdminPage } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";
import {
  FeaturedProjectsManager,
  type AdminProjectOption,
} from "@/components/admin/FeaturedProjectsManager";
import { Layers } from "lucide-react";

export const metadata = {
  title: "Projets Accueil (4) — Administration",
};

export default async function FeaturedProjectsPage() {
  await requireAdminPage();
  const supabase = await createClient();

  // 1. Fetch current featured slugs from site_settings
  const { data: settingsData } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "featured_home_projects")
    .single();

  let initialFeaturedSlugs: string[] = [];
  if (settingsData?.value && Array.isArray(settingsData.value)) {
    initialFeaturedSlugs = settingsData.value as string[];
  }

  // 2. Query all projects with translations and media
  const [projectsRes, translationsRes, mediaRes] = await Promise.all([
    supabase
      .from("projects")
      .select("id, slug, featured, categories, technologies, sort_order")
      .order("sort_order", { ascending: true }),
    supabase.from("project_translations").select("project_id, locale, title, summary"),
    supabase
      .from("project_media")
      .select("project_id, media_assets(storage_path)")
      .order("sort_order", { ascending: true }),
  ]);

  const translationsMap = new Map<string, { titleFr: string; titleEn: string; summaryFr?: string }>();
  for (const t of translationsRes.data ?? []) {
    const existing = translationsMap.get(t.project_id) || { titleFr: "", titleEn: "" };
    if (t.locale === "fr") {
      existing.titleFr = t.title || "";
      existing.summaryFr = t.summary || undefined;
    } else if (t.locale === "en") {
      existing.titleEn = t.title || "";
    }
    translationsMap.set(t.project_id, existing);
  }

  const mediaMap = new Map<string, string>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const m of (mediaRes.data as any[]) ?? []) {
    if (!mediaMap.has(m.project_id)) {
      const asset = Array.isArray(m.media_assets) ? m.media_assets[0] : m.media_assets;
      if (asset?.storage_path) {
        const { data: urlData } = supabase.storage
          .from("portfolio-media")
          .getPublicUrl(asset.storage_path);
        mediaMap.set(m.project_id, urlData.publicUrl);
      }
    }
  }

  const allProjects: AdminProjectOption[] = (projectsRes.data ?? []).map((p) => {
    const trans = translationsMap.get(p.id) || { titleFr: p.slug, titleEn: p.slug };
    const technologies = Array.isArray(p.technologies)
      ? p.technologies.filter((t): t is string => typeof t === "string")
      : [];
    const categories = Array.isArray(p.categories) ? p.categories : [];

    return {
      id: p.id,
      slug: p.slug,
      titleFr: trans.titleFr || p.slug,
      titleEn: trans.titleEn || p.slug,
      summaryFr: trans.summaryFr,
      categories,
      technologies,
      featured: Boolean(p.featured),
      coverImage: mediaMap.get(p.id) || null,
    };
  });

  // If no featured slugs are configured yet, default to the first 4 projects
  if (initialFeaturedSlugs.length === 0 && allProjects.length > 0) {
    initialFeaturedSlugs = allProjects.slice(0, 4).map((p) => p.slug);
  }

  return (
    <div className="max-w-6xl w-full mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border/50 pb-6">
        <div className="p-3 bg-surface border border-border/50 rounded-xl">
          <Layers className="size-6 text-accent" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary tracking-tight">
            Sélection des 4 Projets de l&apos;Accueil
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Définissez les 4 projets phares affichés sous forme de cartes empilées cinématiques sur la page d&apos;accueil.
          </p>
        </div>
      </div>

      {/* Main Manager Component */}
      <FeaturedProjectsManager
        allProjects={allProjects}
        initialFeaturedSlugs={initialFeaturedSlugs}
      />
    </div>
  );
}

