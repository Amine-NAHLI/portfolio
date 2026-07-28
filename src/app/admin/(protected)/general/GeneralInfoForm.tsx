"use client";

import { useState } from "react";
import { saveGeneralInfo } from "./actions";

type Props = {
  locale: "fr" | "en";
  title: string;
  defaultValues: {
    eyebrow: string;
    title: string;
    introduction: string;
    formation: string;
    experience: string;
    languages: string;
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
    } catch (e) {
      setMessage({ type: "error", text: "Erreur lors de l'enregistrement." });
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="technical-frame p-0 flex flex-col">
      <div className="border-b border-border px-6 py-5 bg-surface-subtle/50 flex items-center gap-4">
        <span className="grid size-10 rounded bg-accent/10 text-accent place-items-center text-sm font-bold">
          {locale.toUpperCase()}
        </span>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      
      <form action={handleSubmit} className="flex flex-col p-6 gap-6">
        {message && (
          <div className={`p-4 rounded-md text-sm font-semibold border ${
            message.type === "success" 
              ? "bg-success/10 text-success border-success/30" 
              : "bg-danger/10 text-danger border-danger/30"
          }`}>
            {message.text}
          </div>
        )}
        
        <label className="grid gap-2 text-sm font-semibold text-text-primary">
          <span>Sous-titre (Eyebrow)</span>
          <input name="eyebrow" defaultValue={defaultValues.eyebrow} className="min-h-11 px-3 font-normal" required />
        </label>
        
        <label className="grid gap-2 text-sm font-semibold text-text-primary">
          <span>Titre principal</span>
          <textarea name="title" defaultValue={defaultValues.title} rows={3} className="px-3 py-2 font-normal resize-y" required />
        </label>
        
        <label className="grid gap-2 text-sm font-semibold text-text-primary">
          <span>Introduction</span>
          <textarea name="introduction" defaultValue={defaultValues.introduction} rows={4} className="px-3 py-2 font-normal resize-y" required />
        </label>
        
        <div className="grid grid-cols-2 gap-4">
          <label className="grid gap-2 text-sm font-semibold text-text-primary">
            <span>Formation</span>
            <input name="formation" defaultValue={defaultValues.formation} className="min-h-11 px-3 font-normal" required />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-text-primary">
            <span>Expérience actuelle</span>
            <input name="experience" defaultValue={defaultValues.experience} className="min-h-11 px-3 font-normal" required />
          </label>
        </div>
        
        <label className="grid gap-2 text-sm font-semibold text-text-primary">
          <span>Langues</span>
          <input name="languages" defaultValue={defaultValues.languages} className="min-h-11 px-3 font-normal" required />
        </label>
        
        <div className="pt-6 border-t border-border mt-2">
          <button type="submit" disabled={pending} className="button-primary w-full">
            {pending ? "Enregistrement..." : `Enregistrer les modifications (${locale.toUpperCase()})`}
          </button>
        </div>
      </form>
    </section>
  );
}
