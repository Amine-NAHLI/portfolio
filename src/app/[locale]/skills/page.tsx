import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Container from "@/components/ui/Container";
import PageIntro from "@/components/ui/PageIntro";
import PortfolioEmptyState from "@/components/ui/PortfolioEmptyState";
import TechnicalFrame from "@/components/ui/TechnicalFrame";
import { getPublicSkillGroups } from "@/features/portfolio/data";
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
  const skillGroups = await getPublicSkillGroups(locale);

  return (
    <>
      <PageIntro eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />
      <Container className="py-12 sm:py-16 lg:py-20">
        {skillGroups.length === 0 ? <PortfolioEmptyState collection="skills" locale={locale} className="mx-auto max-w-3xl" /> : <div className="grid gap-6 lg:grid-cols-3">
          {skillGroups.map((group) => (
            <TechnicalFrame key={group.id} index={String(skillGroups.indexOf(group) + 1).padStart(2, "0")} label="Capability" className="flex flex-col p-6 sm:p-7">
              <h2 className="text-2xl font-semibold text-text-primary">{group.title}</h2>
              {group.description ? <p className="mt-3 text-sm leading-6 text-text-secondary">{group.description}</p> : null}
              <ul className="mt-6 flex flex-wrap gap-2">
                {group.skills.map((skill) => <li key={skill.name}><Badge title={skill.level}>{skill.name}</Badge></li>)}
              </ul>
              {Array.from(new Set(group.skills.flatMap((skill) => skill.evidence))).length ? <div className="mt-8 border-t border-border pt-5">
                <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">{copy.evidence}</h3>
                <ul className="mt-3 grid gap-2">
                  {Array.from(new Set(group.skills.flatMap((skill) => skill.evidence))).map((slug) => <li key={slug}><Link href={`/${locale}/projects/${slug}`} className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-semibold text-text-primary transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">{slug}<span className="sr-only"> — {copy.viewProject}</span><ArrowUpRight aria-hidden="true" className="size-4" /></Link></li>)}
                </ul>
              </div> : null}
            </TechnicalFrame>
          ))}
        </div>}
      </Container>
    </>
  );
}
