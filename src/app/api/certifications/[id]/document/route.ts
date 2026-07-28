import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!uuidPattern.test(id)) return new NextResponse(null, { status: 404 });

  try {
    const supabase = createAdminClient();
    const { data: certificate } = await supabase
      .from("certifications")
      .select("document_media_id")
      .eq("id", id)
      .eq("publication_status", "published")
      .maybeSingle();
    if (!certificate?.document_media_id) return new NextResponse(null, { status: 404 });

    const { data: media } = await supabase
      .from("media_assets")
      .select("bucket_id, storage_path, mime_type")
      .eq("id", certificate.document_media_id)
      .eq("publication_status", "published")
      .maybeSingle();
    if (!media) return new NextResponse(null, { status: 404 });

    const { data: signed, error } = await supabase.storage.from(media.bucket_id).createSignedUrl(media.storage_path, 60);
    if (error || !signed?.signedUrl) return new NextResponse(null, { status: 503, headers: { "Cache-Control": "no-store" } });
    return NextResponse.redirect(signed.signedUrl, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return new NextResponse(null, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
