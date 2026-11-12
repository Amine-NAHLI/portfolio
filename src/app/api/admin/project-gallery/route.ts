import { NextResponse, type NextRequest } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath, revalidateTag } from "next/cache";
import { getAdminContext } from "@/lib/auth/admin";
import { acceptsSameOriginMutation, readJsonObject } from "@/lib/security/request";

export const runtime = "nodejs";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function fail(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: { "Cache-Control": "private, no-store" } });
}

async function deleteUnusedMediaAsset(db: SupabaseClient, mediaId: string) {
  const [pmRes, projRes, certDocRes, certBadgeRes] = await Promise.all([
    db.from("project_media").select("media_id", { count: "exact", head: true }).eq("media_id", mediaId),
    db.from("projects").select("id", { count: "exact", head: true }).eq("cover_media_id", mediaId),
    db.from("certifications").select("id", { count: "exact", head: true }).eq("document_media_id", mediaId),
    db.from("certifications").select("id", { count: "exact", head: true }).eq("badge_media_id", mediaId),
  ]);

  const refCount =
    (pmRes.count ?? 0) +
    (projRes.count ?? 0) +
    (certDocRes.count ?? 0) +
    (certBadgeRes.count ?? 0);

  if (refCount > 0) return;

  const { data: media } = await db
    .from("media_assets")
    .select("bucket_id, storage_path")
    .eq("id", mediaId)
    .maybeSingle();

  if (!media) return;

  await db.storage.from(media.bucket_id).remove([media.storage_path]);
  await db.from("media_assets").delete().eq("id", mediaId);
}

export async function PUT(request: NextRequest) {
  if (!acceptsSameOriginMutation(request)) return fail("Requête refusée.", 403);

  const context = await getAdminContext();
  if (!context) return fail("Non autorisé.", 401);

  const body = await readJsonObject(request);
  const projectId = typeof body?.projectId === "string" ? body.projectId.trim() : "";
  if (!UUID_REGEX.test(projectId)) return fail("Identifiant du projet invalide.", 422);

  if (!Array.isArray(body?.mediaIds)) return fail("Liste des photos invalide.", 422);

  const seen = new Set<string>();
  const orderedMediaIds: string[] = [];
  for (const rawId of body.mediaIds) {
    if (typeof rawId !== "string" || !UUID_REGEX.test(rawId.trim())) {
      return fail("Identifiant de photo invalide.", 422);
    }
    const cleanId = rawId.trim();
    if (!seen.has(cleanId)) {
      seen.add(cleanId);
      orderedMediaIds.push(cleanId);
    }
  }

  const db = context.supabase as unknown as SupabaseClient;

  const { data: project, error: projectError } = await db
    .from("projects")
    .select("id, slug")
    .eq("id", projectId)
    .maybeSingle();

  if (projectError || !project) return fail("Projet introuvable.", 404);

  const { data: existingRows } = await db
    .from("project_media")
    .select("media_id")
    .eq("project_id", projectId);

  const previousIds = new Set<string>((existingRows ?? []).map((row: { media_id: string }) => row.media_id));
  const removedIds = [...previousIds].filter((id) => !seen.has(id));

  const { error: deleteError } = await db
    .from("project_media")
    .delete()
    .eq("project_id", projectId);

  if (deleteError) return fail("Impossible de mettre à jour la galerie.", 500);

  if (orderedMediaIds.length > 0) {
    const rowsToInsert = orderedMediaIds.map((mediaId, index) => ({
      project_id: projectId,
      media_id: mediaId,
      sort_order: index,
    }));

    const { error: insertError } = await db.from("project_media").insert(rowsToInsert);
    if (insertError) return fail("Impossible d'enregistrer l'ordre des photos.", 500);

    const { error: publishError } = await db
      .from("media_assets")
      .update({ publication_status: "published" })
      .in("id", orderedMediaIds);

    if (publishError) return fail("Impossible de publier certaines photos.", 500);
  }

  for (const removedId of removedIds) {
    try {
      await deleteUnusedMediaAsset(db, removedId);
    } catch (cleanupError) {
      console.error("Project gallery asset cleanup failed", {
        projectId,
        mediaId: removedId,
        error: cleanupError instanceof Error ? cleanupError.message : String(cleanupError),
      });
    }
  }

  await context.supabase.from("audit_logs").insert({
    actor_id: context.userId,
    action: "update",
    entity_type: "project_media",
    entity_id: projectId,
    details: { count: orderedMediaIds.length, removed: removedIds.length },
  });

  revalidateTag("portfolio");
  revalidateTag("projects");
  revalidatePath("/", "layout");
  revalidatePath("/fr");
  revalidatePath("/en");
  revalidatePath("/fr/projects");
  revalidatePath("/en/projects");
  revalidatePath(`/fr/projects/${project.slug}`);
  revalidatePath(`/en/projects/${project.slug}`);
  revalidatePath("/admin/projects");
  revalidatePath("/admin/project-gallery");

  return NextResponse.json(
    { success: true, count: orderedMediaIds.length },
    { headers: { "Cache-Control": "private, no-store" } }
  );
}

