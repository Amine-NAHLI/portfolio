import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Container from "@/components/ui/Container";
import PageIntro from "@/components/ui/PageIntro";
import { getProject, skillGroups } from "@/content/portfolio";
import { publicCopy } from "@/content/copy";
import { isLocale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";

type SkillsPageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: SkillsPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = publicCopy[locale].skills;
  return createPageMetadata({ locale, title: copy.title, description: copy.description, path: "/skills" });
}

export default async function SkillsPage({ params }: SkillsPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = publicCopy[locale].skills;

  return (
    <>
      <PageIntro eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />
      <Container className="py-12 sm:py-16 lg:py-20">
        <div className="grid gap-6 lg:grid-cols-3">
          {skillGroups.map((group) => (
            <article key={group.id} className="surface-card flex flex-col p-6 sm:p-7">
              <h2 className="text-2xl font-semibold text-text-primary">{group.title[locale]}</h2>
              <p className="mt-3 text-sm leading-6 text-text-secondary">{group.description[locale]}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {group.skills.map((skill) => <li key={skill}><Badge>{skill}</Badge></li>)}
              </ul>
              <div className="mt-8 border-t border-border pt-5">
                <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">{copy.evidence}</h3>
                <ul className="mt-3 grid gap-2">
                  {group.evidence.map((slug) => {
                    const project = getProject(slug);
                    if (!project) return null;
                    return (
                      <li key={slug}>
                        <Link href={`/${locale}/projects/${slug}`} className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-semibold text-text-primary transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                          {project.title}<span className="sr-only"> — {copy.viewProject}</span><ArrowUpRight aria-hidden="true" className="size-4" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </>
  );
}

