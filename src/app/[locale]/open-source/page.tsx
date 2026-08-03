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

      <Container className="mt-12 sm:mt-16 pb-24">
        {/* Global Stats */}
        <ScrollReveal>
          <div className="mb-16">
            <h2 className="text-xl font-semibold font-display tracking-tight text-text-primary mb-6 flex items-center gap-2">
              <GitCommit className="size-5 text-accent" />
              {t.stats}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <TechnicalFrame index="01" label={t.contributions} className="p-8">
                <p className="text-5xl font-bold text-text-primary mb-2">{stats.totalContributions}</p>
                <p className="text-sm font-mono text-accent uppercase tracking-widest">Commits, PRs & Issues</p>
              </TechnicalFrame>
              <TechnicalFrame index="02" label={t.repos} className="p-8">
                <p className="text-5xl font-bold text-text-primary mb-2">{stats.totalRepositories}</p>
                <p className="text-sm font-mono text-accent uppercase tracking-widest">Projets Partagés</p>
              </TechnicalFrame>
            </div>
          </div>
        </ScrollReveal>

        {/* Languages */}
        <ScrollReveal yOffset={40}>
          <div className="mb-16">
            <h2 className="text-xl font-semibold font-display tracking-tight text-text-primary mb-6 flex items-center gap-2">
              <Code2 className="size-5 text-accent" />
              {t.languages}
            </h2>
            <div className="bg-surface-subtle border border-border/50 rounded-2xl overflow-hidden backdrop-blur-md">
              <LanguageGraph languages={stats.languages} locale={locale as Locale} />
            </div>
          </div>
        </ScrollReveal>

        {/* Recent Activity */}
        <ScrollReveal yOffset={40}>
          <div>
            <h2 className="text-xl font-semibold font-display tracking-tight text-text-primary mb-6 flex items-center gap-2">
              <FolderGit2 className="size-5 text-accent" />
              {t.recent}
            </h2>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {activity.recentRepositories.map((repo) => (
                <a 
                  key={repo.name} 
                  href={repo.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border/50 bg-surface-subtle/50 p-6 transition-all hover:bg-surface-subtle hover:border-accent/40"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <BookMarked className="size-5 text-text-muted group-hover:text-accent transition-colors" />
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary group-hover:text-accent transition-colors">
                      {repo.name}
                    </h3>
                    <p className="mt-2 text-sm text-text-secondary line-clamp-3">
                      {repo.description || (locale === "fr" ? "Aucune description fournie." : "No description provided.")}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-1.5">
                      {repo.primaryLanguage ? (
                        <>
                          <span 
                            className="size-2.5 rounded-full" 
                            style={{ backgroundColor: repo.primaryLanguage.color }} 
                          />
                          <span className="text-text-primary">{repo.primaryLanguage.name}</span>
                        </>
                      ) : (
                        <span className="text-text-muted">Unknown</span>
                      )}
                    </div>
                    <span className="text-text-muted">
                      {new Date(repo.pushedAt).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
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
