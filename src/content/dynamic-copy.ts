import { createClient } from "@/lib/supabase/server";
import { publicCopy } from "@/content/copy";
import type { Locale } from "@/i18n/config";

export interface HomeDynamicCopy {
  eyebrow: string;
  title: string;
  roleBadge: string;
  headline: string;
  introduction: string;
  aboutTitle: string;
  aboutBio: string;
  proofItems: Array<[string, string]>;
}

export async function getHomeCopy(locale: Locale): Promise<HomeDynamicCopy> {
  const defaultCopy = publicCopy[locale].home;
  const defaultRoleBadge =
    locale === "fr"
      ? "Élève Ingénieur en Génie Informatique · UPF / Cyber · IA · Software"
      : "Computer Engineering Student · UPF / Cyber · AI · Software";
  const defaultHeadline =
    locale === "fr"
      ? "Concevoir des architectures logicielles fiables, sécurisées et intelligentes."
      : "Engineering robust, secure, and intelligent systems.";
  const defaultAboutTitle =
    locale === "fr"
      ? "Bâtir des solutions fiables, sécurisées dès la conception."
      : "Engineering resilient systems, secure by design.";
  const defaultAboutBio =
    locale === "fr"
      ? "Élève ingénieur en 4ème année de Génie Informatique à l'Université Privée de Fès (UPF), je développe des applications logicielles complètes où la sécurité n'est pas une surcouche de fin de projet, mais le fondement même de l'architecture. Mon expérience de stage chez IntelTrust et mes travaux personnels en cybersécurité offensive et défensive m'ont appris à identifier les vecteurs de défaillance, auditer les flux réseau et verrouiller les politiques d'accès (IAM, Zero-Trust)."
      : "Fourth-year computer engineering student at Université Privée de Fès (UPF), I build full-stack digital systems where security is not a late addition, but the core foundation of architecture. My internship experience at IntelTrust and hands-on work in both offensive and defensive cybersecurity taught me how to diagnose threat surfaces, audit network telemetry, and enforce tight access policies (IAM, Zero-Trust).";

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", `general_info_${locale}`)
      .single();

    if (data?.value && typeof data.value === "object") {
      const v = data.value as Record<string, string>;
      return {
        ...defaultCopy,
        eyebrow: v.eyebrow || defaultCopy.eyebrow,
        title: v.title || defaultCopy.title,
        roleBadge: v.roleBadge || defaultRoleBadge,
        headline: v.headline || defaultHeadline,
        introduction: v.introduction || defaultCopy.introduction,
        aboutTitle: v.aboutTitle || defaultAboutTitle,
        aboutBio: v.aboutBio || defaultAboutBio,
        proofItems: [
          [defaultCopy.proofItems[0][0], v.formation || defaultCopy.proofItems[0][1]],
          [defaultCopy.proofItems[1][0], v.experience || defaultCopy.proofItems[1][1]],
          [defaultCopy.proofItems[2][0], v.languages || defaultCopy.proofItems[2][1]],
        ],
      };
    }
  } catch {
    // Fallback to defaults
  }

  return {
    ...defaultCopy,
    roleBadge: defaultRoleBadge,
    headline: defaultHeadline,
    aboutTitle: defaultAboutTitle,
    aboutBio: defaultAboutBio,
    proofItems: [
      [defaultCopy.proofItems[0][0], defaultCopy.proofItems[0][1]],
      [defaultCopy.proofItems[1][0], defaultCopy.proofItems[1][1]],
      [defaultCopy.proofItems[2][0], defaultCopy.proofItems[2][1]],
    ],
  };
}
