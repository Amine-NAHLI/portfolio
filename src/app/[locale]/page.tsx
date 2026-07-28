import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, FileText, MapPin } from "lucide-react";
import ProjectSummaryCard from "@/components/projects/ProjectSummaryCard";
import ButtonLink from "@/components/ui/ButtonLink";
import Container from "@/components/ui/Container";
import JsonLd from "@/components/ui/JsonLd";
import PortfolioEmptyState from "@/components/ui/PortfolioEmptyState";
import SectionHeading from "@/components/ui/SectionHeading";
import TechnicalFrame from "@/components/ui/TechnicalFrame";
import { getSiteUrl, siteConfig } from "@/config/site";
import { publicCopy } from "@/content/copy";
import { getPublicCertifications, getPublicSkillGroups, getPublicTestimonials } from "@/features/portfolio/data";
import { getPublishedProjects } from "@/features/projects/data";
import { isLocale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";

type HomePageProps = { params: Promise<{ locale: string }> };

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
  const [projects, skillGroups, certifications, testimonials] = await Promise.all([
    getPublishedProjects(locale),
    getPublicSkillGroups(locale),
    getPublicCertifications(locale),
    getPublicTestimonials(locale),
  ]);
  const featuredProjects = projects.filter((project) => project.featured);

  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Person",
            "@id": new URL("/#person", getSiteUrl()).toString(),
            name: siteConfig.name,
            url: new URL(`/${locale}`, getSiteUrl()).toString(),
            homeLocation: siteConfig.location[locale],
            sameAs: [siteConfig.links.github, siteConfig.links.linkedin, siteConfig.links.tryHackMe],
            alumniOf: { "@type": "CollegeOrUniversity", name: "Université Privée de Fès" },
          },
          {
            "@type": "WebSite",
            name: `${siteConfig.name} — Portfolio`,
            url: getSiteUrl().toString(),
            inLanguage: locale,
            author: { "@id": new URL("/#person", getSiteUrl()).toString() },
          },
        ],
      }} />

      <section className="hero-atelier relative overflow-hidden border-b border-border py-20 sm:py-28 lg:py-32">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-65 grid-bg [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
        <div aria-hidden="true" className="absolute left-[8%] top-[24%] h-px w-[42%] bg-gradient-to-r from-transparent via-accent/70 to-transparent" />
        <div aria-hidden="true" className="absolute bottom-[18%] left-[7%] size-2 rounded-full border border-accent bg-bg-page shadow-[0_0_1.5rem_var(--accent)]" />
        <Container className="editorial-shell relative">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
            <div className="max-w-5xl lg:col-span-7">
              <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary">
                <span className="system-label">{"// "}{copy.eyebrow}</span>
                <span aria-hidden="true" className="size-1 rounded-full bg-accent shadow-[0_0_.8rem_var(--accent)]" />
                <span className="inline-flex items-center gap-1.5"><MapPin aria-hidden="true" className="size-4" />{siteConfig.location[locale]}</span>
              </div>
              <h1 className="mt-6 max-w-5xl text-balance font-display text-5xl font-semibold leading-[1.02] tracking-[-.055em] text-text-primary sm:text-6xl lg:text-7xl xl:text-[5.4rem]">{copy.title}</h1>
              <p className="mt-8 max-w-2xl text-pretty text-lg leading-8 text-text-secondary sm:text-xl">{copy.introduction}</p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <ButtonLink href={`/${locale}/projects`}>{copy.primaryCta}<ArrowRight aria-hidden="true" className="size-4" /></ButtonLink>
                <ButtonLink href={`/${locale}/journey`} variant="secondary">{copy.secondaryCta}</ButtonLink>
                <ButtonLink href={siteConfig.links.resume} target="_blank" rel="noreferrer" variant="quiet" data-analytics-event="cv_open"><FileText aria-hidden="true" className="size-4" />{copy.resumeCta}</ButtonLink>
              </div>
            </div>
            <div aria-hidden="true" className="relative hidden justify-center lg:col-span-3 lg:flex"><div className="hero-monogram"><span>AN</span></div></div>
            <aside className="hero-readout hidden self-end lg:col-span-2 lg:block">
              <p className="system-label text-text-muted">System readout</p>
              <div className="mt-3">
                <p className="hero-readout__row"><span>01</span><span>{siteConfig.location[locale]}</span></p>
                <p className="hero-readout__row"><span>02</span><span>FR · EN</span></p>
                <p className="hero-readout__row"><span>03</span><span>Portfolio</span></p>
                <p className="hero-readout__row"><span>04</span><span>2026</span></p>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <section className="section-lift py-20 sm:py-24">
        <Container><div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
          <SectionHeading eyebrow={copy.proofEyebrow} title={copy.proofTitle} description={copy.proofDescription} />
          <dl className="grid border border-border bg-surface/60 sm:grid-cols-3 lg:grid-cols-1">
            {copy.proofItems.map(([term, description], index) => <div key={term} className="group relative overflow-hidden border-b border-border p-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 lg:border-b lg:border-r-0 lg:last:border-b-0"><span aria-hidden="true" className="absolute right-4 top-4 font-mono text-[.62rem] text-text-muted/70">{String(index + 1).padStart(2, "0")}</span><dt className="font-mono text-[.68rem] font-semibold uppercase tracking-[.12em] text-text-muted">{term}</dt><dd className="mt-2 text-sm font-medium leading-6 text-text-primary">{description}</dd></div>)}
          </dl>
        </div></Container>
      </section>

      <section className="section-lift border-y border-border bg-surface-subtle/55 py-20 sm:py-24">
        <Container>
          <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between"><SectionHeading eyebrow={copy.projectsEyebrow} title={copy.projectsTitle} description={copy.projectsDescription} /><ButtonLink href={`/${locale}/projects`} variant="secondary" className="shrink-0 self-start md:self-auto">{copy.allProjects}<ArrowRight aria-hidden="true" className="size-4" /></ButtonLink></div>
          {featuredProjects.length ? <div className="mt-10 grid gap-5 xl:grid-cols-12">{featuredProjects.map((project, index) => <div key={project.slug} className={index === 0 ? "xl:col-span-7" : "xl:col-span-5"}><ProjectSummaryCard project={project} locale={locale} cta={publicCopy[locale].projects.viewProject} index={String(index + 1).padStart(2, "0")} /></div>)}</div> : <PortfolioEmptyState collection="projects" locale={locale} className="mt-10" />}
        </Container>
      </section>

      <section className="section-lift py-20 sm:py-24">
        <Container>
          <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between"><SectionHeading eyebrow={copy.skillsEyebrow} title={copy.skillsTitle} description={copy.skillsDescription} /><ButtonLink href={`/${locale}/skills`} variant="secondary" className="shrink-0 self-start md:self-auto">{copy.allSkills}<ArrowRight aria-hidden="true" className="size-4" /></ButtonLink></div>
          {skillGroups.length ? <div className="mt-10 grid gap-5 lg:grid-cols-3">{skillGroups.map((group, index) => <TechnicalFrame key={group.id} index={`0${index + 1}`} label="Expertise map" className="p-6"><h3 className="text-xl font-semibold text-text-primary">{group.title}</h3>{group.description ? <p className="mt-3 text-sm leading-6 text-text-secondary">{group.description}</p> : null}<ul className="mt-5 flex flex-wrap gap-2">{group.skills.slice(0, 6).map((skill) => <li key={skill.name} className="border border-border bg-surface-raised px-2 py-1 font-mono text-[.68rem] uppercase tracking-[.06em] text-text-secondary">{skill.name}</li>)}</ul></TechnicalFrame>)}</div> : <PortfolioEmptyState collection="skills" locale={locale} className="mt-10" />}
        </Container>
      </section>

      <section className="section-lift border-y border-border bg-surface-subtle/55 py-20 sm:py-24">
        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            {certifications.length ? <TechnicalFrame index="07" label={copy.certificationsEyebrow} className="p-7 sm:p-9"><h2 className="mt-4 text-3xl font-semibold text-text-primary">{copy.certificationsTitle}</h2><ul className="mt-6 divide-y divide-border">{certifications.slice(0, 3).map((certification) => <li key={certification.id} className="py-3 first:pt-0 last:pb-0"><p className="font-medium text-text-primary">{certification.name}</p>{certification.issuer ? <p className="mt-1 text-sm text-text-muted">{certification.issuer}</p> : null}</li>)}</ul><Link className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-sm font-mono text-xs font-semibold uppercase tracking-[.07em] text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent" href={`/${locale}/certifications`}>{copy.certificationsCta}<ArrowUpRight aria-hidden="true" className="size-4" /></Link></TechnicalFrame> : <PortfolioEmptyState collection="certifications" locale={locale} />}
            {testimonials.length ? <TechnicalFrame index="08" label={locale === "fr" ? "Recommandations" : "Recommendations"} className="p-7 sm:p-9"><h2 className="mt-4 text-3xl font-semibold text-text-primary">{locale === "fr" ? "Retours professionnels" : "Professional feedback"}</h2><blockquote className="mt-6 border-l-2 border-accent pl-5 text-lg leading-8 text-text-secondary">“{testimonials[0].message}”</blockquote><p className="mt-5 text-sm font-semibold text-text-primary">{testimonials[0].name}{testimonials[0].role ? ` — ${testimonials[0].role}` : ""}</p>{testimonials[0].organization ? <p className="mt-1 text-sm text-text-muted">{testimonials[0].organization}</p> : null}</TechnicalFrame> : <PortfolioEmptyState collection="testimonials" locale={locale} />}
          </div>
        </Container>
      </section>

      <section className="section-lift py-20 sm:py-24">
        <Container><TechnicalFrame index="09" label={copy.contactEyebrow} className="relative overflow-hidden px-6 py-12 sm:px-10 lg:px-14 lg:py-16"><div aria-hidden="true" className="absolute -right-16 -top-24 size-72 rounded-full bg-accent/10 blur-3xl" /><div className="relative max-w-3xl"><h2 className="mt-4 text-balance text-3xl font-semibold text-text-primary sm:text-4xl">{copy.contactTitle}</h2><p className="mt-5 max-w-2xl text-pretty leading-7 text-text-secondary">{copy.contactDescription}</p><ButtonLink href={`/${locale}/contact`} className="mt-7">{copy.contactCta}<ArrowRight aria-hidden="true" className="size-4" /></ButtonLink></div></TechnicalFrame></Container>
      </section>
    </>
  );
}
