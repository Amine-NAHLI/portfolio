import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key, { auth: { persistSession: false } });
}

// PATCH /api/admin/testimonials  { id, status }
export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    if (!id || !["approved", "rejected", "pending"].includes(status)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const supabase = getServiceClient();
    const { error } = await supabase
      .from("testimonials")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("[admin/testimonials PATCH]", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/admin/testimonials  { id }
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const supabase = getServiceClient();
    const { error } = await supabase.from("testimonials").delete().eq("id", id);

    if (error) {
      console.error("[admin/testimonials DELETE]", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
