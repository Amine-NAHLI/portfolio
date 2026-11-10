import "server-only";

import { readFile, stat, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { hasSupabasePublicConfig } from "@/lib/env/supabase";
import { createAdminClient } from "@/lib/supabase/admin";
import { CV_STORAGE_BUCKET, type CvAssetInfo } from "@/features/cv/config";

export type CvMetadataStatus = {
  exists: boolean;
  size: number;
  updatedAt: string | null;
  url: string;
  filename: string;
};

export function hasSupabaseServerStorage(): boolean {
  return hasSupabasePublicConfig() && Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * Downloads the stored CV PDF bytes from Supabase Storage when available.
 */
export async function downloadCvFromStorage(storagePath: string): Promise<Buffer | null> {
  if (!hasSupabaseServerStorage()) return null;
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.storage.from(CV_STORAGE_BUCKET).download(storagePath);
    if (error || !data) return null;
    return Buffer.from(await data.arrayBuffer());
  } catch {
    return null;
  }
}

/**
 * Reads metadata for the active CV, preferring Supabase Storage over bundled public assets.
 */
export async function getActiveCvStatus(info: CvAssetInfo): Promise<CvMetadataStatus> {
  if (hasSupabaseServerStorage()) {
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase.storage
        .from(CV_STORAGE_BUCKET)
        .list("cv", { search: info.filename });

      if (!error && Array.isArray(data)) {
        const match = data.find((item) => item.name === info.filename);
        if (match) {
          const rawSize = (match.metadata as Record<string, unknown> | null)?.size;
          const size = typeof rawSize === "number" ? rawSize : Number(rawSize ?? 0);
          return {
            exists: true,
            size: Number.isFinite(size) ? size : 0,
            updatedAt: match.updated_at ?? match.created_at ?? null,
            url: info.previewUrl,
            filename: info.filename,
          };
        }
      }
    } catch {
      // Fall back cleanly to static asset stat below
    }
  }

  try {
    const fileStat = await stat(resolve("public", info.filename));
    return {
      exists: true,
      size: fileStat.size,
      updatedAt: fileStat.mtime.toISOString(),
      url: info.previewUrl,
      filename: info.filename,
    };
  } catch {
    return {
      exists: false,
      size: 0,
      updatedAt: null,
      url: info.previewUrl,
      filename: info.filename,
    };
  }
}

/**
 * Uploads the CV PDF into Supabase Storage (works on read-only serverless environments like Vercel).
 */
export async function uploadCvToStorage(info: CvAssetInfo, bytes: Uint8Array): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.storage.from(CV_STORAGE_BUCKET).upload(info.storagePath, bytes, {
    contentType: "application/pdf",
    cacheControl: "0",
    upsert: true,
  });

  if (error) {
    throw new Error(`Échec du stockage cloud du CV (${error.message}).`);
  }
}

/**
 * Reads the bundled static PDF from disk or deployment origin URL as a fallback.
 */
export async function loadFallbackCvBuffer(filename: string, requestUrl: string): Promise<Buffer | null> {
  try {
    return await readFile(join(process.cwd(), "public", filename));
  } catch {
    try {
      const assetResponse = await fetch(new URL(`/${filename}`, requestUrl));
      if (assetResponse.ok) {
        return Buffer.from(await assetResponse.arrayBuffer());
      }
    } catch {
      // Ignore fallback fetch errors
    }
  }
  return null;
}

/**
 * Best-effort local disk sync for development environments; never fails on read-only filesystems (EROFS).
 */
export async function syncLocalPublicCvIfWritable(filename: string, bytes: Uint8Array): Promise<boolean> {
  if (process.env.VERCEL) return false;
  try {
    await writeFile(resolve("public", filename), bytes);
    return true;
  } catch {
    return false;
  }
}

