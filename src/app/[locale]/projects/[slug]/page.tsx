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

      <article className="min-h-screen bg-[#000000] text-[#FFFFFF] pb-32">
        {/* Subtle Ambient Accent Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed right-[-10%] top-20 size-[600px] rounded-full bg-[#C8F122]/5 blur-[180px] -z-10"
        />

        {/* Hero Editorial Header */}
        <header className="relative pt-24 sm:pt-32 pb-14 border-b border-white/[0.08] bg-gradient-to-b from-[#121316]/60 via-[#0B0B0C] to-[#000000]">
          <Container className="max-w-6xl">
            {/* Back Link */}
            <div className="mb-8">
              <Link
                href={`/${locale}/projects`}
                className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[#A1A1AA] hover:text-[#C8F122] transition-colors"
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
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold text-[#C8F122]"
                >
                  {getCategoryLabel(category, locale)}
                </span>
              ))}

              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono font-medium text-emerald-400">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                <span>{locale === "fr" ? "Étude d'ingénierie vérifiée" : "Verified engineering case"}</span>
              </span>
            </div>

            {/* Monumental Title */}
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FFFFFF] leading-tight max-w-4xl">
              {project.title}
            </h1>

            {/* Subtitle */}
            <p className="mt-3 text-lg sm:text-xl font-medium text-[#C8F122]/90 max-w-3xl leading-relaxed">
              {project.subtitle[locale]}
            </p>

            {/* Humanized Executive Overview */}
            <p className="mt-6 text-base sm:text-lg leading-relaxed text-[#A1A1AA] max-w-3xl font-normal">
              {project.summary[locale]}
            </p>

            {/* Action CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3 pt-6 border-t border-white/[0.08]">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-xs font-semibold text-[#FFFFFF] hover:bg-white/[0.08] hover:border-white/20 transition-all"
                >
                  <GithubIcon size={15} />
                  <span>{copy.sourceCode}</span>
                  <ArrowUpRight className="size-3 text-[#A1A1AA]" />
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#C8F122] px-5 py-2.5 text-xs font-bold text-[#000000] hover:bg-[#D9FB52] transition-all shadow-lg shadow-[#C8F122]/20"
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
                  className="block max-h-[480px] w-auto max-w-full rounded-xl object-contain ring-1 ring-white/10 shadow-[0_18px_48px_rgba(0,0,0,0.55)]"
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
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#C8F122]">
                    {locale === "fr" ? "01. Contexte & Problématique" : "01. Context & Challenge"}
                  </span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#FFFFFF]">
                  {copy.problem}
                </h2>
                <div className="border-l-2 border-[#C8F122]/50 pl-5 sm:pl-6 py-1">
                  <p className="text-base sm:text-lg leading-relaxed text-[#FFFFFF]/90 font-normal">
                    {project.problem[locale]}
                  </p>
                </div>
              </section>

              {/* Section 2: Key Objectives */}
              {project.objectives && project.objectives.length > 0 && (
                <section className="space-y-6 pt-4 border-t border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#C8F122]">
                      {locale === "fr" ? "02. Objectifs d'Ingénierie" : "02. Engineering Goals"}
                    </span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#FFFFFF]">
                    {copy.objectives}
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {project.objectives.map((obj, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 rounded-xl border border-white/[0.08] bg-[#121316] p-4 transition-colors hover:border-[#C8F122]/30"
                      >
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#C8F122]/10 text-[#C8F122] mt-0.5">
                          <Check className="size-3 stroke-[3]" />
                        </span>
                        <span className="text-sm text-[#FFFFFF]/90 leading-snug">
                          {obj[locale]}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Section 3: Technical Architecture & System Solution */}
              <section className="space-y-6 pt-4 border-t border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#C8F122]">
                    {locale === "fr" ? "03. Architecture & Implémentation" : "03. Architecture & System"}
                  </span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#FFFFFF]">
                  {copy.architecture}
                </h2>

                {project.solution[locale] && (
                  <p className="text-base sm:text-lg leading-relaxed text-[#A1A1AA]">
                    {project.solution[locale]}
                  </p>
                )}

                {project.architecture && project.architecture.length > 0 && (
                  <div className="rounded-2xl border border-white/10 bg-[#0B0B0C] p-5 sm:p-6 space-y-3 font-mono text-xs">
                    <div className="text-[#A1A1AA] pb-2 border-b border-white/[0.06] text-[11px] uppercase tracking-wider">
                      {locale === "fr" ? "Composants architecturaux & pipeline" : "Architectural components & pipeline"}
                    </div>
                    {project.architecture.map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-[#FFFFFF]/90 leading-relaxed">
                        <span className="text-[#C8F122] select-none font-bold">›</span>
                        <span>{item[locale]}</span>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Section 4: Documented Results & Verification */}
              {project.results && project.results.length > 0 && (
                <section className="space-y-6 pt-4 border-t border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#C8F122]">
                      {locale === "fr" ? "04. Métriques & Résultats" : "04. Metrics & Outcomes"}
                    </span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#FFFFFF]">
                    {copy.documentedResults}
                  </h2>
                  <div className="space-y-3">
                    {project.results.map((res, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 rounded-xl border border-white/[0.08] bg-[#121316] p-4"
                      >
                        <span className="size-2 rounded-full bg-emerald-400 mt-2 shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                        <span className="text-sm text-[#FFFFFF]/90 leading-relaxed font-medium">
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
              <div className="rounded-2xl border border-white/10 bg-[#121316] p-6 shadow-xl space-y-6">
                <div>
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#C8F122] mb-3 block">
                    {copy.technologies}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map((technology) => (
                      <span
                        key={technology}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1 text-xs font-medium text-[#FFFFFF]"
                      >
                        <SkillIcon name={technology} className="text-[13px]" />
                        <span>{technology}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* External Repository Links */}
                {(project.githubUrl || project.demoUrl) && (
                  <div className="space-y-2 pt-4 border-t border-white/[0.08]">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs font-semibold text-[#FFFFFF] hover:bg-white/[0.08] transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <GithubIcon size={14} className="text-[#C8F122]" />
                          <span>{copy.sourceCode}</span>
                        </span>
                        <ArrowUpRight className="size-3.5 text-[#A1A1AA]" />
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center justify-between rounded-xl bg-[#C8F122] px-4 py-2.5 text-xs font-bold text-[#000000] hover:bg-[#D9FB52] transition-colors"
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
                <div className="pt-4 border-t border-white/[0.08] space-y-2">
                  <p className="text-xs font-semibold text-[#FFFFFF]">
                    {locale === "fr" ? "Question sur cette architecture ?" : "Questions on this system?"}
                  </p>
                  <p className="text-[11px] text-[#A1A1AA] leading-relaxed">
                    {locale === "fr"
                      ? "Échangeons sur les choix de conception, de sécurité ou d'IA."
                      : "Let's discuss design tradeoffs, security constraints, or model inference."}
                  </p>
                  <Link
                    href={`/${locale}/contact`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C8F122] hover:underline pt-1"
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
