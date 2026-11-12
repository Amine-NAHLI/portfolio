import type { Metadata } from "next";
import { requireAdminPage } from "@/lib/auth/admin";
import { getPublicJourneyTimeline } from "@/features/portfolio/data";
import { JourneyManager } from "@/components/admin/JourneyManager";

export const metadata: Metadata = {
  title: "Gestion du Parcours & Tags — Administration",
};

export default async function AdminJourneyPage() {
  await requireAdminPage();
  const items = await getPublicJourneyTimeline();

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end border-b border-white/10 pb-6 mb-10">
        <div>
          <p className="font-mono text-xs text-[#C8F122] uppercase tracking-wider">
            {"// Parcours Professionnel & Tags"}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl text-[#FFFFFF]">
            Trajectoire & Tags Personnalisés
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#A1A1AA]">
            Gérez manuellement chaque étape de votre parcours (formations, expériences, distinctions), ajoutez des tags techniques et choisissez soit leur style neutre standard, soit vos propres couleurs personnalisées.
          </p>
        </div>
      </header>

      <JourneyManager initialItems={items} />
    </div>
  );
}

