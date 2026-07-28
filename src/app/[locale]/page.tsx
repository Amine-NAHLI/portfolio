import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, FileText } from "lucide-react";
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

      <section className="relative overflow-hidden border-b border-border bg-bg-page py-20 sm:py-28 lg:py-32">
        {/* Spotlight Blur Effect */}
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[40rem] w-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-accent/10 blur-[120px]" />
        
        <Container className="relative z-10">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
            {/* Left Column - Text Content */}
            <div className="flex flex-col justify-center lg:col-span-7">
              <div className="flex items-center gap-4 text-sm font-semibold tracking-[0.15em] text-accent uppercase">
                <span className="h-px w-8 bg-accent" />
                L'ingénieur
              </div>
              
              <h1 className="mt-6 text-5xl font-black uppercase tracking-tight text-text-primary sm:text-7xl lg:text-[5.5rem] lg:leading-[1.1]">
                {siteConfig.name}
              </h1>
              
              <h2 className="mt-6 font-mono text-sm font-semibold uppercase tracking-widest text-accent sm:text-base">
                {copy.eyebrow}
              </h2>
              
              <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-text-secondary">
                {copy.title}
              </p>
              
              <p className="mt-4 max-w-xl text-pretty text-lg leading-relaxed text-text-secondary">
                {copy.introduction}
              </p>
              
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <ButtonLink href={`/${locale}/contact`}>
                  {copy.contactCta} <ArrowRight aria-hidden="true" className="size-4" />
                </ButtonLink>
                <ButtonLink href={siteConfig.links.resume} target="_blank" rel="noreferrer" variant="secondary" data-analytics-event="cv_open">
                  <FileText aria-hidden="true" className="size-4" />
                  {copy.resumeCta}
                </ButtonLink>
              </div>
            </div>

            {/* Right Column - Photo */}
            <div className="relative flex justify-center lg:col-span-5 lg:justify-end">
              <div className="relative aspect-[3/4] w-full max-w-sm overflow-hidden p-3 sm:max-w-md">
                {/* Frame corners (like in the screenshot) */}
                <div className="absolute left-0 top-0 size-10 border-l-2 border-t-2 border-accent rounded-tl-xl opacity-80" />
                <div className="absolute right-0 top-0 size-10 border-r-2 border-t-2 border-accent rounded-tr-xl opacity-80" />
                <div className="absolute bottom-0 left-0 size-10 border-b-2 border-l-2 border-accent rounded-bl-xl opacity-80" />
                <div className="absolute bottom-0 right-0 size-10 border-b-2 border-r-2 border-accent rounded-br-xl opacity-80" />
                
                {/* Photo container */}
                <div className="relative h-full w-full overflow-hidden rounded-xl bg-surface-subtle shadow-2xl">
                  <Image 
                    src="/nahli.png" 
                    alt={siteConfig.name} 
                    fill 
                    className="object-cover object-top" 
                    priority 
                    sizes="(max-width: 768px) 100vw, 30vw"
                  />
                </div>
              </div>
            </div>
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
