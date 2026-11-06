"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function saveFeaturedHomeCertifications(certIds: string[]) {
  const supabase = await createClient();

  if (!Array.isArray(certIds) || certIds.length > 3) {
    return { error: "Veuillez sélectionner au maximum 3 certifications pour l'accueil." };
  }

  const { error } = await supabase.from("site_settings").upsert(
    { key: "featured_home_certifications", value: certIds, is_public: true },
    { onConflict: "key" }
  );

  if (error) {
    return { error: error.message };
  }

  revalidateTag("portfolio");
  revalidateTag("certifications");
  revalidateTag("settings");
  revalidatePath("/", "layout");
  revalidatePath("/fr");
  revalidatePath("/en");

  return { success: true };
}

