import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BookMarked, GitCommit, Code2, FolderGit2, ArrowUpRight, Calendar } from "lucide-react";
import Container from "@/components/ui/Container";
import PageIntro from "@/components/ui/PageIntro";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { fetchGitHubData } from "@/lib/github";
import { isLocale, type Locale } from "@/i18n/config";
import LanguageGraph from "@/components/github/LanguageGraph";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { GithubIcon } from "@/components/ui/Icons";

type ContributionsPageProps = { params: Promise<{ locale: string }> };

export const revalidate = 3600;

export async function generateMetadata({ params }: ContributionsPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  
  return {
    title: locale === "fr" ? "Contributions & Code Ouvert — Amine Nahli" : "Contributions & Open Source — Amine Nahli",
    description: locale === "fr"
      ? "Dossier complet des contributions GitHub en temps réel, dépôts publics et répartition des langages d'Amine Nahli."
      : "Complete real-time GitHub contributions dossier, public repositories, and technology breakdown by Amine Nahli.",
  };
}

export default async function ContributionsPage({ params }: ContributionsPageProps) {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? localeParam : "fr";
  if (!isLocale(locale)) notFound();

  const data = await fetchGitHubData();

  if (!data) {
    return (
      <Container className="py-24 sm:py-32">
        <PageIntro 
          eyebrow="GitHub Telemetry" 
          title={locale === "fr" ? "En cours de synchronisation" : "Telemetry in Sync"}
          description={locale === "fr" 
            ? "Les données GitHub sont temporairement indisponibles via l'API GraphQL. Veuillez réessayer dans quelques instants." 
            : "GitHub telemetry is temporarily unavailable via GraphQL API. Please retry shortly."}
        />
      </Container>
    );
  }

  const { stats, activity } = data;

  const t = {
    eyebrow: locale === "fr" ? "// TÉLÉMÉTRIE GITHUB & CODE OUVERT" : "// GITHUB TELEMETRY & OPEN SOURCE",
    title: locale === "fr" ? "Contributions & Dépôts Publics" : "Contributions & Public Repositories",
    description: locale === "fr"
      ? "L'ingénierie logicielle s'évalue par la consistance des livraisons. Retrouvez ici la télémétrie complète de mon activité de code en temps réel, mes dépôts publics et mes architectures ouvertes."
      : "Software engineering is measured by shipping consistency. Explore real-time commit telemetry, verified open-source repositories, and system architectures.",
    stats: locale === "fr" ? "Statistiques Globales" : "Global Statistics",
    languages: locale === "fr" ? "Répartition des Technologies" : "Tech Stack Distribution",
    recent: locale === "fr" ? "Dépôts Publics & Systèmes Ouverts" : "Public Repositories & Open Systems",
    viewOnGithub: locale === "fr" ? "Consulter le profil GitHub officiel" : "View Official GitHub Profile",
    contributions: locale === "fr" ? "Contributions Annuelles" : "Annual Contributions",
    repos: locale === "fr" ? "Dépôts Publics" : "Public Repositories",
    backHome: locale === "fr" ? "← Retour à l'accueil" : "← Back to Home",
  };

  return (
    <>
      <PageIntro eyebrow={t.eyebrow} title={t.title} description={t.description}>
        <div className="flex flex-wrap items-center gap-3">
          <a 
            href="https://github.com/Amine-NAHLI" 
            target="_blank" 
            rel="noreferrer"
            className="group inline-flex items-center gap-2.5 rounded-full bg-accent px-6 py-3 font-mono text-xs sm:text-sm font-bold text-text-on-accent transition-all duration-200 hover:bg-accent-hover hover:scale-[1.02] active:scale-[0.98] shadow-md"
          >
            <GithubIcon className="size-4 fill-current" />
            <span>{t.viewOnGithub}</span>
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          <Link
            href={`/${locale}/#github`}
            className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface px-5 py-3 font-mono text-xs sm:text-sm font-semibold text-text-secondary transition-all hover:border-accent hover:text-text-primary"
          >
            <span>{t.backHome}</span>
          </Link>
        </div>
      </PageIntro>

      <Container className="mt-8 sm:mt-12 pb-28">
        <ScrollReveal>
          {/* Top KPI Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            
            {/* Metric 1: Verified Commits */}
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border-strong bg-surface p-7 shadow-lg transition-all duration-300 hover:border-accent/40">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase tracking-wider text-text-muted">
                  {locale === "fr" ? "Volume Annuel" : "Annual Volume"}
                </span>
                <GitCommit className="size-5 text-accent" />
              </div>
              <div>
                <p className="text-4xl sm:text-5xl font-display font-black text-text-primary mb-1 tracking-tight">
                  <AnimatedCounter value={stats.totalContributions} />
                </p>
                <p className="text-xs font-mono text-text-secondary uppercase tracking-wider">{t.contributions}</p>
              </div>
              <p className="mt-4 text-xs text-text-secondary leading-relaxed border-t border-border pt-3">
                {locale === "fr"
                  ? "Commits validés, pull requests et revues techniques sur les 365 derniers jours."
                  : "Verified commits, pull requests, and technical code reviews over the past 365 days."}
              </p>
            </div>

            {/* Metric 2: Public Repositories */}
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border-strong bg-surface p-7 shadow-lg transition-all duration-300 hover:border-accent/40">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase tracking-wider text-text-muted">
                  {locale === "fr" ? "Code Ouvert" : "Open Source"}
                </span>
                <BookMarked className="size-5 text-accent" />
              </div>
              <div>
                <p className="text-4xl sm:text-5xl font-display font-black text-text-primary mb-1 tracking-tight">
                  <AnimatedCounter value={stats.totalRepositories} />
                </p>
                <p className="text-xs font-mono text-text-secondary uppercase tracking-wider">{t.repos}</p>
              </div>
              <p className="mt-4 text-xs text-text-secondary leading-relaxed border-t border-border pt-3">
                {locale === "fr"
                  ? "Dépôts d'ingénierie, modules d'IA et systèmes documentés accessibles en open source."
                  : "Software repositories, AI models, and engineering architectures available publicly."}
              </p>
            </div>

            {/* Metric 3 & 4: Tech Stack Languages (Span 2) */}
            <div className="col-span-1 md:col-span-2 group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border-strong bg-surface p-7 shadow-lg transition-all duration-300 hover:border-accent/40">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Code2 className="size-5 text-accent" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary">
                    {t.languages}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-accent">
                  {stats.topLanguage?.name ? `${stats.topLanguage.name} (Dominant)` : "Python"}
                </span>
              </div>
              <div className="my-auto py-2">
                <LanguageGraph languages={stats.languages} locale={locale as Locale} />
              </div>
              <p className="mt-4 text-xs text-text-secondary leading-relaxed border-t border-border pt-3">
                {locale === "fr"
                  ? "Distribution télémétrique des octets de code écrits dans les dépôts publics."
                  : "Telemetry breakdown of codebase volume authored across public repositories."}
              </p>
            </div>
          </div>

          {/* Repositories Section */}
          <div className="mt-16">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-text-primary flex items-center gap-2.5">
                    <FolderGit2 className="size-6 text-accent" />
                    <span>{t.recent}</span>
                  </h2>
                  <div className="flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-0.5">
                    <span className="relative flex size-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                      <span className="relative inline-flex size-1.5 rounded-full bg-green-500" />
                    </span>
                    <span className="text-[10px] font-mono font-bold text-green-400 uppercase tracking-wider">Live API</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-text-secondary max-w-2xl leading-relaxed">
                  {locale === "fr" 
                    ? "Connecté directement à l'API GraphQL GitHub. Cette sélection inclut les dépôts avec activité continue, architectures documentées et commits récents." 
                    : "Directly synchronized with GitHub's GraphQL API. Featuring repositories with continuous activity and documented architectures."}
                </p>
              </div>

              <span className="text-xs font-mono text-text-muted">
                {activity.recentRepositories.length} {locale === "fr" ? "dépôts affichés" : "repositories shown"}
              </span>
            </div>

            {/* Repositories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activity.recentRepositories.map((repo) => (
                <a 
                  key={repo.name} 
                  href={repo.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border-strong bg-surface p-6 shadow-md transition-all duration-300 hover:border-accent/40 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        <FolderGit2 className="size-4 text-accent shrink-0" />
                        <h3 className="text-base font-bold text-text-primary group-hover:text-accent transition-colors truncate">
                          {repo.name}
                        </h3>
                      </div>
                      <ArrowUpRight className="size-4 text-text-muted group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                    </div>

                    <p className="text-xs sm:text-sm text-text-secondary line-clamp-3 leading-relaxed">
                      {repo.description || (locale === "fr" ? "Dépôt d'ingénierie et architecture logicielle." : "Engineering repository and software architecture.")}
                    </p>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-mono text-text-muted">
                    <div className="flex items-center gap-2 min-w-0">
                      {repo.primaryLanguage ? (
                        <>
                          <span 
                            className="size-2.5 rounded-full shrink-0 shadow-sm" 
                            style={{ backgroundColor: repo.primaryLanguage.color }} 
                          />
                          <span className="text-text-primary truncate font-medium">{repo.primaryLanguage.name}</span>
                        </>
                      ) : (
                        <span className="text-text-muted">Code</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 text-[11px] text-text-muted">
                      <Calendar className="size-3" />
                      <span>
                        {new Date(repo.pushedAt).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", { month: "short", year: "numeric" })}
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </>
  );
}
