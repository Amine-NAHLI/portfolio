import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || (!serviceKey && !anonKey)) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, serviceKey || anonKey!, {
    auth: { persistSession: false },
  });

  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? [], { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: NextRequest) {
  try {
    const { name, role, company, message, rating } = await req.json();

    if (!name?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Name and message are required" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || (!serviceKey && !anonKey)) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
    }

    // Service role key bypasses RLS — anon key fallback still subject to policies
    const supabase = createClient(supabaseUrl, serviceKey || anonKey!, {
      auth: { persistSession: false },
    });

    const { error } = await supabase.from("testimonials").insert({
      name: name.trim(),
      role: role?.trim() || "",
      company: company?.trim() || "",
      message: message.trim(),
      rating: Math.min(5, Math.max(1, Number(rating) || 5)),
      status: "pending",
    });

    if (error) {
      console.error("[testimonials] Supabase error:", error.code, error.message, error.details);

      // Column doesn't exist yet → insert without status
      if (error.code === "42703" || error.message?.includes("status")) {
        const { error: e2 } = await supabase.from("testimonials").insert({
          name: name.trim(),
          role: role?.trim() || "",
          company: company?.trim() || "",
          message: message.trim(),
          rating: Math.min(5, Math.max(1, Number(rating) || 5)),
        });
        if (e2) {
          console.error("[testimonials] Fallback error:", e2.message);
          return NextResponse.json({ error: e2.message }, { status: 500 });
        }
        return NextResponse.json({ ok: true, warn: "status column missing — run migration" });
      }

      return NextResponse.json({ error: error.message, code: error.code }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[testimonials] Unexpected error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
