import type { Metadata } from "next";
import { requireAdminPage } from "@/lib/auth/admin";
import { CVManager } from "@/components/admin/CVManager";

export const metadata: Metadata = {
  title: "Gestion du CV (PDF) — Administration",
};

export default async function AdminCVPage() {
  await requireAdminPage();

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end border-b border-white/10 pb-6 mb-10">
        <div>
          <p className="font-mono text-xs text-[#9A71FF] uppercase tracking-wider">{"// Document Professionnel"}</p>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl text-[#f3f1f7]">
            Curriculum Vitae (PDF)
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#797681]">
            Téléversez vos versions officielles en Français et en Anglais. Chaque fichier est servi automatiquement selon la langue du visiteur.
          </p>
        </div>
      </header>

      <CVManager />
    </div>
  );
}

