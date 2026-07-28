import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const pdf = await readFile(join(process.cwd(), "public", "Amine_Nahli_CV.pdf"));
    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=Amine_Nahli_CV.pdf",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  } catch {
    return new NextResponse("CV indisponible.", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }
}
