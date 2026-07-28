import { createClient } from "@/lib/supabase/server";
import { publicCopy } from "@/content/copy";
import { GeneralInfoForm } from "./GeneralInfoForm";

export default async function GeneralInfoPage() {
  const supabase = await createClient();
  
  // Fetch both FR and EN from DB
  const [resFr, resEn] = await Promise.all([
    supabase.from("site_settings").select("value").eq("key", "general_info_fr").single(),
    supabase.from("site_settings").select("value").eq("key", "general_info_en").single()
  ]);

  const frData = (resFr.data?.value as Record<string, string>) || {};
  const enData = (resEn.data?.value as Record<string, string>) || {};

  const defaultFr = publicCopy.fr.home;
  const defaultEn = publicCopy.en.home;

  const currentFr = {
    eyebrow: frData.eyebrow || defaultFr.eyebrow,
    title: frData.title || defaultFr.title,
    introduction: frData.introduction || defaultFr.introduction,
    formation: frData.formation || defaultFr.proofItems[0][1],
    experience: frData.experience || defaultFr.proofItems[1][1],
    languages: frData.languages || defaultFr.proofItems[2][1],
  };

  const currentEn = {
    eyebrow: enData.eyebrow || defaultEn.eyebrow,
    title: enData.title || defaultEn.title,
    introduction: enData.introduction || defaultEn.introduction,
    formation: enData.formation || defaultEn.proofItems[0][1],
    experience: enData.experience || defaultEn.proofItems[1][1],
    languages: enData.languages || defaultEn.proofItems[2][1],
  };

  return (
    <div className="max-w-6xl">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end border-b border-border pb-6 mb-10">
        <div className="max-w-3xl">
          <p className="system-label">{"// Administration"}</p>
          <h1 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">Infos Générales</h1>
          <p className="mt-3 text-sm leading-6 text-text-secondary sm:text-base">Gérez les textes affichés sur la page d&apos;accueil de votre portfolio de manière unifiée.</p>
        </div>
      </header>

      <div className="grid gap-8 xl:grid-cols-2 items-start">
        <GeneralInfoForm locale="fr" title="Version Française" defaultValues={currentFr} />
        <GeneralInfoForm locale="en" title="Version Anglaise" defaultValues={currentEn} />
      </div>
    </div>
  );
}
