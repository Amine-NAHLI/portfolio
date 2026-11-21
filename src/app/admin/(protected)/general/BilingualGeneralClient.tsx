"use client";

import { useState } from "react";
import { Languages, Columns } from "lucide-react";
import { GeneralInfoForm } from "./GeneralInfoForm";
import { HeroButtonsManager } from "./HeroButtonsManager";
import type { HeroActionButton } from "@/content/dynamic-copy";

interface BilingualGeneralClientProps {
  heroButtons: HeroActionButton[];
  currentFr: Parameters<typeof GeneralInfoForm>[0]["defaultValues"];
  currentEn: Parameters<typeof GeneralInfoForm>[0]["defaultValues"];
}

export function BilingualGeneralClient({
  heroButtons,
  currentFr,
  currentEn,
}: BilingualGeneralClientProps) {
  const [activeLang, setActiveLang] = useState<"fr" | "en" | "both">("fr");

  return (
    <div className="space-y-8">
      {/* Hero Action Buttons Manager */}
      <HeroButtonsManager initialButtons={heroButtons} />

      {/* Language Switcher Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-white/10 bg-surface/40 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <Languages className="size-4 text-accent" />
          <span className="font-mono text-xs uppercase tracking-wider text-text-primary font-bold">
            Langue d&apos;édition :
          </span>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/10">
          <button
            type="button"
            onClick={() => setActiveLang("fr")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-mono text-xs font-semibold transition-all cursor-pointer ${
              activeLang === "fr"
                ? "bg-accent/20 text-accent border border-accent/30 shadow-xs"
                : "text-text-muted hover:text-text-primary hover:bg-white/5"
            }`}
          >
            <span>🇫🇷 Français</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveLang("en")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-mono text-xs font-semibold transition-all cursor-pointer ${
              activeLang === "en"
                ? "bg-accent/20 text-accent border border-accent/30 shadow-xs"
                : "text-text-muted hover:text-text-primary hover:bg-white/5"
            }`}
          >
            <span>🇬🇧 English</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveLang("both")}
            className={`hidden xl:flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-mono text-xs font-semibold transition-all cursor-pointer ${
              activeLang === "both"
                ? "bg-accent/20 text-accent border border-accent/30 shadow-xs"
                : "text-text-muted hover:text-text-primary hover:bg-white/5"
            }`}
          >
            <Columns className="size-3.5" />
            <span>Côte à côte</span>
          </button>
        </div>
      </div>

      {/* Form Views */}
      {activeLang === "both" ? (
        <div className="grid gap-8 xl:grid-cols-2 items-start animate-in fade-in duration-200">
          <GeneralInfoForm locale="fr" title="Version Française" defaultValues={currentFr} />
          <GeneralInfoForm locale="en" title="Version Anglaise" defaultValues={currentEn} />
        </div>
      ) : activeLang === "fr" ? (
        <div className="max-w-3xl mx-auto animate-in fade-in duration-200">
          <GeneralInfoForm locale="fr" title="Version Française" defaultValues={currentFr} />
        </div>
      ) : (
        <div className="max-w-3xl mx-auto animate-in fade-in duration-200">
          <GeneralInfoForm locale="en" title="Version Anglaise" defaultValues={currentEn} />
        </div>
      )}
    </div>
  );
}
