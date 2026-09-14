"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function saveHeroTechnologies(technologies: string[]) {
  const supabase = await createClient();

  const { error } = await supabase.from("site_settings").upsert(
    { key: "hero_technologies", value: technologies, is_public: true },
    { onConflict: "key" }
  );

  if (error) {
    return { error: error.message };
  }

  revalidateTag("portfolio");
  revalidateTag("settings");
  revalidatePath("/", "layout");

  return { success: true };
}
