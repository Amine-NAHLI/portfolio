import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookMarked, GitCommit, Code2, Terminal, FolderGit2 } from "lucide-react";
import Container from "@/components/ui/Container";
import PageIntro from "@/components/ui/PageIntro";
import ScrollReveal from "@/components/ui/ScrollReveal";
import TechnicalFrame from "@/components/ui/TechnicalFrame";
import ButtonLink from "@/components/ui/ButtonLink";
import { fetchGitHubData } from "@/lib/github";
import { isLocale } from "@/i18n/config";
import LanguageBarChart from "@/components/github/LanguageBarChart";

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
      <PageIntro eyebrow={t.eyebrow} title={t.title} description={t.description} />

      <Container className="pb-16 -mt-8">
        <ButtonLink href="https://github.com/Amine-NAHLI" target="_blank" rel="noreferrer">
          <Terminal className="size-4" />
          {t.viewOnGithub}
        </ButtonLink>
      </Container>

      <Container className="mt-16 sm:mt-24 pb-24">
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
            <div className="bg-surface-subtle border border-border/50 rounded-2xl p-6 sm:p-10 backdrop-blur-md">
              <LanguageBarChart languages={stats.languages} locale={locale} />
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
