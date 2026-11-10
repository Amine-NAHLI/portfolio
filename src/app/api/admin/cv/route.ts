import { NextResponse, type NextRequest } from "next/server";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { revalidatePath, revalidateTag } from "next/cache";
import { getAdminContext } from "@/lib/auth/admin";
import { acceptsSameOriginMutation } from "@/lib/security/request";
import { CV_MAX_FILE_BYTES, CV_MAX_REQUEST_BYTES, getCvAssetInfo } from "@/features/cv/config";
import {
  getActiveCvStatus,
  hasSupabaseServerStorage,
  syncLocalPublicCvIfWritable,
  uploadCvToStorage,
} from "@/features/cv/storage";

export const runtime = "nodejs";

function fail(error: string, status: number) {
  return NextResponse.json({ error }, { status, headers: { "Cache-Control": "private, no-store" } });
}

export async function GET(req: NextRequest) {
  const context = await getAdminContext();
  if (!context) {
    return fail("Non autorisé. Accès administrateur requis.", 401);
  }

  const { searchParams } = new URL(req.url);
  const info = getCvAssetInfo(searchParams.get("locale"));
  const status = await getActiveCvStatus(info);

  return NextResponse.json(status, { headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(req: NextRequest) {
  if (!acceptsSameOriginMutation(req)) {
    return fail("Requête refusée.", 403);
  }

  const contentLength = Number(req.headers.get("content-length") ?? "0");
  if (!Number.isFinite(contentLength) || contentLength < 0 || contentLength > CV_MAX_REQUEST_BYTES) {
    return fail("Le fichier dépasse la taille maximale autorisée (5 Mo).", 413);
  }

  if (!req.headers.get("content-type")?.toLowerCase().startsWith("multipart/form-data;")) {
    return fail("Format de requête invalide.", 415);
  }

  const context = await getAdminContext();
  if (!context) {
    return fail("Non autorisé. Accès administrateur requis.", 401);
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const info = getCvAssetInfo(formData.get("locale")?.toString());

    if (!(file instanceof File)) {
      return fail("Aucun fichier PDF fourni.", 400);
    }

    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      return fail("Format non valide. Seuls les fichiers PDF (.pdf) sont acceptés.", 400);
    }

    if (file.size <= 0 || file.size > CV_MAX_FILE_BYTES) {
      return fail("Le fichier dépasse la taille maximale autorisée (5 Mo).", 400);
    }

    const headerSignature = new TextDecoder().decode(await file.slice(0, 5).arrayBuffer());
    if (headerSignature !== "%PDF-") {
      return fail("Le contenu du fichier n’est pas un document PDF valide.", 422);
    }

    const bytes = new Uint8Array(await file.arrayBuffer());

    if (hasSupabaseServerStorage()) {
      await uploadCvToStorage(info, bytes);
      // Best-effort local mirror in dev; ignored on read-only serverless filesystems
      await syncLocalPublicCvIfWritable(info.filename, bytes);
    } else {
      await writeFile(resolve("public", info.filename), bytes);
    }

    await context.supabase.from("audit_logs").insert({
      actor_id: context.userId,
      action: "update",
      entity_type: "cv_document",
      entity_id: info.filename,
      details: { locale: info.locale, size_bytes: file.size },
    });

    try {
      revalidatePath("/cv");
      revalidatePath("/");
      revalidatePath("/fr");
      revalidatePath("/en");
      revalidateTag("portfolio");
      revalidateTag("settings");
    } catch (e) {
      console.warn("Revalidation error after CV upload:", e);
    }

    return NextResponse.json(
      {
        success: true,
        size: file.size,
        updatedAt: new Date().toISOString(),
        url: info.previewUrl,
        filename: info.filename,
        message: `Curriculum Vitae (${info.locale.toUpperCase()}) mis à jour avec succès !`,
      },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    console.error("CV upload error:", error);
    return fail(
      error instanceof Error ? error.message : "Erreur interne lors de la publication du CV.",
      500,
    );
  }
}
