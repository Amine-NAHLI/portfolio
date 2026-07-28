import { createClient } from "@/lib/supabase/server";
import { publicCopy } from "@/content/copy";
import type { Locale } from "@/i18n/config";

export async function getHomeCopy(locale: Locale) {
  const defaultCopy = publicCopy[locale].home;
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("site_settings").select("value").eq("key", `general_info_${locale}`).single();
    if (data?.value && typeof data.value === "object") {
      const v = data.value as Record<string, string>;
      return {
        ...defaultCopy,
        eyebrow: v.eyebrow || defaultCopy.eyebrow,
        title: v.title || defaultCopy.title,
        introduction: v.introduction || defaultCopy.introduction,
        proofItems: [
          [defaultCopy.proofItems[0][0], v.formation || defaultCopy.proofItems[0][1]],
          [defaultCopy.proofItems[1][0], v.experience || defaultCopy.proofItems[1][1]],
          [defaultCopy.proofItems[2][0], v.languages || defaultCopy.proofItems[2][1]],
        ]
      };
    }
  } catch {
    // silently fallback to default copy
  }
  return defaultCopy;
}
