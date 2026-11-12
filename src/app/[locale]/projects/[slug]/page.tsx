import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check, ExternalLink } from "lucide-react";
import Container from "@/components/ui/Container";
import JsonLd from "@/components/ui/JsonLd";
import ProjectGallery from "@/components/ui/ProjectGallery";
import SkillIcon from "@/components/ui/SkillIcon";
import { GithubIcon } from "@/components/ui/Icons";
import { publicCopy } from "@/content/copy";
import { getCategoryLabel, normalizeProjectCategories } from "@/lib/project-categories";
import { getPublishedProject, getPublishedProjects, getProjectGallery } from "@/features/projects/data";
import { isLocale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/seo";

type SingleProjectPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const [frProjects, enProjects] = await Promise.all([
    getPublishedProjects("fr"),
    getPublishedProjects("en"),
  ]);
  return [
    ...frProjects.map((project) => ({ locale: "fr", slug: project.slug })),
    ...enProjects.map((project) => ({ locale: "en", slug: project.slug })),
  ];
}

export async function generateMetadata({ params }: SingleProjectPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const project = await getPublishedProject(locale, slug);
  if (!project) return {};

  return createPageMetadata({
    locale,
    title: project.title,
    description: project.summary[locale],
    path: `/projects/${project.slug}`,
  });
}

export default async function SingleProjectPage({ params }: SingleProjectPageProps) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const project = await getPublishedProject(locale, slug);
  if (!project) notFound();

  const copy = publicCopy[locale].projects;
  const gallery = await getProjectGallery(project.slug);
  const normalizedCategories = normalizeProjectCategories(project.categories);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: project.title,
          description: project.summary[locale],
          applicationCategory: project.categories.join(", "),
          operatingSystem: "Web",
        }}
      />

      <article className="min-h-screen bg-bg-page text-text-primary pb-32">
        {/* Subtle Ambient Accent Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed right-[-10%] top-20 size-[600px] rounded-full bg-accent/5 blur-[180px] -z-10"
        />

        {/* Hero Editorial Header */}
        <header className="relative pt-24 sm:pt-32 pb-14 border-b border-border bg-gradient-to-b from-surface/70 via-bg-page to-bg-page">
          <Container className="max-w-6xl">
            {/* Back Link */}
            <div className="mb-8">
              <Link
                href={`/${locale}/projects`}
                className="inline-flex items-center gap-2 text-xs font-mono font-medium text-text-muted hover:text-accent transition-colors"
              >
                <ArrowLeft className="size-3.5" />
                <span>{locale === "fr" ? "Retour à tous les projets" : "Back to all projects"}</span>
              </Link>
            </div>

            {/* Categories & Verified Badge */}
            <div className="flex flex-wrap items-center gap-2.5 mb-5">
              {normalizedCategories.map((category) => (
                <span
                  key={category}
                  className="rounded-full border border-border-strong bg-text-primary/[0.04] px-3 py-1 text-xs font-semibold text-accent"
                >
                  {getCategoryLabel(category, locale)}
                </span>
              ))}

              <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-mono font-medium text-success">
                <span className="size-1.5 rounded-full bg-success" />
                <span>{locale === "fr" ? "Étude d'ingénierie vérifiée" : "Verified engineering case"}</span>
              </span>
            </div>

            {/* Monumental Title */}
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary leading-tight max-w-4xl">
              {project.title}
            </h1>

            {/* Subtitle */}
            <p className="mt-3 text-lg sm:text-xl font-medium text-accent/90 max-w-3xl leading-relaxed">
              {project.subtitle[locale]}
            </p>

            {/* Humanized Executive Overview */}
            <p className="mt-6 text-base sm:text-lg leading-relaxed text-text-secondary max-w-3xl font-normal">
              {project.summary[locale]}
            </p>

            {/* Action CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3 pt-6 border-t border-border">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-text-primary/[0.04] px-5 py-2.5 text-xs font-semibold text-text-primary hover:bg-text-primary/[0.08] hover:border-border-strong transition-all"
                >
                  <GithubIcon size={15} />
                  <span>{copy.sourceCode}</span>
                  <ArrowUpRight className="size-3 text-text-muted" />
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs font-bold text-text-on-accent hover:bg-accent-hover transition-all shadow-lg shadow-accent/20"
                >
                  <ExternalLink className="size-3.5" />
                  <span>{copy.liveDemo}</span>
                </a>
              )}
            </div>

            {/* Visual Media Showcase */}
            {gallery && gallery.length > 0 ? (
              <div className="mt-10">
                <ProjectGallery images={gallery} locale={locale} projectTitle={project.title} />
              </div>
            ) : project.coverImage ? (
              <div className="mt-10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="block max-h-[480px] w-auto max-w-full rounded-xl object-contain ring-1 ring-border-strong shadow-[0_18px_48px_rgba(0,0,0,0.28)] dark:shadow-[0_18px_48px_rgba(0,0,0,0.55)]"
                />
              </div>
            ) : null}
          </Container>
        </header>

        {/* Engineering Case Study Body */}
        <Container className="max-w-6xl mt-16">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16 items-start">
            
            {/* Main Narrative Column (8 Cols) */}
            <div className="lg:col-span-8 space-y-16">
              
              {/* Section 1: The Engineering Problem / Challenge */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-accent">
                    {locale === "fr" ? "01. Contexte & Problématique" : "01. Context & Challenge"}
                  </span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
                  {copy.problem}
                </h2>
                <div className="border-l-2 border-accent/50 pl-5 sm:pl-6 py-1">
                  <p className="text-base sm:text-lg leading-relaxed text-text-primary/90 font-normal">
                    {project.problem[locale]}
                  </p>
                </div>
              </section>

              {/* Section 2: Key Objectives */}
              {project.objectives && project.objectives.length > 0 && (
                <section className="space-y-6 pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-accent">
                      {locale === "fr" ? "02. Objectifs d'Ingénierie" : "02. Engineering Goals"}
                    </span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
                    {copy.objectives}
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {project.objectives.map((obj, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-accent/40"
                      >
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent/12 text-accent mt-0.5">
                          <Check className="size-3 stroke-[3]" />
                        </span>
                        <span className="text-sm text-text-primary/90 leading-snug">
                          {obj[locale]}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Section 3: Technical Architecture & System Solution */}
              <section className="space-y-6 pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-accent">
                    {locale === "fr" ? "03. Architecture & Implémentation" : "03. Architecture & System"}
                  </span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
                  {copy.architecture}
                </h2>

                {project.solution[locale] && (
                  <p className="text-base sm:text-lg leading-relaxed text-text-secondary">
                    {project.solution[locale]}
                  </p>
                )}

                {project.architecture && project.architecture.length > 0 && (
                  <div className="rounded-2xl border border-border-strong bg-surface-subtle p-5 sm:p-6 space-y-3 font-mono text-xs">
                    <div className="text-text-muted pb-2 border-b border-border text-[11px] uppercase tracking-wider">
                      {locale === "fr" ? "Composants architecturaux & pipeline" : "Architectural components & pipeline"}
                    </div>
                    {project.architecture.map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-text-primary/90 leading-relaxed">
                        <span className="text-accent select-none font-bold">›</span>
                        <span>{item[locale]}</span>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Section 4: Documented Results & Verification */}
              {project.results && project.results.length > 0 && (
                <section className="space-y-6 pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-accent">
                      {locale === "fr" ? "04. Métriques & Résultats" : "04. Metrics & Outcomes"}
                    </span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
                    {copy.documentedResults}
                  </h2>
                  <div className="space-y-3">
                    {project.results.map((res, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4"
                      >
                        <span className="size-2 rounded-full bg-success mt-2 shrink-0 shadow-[0_0_8px_color-mix(in_srgb,var(--success)_60%,transparent)]" />
                        <span className="text-sm text-text-primary/90 leading-relaxed font-medium">
                          {res[locale]}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right Technical Stack Sidebar (4 Cols) */}
            <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
              <div className="rounded-2xl border border-border-strong bg-surface p-6 shadow-xl space-y-6">
                <div>
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent mb-3 block">
                    {copy.technologies}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map((technology) => (
                      <span
                        key={technology}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border-strong bg-text-primary/[0.03] px-2.5 py-1 text-xs font-medium text-text-primary"
                      >
                        <SkillIcon name={technology} className="text-[13px]" />
                        <span>{technology}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* External Repository Links */}
                {(project.githubUrl || project.demoUrl) && (
                  <div className="space-y-2 pt-4 border-t border-border">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center justify-between rounded-xl border border-border-strong bg-text-primary/[0.04] px-4 py-2.5 text-xs font-semibold text-text-primary hover:bg-text-primary/[0.08] transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <GithubIcon size={14} className="text-accent" />
                          <span>{copy.sourceCode}</span>
                        </span>
                        <ArrowUpRight className="size-3.5 text-text-muted" />
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center justify-between rounded-xl bg-accent px-4 py-2.5 text-xs font-bold text-text-on-accent hover:bg-accent-hover transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <ExternalLink className="size-3.5" />
                          <span>{copy.liveDemo}</span>
                        </span>
                        <ArrowUpRight className="size-3.5" />
                      </a>
                    )}
                  </div>
                )}

                {/* Direct Discussion CTA */}
                <div className="pt-4 border-t border-border space-y-2">
                  <p className="text-xs font-semibold text-text-primary">
                    {locale === "fr" ? "Question sur cette architecture ?" : "Questions on this system?"}
                  </p>
                  <p className="text-[11px] text-text-muted leading-relaxed">
                    {locale === "fr"
                      ? "Échangeons sur les choix de conception, de sécurité ou d'IA."
                      : "Let's discuss design tradeoffs, security constraints, or model inference."}
                  </p>
                  <Link
                    href={`/${locale}/contact`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline pt-1"
                  >
                    <span>{locale === "fr" ? "Ouvrir une discussion →" : "Start a discussion →"}</span>
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </article>
    </>
  );
}
