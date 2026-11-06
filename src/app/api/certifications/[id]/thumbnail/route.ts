import { NextResponse, type NextRequest } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!uuidPattern.test(id)) return new NextResponse(null, { status: 404 });

  try {
    const staticPath = path.join(process.cwd(), "public", "images", "certifications", `${id}.png`);
    if (fs.existsSync(staticPath)) {
      const buffer = fs.readFileSync(staticPath);
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
          "Content-Length": buffer.length.toString(),
        },
      });
    }

    // If pre-generated static PNG does not exist, redirect to document stream
    return NextResponse.redirect(new URL(`/api/certifications/${id}/document`, _request.url));
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}

