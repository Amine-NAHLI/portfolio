import type { Metadata } from "next";
import { requireAdminPage } from "@/lib/auth/admin";
import { getPublicJourneyTimeline } from "@/features/portfolio/data";
import { JourneyManager } from "@/components/admin/JourneyManager";

export const metadata: Metadata = {
  title: "Gestion des Hackathons & Photos — Administration",
};

export default async function AdminJourneyPage() {
  await requireAdminPage();
  const items = await getPublicJourneyTimeline();

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end border-b border-white/10 pb-6 mb-10">
        <div>
          <p className="font-mono text-xs text-[#A855F7] uppercase tracking-wider font-bold">
            {"// Hackathons & Compétitions d'Ingénierie"}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl text-[#FFFFFF]">
            War Room des Hackathons & Clichés de Terrain
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#A1A1AA]">
            Gérez vos hackathons (Google Build with Gemma, UPF Robotics, Prochains Défis), importez vos photographies réelles de terrain (podium, remise de trophée, stands, live coding), documentez vos défis 48H et configurez les tags techniques.
          </p>
        </div>
      </header>

      <JourneyManager initialItems={items} />
    </div>
  );
}
