import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, FileText, MapPin } from "lucide-react";
import ProjectSummaryCard from "@/components/projects/ProjectSummaryCard";
import ButtonLink from "@/components/ui/ButtonLink";
import Container from "@/components/ui/Container";
import JsonLd from "@/components/ui/JsonLd";
import SectionHeading from "@/components/ui/SectionHeading";
import { getSiteUrl, siteConfig } from "@/config/site";
import { certifications, currentFocus, skillGroups } from "@/content/portfolio";
import { publicCopy } from "@/content/copy";
import { getPublishedProjects } from "@/features/projects/data";
import { isLocale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = publicCopy[locale].home;
  return createPageMetadata({ locale, title: copy.eyebrow, description: copy.introduction });
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = publicCopy[locale].home;
  const projects = await getPublishedProjects(locale);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Person",
              "@id": new URL("/#person", getSiteUrl()).toString(),
              name: siteConfig.name,
              url: new URL(`/${locale}`, getSiteUrl()).toString(),
              homeLocation: siteConfig.location[locale],
              sameAs: [siteConfig.links.github, siteConfig.links.linkedin, siteConfig.links.tryHackMe],
              alumniOf: {
                "@type": "CollegeOrUniversity",
                name: "Université Privée de Fès",
              },
            },
            {
              "@type": "WebSite",
              name: `${siteConfig.name} — Portfolio`,
              url: getSiteUrl().toString(),
              inLanguage: locale,
              author: { "@id": new URL("/#person", getSiteUrl()).toString() },
            },
          ],
        }}
      />

      <section className="relative overflow-hidden border-b border-border py-20 sm:py-28 lg:py-36">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-35 grid-bg [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />
        <Container className="relative">
          <div className="max-w-5xl">
            <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary">
              <span className="eyebrow">{copy.eyebrow}</span>
              <span aria-hidden="true" className="size-1 rounded-full bg-border-strong" />
              <span className="inline-flex items-center gap-1.5"><MapPin aria-hidden="true" className="size-4" />{siteConfig.location[locale]}</span>
            </div>
            <h1 className="mt-6 max-w-5xl text-balance text-5xl font-semibold leading-[1.05] tracking-[-0.045em] text-text-primary sm:text-6xl lg:text-7xl xl:text-[5.25rem]">
              {copy.title}
            </h1>
            <p className="mt-7 max-w-3xl text-pretty text-lg leading-8 text-text-secondary sm:text-xl">
              {copy.introduction}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href={`/${locale}/projects`}>
                {copy.primaryCta}<ArrowRight aria-hidden="true" className="size-4" />
              </ButtonLink>
              <ButtonLink href={`/${locale}/journey`} variant="secondary">{copy.secondaryCta}</ButtonLink>
              <ButtonLink href={siteConfig.links.resume} target="_blank" rel="noreferrer" variant="quiet" data-analytics-event="cv_open">
                <FileText aria-hidden="true" className="size-4" />{copy.resumeCta}
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <SectionHeading eyebrow={copy.proofEyebrow} title={copy.proofTitle} description={copy.proofDescription} />
            <dl className="grid overflow-hidden rounded-2xl border border-border bg-surface sm:grid-cols-3 lg:grid-cols-1">
              {copy.proofItems.map(([term, description]) => (
                <div key={term} className="border-b border-border p-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 lg:border-b lg:border-r-0 lg:last:border-b-0">
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">{term}</dt>
                  <dd className="mt-2 text-sm font-medium leading-6 text-text-primary">{description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </section>

      <section className="border-y border-border bg-surface-subtle py-20 sm:py-24">
        <Container>
          <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
            <SectionHeading eyebrow={copy.projectsEyebrow} title={copy.projectsTitle} description={copy.projectsDescription} />
            <ButtonLink href={`/${locale}/projects`} variant="secondary" className="shrink-0 self-start md:self-auto">
              {copy.allProjects}<ArrowRight aria-hidden="true" className="size-4" />
            </ButtonLink>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {projects.filter((project) => project.featured).map((project) => (
              <ProjectSummaryCard key={project.slug} project={project} locale={locale} cta={publicCopy[locale].projects.viewProject} />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
            <SectionHeading eyebrow={copy.skillsEyebrow} title={copy.skillsTitle} description={copy.skillsDescription} />
            <ButtonLink href={`/${locale}/skills`} variant="secondary" className="shrink-0 self-start md:self-auto">
              {copy.allSkills}<ArrowRight aria-hidden="true" className="size-4" />
            </ButtonLink>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {skillGroups.map((group) => (
              <article key={group.id} className="surface-card p-6">
                <h3 className="text-xl font-semibold text-text-primary">{group.title[locale]}</h3>
                <p className="mt-3 text-sm leading-6 text-text-secondary">{group.description[locale]}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {group.skills.slice(0, 6).map((skill) => <li key={skill} className="rounded-full bg-surface-raised px-3 py-1 text-xs text-text-secondary">{skill}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-border bg-surface-subtle py-20 sm:py-24">
        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            <article className="surface-card p-7 sm:p-9">
              <p className="eyebrow">{copy.nowEyebrow}</p>
              <h2 className="mt-4 text-3xl font-semibold text-text-primary">{copy.nowTitle}</h2>
              <p className="mt-4 leading-7 text-text-secondary">{copy.nowDescription}</p>
              <p className="mt-6 rounded-xl border border-border bg-bg-page p-4 text-sm leading-6 text-text-primary">{currentFocus.project[locale]}</p>
              <Link className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg font-semibold text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent" href={`/${locale}/now`}>
                {copy.nowCta}<ArrowUpRight aria-hidden="true" className="size-4" />
              </Link>
            </article>
            <article className="surface-card p-7 sm:p-9">
              <p className="eyebrow">{copy.certificationsEyebrow}</p>
              <h2 className="mt-4 text-3xl font-semibold text-text-primary">{copy.certificationsTitle}</h2>
              <ul className="mt-6 divide-y divide-border">
                {certifications.slice(0, 3).map((certification) => (
                  <li key={certification.id} className="py-3 first:pt-0 last:pb-0">
                    <p className="font-medium text-text-primary">{certification.name[locale]}</p>
                    {certification.issuer ? <p className="mt-1 text-sm text-text-muted">{certification.issuer}</p> : null}
                  </li>
                ))}
              </ul>
              <Link className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg font-semibold text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent" href={`/${locale}/certifications`}>
                {copy.certificationsCta}<ArrowUpRight aria-hidden="true" className="size-4" />
              </Link>
            </article>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <div className="surface-card relative overflow-hidden px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
            <div aria-hidden="true" className="absolute -right-16 -top-24 size-72 rounded-full bg-accent/10 blur-3xl" />
            <div className="relative max-w-3xl">
              <p className="eyebrow">{copy.contactEyebrow}</p>
              <h2 className="mt-4 text-balance text-3xl font-semibold text-text-primary sm:text-4xl">{copy.contactTitle}</h2>
              <p className="mt-5 max-w-2xl text-pretty leading-7 text-text-secondary">{copy.contactDescription}</p>
              <ButtonLink href={`/${locale}/contact`} className="mt-7">{copy.contactCta}<ArrowRight aria-hidden="true" className="size-4" /></ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
