"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function saveFeaturedHomeProjects(projectSlugs: string[]) {
  const supabase = await createClient();

  if (!Array.isArray(projectSlugs) || projectSlugs.length > 4) {
    return { error: "Veuillez sélectionner au maximum 4 projets." };
  }

  const { error } = await supabase.from("site_settings").upsert(
    { key: "featured_home_projects", value: projectSlugs, is_public: true },
    { onConflict: "key" }
  );

  if (error) {
    return { error: error.message };
  }

  revalidateTag("portfolio");
  revalidateTag("projects");
  revalidateTag("settings");
  revalidatePath("/", "layout");
  revalidatePath("/fr");
  revalidatePath("/en");

  return { success: true };
}

