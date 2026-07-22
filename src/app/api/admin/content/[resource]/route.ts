import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { adminResources, isAdminResourceKey } from "@/features/admin/resources";
import { validatePrimaryKey, validateResourcePayload } from "@/features/admin/validation";
import { getAdminContext } from "@/lib/auth/admin";
import {
  createAdminRecord,
  deleteAdminRecord,
  getAdminRecord,
  updateAdminRecord,
  writeAuditLog,
} from "@/lib/admin/content-repository";
import { acceptsSameOriginMutation, readJsonObject } from "@/lib/security/request";

type RouteContext = { params: Promise<{ resource: string }> };

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: { "Cache-Control": "private, no-store" } });
}

async function getRequestContext(request: NextRequest, routeContext: RouteContext) {
  if (!acceptsSameOriginMutation(request)) return { error: errorResponse("Requête refusée.", 403) } as const;

  const context = await getAdminContext();
  if (!context) return { error: errorResponse("Non autorisé.", 401) } as const;

  const { resource } = await routeContext.params;
  if (!isAdminResourceKey(resource)) return { error: errorResponse("Ressource inconnue.", 404) } as const;
  return { context, config: adminResources[resource] } as const;
}

function enrichPayload(
  table: string,
  mode: "create" | "update",
  userId: string,
  payload: Record<string, unknown>,
) {
  const enriched = { ...payload };
  if (table === "projects" || table === "blog_posts") {
    if (mode === "create") enriched.created_by = userId;
    enriched.updated_by = userId;
    if (enriched.publication_status === "published" && !enriched.published_at) {
      enriched.published_at = new Date().toISOString();
    }
  }

  if (table === "ai_jobs" && enriched.status === "validated") {
    enriched.reviewed_by = userId;
    enriched.reviewed_at = new Date().toISOString();
  }

  if (table === "contact_messages" && typeof enriched.status === "string") {
    if (enriched.status === "read" || enriched.status === "replied") enriched.read_at = new Date().toISOString();
    if (enriched.status === "archived") enriched.archived_at = new Date().toISOString();
    if (enriched.status === "new") {
      enriched.read_at = null;
      enriched.archived_at = null;
    }
  }

  return enriched;
}

function mutationFailure(errorCode: string | null) {
  if (errorCode === "23505") return errorResponse("Un contenu avec cette clé existe déjà.", 409);
  if (errorCode === "23503") return errorResponse("Une relation liée est introuvable ou empêche cette action.", 409);
  if (errorCode === "23514") return errorResponse("Les données ne respectent pas les contraintes attendues.", 422);
  return errorResponse("L'opération n'a pas pu être enregistrée.", 500);
}

function revalidateResource(table: string, key: string) {
  revalidatePath(`/admin/${key}`);
  if (table === "projects" || table === "project_translations" || table === "project_skills" || table === "skills" || table === "site_settings") {
    revalidateTag("projects");
  }
  if (table === "blog_posts" || table === "blog_post_translations" || table === "categories" || table === "tags") {
    revalidateTag("blog");
  }
}

async function validatePublication(
  context: NonNullable<Awaited<ReturnType<typeof getAdminContext>>>,
  table: string,
  id: string | number | null,
  payload: Record<string, unknown>,
): Promise<string | null> {
  const status = payload.publication_status;
  if (status !== "published" && status !== "scheduled") return null;
  if (status === "scheduled" && (typeof payload.published_at !== "string" || Date.parse(payload.published_at) <= Date.now())) {
    return "Une publication programmée exige une date future.";
  }

  if (table === "projects" || table === "blog_posts") {
    if (typeof id !== "string") return "Enregistrez d’abord le brouillon avant de préparer ses traductions.";
    if (table === "projects") {
      const { data, error } = await context.supabase
        .from("project_translations")
        .select("locale, review_status, title, summary, problem, objectives, solution, architecture, results")
        .eq("project_id", id)
        .eq("review_status", "validated");
      if (error || !data) return "Les traductions n’ont pas pu être vérifiées.";
      const completeLocales = new Set(data.filter((translation) => (
        translation.title.trim()
        && translation.summary.trim()
        && translation.problem?.trim()
        && translation.solution?.trim()
        && isNonEmptyArray(translation.objectives)
        && isNonEmptyArray(translation.architecture)
        && isNonEmptyArray(translation.results)
      )).map((translation) => translation.locale));
      if (!completeLocales.has("fr") || !completeLocales.has("en")) {
        return "Les études de cas française et anglaise doivent être complètes et validées avant publication.";
      }
    } else {
      const { data, error } = await context.supabase
        .from("blog_post_translations")
        .select("locale, review_status")
        .eq("blog_post_id", id)
        .eq("review_status", "validated");
      if (error || !data) return "Les traductions n’ont pas pu être vérifiées.";
      const locales = new Set(data.map((translation) => translation.locale));
      if (!locales.has("fr") || !locales.has("en")) return "Les versions française et anglaise doivent être validées avant publication.";
    }
  }

  if (table === "media_assets" && typeof id === "string") {
    const current = await getAdminRecord(context, adminResources.media, id);
    const mimeType = current?.mime_type;
    if (typeof mimeType === "string" && mimeType.startsWith("image/")) {
      const altFr = payload.alt_fr ?? current?.alt_fr;
      const altEn = payload.alt_en ?? current?.alt_en;
      if (typeof altFr !== "string" || !altFr.trim() || typeof altEn !== "string" || !altEn.trim()) {
        return "Les textes alternatifs français et anglais sont obligatoires avant de publier une image.";
      }
    }
  }

  return null;
}

function isNonEmptyArray(value: unknown): boolean {
  return Array.isArray(value) && value.length > 0;
}

export async function POST(request: NextRequest, routeContext: RouteContext) {
  const requestContext = await getRequestContext(request, routeContext);
  if ("error" in requestContext) return requestContext.error;
  const { context, config } = requestContext;
  if (!config.canCreate) return errorResponse("Création interdite pour cette ressource.", 405);

  const body = await readJsonObject(request);
  const validation = validateResourcePayload(config, body?.values, "create");
  if (!validation.success) return errorResponse(validation.error, 422);

  const payload = enrichPayload(config.table, "create", context.userId, validation.data);
  const publicationError = await validatePublication(context, config.table, null, payload);
  if (publicationError) return errorResponse(publicationError, 422);
  const result = await createAdminRecord(context, config, payload);
  if (!result.record) return mutationFailure(result.errorCode);

  const entityId = result.record[config.primaryKey];
  await writeAuditLog(context, "create", config, typeof entityId === "string" || typeof entityId === "number" ? entityId : null, Object.keys(validation.data));
  revalidateResource(config.table, config.key);
  return NextResponse.json({ record: result.record }, { status: 201, headers: { "Cache-Control": "private, no-store" } });
}

export async function PATCH(request: NextRequest, routeContext: RouteContext) {
  const requestContext = await getRequestContext(request, routeContext);
  if ("error" in requestContext) return requestContext.error;
  const { context, config } = requestContext;
  if (!config.canUpdate) return errorResponse("Modification interdite pour cette ressource.", 405);

  const body = await readJsonObject(request);
  if (!body || !validatePrimaryKey(config, body.id)) return errorResponse("Identifiant invalide.", 422);
  const validation = validateResourcePayload(config, body.values, "update");
  if (!validation.success) return errorResponse(validation.error, 422);

  const payload = enrichPayload(config.table, "update", context.userId, validation.data);
  const publicationError = await validatePublication(context, config.table, body.id, payload);
  if (publicationError) return errorResponse(publicationError, 422);
  const result = await updateAdminRecord(context, config, body.id, payload);
  if (!result.record) return mutationFailure(result.errorCode);

  await writeAuditLog(context, "update", config, body.id, Object.keys(validation.data));
  revalidateResource(config.table, config.key);
  return NextResponse.json({ record: result.record }, { headers: { "Cache-Control": "private, no-store" } });
}

export async function DELETE(request: NextRequest, routeContext: RouteContext) {
  const requestContext = await getRequestContext(request, routeContext);
  if ("error" in requestContext) return requestContext.error;
  const { context, config } = requestContext;
  if (!config.canDelete) return errorResponse("Suppression interdite pour cette ressource.", 405);

  const body = await readJsonObject(request);
  if (!body || !validatePrimaryKey(config, body.id)) return errorResponse("Identifiant invalide.", 422);

  const mediaRecord = config.table === "media_assets" ? await getAdminRecord(context, config, body.id) : null;
  const result = await deleteAdminRecord(context, config, body.id);
  if (!result.success) return mutationFailure(result.errorCode);

  if (mediaRecord && typeof mediaRecord.bucket_id === "string" && typeof mediaRecord.storage_path === "string") {
    await context.supabase.storage.from(mediaRecord.bucket_id).remove([mediaRecord.storage_path]);
  }

  await writeAuditLog(context, "delete", config, body.id, []);
  revalidateResource(config.table, config.key);
  return NextResponse.json({ success: true }, { headers: { "Cache-Control": "private, no-store" } });
}
