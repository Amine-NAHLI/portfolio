import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import PageIntro from "@/components/ui/PageIntro";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { getPublicCertifications, getPublicJourney } from "@/features/portfolio/data";
import { getPublishedProjects } from "@/features/projects/data";
import type { PublicSearchEntry } from "@/features/search/types";
import { isLocale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/seo";

type SearchPageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: SearchPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const title = locale === "fr" ? "Recherche" : "Search";
  const description = locale === "fr" ? "Recherchez dans les contenus publics du portfolio." : "Search the portfolio's public content.";
  return createPageMetadata({ locale, title, description, path: "/search" });
}

export default async function SearchPage({ params }: SearchPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [projects, certifications, timelineEntries] = await Promise.all([getPublishedProjects(locale), getPublicCertifications(locale), getPublicJourney(locale)]);
  const entries: PublicSearchEntry[] = [
    ...projects.map((project) => ({ id: project.slug, type: "project" as const, title: project.title, description: project.summary[locale], href: `/${locale}/projects/${project.slug}`, keywords: [...project.technologies, ...project.categories] })),
    ...certifications.map((certificate) => ({ id: certificate.id, type: "certification" as const, title: certificate.name, description: certificate.issuer ?? certificate.skills.join(" · "), href: `/${locale}/certifications`, keywords: certificate.skills })),
    ...timelineEntries.map((entry) => ({ id: entry.id, type: "journey" as const, title: entry.title, description: entry.description, href: `/${locale}/journey`, keywords: [entry.eventDate] })),
  ];
  const title = locale === "fr" ? "Recherche globale" : "Global search";
  const description = locale === "fr" ? "Retrouvez rapidement un projet, une compétence, une certification ou une étape du parcours." : "Quickly find a project, skill, certification or journey milestone.";

  return <><PageIntro eyebrow={locale === "fr" ? "Contenu public" : "Public content"} title={title} description={description} /><Container className="py-12 sm:py-16 lg:py-20"><div className="border-l border-border pl-0 sm:pl-6"><GlobalSearch entries={entries} locale={locale} /></div></Container></>;
}

export const revalidate = 900;
