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
import TextReveal from "@/components/ui/TextReveal";
import { TechCore } from "@/components/ui/TechCore";
import { getSiteUrl, siteConfig } from "@/config/site";
import { publicCopy } from "@/content/copy";
import { getHomeCopy } from "@/content/dynamic-copy";
import { getPublicCertifications, getPublicTestimonials, getPublicJourney, getPublicContactLinks } from "@/features/portfolio/data";
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
  const [projects, certifications, testimonials, journey, contactLinks] = await Promise.all([
    getPublishedProjects(locale),
    getPublicCertifications(locale),
    getPublicTestimonials(locale),
    getPublicJourney(locale),
    getPublicContactLinks(),
  ]);
  let featuredProjects = projects.filter((project) => project.featured);
  if (featuredProjects.length === 0) featuredProjects = projects;

  const allTechnologies = Array.from(new Set(projects.flatMap((p) => p.coreTechnologies || p.technologies || []))).filter(Boolean);

  let displayCertifications = certifications.filter((c) => c.featured);
  if (displayCertifications.length === 0) displayCertifications = certifications;
  displayCertifications = displayCertifications.slice(0, 3);

  let displayTestimonials = testimonials.filter((t) => t.featured);
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
        <section id="home" className="relative z-10 py-16 sm:py-24 lg:py-32">
          {/* Spotlight Blur Effect */}
          <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[40rem] w-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-accent/10 blur-[120px]" />
          
          <Container className="relative z-10">
            <ScrollReveal>
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
            {/* Left Column - Text Content */}
            <div className="flex flex-col justify-center lg:col-span-7">
              <div className="flex items-center gap-4 text-sm font-semibold tracking-[0.15em] text-accent uppercase">
                <span className="h-px w-8 bg-accent" />
                L&apos;ingénieur
              </div>
              
              <TextReveal 
                as="h1"
                text={siteConfig.name}
                className="mt-6 text-5xl font-black uppercase tracking-tight text-text-primary sm:text-7xl lg:text-[5.5rem] lg:leading-[1.1]"
                delay={0.1}
              />
              
              <TextReveal
                as="h2"
                text={copy.eyebrow}
                className="mt-6 font-mono text-sm font-semibold uppercase tracking-widest text-accent sm:text-base"
                delay={0.3}
              />
              
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
                <ButtonLink href={contactLinks.resume} target="_blank" rel="noreferrer" variant="secondary" data-analytics-event="cv_open">
                  <FileText aria-hidden="true" className="size-4" />
                  {copy.resumeCta}
                </ButtonLink>
              </div>
            </div>

            {/* Right Column - Photo */}
            <div className="relative flex justify-center lg:col-span-5 lg:justify-end">
              <HeroImageParallax name={siteConfig.name} />
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
              <dl className="grid gap-6 sm:grid-cols-3 lg:grid-cols-1">
                {copy.proofItems.map(([term, description], index) => <div key={term} className="group relative overflow-hidden p-5 bg-surface-subtle/50 backdrop-blur-sm border border-border/50 rounded-xl transition-all hover:bg-surface-subtle/80 hover:border-accent/30"><span aria-hidden="true" className="absolute right-4 top-4 font-mono text-[.62rem] text-text-muted/70">{String(index + 1).padStart(2, "0")}</span><dt className="font-mono text-[.68rem] font-semibold uppercase tracking-[.12em] text-accent">{term}</dt><dd className="mt-2 text-sm font-medium leading-6 text-text-primary">{description}</dd></div>)}
              </dl>
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
      <GitHubPreviewSection locale={locale as Locale} />

      <section id="projects" className="relative z-10 py-16 sm:py-24">
        <Container>
          <ScrollReveal yOffset={40}>
            <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between"><SectionHeading eyebrow={copy.projectsEyebrow} title={copy.projectsTitle} description={overviewDescription} /><ButtonLink href={`/${locale}/projects`} variant="secondary" className="shrink-0 self-start md:self-auto">{copy.allProjects}<ArrowRight aria-hidden="true" className="size-4" /></ButtonLink></div>
            {featuredProjects.length ? <div className="mt-10 grid gap-5 xl:grid-cols-12">{featuredProjects.map((project, index) => <div key={project.slug} className={index === 0 ? "xl:col-span-7" : "xl:col-span-5"}><ProjectSummaryCard project={project} locale={locale} cta={publicCopy[locale].projects.viewProject} /></div>)}</div> : <PortfolioEmptyState collection="projects" locale={locale} className="mt-10" />}
          </ScrollReveal>
        </Container>
      </section>

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

      <section id="testimonials" className="relative z-10 py-16 sm:py-24 overflow-hidden">
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

      <section id="contact" className="relative z-10 py-16 sm:py-24">
        <Container>
          <ScrollReveal yOffset={40}>
            <TechnicalFrame index="09" label={copy.contactEyebrow} className="relative overflow-hidden px-6 py-12 sm:px-10 lg:px-14 lg:py-16"><div aria-hidden="true" className="absolute -right-16 -top-24 size-72 rounded-full bg-accent/10 blur-3xl" /><div className="relative max-w-3xl"><h2 className="mt-4 text-balance text-3xl font-semibold text-text-primary sm:text-4xl">{copy.contactTitle}</h2><p className="mt-5 max-w-2xl text-pretty leading-7 text-text-secondary">{copy.contactDescription}</p><ButtonLink href={`/${locale}/contact`} className="mt-7">{copy.contactCta}<ArrowRight aria-hidden="true" className="size-4" /></ButtonLink></div></TechnicalFrame>
          </ScrollReveal>
        </Container>
      </section>
      </div>
    </>
  );
}
