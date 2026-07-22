import type { Metadata } from "next";
import ProjectExplorer from "@/components/projects/ProjectExplorer";
import Container from "@/components/ui/Container";
import PageIntro from "@/components/ui/PageIntro";
import { publicCopy } from "@/content/copy";
import { getPublishedProjects } from "@/features/projects/data";
import { isLocale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";

type ProjectsPageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: ProjectsPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = publicCopy[locale].projects;
  return createPageMetadata({ locale, title: copy.title, description: copy.description, path: "/projects" });
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = publicCopy[locale].projects;
  const projects = await getPublishedProjects(locale);

  return (
    <>
      <PageIntro eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />
      <Container className="py-12 sm:py-16 lg:py-20">
        <ProjectExplorer locale={locale} projects={projects} />
      </Container>
    </>
  );
}
