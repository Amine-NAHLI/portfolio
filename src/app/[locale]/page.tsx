import type { Metadata } from "next";
import { ArrowRight, FileText } from "lucide-react";
import ProjectSummaryCard from "@/components/projects/ProjectSummaryCard";
import ButtonLink from "@/components/ui/ButtonLink";
import Container from "@/components/ui/Container";
import JsonLd from "@/components/ui/JsonLd";
import PortfolioEmptyState from "@/components/ui/PortfolioEmptyState";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHeading from "@/components/ui/SectionHeading";
import Roadmap from "@/components/ui/Roadmap";
import TechnicalFrame from "@/components/ui/TechnicalFrame";
import HackerText from "@/components/ui/HackerText";
import SystemStatus from "@/components/ui/SystemStatus";
import SystemBadges from "@/components/ui/SystemBadges";
import TechCard from "@/components/ui/TechCard";
import { TechCore } from "@/components/ui/TechCore";
import { getSiteUrl, siteConfig } from "@/config/site";
import { publicCopy } from "@/content/copy";
import { getHomeCopy } from "@/content/dynamic-copy";
import { getPublicCertifications, getPublicTestimonials, getPublicJourney, getPublicContactLinks, getSectionsVisibility, getHeroTechnologies } from "@/features/portfolio/data";
import { getPublishedProjects } from "@/features/projects/data";
import { isLocale, Locale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import TestimonialForm from "@/components/testimonials/TestimonialForm";
import GitHubPreviewSection from "@/components/github/GitHubPreviewSection";
import CertificationCard from "@/components/ui/CertificationCard";
import TestimonialMarquee from "@/components/ui/TestimonialMarquee";
import HeroImageParallax from "@/components/ui/HeroImageParallax";

type HomePageProps = { params: Promise<{ locale: string }> };

export const revalidate = 3600;

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = await getHomeCopy(locale);
  return createPageMetadata({ locale, title: copy.eyebrow, description: copy.introduction });
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? localeParam : "fr";
  if (!isLocale(locale)) notFound();

  const copy = await getHomeCopy(locale);
  const [projects, certifications, testimonials, journey, contactLinks, sectionsVisibility, heroTech] = await Promise.all([
    getPublishedProjects(locale),
    getPublicCertifications(locale),
    getPublicTestimonials(locale),
    getPublicJourney(locale),
    getPublicContactLinks(),
    getSectionsVisibility(),
    getHeroTechnologies(),
  ]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let featuredProjects = projects.filter((project: any) => project.featured);
  if (featuredProjects.length === 0) featuredProjects = projects;
  featuredProjects = featuredProjects.slice(0, 3);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allTechnologies = heroTech || Array.from(new Set(projects.flatMap((p: any) => p.coreTechnologies || p.technologies || []))).filter(Boolean);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let displayCertifications = certifications.filter((c: any) => c.featured);
  if (displayCertifications.length === 0) displayCertifications = certifications;
  displayCertifications = displayCertifications.slice(0, 3);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let displayTestimonials = testimonials.filter((t: any) => t.featured);
  if (displayTestimonials.length === 0) displayTestimonials = testimonials;
  const displayJourney = journey;

  const overviewDescription = locale === "fr" 
    ? "Voici un aperçu de mon profil. Cliquez sur le bouton pour tout explorer." 
    : "Here is an overview of my profile. Click the button to explore everything.";

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
            sameAs: [contactLinks.github, contactLinks.linkedin, contactLinks.tryHackMe],
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

      <div className="relative w-full">
        <section id="home" className="relative z-10 pt-24 pb-12 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-24">
          {/* Spotlight Blur Effect */}
          <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[45rem] w-[65rem] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-accent/10 blur-[140px]" />
          
          <Container className="relative z-10">
            <ScrollReveal>
              <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
                {/* Left Column - Hero Content */}
                <div className="flex flex-col justify-center lg:col-span-7">
                  <div className="mb-4">
                    <SystemStatus locale={locale} />
                  </div>
                  
                  <HackerText 
                    text={siteConfig.name}
                    className="mt-1 text-4xl font-black tracking-tight text-text-primary sm:text-6xl lg:text-[4.75rem] lg:leading-[1.05]"
                    as="h1"
                  />
                  
                  <p className="mt-3 text-base sm:text-lg font-semibold tracking-tight text-accent">
                    {locale === "fr" ? "Élève Ingénieur en Génie Informatique & Développeur Full-Stack / Cybersécurité" : "Computer Engineering Student & Full-Stack / Security Developer"}
                  </p>

                  <SystemBadges locale={locale} />
                  
                  <p className="mt-5 max-w-xl text-pretty text-base sm:text-lg leading-relaxed text-text-secondary">
                    {copy.introduction}
                  </p>
                  
                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <ButtonLink href={`/${locale}/contact`} className="relative overflow-hidden group shadow-lg shadow-accent/20">
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                      <span className="relative flex items-center gap-2">{copy.contactCta} <ArrowRight aria-hidden="true" className="size-4" /></span>
                    </ButtonLink>

                    <ButtonLink href={contactLinks.resume} target="_blank" rel="noreferrer" variant="secondary" data-analytics-event="cv_open">
                      <FileText aria-hidden="true" className="size-4" />
                      {copy.resumeCta}
                    </ButtonLink>

                    {contactLinks.github && (
                      <a href={contactLinks.github} target="_blank" rel="noreferrer" className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-surface/60 text-text-secondary hover:text-white hover:border-accent/40 hover:bg-surface transition-all" aria-label="GitHub">
                        <svg className="size-5 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                      </a>
                    )}

                    {contactLinks.linkedin && (
                      <a href={contactLinks.linkedin} target="_blank" rel="noreferrer" className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-surface/60 text-text-secondary hover:text-white hover:border-accent/40 hover:bg-surface transition-all" aria-label="LinkedIn">
                        <svg className="size-5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                      </a>
                    )}
                  </div>
                </div>

                {/* Right Column - Bento Portrait Card */}
                <div className="relative flex justify-center lg:col-span-5 lg:justify-end perspective-[1000px]">
                  <HeroImageParallax name={siteConfig.name} />
                </div>
              </div>

              {/* Executive Bento Quick Highlights Strip */}
              <div className="mt-16 grid gap-4 sm:grid-cols-3">
                <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-surface/40 p-5 backdrop-blur-md transition-colors hover:border-accent/40 hover:bg-surface/60">
                  <div className="font-mono text-xs font-semibold uppercase tracking-wider text-accent mb-1">
                    {locale === "fr" ? "Discipline 01" : "Discipline 01"}
                  </div>
                  <div className="font-display text-lg font-bold text-text-primary group-hover:text-white transition-colors">
                    {locale === "fr" ? "Cybersécurité & Audit" : "Cybersecurity & Audit"}
                  </div>
                  <div className="mt-1 text-xs text-text-secondary">
                    {locale === "fr" ? "Pentesting, IAM, Sécurité Réseau & IntelTrust" : "Pentesting, IAM, Network Security & IntelTrust"}
                  </div>
                </div>

                <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-surface/40 p-5 backdrop-blur-md transition-colors hover:border-accent/40 hover:bg-surface/60">
                  <div className="font-mono text-xs font-semibold uppercase tracking-wider text-accent mb-1">
                    {locale === "fr" ? "Discipline 02" : "Discipline 02"}
                  </div>
                  <div className="font-display text-lg font-bold text-text-primary group-hover:text-white transition-colors">
                    {locale === "fr" ? "Développement Full-Stack" : "Full-Stack Software Dev"}
                  </div>
                  <div className="mt-1 text-xs text-text-secondary">
                    {locale === "fr" ? "Architectures Web Modernes, Next.js, APIs" : "Modern Web Architectures, Next.js, APIs"}
                  </div>
                </div>

                <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-surface/40 p-5 backdrop-blur-md transition-colors hover:border-accent/40 hover:bg-surface/60">
                  <div className="font-mono text-xs font-semibold uppercase tracking-wider text-accent mb-1">
                    {locale === "fr" ? "Discipline 03" : "Discipline 03"}
                  </div>
                  <div className="font-display text-lg font-bold text-text-primary group-hover:text-white transition-colors">
                    {locale === "fr" ? "Intelligence Artificielle" : "Artificial Intelligence"}
                  </div>
                  <div className="mt-1 text-xs text-text-secondary">
                    {locale === "fr" ? "Deep Learning, NLP & Systèmes Intelligents" : "Deep Learning, NLP & Intelligent Systems"}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </Container>
        </section>

      <section className="relative z-10 py-16 sm:py-24">
        <Container>
          <ScrollReveal yOffset={40}>
            <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
              <SectionHeading eyebrow={copy.proofEyebrow} title={copy.proofTitle} description={copy.proofDescription} />
              <div className="relative">
                {/* Vertical Glowing Line */}
                <div className="absolute left-4 sm:left-6 top-6 bottom-6 w-px bg-gradient-to-b from-accent/50 via-accent/20 to-transparent hidden lg:block" />
                
                <dl className="grid gap-6 sm:grid-cols-3 lg:grid-cols-1">
                  {copy.proofItems.map(([term, description], index) => {
                    const isLanguages = index === 2;
                    const languageItems = isLanguages ? description.split(" · ") : [];

                    return (
                      <ScrollReveal key={term} delay={0.1 * index} yOffset={20}>
                        <div className="relative flex items-center">
                          {/* Node on the vertical line */}
                          <div className="absolute -left-[1.35rem] size-2 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)] hidden lg:block" />
                          
                          <TechCard className="w-full h-full">
                            <span aria-hidden="true" className="absolute right-4 top-4 font-mono text-[.62rem] text-text-muted/70 group-hover:text-accent transition-colors">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <dt className="font-mono text-xs font-semibold uppercase tracking-[.12em] text-accent mb-3 flex items-center gap-2">
                              {term}
                              {index === 1 && (
                                <span className="inline-flex items-center rounded-sm bg-accent/10 px-1.5 py-0.5 text-[0.55rem] text-accent border border-accent/20">
                                  <span className="mr-1.5 size-1.5 rounded-full bg-accent animate-pulse" />
                                  {locale === "fr" ? "EN COURS" : "CURRENT"}
                                </span>
                              )}
                            </dt>
                            <dd className="mt-2 text-sm font-medium leading-relaxed text-text-primary group-hover:text-white transition-colors">
                              {isLanguages ? (
                                <div className="flex flex-wrap gap-2 mt-3">
                                  {languageItems.map((lang, i) => {
                                    // Split language and level for better styling
                                    const parts = locale === "fr" ? lang.split(" (") : lang.split(" · ");
                                    const name = parts[0];
                                    const level = parts.length > 1 ? (locale === "fr" ? `(${parts[1]}` : parts[1]) : "";
                                    
                                    return (
                                      <span key={i} className="inline-flex items-center gap-1.5 rounded border border-border/50 bg-surface-subtle/50 px-2 py-1 text-xs">
                                        <span className="text-accent font-mono opacity-60">[{String(i + 1).padStart(2, "0")}]</span>
                                        <span className="font-semibold">{name}</span>
                                        {level && <span className="opacity-60 text-[0.65rem] uppercase tracking-wider">{level}</span>}
                                      </span>
                                    );
                                  })}
                                </div>
                              ) : (
                                description
                              )}
                            </dd>
                          </TechCard>
                        </div>
                      </ScrollReveal>
                    );
                  })}
                </dl>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {allTechnologies.length > 0 && (
        <section id="expertise" className="relative z-10 py-16 sm:py-24 overflow-hidden">
          <Container>
            <ScrollReveal yOffset={40}>
              <div className="flex flex-col items-center justify-center text-center mb-12">
                <p className="eyebrow">{locale === "fr" ? "Mon Expertise" : "My Expertise"}</p>
                <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
                  {locale === "fr" ? "La Singularité Technique" : "The Technical Singularity"}
                </h2>
                <p className="mt-3 max-w-xl text-text-secondary">
                  {locale === "fr" ? "Toutes les technologies que je maîtrise, unifiées en un seul écosystème dynamique." : "All the technologies I master, unified into a single dynamic ecosystem."}
                </p>
              </div>
              <TechCore technologies={allTechnologies} className="mt-8" />
            </ScrollReveal>
          </Container>
        </section>
      )}

      {/* GitHub Preview */}
      {sectionsVisibility.github && <GitHubPreviewSection locale={locale as Locale} />}

      {sectionsVisibility.projects && (
        <section id="projects" className="relative z-10 py-16 sm:py-24">
        <Container>
          <ScrollReveal yOffset={40}>
            <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between"><SectionHeading eyebrow={copy.projectsEyebrow} title={copy.projectsTitle} description={overviewDescription} /><ButtonLink href={`/${locale}/projects`} variant="secondary" className="shrink-0 self-start md:self-auto">{copy.allProjects}<ArrowRight aria-hidden="true" className="size-4" /></ButtonLink></div>
            {featuredProjects.length ? (
              <div className="mt-10 grid gap-5 md:grid-cols-3 xl:grid-cols-12">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {featuredProjects.map((project: any) => (
                  <div key={project.slug} className="md:col-span-1 xl:col-span-4">
                    <ProjectSummaryCard project={project} locale={locale} cta={publicCopy[locale].projects.viewProject} />
                  </div>
                ))}
              </div>
            ) : <PortfolioEmptyState collection="projects" locale={locale} className="mt-10" />}
          </ScrollReveal>
        </Container>
      </section>
      )}

      {sectionsVisibility.journey && (
      <section id="journey" className="relative z-10 py-16 sm:py-24">
        <Container>
          <ScrollReveal yOffset={40}>
            <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
              <SectionHeading eyebrow={publicCopy[locale].journey.eyebrow} title={publicCopy[locale].journey.title} description={overviewDescription} />
              <ButtonLink href={`/${locale}/journey`} variant="secondary" className="shrink-0 self-start md:self-auto">{locale === "fr" ? "Tout le parcours" : "Full journey"}<ArrowRight aria-hidden="true" className="size-4" /></ButtonLink>
            </div>
            {displayJourney.length ? <Roadmap entries={displayJourney} labels={{ experience: publicCopy[locale].journey.experience, education: publicCopy[locale].journey.education }} variant="minimal" /> : <PortfolioEmptyState collection="journey" locale={locale} className="mt-10" />}
          </ScrollReveal>
        </Container>
      </section>
      )}


      {sectionsVisibility.certifications && (
      <section id="certifications" className="relative z-10 py-16 sm:py-24">
        <Container>
          <ScrollReveal yOffset={40}>
            <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between mb-10">
              <SectionHeading eyebrow={copy.certificationsEyebrow} title={copy.certificationsTitle} description={overviewDescription} />
              <ButtonLink href={`/${locale}/certifications`} variant="secondary" className="shrink-0 self-start md:self-auto">{copy.certificationsCta}<ArrowRight aria-hidden="true" className="size-4" /></ButtonLink>
            </div>
            {displayCertifications.length ? (
              <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 no-scrollbar">
                {displayCertifications.map((certification) => (
                  <div key={certification.id} className="w-[85vw] sm:w-[50vw] md:w-[40vw] lg:w-[30vw] shrink-0 snap-start">
                    <CertificationCard 
                      certification={{
                        id: certification.id,
                        name: certification.name,
                        issuer: certification.issuer,
                        issuedOn: certification.issuedOn,
                        verificationUrl: certification.verificationUrl,
                        hasDocument: certification.hasDocument,
                        documentMimeType: certification.documentMimeType,
                        description: certification.description
                      }} 
                      locale={locale} 
                      copy={publicCopy[locale].certifications} 
                    />
                  </div>
                ))}
              </div>
            ) : <PortfolioEmptyState collection="certifications" locale={locale} />}
          </ScrollReveal>
        </Container>
      </section>
      )}

      {sectionsVisibility.testimonials && (
      <section id="reviews" className="relative z-10 overflow-hidden py-24 sm:py-32">
        <Container>
          <ScrollReveal yOffset={40}>
            <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between mb-10">
              <SectionHeading eyebrow={locale === "fr" ? "Recommandations" : "Recommendations"} title={locale === "fr" ? "Retours professionnels" : "Professional feedback"} description={overviewDescription} />
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <TestimonialForm locale={locale as Locale} inline />
                <ButtonLink href={`/${locale}/testimonials`} variant="secondary" className="shrink-0 self-start md:self-auto">{locale === "fr" ? "Tous les avis" : "All feedback"}<ArrowRight aria-hidden="true" className="size-4" /></ButtonLink>
              </div>
            </div>
          </ScrollReveal>
        </Container>
        
        <ScrollReveal yOffset={40}>
          {displayTestimonials.length ? (
            <TestimonialMarquee testimonials={displayTestimonials} />
          ) : (
            <Container>
              <PortfolioEmptyState collection="testimonials" locale={locale} />
            </Container>
          )}
        </ScrollReveal>
      </section>
      )}

      {sectionsVisibility.contact && (
      <section id="contact" className="relative z-10 py-16 sm:py-24">
        <Container>
          <ScrollReveal yOffset={40}>
            <TechnicalFrame index="09" label={copy.contactEyebrow} className="relative overflow-hidden px-6 py-12 sm:px-10 lg:px-14 lg:py-16"><div aria-hidden="true" className="absolute -right-16 -top-24 size-72 rounded-full bg-accent/10 blur-3xl" /><div className="relative max-w-3xl"><h2 className="mt-4 text-balance text-3xl font-semibold text-text-primary sm:text-4xl">{copy.contactTitle}</h2><p className="mt-5 max-w-2xl text-pretty leading-7 text-text-secondary">{copy.contactDescription}</p><ButtonLink href={`/${locale}/contact`} className="mt-7">{copy.contactCta}<ArrowRight aria-hidden="true" className="size-4" /></ButtonLink></div></TechnicalFrame>
          </ScrollReveal>
        </Container>
      </section>
      )}
      </div>
    </>
  );
}
