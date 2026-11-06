"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { HeroActionButton } from "@/content/dynamic-copy";

export async function saveGeneralInfo(locale: "fr" | "en", formData: FormData) {
  const supabase = await createClient();
  const data = {
    eyebrow: formData.get("eyebrow")?.toString().trim() || "",
    title: formData.get("title")?.toString().trim() || "",
    roleBadge: formData.get("roleBadge")?.toString().trim() || "",
    headline: formData.get("headline")?.toString().trim() || "",
    introduction: formData.get("introduction")?.toString().trim() || "",
    formation: formData.get("formation")?.toString().trim() || "",
    experience: formData.get("experience")?.toString().trim() || "",
    experienceStatus: formData.get("experienceStatus")?.toString().trim() || "completed",
    experienceTitle: formData.get("experienceTitle")?.toString().trim() || "",
    languages: formData.get("languages")?.toString().trim() || "",
    aboutTitle: formData.get("aboutTitle")?.toString().trim() || "",
    aboutBio: formData.get("aboutBio")?.toString().trim() || "",
  };

  const key = `general_info_${locale}`;
  
  const { error } = await supabase.from("site_settings").upsert(
    { key, value: data, is_public: true },
    { onConflict: "key" }
  );

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/fr");
  revalidatePath("/en");
  revalidatePath("/admin/general");
  
  return { success: true };
}

export async function saveHeroButtons(buttons: HeroActionButton[]) {
  const supabase = await createClient();

  const { error } = await supabase.from("site_settings").upsert(
    { key: "hero_buttons", value: buttons, is_public: true },
    { onConflict: "key" }
  );

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/fr");
  revalidatePath("/en");
  revalidatePath("/admin/general");

  return { success: true };
}
