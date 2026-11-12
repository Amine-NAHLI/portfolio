import type { SupabaseClient } from "@supabase/supabase-js";
import { Images } from "lucide-react";
import { requireAdminPage } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";
import {
  ProjectGalleryManager,
  type AdminGalleryPhoto,
  type AdminProjectWithGallery,
} from "@/components/admin/ProjectGalleryManager";

export const metadata = {
  title: "Galerie Photos Projets — Administration",
};

export const dynamic = "force-dynamic";

type ProjectGalleryPageProps = {
  searchParams: Promise<{ project?: string }>;
};

interface JoinedMediaAsset {
  id: string;
  storage_path: string;
  original_name: string | null;
  mime_type: string | null;
  size_bytes: number | null;
  alt_fr: string | null;
  alt_en: string | null;
}

interface JoinedProjectMedia {
  project_id: string;
  media_id: string;
  sort_order: number;
  media_assets: JoinedMediaAsset | JoinedMediaAsset[] | null;
}

export default async function AdminProjectGalleryPage({ searchParams }: ProjectGalleryPageProps) {
  await requireAdminPage();
  const resolvedSearchParams = await searchParams;
  const supabase = await createClient();
  const db = supabase as unknown as SupabaseClient;

  const [projectsRes, translationsRes, mediaRes] = await Promise.all([
    supabase
      .from("projects")
      .select("id, slug, sort_order, created_at")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false }),
    supabase.from("project_translations").select("project_id, locale, title"),
    db
      .from("project_media")
      .select("project_id, media_id, sort_order, media_assets(id, storage_path, original_name, mime_type, size_bytes, alt_fr, alt_en)")
      .order("sort_order", { ascending: true }),
  ]);

  const titlesMap = new Map<string, { titleFr: string; titleEn: string }>();
  for (const row of translationsRes.data ?? []) {
    const existing = titlesMap.get(row.project_id) ?? { titleFr: "", titleEn: "" };
    if (row.locale === "fr") existing.titleFr = row.title || "";
    if (row.locale === "en") existing.titleEn = row.title || "";
    titlesMap.set(row.project_id, existing);
  }

  const photosByProject = new Map<string, AdminGalleryPhoto[]>();
  for (const item of (mediaRes.data as JoinedProjectMedia[] | null) ?? []) {
    const asset = Array.isArray(item.media_assets) ? item.media_assets[0] : item.media_assets;
    if (!asset?.storage_path) continue;
    const { data: urlData } = supabase.storage.from("portfolio-media").getPublicUrl(asset.storage_path);
    const list = photosByProject.get(item.project_id) ?? [];
    list.push({
      mediaId: item.media_id,
      url: urlData.publicUrl,
      originalName: asset.original_name ?? "image",
      mimeType: asset.mime_type ?? "image/png",
      sizeBytes: asset.size_bytes ?? 0,
      altFr: asset.alt_fr ?? null,
      altEn: asset.alt_en ?? null,
    });
    photosByProject.set(item.project_id, list);
  }

  const projects: AdminProjectWithGallery[] = (projectsRes.data ?? []).map((project) => {
    const titles = titlesMap.get(project.id);
    return {
      id: project.id,
      slug: project.slug,
      titleFr: titles?.titleFr || titles?.titleEn || project.slug,
      titleEn: titles?.titleEn || titles?.titleFr || project.slug,
      photos: photosByProject.get(project.id) ?? [],
    };
  });

  return (
    <div className="max-w-7xl w-full mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 border-b border-border/50 pb-6">
        <div className="p-3 bg-surface border border-border/50 rounded-xl">
          <Images className="size-6 text-accent" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary tracking-tight">
            Galerie &amp; Ordre des Photos par Projet
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Visualisez toutes les photos associées à chaque projet, ajoutez ou supprimez des captures et définissez leur ordre exact d&apos;affichage.
          </p>
        </div>
      </div>

      <ProjectGalleryManager
        projects={projects}
        initialProjectId={resolvedSearchParams.project}
      />
    </div>
  );
}

