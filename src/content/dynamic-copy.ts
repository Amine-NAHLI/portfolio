import { createClient } from "@/lib/supabase/server";
import { publicCopy } from "@/content/copy";
import type { Locale } from "@/i18n/config";

export type HeroActionButton = {
  id: string;
  labelFr: string;
  labelEn: string;
  url: string;
  style: "primary" | "secondary";
  enabled: boolean;
};

export const DEFAULT_HERO_BUTTONS: HeroActionButton[] = [
  { id: "projects", labelFr: "Explorer les projets", labelEn: "Explore Selected Work", url: "#work", style: "primary", enabled: true },
  { id: "cv", labelFr: "Consulter le CV", labelEn: "View CV", url: "/cv", style: "secondary", enabled: true },
  { id: "contact", labelFr: "Me contacter", labelEn: "Contact Me", url: "#contact", style: "secondary", enabled: false },
  { id: "journey", labelFr: "Mon parcours", labelEn: "My Journey", url: "#journey", style: "secondary", enabled: false },
  { id: "certifications", labelFr: "Certifications", labelEn: "Certifications", url: "#certifications", style: "secondary", enabled: false },
];

export interface HomeDynamicCopy {
  eyebrow: string;
  title: string;
  roleBadge: string;
  headline: string;
  introduction: string;
  aboutTitle: string;
  aboutBio: string;
  proofItems: Array<[string, string]>;
  heroButtons?: HeroActionButton[];
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

  let heroButtons = DEFAULT_HERO_BUTTONS;

  try {
    const supabase = await createClient();

    const [{ data: genData }, { data: btnData }] = await Promise.all([
      supabase.from("site_settings").select("value").eq("key", `general_info_${locale}`).single(),
      supabase.from("site_settings").select("value").eq("key", "hero_buttons").single(),
    ]);

    if (btnData?.value && Array.isArray(btnData.value)) {
      heroButtons = btnData.value as HeroActionButton[];
    }

    if (genData?.value && typeof genData.value === "object") {
      const v = genData.value as Record<string, string>;
      const expTitle =
        v.experienceTitle ||
        (v.experienceStatus === "in_progress"
          ? locale === "fr" ? "Expérience actuelle" : "Current Experience"
          : locale === "fr" ? "Dernière expérience" : "Recent Experience");

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
          [expTitle, v.experience || defaultCopy.proofItems[1][1]],
          [defaultCopy.proofItems[2][0], v.languages || defaultCopy.proofItems[2][1]],
        ],
        heroButtons,
      };
    }
  } catch {
    // Fallback to defaults
  }

  const defaultExpTitle = locale === "fr" ? "Dernière expérience" : "Recent Experience";

  return {
    ...defaultCopy,
    roleBadge: defaultRoleBadge,
    headline: defaultHeadline,
    aboutTitle: defaultAboutTitle,
    aboutBio: defaultAboutBio,
    proofItems: [
      [defaultCopy.proofItems[0][0], defaultCopy.proofItems[0][1]],
      [defaultExpTitle, defaultCopy.proofItems[1][1]],
      [defaultCopy.proofItems[2][0], defaultCopy.proofItems[2][1]],
    ],
    heroButtons,
  };
}
