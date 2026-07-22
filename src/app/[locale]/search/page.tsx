import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import PageIntro from "@/components/ui/PageIntro";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { certifications, skillGroups, timelineEntries } from "@/content/portfolio";
import { getPublishedPosts } from "@/features/blog/data";
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
  const [posts, projects] = await Promise.all([getPublishedPosts(locale), getPublishedProjects(locale)]);
  const entries: PublicSearchEntry[] = [
    ...projects.map((project) => ({ id: project.slug, type: "project" as const, title: project.title, description: project.summary[locale], href: `/${locale}/projects/${project.slug}`, keywords: [...project.technologies, ...project.categories] })),
    ...skillGroups.map((group) => ({ id: group.id, type: "skill" as const, title: group.title[locale], description: group.description[locale], href: `/${locale}/skills`, keywords: group.skills })),
    ...certifications.map((certification) => ({ id: certification.id, type: "certification" as const, title: certification.name[locale], description: certification.issuer ?? certification.relatedSkills.join(" · "), href: `/${locale}/certifications`, keywords: certification.relatedSkills })),
    ...timelineEntries.map((entry) => ({ id: entry.id, type: "journey" as const, title: entry.title[locale], description: entry.description[locale], href: `/${locale}/journey`, keywords: [entry.organization, ...entry.details.map((detail) => detail[locale])] })),
    ...posts.map((post) => ({ id: post.id, type: "article" as const, title: post.title, description: post.excerpt, href: `/${locale}/blog/${post.slug}`, keywords: [post.category?.name ?? "", ...post.tags.map((tag) => tag.name)] })),
  ];
  const title = locale === "fr" ? "Recherche globale" : "Global search";
  const description = locale === "fr" ? "Retrouvez rapidement un projet, une compétence, une certification, une étape du parcours ou un article publié." : "Quickly find a project, skill, certification, journey milestone or published article.";

  return <><PageIntro eyebrow={locale === "fr" ? "Contenu public" : "Public content"} title={title} description={description} /><Container className="py-12 sm:py-16 lg:py-20"><GlobalSearch entries={entries} locale={locale} /></Container></>;
}

export const revalidate = 900;
