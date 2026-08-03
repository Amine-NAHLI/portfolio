import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookMarked, GitCommit, Code2, FolderGit2 } from "lucide-react";
import Container from "@/components/ui/Container";
import PageIntro from "@/components/ui/PageIntro";
import ScrollReveal from "@/components/ui/ScrollReveal";
import TechnicalFrame from "@/components/ui/TechnicalFrame";
import { fetchGitHubData } from "@/lib/github";
import { isLocale, type Locale } from "@/i18n/config";
import LanguageGraph from "@/components/github/LanguageGraph";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

type OpenSourcePageProps = { params: Promise<{ locale: string }> };

export const revalidate = 3600;

export async function generateMetadata({ params }: OpenSourcePageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  
  return {
    title: locale === "fr" ? "Open Source & GitHub" : "Open Source & GitHub",
    description: locale === "fr" ? "Statistiques et activité de mon profil GitHub en temps réel." : "Real-time statistics and activity of my GitHub profile.",
  };
}

export default async function OpenSourcePage({ params }: OpenSourcePageProps) {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? localeParam : "fr";
  if (!isLocale(locale)) notFound();

  const data = await fetchGitHubData();

  if (!data) {
    return (
      <Container className="py-24 sm:py-32">
        <PageIntro 
          eyebrow="GitHub" 
          title="En cours de maintenance"
          description="Les données GitHub ne sont pas disponibles pour le moment."
        />
      </Container>
    );
  }

  const { stats, activity } = data;

  const t = {
    eyebrow: "Open Source",
    title: locale === "fr" ? "Mon activité GitHub" : "My GitHub Activity",
    description: locale === "fr"
      ? "L'open source et le partage de code sont au cœur de ma démarche d'ingénieur. Voici un aperçu en temps réel de mon activité, de mes dépôts publics et des langages que je pratique au quotidien."
      : "Open source and code sharing are at the core of my engineering process. Here is a real-time overview of my activity, public repositories, and the languages I use daily.",
    stats: locale === "fr" ? "Statistiques Globales" : "Global Statistics",
    languages: locale === "fr" ? "Langages & Technologies" : "Languages & Technologies",
    recent: locale === "fr" ? "Derniers Dépôts Actifs" : "Recent Active Repositories",
    viewOnGithub: locale === "fr" ? "Voir mon profil GitHub" : "View my GitHub profile",
    contributions: locale === "fr" ? "Contributions (cette année)" : "Contributions (this year)",
    repos: locale === "fr" ? "Dépôts Publics" : "Public Repositories",
  };

  return (
    <>
      <PageIntro eyebrow={t.eyebrow} title={t.title} description={t.description}>
        <a 
          href="https://github.com/Amine-NAHLI" 
          target="_blank" 
          rel="noreferrer"
          className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-surface-raised px-8 py-4 font-mono text-sm font-semibold text-text-primary transition-all hover:bg-surface-deep hover:scale-105 hover:shadow-[0_0_40px_rgba(56,189,248,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/10 to-accent/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
          <svg viewBox="0 0 24 24" className="size-5 fill-current transition-transform group-hover:rotate-12 group-hover:scale-110 group-hover:text-accent"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          <span className="relative z-10">{t.viewOnGithub}</span>
        </a>
      </PageIntro>

      <Container className="mt-8 sm:mt-12 pb-24">
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 auto-rows-[minmax(180px,auto)]">
            
            {/* Bento Box 1: Commits (Span 1) */}
            <div className="group relative flex flex-col justify-center overflow-hidden rounded-[2rem] border border-border/50 bg-surface-subtle/40 p-8 backdrop-blur-xl transition-all hover:bg-surface-subtle/60 hover:border-accent/40 shadow-sm hover:shadow-[0_0_40px_-10px_rgba(var(--color-accent-rgb),0.15)]">
              <div className="absolute -top-12 -right-12 size-32 bg-accent/20 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <GitCommit className="size-6 text-text-muted mb-4 group-hover:text-accent transition-colors" />
              <p className="text-5xl font-display font-bold text-text-primary mb-1">
                <AnimatedCounter value={stats.totalContributions} />
              </p>
              <p className="text-xs font-mono text-text-secondary uppercase tracking-widest">{t.contributions}</p>
            </div>

            {/* Bento Box 2: Repos (Span 1) */}
            <div className="group relative flex flex-col justify-center overflow-hidden rounded-[2rem] border border-border/50 bg-surface-subtle/40 p-8 backdrop-blur-xl transition-all hover:bg-surface-subtle/60 hover:border-accent/40 shadow-sm hover:shadow-[0_0_40px_-10px_rgba(var(--color-accent-rgb),0.15)]">
              <div className="absolute -bottom-12 -left-12 size-32 bg-accent/20 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <BookMarked className="size-6 text-text-muted mb-4 group-hover:text-accent transition-colors" />
              <p className="text-5xl font-display font-bold text-text-primary mb-1">
                <AnimatedCounter value={stats.totalRepositories} />
              </p>
              <p className="text-xs font-mono text-text-secondary uppercase tracking-widest">{t.repos}</p>
            </div>

            {/* Bento Box 3: Languages (Span 2) */}
            <div className="col-span-1 md:col-span-2 group relative flex flex-col justify-center overflow-hidden rounded-[2rem] border border-border/50 bg-surface-subtle/40 p-6 backdrop-blur-xl transition-all hover:bg-surface-subtle/60 hover:border-accent/40 shadow-sm">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-48 bg-accent/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <div className="flex items-center gap-2 mb-4">
                <Code2 className="size-5 text-accent" />
                <h2 className="text-sm font-semibold font-display tracking-wide text-text-primary uppercase">{t.languages}</h2>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <LanguageGraph languages={stats.languages} locale={locale as Locale} />
              </div>
            </div>

            {/* Bento Boxes 4+: Recent Repositories */}
            <div className="md:col-span-4 mt-8">
              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold font-display tracking-tight text-text-primary flex items-center gap-2">
                    <FolderGit2 className="size-5 text-accent" />
                    {t.recent}
                  </h2>
                  <div className="flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-2 py-0.5" title={locale === "fr" ? "Synchronisation en temps réel" : "Real-time sync"}>
                    <span className="relative flex size-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                      <span className="relative inline-flex size-1.5 rounded-full bg-green-500"></span>
                    </span>
                    <span className="text-[9px] font-mono font-bold text-green-500 uppercase tracking-widest">Live API</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-text-secondary">
                  {locale === "fr" 
                    ? "Connecté en temps réel à mon compte GitHub. Cette grille s'actualise automatiquement avec mes derniers commits." 
                    : "Connected in real-time to my GitHub account. This grid automatically updates with my latest commits."}
                </p>
              </div>
            </div>

            {activity.recentRepositories.map((repo, idx) => {
              // Feature the first repo by making it span 2 columns on large screens if desired, but 1 col keeps grid consistent
              const isFeatured = idx === 0;
              return (
                <a 
                  key={repo.name} 
                  href={repo.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className={`group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-border/50 bg-surface-subtle/40 p-6 backdrop-blur-xl transition-all hover:bg-surface-subtle/60 hover:-translate-y-1 hover:border-accent/40 shadow-sm hover:shadow-xl ${isFeatured ? 'md:col-span-2' : 'col-span-1'}`}
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <FolderGit2 className="size-5 text-text-muted group-hover:text-accent transition-colors" />
                      <span className="text-[10px] font-mono text-text-muted">
                        {new Date(repo.pushedAt).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary group-hover:text-accent transition-colors truncate">
                      {repo.name}
                    </h3>
                    <p className="mt-2 text-sm text-text-secondary line-clamp-2">
                      {repo.description || (locale === "fr" ? "Aucune description fournie." : "No description provided.")}
                    </p>
                  </div>
                  
                  <div className="mt-6 flex items-center gap-1.5 text-xs font-mono">
                    {repo.primaryLanguage ? (
                      <>
                        <span 
                          className="size-2.5 rounded-full shadow-sm" 
                          style={{ backgroundColor: repo.primaryLanguage.color }} 
                        />
                        <span className="text-text-primary truncate">{repo.primaryLanguage.name}</span>
                      </>
                    ) : (
                      <span className="text-text-muted truncate">Unknown</span>
                    )}
                  </div>
                </a>
              );
            })}
            
          </div>
        </ScrollReveal>
      </Container>
    </>
  );
}
