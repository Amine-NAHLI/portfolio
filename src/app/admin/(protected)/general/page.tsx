import { createClient } from "@/lib/supabase/server";
import { publicCopy } from "@/content/copy";
import { DEFAULT_HERO_BUTTONS, type HeroActionButton } from "@/content/dynamic-copy";
import { GeneralInfoForm } from "./GeneralInfoForm";
import { HeroButtonsManager } from "./HeroButtonsManager";

export default async function GeneralInfoPage() {
  const supabase = await createClient();
  
  // Fetch both FR and EN from DB, plus hero_buttons
  const [resFr, resEn, resButtons] = await Promise.all([
    supabase.from("site_settings").select("value").eq("key", "general_info_fr").single(),
    supabase.from("site_settings").select("value").eq("key", "general_info_en").single(),
    supabase.from("site_settings").select("value").eq("key", "hero_buttons").single(),
  ]);

  const frData = (resFr.data?.value as Record<string, string>) || {};
  const enData = (resEn.data?.value as Record<string, string>) || {};
  const heroButtons = (
    resButtons.data?.value && Array.isArray(resButtons.data.value)
      ? resButtons.data.value
      : DEFAULT_HERO_BUTTONS
  ) as HeroActionButton[];

  const defaultFr = publicCopy.fr.home;
  const defaultEn = publicCopy.en.home;

  const currentFr = {
    eyebrow: frData.eyebrow || defaultFr.eyebrow,
    title: frData.title || defaultFr.title,
    roleBadge: frData.roleBadge || "Élève Ingénieur en Génie Informatique · UPF / Cyber · IA · Software",
    headline: frData.headline || "Concevoir des architectures logicielles fiables, sécurisées et intelligentes.",
    introduction: frData.introduction || defaultFr.introduction,
    formation: frData.formation || defaultFr.proofItems[0][1],
    experience: frData.experience || defaultFr.proofItems[1][1],
    experienceStatus: frData.experienceStatus || "completed",
    experienceTitle: frData.experienceTitle || "",
    languages: frData.languages || defaultFr.proofItems[2][1],
    aboutTitle: frData.aboutTitle || "Bâtir des solutions fiables, sécurisées dès la conception.",
    aboutBio: frData.aboutBio || "Élève ingénieur en 4ème année de Génie Informatique à l'Université Privée de Fès (UPF), je développe des applications logicielles complètes où la sécurité n'est pas une surcouche de fin de projet, mais le fondement même de l'architecture. Mon expérience de stage chez IntelTrust et mes travaux personnels en cybersécurité m'ont appris à verrouiller les politiques d'accès (Zero-Trust, IAM) et auditer les surfaces d'attaque.",
  };

  const currentEn = {
    eyebrow: enData.eyebrow || defaultEn.eyebrow,
    title: enData.title || defaultEn.title,
    roleBadge: enData.roleBadge || "Computer Engineering Student · UPF / Cyber · AI · Software",
    headline: enData.headline || "Engineering robust, secure, and intelligent systems.",
    introduction: enData.introduction || defaultEn.introduction,
    formation: enData.formation || defaultEn.proofItems[0][1],
    experience: enData.experience || defaultEn.proofItems[1][1],
    experienceStatus: enData.experienceStatus || "completed",
    experienceTitle: enData.experienceTitle || "",
    languages: enData.languages || defaultEn.proofItems[2][1],
    aboutTitle: enData.aboutTitle || "Engineering resilient systems, secure by design.",
    aboutBio: enData.aboutBio || "Fourth-year computer engineering student at Université Privée de Fès (UPF), I build full-stack digital systems where security is not a late addition, but the core foundation of architecture. My experience at IntelTrust and hands-on work in defensive cybersecurity taught me how to enforce Zero-Trust access and eliminate attack vectors.",
  };

  return (
    <div className="max-w-6xl">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end border-b border-white/10 pb-6 mb-10">
        <div className="max-w-3xl">
          <p className="font-mono text-xs text-[#9A71FF] uppercase tracking-wider">{"// Administration Bilingue"}</p>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl text-[#f3f1f7]">Textes & Identité du Portfolio</h1>
          <p className="mt-2 text-sm leading-6 text-[#797681]">Modifiez tous les textes de la page d&apos;accueil, les slogans, la bio, le statut de votre expérience et configurez les boutons d&apos;action en français et en anglais.</p>
        </div>
      </header>

      {/* Hero Action Buttons Manager */}
      <HeroButtonsManager initialButtons={heroButtons} />

      {/* Bilingual Content Editor */}
      <div className="mt-10 grid gap-8 xl:grid-cols-2 items-start">
        <GeneralInfoForm locale="fr" title="Version Française" defaultValues={currentFr} />
        <GeneralInfoForm locale="en" title="Version Anglaise" defaultValues={currentEn} />
      </div>
    </div>
  );
}
