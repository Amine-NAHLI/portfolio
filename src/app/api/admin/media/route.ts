import { randomUUID } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { getAdminContext } from "@/lib/auth/admin";
import { writeAuditLog } from "@/lib/admin/content-repository";
import { adminResources } from "@/features/admin/resources";
import { acceptsSameOriginMutation } from "@/lib/security/request";

export const runtime = "nodejs";

const BUCKET = "portfolio-media";
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const MAX_REQUEST_BYTES = MAX_FILE_BYTES + 256 * 1024;
const extensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "application/pdf": "pdf",
};

function fail(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(request: NextRequest) {
  if (!acceptsSameOriginMutation(request)) return fail("Requête refusée.", 403);
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (!Number.isFinite(contentLength) || contentLength < 0 || contentLength > MAX_REQUEST_BYTES) return fail("Fichier trop volumineux.", 413);
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("multipart/form-data;")) return fail("Format de requête invalide.", 415);

  const context = await getAdminContext();
  if (!context) return fail("Non autorisé.", 401);

  let formData: FormData;
  try { formData = await request.formData(); }
  catch { return fail("Formulaire invalide.", 400); }
  const file = formData.get("file");
  if (!(file instanceof File)) return fail("Fichier manquant.", 422);
  const extension = extensions[file.type];
  if (!extension || file.size <= 0 || file.size > MAX_FILE_BYTES) return fail("Type ou taille de fichier refusé.", 422);

  const now = new Date();
  const storagePath = `${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}/${randomUUID()}.${extension}`;
  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error: uploadError } = await context.supabase.storage.from(BUCKET).upload(storagePath, bytes, {
    contentType: file.type,
    cacheControl: "31536000",
    upsert: false,
  });
  if (uploadError) return fail("Le fichier n’a pas pu être stocké.", 500);

  const { data, error: metadataError } = await context.supabase.from("media_assets").insert({
    bucket_id: BUCKET,
    storage_path: storagePath,
    original_name: file.name.slice(0, 255),
    mime_type: file.type,
    size_bytes: file.size,
    publication_status: "draft",
    created_by: context.userId,
  }).select("*").single();

  if (metadataError || !data) {
    await context.supabase.storage.from(BUCKET).remove([storagePath]);
    return fail("Les métadonnées du fichier n’ont pas pu être enregistrées.", 500);
  }

  await writeAuditLog(context, "create", adminResources.media, data.id, ["file", "mime_type", "size_bytes"]);
  return NextResponse.json({ record: data }, { status: 201, headers: { "Cache-Control": "private, no-store" } });
}
