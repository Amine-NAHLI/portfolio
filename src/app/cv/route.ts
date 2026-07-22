import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const html = await readFile(join(process.cwd(), "CV", "cv.html"), "utf8");
    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": "inline; filename=Amine-Nahli-CV.html",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        "Content-Security-Policy": "default-src 'none'; base-uri 'none'; object-src 'none'; script-src 'none'; style-src 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src data:; connect-src 'none'; frame-ancestors 'self'; form-action 'none'",
        "Referrer-Policy": "no-referrer",
        "X-Content-Type-Options": "nosniff",
        "X-Robots-Tag": "index, follow",
      },
    });
  } catch {
    return new NextResponse("CV indisponible.", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }
}
