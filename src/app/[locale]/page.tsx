import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, FileText, BriefcaseBusiness, GraduationCap } from "lucide-react";
import ProjectSummaryCard from "@/components/projects/ProjectSummaryCard";
import ButtonLink from "@/components/ui/ButtonLink";
import Container from "@/components/ui/Container";
import JsonLd from "@/components/ui/JsonLd";
import PortfolioEmptyState from "@/components/ui/PortfolioEmptyState";
import SectionHeading from "@/components/ui/SectionHeading";
import TechnicalFrame from "@/components/ui/TechnicalFrame";
import { getSiteUrl, siteConfig } from "@/config/site";
import { publicCopy } from "@/content/copy";
import { getPublicCertifications, getPublicSkillGroups, getPublicTestimonials, getPublicJourney } from "@/features/portfolio/data";
import { getPublishedProjects } from "@/features/projects/data";
import { isLocale, Locale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import TestimonialForm from "@/components/testimonials/TestimonialForm";

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
  const [projects, skillGroups, certifications, testimonials, journey] = await Promise.all([
    getPublishedProjects(locale),
    getPublicSkillGroups(locale),
    getPublicCertifications(locale),
    getPublicTestimonials(locale),
    getPublicJourney(locale),
  ]);
  const featuredProjects = projects.filter((project) => project.featured).slice(0, 3);
  const displaySkills = skillGroups.slice(0, 3);
  const displayCertifications = certifications.slice(0, 3);
  const displayTestimonials = testimonials.slice(0, 3);
  const displayJourney = journey.slice(0, 3);

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

      <section id="home" className="relative overflow-hidden border-b border-border bg-bg-page py-20 sm:py-28 lg:py-32">
        {/* Spotlight Blur Effect */}
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[40rem] w-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-accent/10 blur-[120px]" />
        
        <Container className="relative z-10">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
            {/* Left Column - Text Content */}
            <div className="flex flex-col justify-center lg:col-span-7">
              <div className="flex items-center gap-4 text-sm font-semibold tracking-[0.15em] text-accent uppercase">
                <span className="h-px w-8 bg-accent" />
                L&apos;ingénieur
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

      <section id="projects" className="section-lift border-y border-border bg-surface-subtle/55 py-20 sm:py-24">
        <Container>
          <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between"><SectionHeading eyebrow={copy.projectsEyebrow} title={copy.projectsTitle} description={copy.projectsDescription} /><ButtonLink href={`/${locale}/projects`} variant="secondary" className="shrink-0 self-start md:self-auto">{copy.allProjects}<ArrowRight aria-hidden="true" className="size-4" /></ButtonLink></div>
          {featuredProjects.length ? <div className="mt-10 grid gap-5 xl:grid-cols-12">{featuredProjects.map((project, index) => <div key={project.slug} className={index === 0 ? "xl:col-span-7" : "xl:col-span-5"}><ProjectSummaryCard project={project} locale={locale} cta={publicCopy[locale].projects.viewProject} index={String(index + 1).padStart(2, "0")} /></div>)}</div> : <PortfolioEmptyState collection="projects" locale={locale} className="mt-10" />}
        </Container>
      </section>

      <section id="journey" className="section-lift py-20 sm:py-24">
        <Container>
          <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
            <SectionHeading eyebrow={publicCopy[locale].journey.eyebrow} title={publicCopy[locale].journey.title} description={publicCopy[locale].journey.description} />
            <ButtonLink href={`/${locale}/journey`} variant="secondary" className="shrink-0 self-start md:self-auto">{locale === "fr" ? "Tout le parcours" : "Full journey"}<ArrowRight aria-hidden="true" className="size-4" /></ButtonLink>
          </div>
          {displayJourney.length ? <ol className="mt-10 relative mx-auto max-w-4xl before:absolute before:bottom-4 before:left-[1.35rem] before:top-4 before:w-px before:bg-border sm:before:left-[1.6rem]">
            {displayJourney.map((entry) => {
              const Icon = entry.type === "experience" ? BriefcaseBusiness : GraduationCap;
              return (
                <li key={entry.id} className="relative grid grid-cols-[2.75rem_1fr] gap-5 pb-10 last:pb-0 sm:grid-cols-[3.25rem_1fr] sm:gap-7">
                  <span className="relative z-10 grid size-11 place-items-center rounded-full border border-border-strong bg-bg-page text-accent sm:size-13">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <TechnicalFrame index={String(displayJourney.indexOf(entry) + 1).padStart(2, "0")} label={entry.type === "experience" ? publicCopy[locale].journey.experience : publicCopy[locale].journey.education} className="p-6 sm:p-7">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">{entry.type === "experience" ? publicCopy[locale].journey.experience : publicCopy[locale].journey.education}</p>
                        <h2 className="mt-2 text-xl font-semibold text-text-primary sm:text-2xl">{entry.title}</h2>
                      </div>
                      <p className="shrink-0 font-mono text-xs text-text-muted">{entry.eventDate}</p>
                    </div>
                    <p className="mt-5 text-sm leading-6 text-text-secondary">{entry.description}</p>
                  </TechnicalFrame>
                </li>
              );
            })}
          </ol> : <PortfolioEmptyState collection="journey" locale={locale} className="mt-10" />}
        </Container>
      </section>

      <section id="skills" className="section-lift border-y border-border bg-surface-subtle/55 py-20 sm:py-24">
        <Container>
          <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between"><SectionHeading eyebrow={copy.skillsEyebrow} title={copy.skillsTitle} description={copy.skillsDescription} /><ButtonLink href={`/${locale}/skills`} variant="secondary" className="shrink-0 self-start md:self-auto">{copy.allSkills}<ArrowRight aria-hidden="true" className="size-4" /></ButtonLink></div>
          {displaySkills.length ? <div className="mt-10 grid gap-5 lg:grid-cols-3">{displaySkills.map((group, index) => <TechnicalFrame key={group.id} index={`0${index + 1}`} label="Expertise map" className="p-6"><h3 className="text-xl font-semibold text-text-primary">{group.title}</h3>{group.description ? <p className="mt-3 text-sm leading-6 text-text-secondary">{group.description}</p> : null}<ul className="mt-5 flex flex-wrap gap-2">{group.skills.slice(0, 6).map((skill) => <li key={skill.name} className="border border-border bg-surface-raised px-2 py-1 font-mono text-[.68rem] uppercase tracking-[.06em] text-text-secondary">{skill.name}</li>)}</ul></TechnicalFrame>)}</div> : <PortfolioEmptyState collection="skills" locale={locale} className="mt-10" />}
        </Container>
      </section>

      <section id="certifications" className="section-lift py-20 sm:py-24">
        <Container>
          <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between mb-10">
            <SectionHeading eyebrow={copy.certificationsEyebrow} title={copy.certificationsTitle} description={""} />
            <ButtonLink href={`/${locale}/certifications`} variant="secondary" className="shrink-0 self-start md:self-auto">{copy.certificationsCta}<ArrowRight aria-hidden="true" className="size-4" /></ButtonLink>
          </div>
          {displayCertifications.length ? <div className="grid gap-5 md:grid-cols-3">
            {displayCertifications.map((certification) => (
              <TechnicalFrame key={certification.id} index="07" label="Certification" className="p-6">
                <p className="font-medium text-text-primary text-lg">{certification.name}</p>
                {certification.issuer ? <p className="mt-2 text-sm text-text-muted">{certification.issuer}</p> : null}
              </TechnicalFrame>
            ))}
          </div> : <PortfolioEmptyState collection="certifications" locale={locale} />}
        </Container>
      </section>

      <section id="testimonials" className="section-lift border-y border-border bg-surface-subtle/55 py-20 sm:py-24">
        <Container>
          <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between mb-10">
            <SectionHeading eyebrow={locale === "fr" ? "Recommandations" : "Recommendations"} title={locale === "fr" ? "Retours professionnels" : "Professional feedback"} description={""} />
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <TestimonialForm locale={locale as Locale} inline />
              <ButtonLink href={`/${locale}/testimonials`} variant="secondary" className="shrink-0 self-start md:self-auto">{locale === "fr" ? "Tous les avis" : "All feedback"}<ArrowRight aria-hidden="true" className="size-4" /></ButtonLink>
            </div>
          </div>
          {displayTestimonials.length ? <div className="grid gap-6 md:grid-cols-3">
            {displayTestimonials.map((t) => (
              <TechnicalFrame key={t.id} index="08" label="Avis" className="p-6 flex flex-col justify-between">
                <blockquote className="border-l-2 border-accent pl-5 text-sm leading-relaxed text-text-secondary mb-6">
                  “{t.message.length > 150 ? t.message.substring(0, 150) + '...' : t.message}”
                </blockquote>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{t.name}</p>
                  {(t.role || t.organization) && (
                    <p className="mt-1 text-xs text-text-muted">
                      {t.role}{t.role && t.organization ? ' — ' : ''}{t.organization}
                    </p>
                  )}
                </div>
              </TechnicalFrame>
            ))}
          </div> : <PortfolioEmptyState collection="testimonials" locale={locale} />}
        </Container>
      </section>

      <section id="contact" className="section-lift border-t border-border bg-surface-subtle/55 py-20 sm:py-24">
        <Container><TechnicalFrame index="09" label={copy.contactEyebrow} className="relative overflow-hidden px-6 py-12 sm:px-10 lg:px-14 lg:py-16"><div aria-hidden="true" className="absolute -right-16 -top-24 size-72 rounded-full bg-accent/10 blur-3xl" /><div className="relative max-w-3xl"><h2 className="mt-4 text-balance text-3xl font-semibold text-text-primary sm:text-4xl">{copy.contactTitle}</h2><p className="mt-5 max-w-2xl text-pretty leading-7 text-text-secondary">{copy.contactDescription}</p><ButtonLink href={`/${locale}/contact`} className="mt-7">{copy.contactCta}<ArrowRight aria-hidden="true" className="size-4" /></ButtonLink></div></TechnicalFrame></Container>
      </section>
    </>
  );
}
