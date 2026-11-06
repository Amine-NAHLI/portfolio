import type { Metadata } from "next";
import { requireAdminPage } from "@/lib/auth/admin";
import { getPublishedProjects } from "@/features/projects/data";
import { getPublicJourney, getPublicCertifications } from "@/features/portfolio/data";
import TranslationsClient from "@/components/admin/TranslationsClient";

export const metadata: Metadata = {
  title: "Centre de Traductions & Langues — Administration",
};

export default async function AdminTranslationsPage() {
  await requireAdminPage();

  const [projects, journey, certifications] = await Promise.all([
    getPublishedProjects("fr"),
    getPublicJourney("fr"),
    getPublicCertifications("fr"),
  ]);

  const stats = {
    projectsCount: projects.length,
    journeyCount: journey.length,
    certificationsCount: certifications.length,
  };

  return (
    <div className="max-w-6xl">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end border-b border-white/10 pb-6 mb-10">
        <div className="max-w-3xl">
          <p className="font-mono text-xs text-[#9A71FF] uppercase tracking-wider">{"// Système Linguistique & IA"}</p>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl text-[#f3f1f7]">
            Traductions & Multilinguisme
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#797681]">
            Supervisez la couverture bilingue (Français / Anglais), traduisez du contenu technique avec l&apos;IA LLaMA 3.3 et accédez rapidement à la gestion bilingue de chaque section.
          </p>
        </div>
      </header>

      <TranslationsClient stats={stats} />
    </div>
  );
}

