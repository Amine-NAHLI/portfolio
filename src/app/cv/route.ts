import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";

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

async function loadCvBuffer(filename: string, requestUrl: string): Promise<Buffer | null> {
  // 1. Primary: Read traced static PDF asset from the server filesystem
  try {
    return await readFile(join(process.cwd(), "public", filename));
  } catch {
    // 2. Fallback: Fetch static asset from deployment origin if not bundled on fs
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

export async function GET(req: Request) {
  let isEnglish = false;
  try {
    const { searchParams } = new URL(req.url);
    isEnglish = searchParams.get("locale") === "en";
  } catch {
    // Ignore URL parse error and default to French CV
  }

  let filename = isEnglish ? "Amine_Nahli_CV_EN.pdf" : "Amine_Nahli_CV.pdf";
  let pdfBuffer = await loadCvBuffer(filename, req.url);

  // Fallback to default French CV if English file is absent
  if (!pdfBuffer && isEnglish) {
    filename = "Amine_Nahli_CV.pdf";
    pdfBuffer = await loadCvBuffer(filename, req.url);
  }

  if (!pdfBuffer) {
    return new NextResponse("CV indisponible.", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return new NextResponse(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      ...CV_SECURITY_HEADERS,
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": pdfBuffer.length.toString(),
    },
  });
}
