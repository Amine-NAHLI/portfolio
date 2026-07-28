import { createClient } from "@/lib/supabase/server";
import { saveGeneralInfo } from "./actions";
import { publicCopy } from "@/content/copy";

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
    <div className="p-6 sm:p-10 max-w-5xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-display font-semibold">Informations Générales</h1>
        <p className="text-text-secondary mt-2">Modifiez les textes affichés sur la page d&apos;accueil de votre portfolio.</p>
      </div>

      <div className="grid gap-10 xl:grid-cols-2">
        {/* French Form */}
        <section className="bg-surface border border-border p-6 rounded-md">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded bg-accent/10 text-accent flex items-center justify-center text-sm font-bold">FR</span>
            Version Française
          </h2>
          <form action={saveGeneralInfo.bind(null, "fr") as unknown as (payload: FormData) => void} className="space-y-5">
            <label className="grid gap-2 text-sm font-semibold">
              Sous-titre (Eyebrow)
              <input name="eyebrow" defaultValue={currentFr.eyebrow} className="min-h-11 px-3 font-normal bg-bg-page border border-border rounded" required />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Titre principal
              <textarea name="title" defaultValue={currentFr.title} rows={3} className="px-3 py-2 font-normal bg-bg-page border border-border rounded resize-y" required />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Introduction
              <textarea name="introduction" defaultValue={currentFr.introduction} rows={4} className="px-3 py-2 font-normal bg-bg-page border border-border rounded resize-y" required />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Formation
              <input name="formation" defaultValue={currentFr.formation} className="min-h-11 px-3 font-normal bg-bg-page border border-border rounded" required />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Expérience actuelle
              <input name="experience" defaultValue={currentFr.experience} className="min-h-11 px-3 font-normal bg-bg-page border border-border rounded" required />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Langues
              <input name="languages" defaultValue={currentFr.languages} className="min-h-11 px-3 font-normal bg-bg-page border border-border rounded" required />
            </label>
            <div className="pt-4">
              <button type="submit" className="button-primary w-full">Sauvegarder (FR)</button>
            </div>
          </form>
        </section>

        {/* English Form */}
        <section className="bg-surface border border-border p-6 rounded-md">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded bg-accent/10 text-accent flex items-center justify-center text-sm font-bold">EN</span>
            Version Anglaise
          </h2>
          <form action={saveGeneralInfo.bind(null, "en") as unknown as (payload: FormData) => void} className="space-y-5">
            <label className="grid gap-2 text-sm font-semibold">
              Sous-titre (Eyebrow)
              <input name="eyebrow" defaultValue={currentEn.eyebrow} className="min-h-11 px-3 font-normal bg-bg-page border border-border rounded" required />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Titre principal
              <textarea name="title" defaultValue={currentEn.title} rows={3} className="px-3 py-2 font-normal bg-bg-page border border-border rounded resize-y" required />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Introduction
              <textarea name="introduction" defaultValue={currentEn.introduction} rows={4} className="px-3 py-2 font-normal bg-bg-page border border-border rounded resize-y" required />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Formation
              <input name="formation" defaultValue={currentEn.formation} className="min-h-11 px-3 font-normal bg-bg-page border border-border rounded" required />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Expérience actuelle
              <input name="experience" defaultValue={currentEn.experience} className="min-h-11 px-3 font-normal bg-bg-page border border-border rounded" required />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Langues
              <input name="languages" defaultValue={currentEn.languages} className="min-h-11 px-3 font-normal bg-bg-page border border-border rounded" required />
            </label>
            <div className="pt-4">
              <button type="submit" className="button-primary w-full">Sauvegarder (EN)</button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
