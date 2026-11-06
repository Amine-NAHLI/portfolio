import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!uuidPattern.test(id)) return new NextResponse(null, { status: 404 });

  try {
    const supabase = createAdminClient();
    const { data: certificate, error: certError } = await supabase
      .from("certifications")
      .select("document_media_id, publication_status")
      .eq("id", id)
      .maybeSingle();

    if (certError || !certificate?.document_media_id) {
      return new NextResponse(null, { status: 404 });
    }
    if (certificate.publication_status === "archived") {
      return new NextResponse(null, { status: 404 });
    }

    const { data: media, error: mediaError } = await supabase
      .from("media_assets")
      .select("bucket_id, storage_path, mime_type, original_name")
      .eq("id", certificate.document_media_id)
      .maybeSingle();

    if (mediaError || !media?.bucket_id || !media?.storage_path) {
      return new NextResponse(null, { status: 404 });
    }

    // Attempt direct file download to stream same-origin (bypasses cross-origin iframe blocking)
    const { data: blob, error: downloadError } = await supabase.storage
      .from(media.bucket_id)
      .download(media.storage_path);

    if (blob && !downloadError) {
      const buffer = Buffer.from(await blob.arrayBuffer());
      const mimeType =
        media.mime_type ||
        (media.storage_path.toLowerCase().endsWith(".pdf") ? "application/pdf" : "application/octet-stream");
      const filename = media.original_name || `certificate-${id}.pdf`;

      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Type": mimeType,
          "Content-Disposition": `inline; filename="${encodeURIComponent(filename)}"`,
          "Content-Length": buffer.length.toString(),
          "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
          "X-Content-Type-Options": "nosniff",
        },
      });
    }

    // Fallback to signed URL redirect if direct download is unavailable
    const { data: signed, error: signError } = await supabase.storage
      .from(media.bucket_id)
      .createSignedUrl(media.storage_path, 300);

    if (signError || !signed?.signedUrl) {
      return new NextResponse(null, { status: 503, headers: { "Cache-Control": "no-store" } });
    }

    return NextResponse.redirect(signed.signedUrl, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return new NextResponse(null, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
