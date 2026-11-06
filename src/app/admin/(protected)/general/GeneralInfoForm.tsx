"use client";

import { useState } from "react";
import { saveGeneralInfo } from "./actions";

type Props = {
  locale: "fr" | "en";
  title: string;
  defaultValues: {
    eyebrow: string;
    title: string;
    roleBadge?: string;
    headline?: string;
    introduction: string;
    formation: string;
    experience: string;
    experienceStatus?: "completed" | "in_progress" | string;
    experienceTitle?: string;
    languages: string;
    aboutTitle?: string;
    aboutBio?: string;
  };
};

export function GeneralInfoForm({ locale, title, defaultValues }: Props) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setMessage(null);
    try {
      const result = await saveGeneralInfo(locale, formData);
      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ type: "success", text: "Modifications enregistrées avec succès !" });
        setTimeout(() => setMessage(null), 5000);
      }
    } catch {
      setMessage({ type: "error", text: "Erreur lors de l'enregistrement." });
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="technical-frame p-0 flex flex-col rounded-3xl border border-white/10 bg-[#0B0510] overflow-hidden shadow-2xl">
      <div className="border-b border-white/10 px-6 py-5 bg-[#060605] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="grid size-10 rounded-xl bg-[#9A71FF]/10 text-[#9A71FF] border border-[#9A71FF]/30 place-items-center text-sm font-bold">
            {locale.toUpperCase()}
          </span>
          <div>
            <h2 className="text-lg font-bold text-[#f3f1f7]">{title}</h2>
            <p className="text-xs text-[#797681]">Contenus éditables bilingues</p>
          </div>
        </div>
      </div>
      
      <form action={handleSubmit} className="flex flex-col p-6 sm:p-8 gap-6 text-sm">
        {message && (
          <div className={`p-4 rounded-xl text-xs font-semibold border ${
            message.type === "success" 
              ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30" 
              : "bg-rose-500/10 text-rose-300 border-rose-500/30"
          }`}>
            {message.text}
          </div>
        )}

        {/* Hero Section Texts */}
        <div className="space-y-4 pb-6 border-b border-white/[0.08]">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#9A71FF] block">
            1. Section Accueil (Hero)
          </span>

          <label className="grid gap-2 font-semibold text-[#f3f1f7]">
            <span className="text-xs text-[#797681]">Badge de profil (au-dessus du nom)</span>
            <input
              name="roleBadge"
              defaultValue={
                defaultValues.roleBadge ||
                (locale === "fr"
                  ? "Élève Ingénieur en Génie Informatique · UPF / Cyber · IA · Software"
                  : "Computer Engineering Student · UPF / Cyber · AI · Software")
              }
              className="rounded-xl border border-white/10 bg-[#060605] min-h-11 px-3.5 text-xs text-[#f3f1f7] focus:border-[#9A71FF] focus:outline-none"
              required
            />
          </label>

          <label className="grid gap-2 font-semibold text-[#f3f1f7]">
            <span className="text-xs text-[#797681]">Accroche / Slogan principal</span>
            <input
              name="headline"
              defaultValue={
                defaultValues.headline ||
                (locale === "fr"
                  ? "Concevoir des architectures logicielles fiables, sécurisées et intelligentes."
                  : "Engineering robust, secure, and intelligent systems.")
              }
              className="rounded-xl border border-white/10 bg-[#060605] min-h-11 px-3.5 text-xs text-[#f3f1f7] focus:border-[#9A71FF] focus:outline-none"
              required
            />
          </label>

          <label className="grid gap-2 font-semibold text-[#f3f1f7]">
            <span className="text-xs text-[#797681]">Introduction & Bio courte</span>
            <textarea
              name="introduction"
              defaultValue={defaultValues.introduction}
              rows={3}
              className="rounded-xl border border-white/10 bg-[#060605] px-3.5 py-2.5 text-xs text-[#f3f1f7] resize-y focus:border-[#9A71FF] focus:outline-none leading-relaxed"
              required
            />
          </label>
        </div>

        {/* About Section Texts */}
        <div className="space-y-4 pb-6 border-b border-white/[0.08]">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#9A71FF] block">
            2. Section Profil & Vision (About)
          </span>

          <label className="grid gap-2 font-semibold text-[#f3f1f7]">
            <span className="text-xs text-[#797681]">Titre de la section À Propos</span>
            <input
              name="aboutTitle"
              defaultValue={
                defaultValues.aboutTitle ||
                (locale === "fr"
                  ? "Bâtir des solutions fiables, sécurisées dès la conception."
                  : "Engineering resilient systems, secure by design.")
              }
              className="rounded-xl border border-white/10 bg-[#060605] min-h-11 px-3.5 text-xs text-[#f3f1f7] focus:border-[#9A71FF] focus:outline-none"
              required
            />
          </label>

          <label className="grid gap-2 font-semibold text-[#f3f1f7]">
            <span className="text-xs text-[#797681]">Paragraphe narratif / Vision</span>
            <textarea
              name="aboutBio"
              defaultValue={
                defaultValues.aboutBio ||
                (locale === "fr"
                  ? "Élève ingénieur en 4ème année de Génie Informatique à l'Université Privée de Fès (UPF), je développe des applications logicielles complètes où la sécurité n'est pas une surcouche de fin de projet, mais le fondement même de l'architecture. Mon expérience de stage chez IntelTrust et mes travaux personnels en cybersécurité m'ont appris à verrouiller les politiques d'accès (Zero-Trust, IAM) et auditer les surfaces d'attaque."
                  : "Fourth-year computer engineering student at Université Privée de Fès (UPF), I build full-stack digital systems where security is not a late addition, but the core foundation of architecture. My experience at IntelTrust and hands-on work in defensive cybersecurity taught me how to enforce Zero-Trust access and eliminate attack vectors.")
              }
              rows={4}
              className="rounded-xl border border-white/10 bg-[#060605] px-3.5 py-2.5 text-xs text-[#f3f1f7] resize-y focus:border-[#9A71FF] focus:outline-none leading-relaxed"
              required
            />
          </label>
        </div>

        {/* Quick Facts */}
        <div className="space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#9A71FF] block">
            3. Métadonnées & Repères
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="grid gap-2 font-semibold text-[#f3f1f7]">
              <span className="text-xs text-[#797681]">Formation</span>
              <input
                name="formation"
                defaultValue={defaultValues.formation}
                className="rounded-xl border border-white/10 bg-[#060605] min-h-11 px-3.5 text-xs text-[#f3f1f7] focus:border-[#9A71FF] focus:outline-none"
                required
              />
            </label>
            <label className="grid gap-2 font-semibold text-[#f3f1f7]">
              <span className="text-xs text-[#797681]">Détails de l&apos;expérience</span>
              <input
                name="experience"
                defaultValue={defaultValues.experience}
                className="rounded-xl border border-white/10 bg-[#060605] min-h-11 px-3.5 text-xs text-[#f3f1f7] focus:border-[#9A71FF] focus:outline-none"
                required
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="grid gap-2 font-semibold text-[#f3f1f7]">
              <span className="text-xs text-[#797681]">Statut de l&apos;expérience (Actuelle ou Terminée)</span>
              <select
                name="experienceStatus"
                defaultValue={defaultValues.experienceStatus || "completed"}
                className="rounded-xl border border-white/10 bg-[#060605] min-h-11 px-3.5 text-xs text-[#f3f1f7] focus:border-[#9A71FF] focus:outline-none cursor-pointer"
              >
                <option value="completed">
                  {locale === "fr" ? "Terminée (Affiche: Dernière expérience)" : "Completed (Displays: Recent Experience)"}
                </option>
                <option value="in_progress">
                  {locale === "fr" ? "En cours (Affiche: Expérience actuelle)" : "In Progress (Displays: Current Experience)"}
                </option>
              </select>
            </label>

            <label className="grid gap-2 font-semibold text-[#f3f1f7]">
              <span className="text-xs text-[#797681]">
                {locale === "fr"
                  ? "Titre personnalisé du repère (optionnel)"
                  : "Custom Label Title (optional)"}
              </span>
              <input
                name="experienceTitle"
                placeholder={
                  defaultValues.experienceStatus === "in_progress"
                    ? (locale === "fr" ? "Expérience actuelle" : "Current Experience")
                    : (locale === "fr" ? "Dernière expérience" : "Recent Experience")
                }
                defaultValue={defaultValues.experienceTitle || ""}
                className="rounded-xl border border-white/10 bg-[#060605] min-h-11 px-3.5 text-xs text-[#f3f1f7] focus:border-[#9A71FF] focus:outline-none"
              />
            </label>
          </div>

          <label className="grid gap-2 font-semibold text-[#f3f1f7]">
            <span className="text-xs text-[#797681]">Langues maîtrisées</span>
            <input
              name="languages"
              defaultValue={defaultValues.languages}
              className="rounded-xl border border-white/10 bg-[#060605] min-h-11 px-3.5 text-xs text-[#f3f1f7] focus:border-[#9A71FF] focus:outline-none"
              required
            />
          </label>
        </div>
        
        <div className="pt-4 border-t border-white/[0.08] mt-2">
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-xl bg-[#9A71FF] px-6 py-3.5 font-mono text-xs font-bold text-[#000000] hover:bg-[#b08dff] transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-[#9A71FF]/20"
          >
            {pending ? "Enregistrement en cours..." : `Enregistrer les modifications (${locale.toUpperCase()})`}
          </button>
        </div>
      </form>
    </section>
  );
}
