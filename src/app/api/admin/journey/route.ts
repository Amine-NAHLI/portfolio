import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getAdminContext } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_JOURNEY_TIMELINE, type JourneyTimelineItem } from "@/types/journey";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "journey_timeline")
      .single();

    if (data && Array.isArray(data.value) && data.value.length > 0) {
      return NextResponse.json({ items: data.value });
    }

    return NextResponse.json({ items: DEFAULT_JOURNEY_TIMELINE });
  } catch (error) {
    console.error("GET journey timeline error:", error);
    return NextResponse.json({ items: DEFAULT_JOURNEY_TIMELINE });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await getAdminContext();
    if (!admin) {
      return NextResponse.json({ error: "Non autorisé. Accès administrateur requis." }, { status: 401 });
    }

    const { items } = await req.json();

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Format invalide. Liste attendue." }, { status: 400 });
    }

    // Clean & validate items
    const cleanedItems: JourneyTimelineItem[] = items.map((item, idx) => ({
      id: String(item.id || `journey-${idx}`),
      year: String(item.year || "").trim(),
      title: String(item.title || "").trim(),
      titleEn: String(item.titleEn || item.title || "").trim(),
      organization: String(item.organization || "").trim(),
      location: String(item.location || "").trim(),
      type: item.type === "experience" ? "experience" : "education",
      categoryLabel: String(item.categoryLabel || (item.type === "experience" ? "EXPÉRIENCE" : "FORMATION")).trim(),
      categoryLabelEn: String(item.categoryLabelEn || (item.type === "experience" ? "EXPERIENCE" : "EDUCATION")).trim(),
      award: item.award ? String(item.award).trim() : undefined,
      awardColor: item.awardColor ? String(item.awardColor).trim() : "#F59E0B",
      tags: Array.isArray(item.tags)
        ? item.tags
            .map((t: unknown) => {
              if (typeof t === "string") return { name: t.trim(), color: "standard" };
              const obj = t as Record<string, unknown>;
              return {
                name: String(obj?.name || "").trim(),
                color: String(obj?.color || "standard").trim(),
              };
            })
            .filter((t: { name: string; color: string }) => t.name.length > 0)
        : [],
    }));

    const supabase = await createClient();
    const { error } = await supabase.from("site_settings").upsert(
      {
        key: "journey_timeline",
        value: cleanedItems,
        is_public: true,
      },
      { onConflict: "key" }
    );

    if (error) {
      console.error("Supabase upsert journey error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Revalidate paths and tags
    try {
      revalidateTag("portfolio");
      revalidateTag("journey");
      revalidateTag("settings");
      revalidatePath("/");
      revalidatePath("/fr");
      revalidatePath("/en");
      revalidatePath("/fr/journey");
      revalidatePath("/en/journey");
    } catch (e) {
      console.warn("Revalidation error after journey save:", e);
    }

    return NextResponse.json({
      success: true,
      message: "Parcours et tags enregistrés avec succès !",
      items: cleanedItems,
    });
  } catch (error) {
    console.error("POST journey timeline error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur interne" },
      { status: 500 }
    );
  }
}
