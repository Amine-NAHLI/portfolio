import Link from "next/link";
import { ArrowUpRight, Inbox } from "lucide-react";
import TechnicalFrame from "@/components/ui/TechnicalFrame";
import type { Locale } from "@/i18n/config";

type PortfolioCollection = "projects" | "journey" | "skills" | "certifications" | "testimonials";

const emptyCopy: Record<Locale, Record<PortfolioCollection, { title: string; description: string; action: string }>> = {
  fr: {
    projects: { title: "Aucun projet publié", description: "Ajoutez votre premier projet depuis l’administration pour commencer à documenter votre travail.", action: "Gérer les projets" },
    journey: { title: "Aucune étape de parcours", description: "Les expériences et formations apparaîtront ici après leur ajout dans l’administration.", action: "Gérer le parcours" },
    skills: { title: "Aucune compétence publiée", description: "Ajoutez des compétences et leurs catégories depuis l’administration pour construire cette cartographie.", action: "Gérer les compétences" },
    certifications: { title: "Aucune certification publiée", description: "Ajoutez vos certifications depuis l’administration pour les présenter ici.", action: "Gérer les certifications" },
    testimonials: { title: "Aucun témoignage publié", description: "Les recommandations approuvées apparaîtront ici après leur modération dans l’administration.", action: "Gérer les avis" },
  },
  en: {
    projects: { title: "No published projects yet", description: "Add your first project in the administration area to begin documenting your work.", action: "Manage projects" },
    journey: { title: "No journey entries yet", description: "Experiences and education will appear here after they are added in the administration area.", action: "Manage journey" },
    skills: { title: "No published skills yet", description: "Add skills and their categories in the administration area to build this map.", action: "Manage skills" },
    certifications: { title: "No published certifications yet", description: "Add certifications in the administration area to present them here.", action: "Manage certifications" },
    testimonials: { title: "No published testimonials yet", description: "Approved recommendations will appear here after they are moderated in the administration area.", action: "Manage testimonials" },
  },
};

export default function PortfolioEmptyState({ collection, locale, className }: { collection: PortfolioCollection; locale: Locale; className?: string }) {
  const copy = emptyCopy[locale][collection];
  const target = collection === "testimonials" ? "/admin/testimonials" : `/admin/${collection}`;

  return (
    <TechnicalFrame as="section" index="00" label="Content queue" className={`p-7 text-center sm:p-10 ${className ?? ""}`}>
      <Inbox aria-hidden="true" className="mx-auto size-6 text-accent" />
      <h2 className="mt-4 text-xl font-semibold text-text-primary">{copy.title}</h2>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-text-secondary">{copy.description}</p>
    </TechnicalFrame>
  );
}
