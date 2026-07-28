"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveGeneralInfo(locale: "fr" | "en", formData: FormData) {
  const supabase = await createClient();
  const data = {
    eyebrow: formData.get("eyebrow")?.toString().trim() || "",
    title: formData.get("title")?.toString().trim() || "",
    introduction: formData.get("introduction")?.toString().trim() || "",
    formation: formData.get("formation")?.toString().trim() || "",
    experience: formData.get("experience")?.toString().trim() || "",
    languages: formData.get("languages")?.toString().trim() || "",
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
  
  return { success: true };
}
