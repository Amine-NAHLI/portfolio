import { NextResponse } from "next/server";
import { getCvAssetInfo } from "@/features/cv/config";
import { downloadCvFromStorage, loadFallbackCvBuffer } from "@/features/cv/storage";

export const runtime = "nodejs";

const CV_SECURITY_HEADERS = {
  "Content-Security-Policy":
    "default-src 'none'; base-uri 'none'; object-src 'none'; script-src 'none'; style-src 'none'; img-src data:; connect-src 'none'; frame-ancestors 'self'; form-action 'none'",
  "Referrer-Policy": "no-referrer",
  "X-Frame-Options": "SAMEORIGIN",
  "X-Content-Type-Options": "nosniff",
  "X-Robots-Tag": "noindex, nofollow",
  "Cache-Control": "no-store, must-revalidate",
};

async function resolveCvBuffer(filename: string, storagePath: string, requestUrl: string): Promise<Buffer | null> {
  const cloudBuffer = await downloadCvFromStorage(storagePath);
  if (cloudBuffer) return cloudBuffer;
  return loadFallbackCvBuffer(filename, requestUrl);
}

export async function GET(req: Request) {
  let localeParam: string | null = null;
  let isInline = false;

  try {
    const { searchParams } = new URL(req.url);
    localeParam = searchParams.get("locale");
    isInline = searchParams.get("disposition") === "inline";
  } catch {
    // Ignore malformed query string and use default French attachment
  }

  const primary = getCvAssetInfo(localeParam);
  let filename = primary.filename;
  let pdfBuffer = await resolveCvBuffer(primary.filename, primary.storagePath, req.url);

  if (!pdfBuffer && primary.locale === "en") {
    const fallback = getCvAssetInfo("fr");
    filename = fallback.filename;
    pdfBuffer = await resolveCvBuffer(fallback.filename, fallback.storagePath, req.url);
  }

  if (!pdfBuffer) {
    return new NextResponse("CV indisponible.", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const disposition = isInline ? "inline" : "attachment";

  return new NextResponse(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      ...CV_SECURITY_HEADERS,
      "Content-Type": "application/pdf",
      "Content-Disposition": `${disposition}; filename="${filename}"`,
      "Content-Length": pdfBuffer.length.toString(),
    },
  });
}
