import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CheckCircle2 } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Container from "@/components/ui/Container";
import JsonLd from "@/components/ui/JsonLd";
import TechnicalFrame from "@/components/ui/TechnicalFrame";
import { projectCategoryLabels, publicCopy } from "@/content/copy";
import { getPublishedProject, getProjectGallery } from "@/features/projects/data";
import { isLocale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/config/site";
import { notFound } from "next/navigation";
import SkillIcon from "@/components/ui/SkillIcon";
import ProjectGallery from "@/components/ui/ProjectGallery";

type ProjectPageProps = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const project = await getPublishedProject(locale, slug);
  if (!project) return {};
  return createPageMetadata({ locale, title: project.title, description: project.summary[locale], path: `/projects/${slug}` });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const project = await getPublishedProject(locale, slug);
  if (!project) notFound();
  const gallery = await getProjectGallery(slug);
  const copy = publicCopy[locale].projects;

  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "SoftwareSourceCode",
        name: project.title,
        description: project.summary[locale],
        programmingLanguage: project.technologies,
        url: new URL(`/${locale}/projects/${project.slug}`, getSiteUrl()).toString(),
        codeRepository: project.githubUrl,
        sameAs: [project.githubUrl, project.demoUrl].filter(Boolean),
        author: { "@type": "Person", name: "Amine Nahli" },
      }} />
      <article>
        <header className="relative overflow-hidden border-b border-border py-14 sm:py-20 lg:py-28">
          <Container>
            <Link href={`/${locale}/projects`} className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-semibold text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
              <ArrowLeft aria-hidden="true" className="size-4" />{copy.back}
            </Link>
            <div className="mt-8 flex flex-wrap gap-2">
              {project.categories.map((category) => {
                const label = projectCategoryLabels[category]?.[locale] || category;
                return <Badge key={category}>{label}</Badge>;
              })}
            </div>
            <h1 className="mt-6 text-balance font-display text-5xl font-semibold tracking-tight text-text-primary sm:text-6xl lg:text-7xl">{project.title}</h1>
            <p className="mt-4 text-xl font-medium text-accent sm:text-2xl">{project.subtitle[locale]}</p>
            
            {gallery && gallery.length > 0 && (
              <div className="mt-12 rounded-xl border border-border/50 bg-surface/30 p-2 shadow-2xl backdrop-blur-sm sm:p-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="overflow-hidden rounded-lg">
                  <ProjectGallery images={gallery} locale={locale} />
                </div>
              </div>
            )}

            <p className="mt-12 max-w-3xl text-pretty text-lg leading-8 text-text-secondary">{project.summary[locale]}</p>
          </Container>
        </header>

        <Container className="grid gap-14 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-20">
          <div className="space-y-14">
            {project.problem[locale] !== project.summary[locale] ? (
              <>
                <section aria-labelledby="problem-heading">
                  <p className="eyebrow">01</p>
                  <h2 id="problem-heading" className="mt-3 text-3xl font-semibold text-text-primary">{copy.problem}</h2>
                  <p className="mt-5 text-base leading-8 text-text-secondary">{project.problem[locale]}</p>
                </section>
                <section aria-labelledby="objectives-heading">
                  <p className="eyebrow">02</p>
                  <h2 id="objectives-heading" className="mt-3 text-3xl font-semibold text-text-primary">{copy.objectives}</h2>
                  <ul className="mt-6 grid gap-3">
                    {project.objectives.map((objective) => (
                      <li key={objective[locale]} className="flex gap-3 text-base leading-7 text-text-secondary">
                        <CheckCircle2 aria-hidden="true" className="mt-1 size-4 shrink-0 text-accent" />{objective[locale]}
                      </li>
                    ))}
                  </ul>
                </section>
                <section aria-labelledby="solution-heading">
                  <p className="eyebrow">03</p>
                  <h2 id="solution-heading" className="mt-3 text-3xl font-semibold text-text-primary">{copy.solution}</h2>
                  <p className="mt-5 text-base leading-8 text-text-secondary">{project.solution[locale]}</p>
                </section>
                <section aria-labelledby="architecture-heading">
                  <p className="eyebrow">04</p>
                  <h2 id="architecture-heading" className="mt-3 text-3xl font-semibold text-text-primary">{copy.architecture}</h2>
                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                    {project.architecture.map((item) => (
                      <li key={item[locale]} className="flex gap-3 border border-border bg-surface p-4 text-sm leading-6 text-text-secondary">
                        <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" />{item[locale]}
                      </li>
                    ))}
                  </ul>
                </section>
                <section aria-labelledby="results-heading">
                  <p className="eyebrow">05</p>
                  <h2 id="results-heading" className="mt-3 text-3xl font-semibold text-text-primary">{copy.documentedResults}</h2>
                  <ul className="mt-6 space-y-3">
                    {project.results.map((result) => (
                      <li key={result[locale]} className="flex gap-3 text-base leading-7 text-text-secondary">
                        <span aria-hidden="true" className="mt-3 size-1.5 shrink-0 rounded-full bg-accent" />{result[locale]}
                      </li>
                    ))}
                  </ul>
                </section>
              </>
            ) : (
              <section aria-labelledby="description-heading">
                <h2 id="description-heading" className="text-3xl font-semibold text-text-primary">
                  {locale === "fr" ? "Description" : "Description"}
                </h2>
                <p className="mt-5 whitespace-pre-wrap text-base leading-8 text-text-secondary">
                  {project.summary[locale]}
                </p>
              </section>
            )}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <TechnicalFrame as="div" index="//" label="Project system" className="p-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-text-muted">{copy.technologies}</h2>
              <ul className="mt-5 flex flex-wrap gap-2">
                {project.technologies.map((technology) => (
                  <li key={technology}>
                    <Badge className="flex items-center gap-1.5 px-3 py-1.5">
                      <SkillIcon name={technology} className="text-[16px]" />
                      <span>{technology}</span>
                    </Badge>
                  </li>
                ))}
              </ul>
              {project.githubUrl || project.demoUrl ? (
                <div className="mt-6 grid gap-2 border-t border-border pt-5">
                  {project.githubUrl ? <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="button-secondary"><ArrowUpRight aria-hidden="true" className="size-4" />{copy.sourceCode}</a> : null}
                  {project.demoUrl ? <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="button-primary"><ArrowUpRight aria-hidden="true" className="size-4" />{copy.liveDemo}</a> : null}
                </div>
              ) : null}
            </TechnicalFrame>
            <p className="mt-5 text-xs leading-5 text-text-muted">{copy.sourceNote}</p>
          </aside>
        </Container>
      </article>
    </>
  );
}
