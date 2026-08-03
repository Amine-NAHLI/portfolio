import { ArrowRight, Terminal, GitCommit, FolderGit2, Code2 } from "lucide-react";
import ButtonLink from "@/components/ui/ButtonLink";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHeading from "@/components/ui/SectionHeading";
import TechnicalFrame from "@/components/ui/TechnicalFrame";
import { fetchGitHubData } from "@/lib/github";
import { Locale } from "@/i18n/config";

type GitHubPreviewSectionProps = {
  locale: Locale;
};

export default async function GitHubPreviewSection({ locale }: GitHubPreviewSectionProps) {
  const data = await fetchGitHubData();

  if (!data) {
    return null; // Do not render the section if data fetching fails or token is missing
  }

  const { stats } = data;

  // Localized texts
  const t = {
    eyebrow: locale === "fr" ? "Activité en temps réel" : "Real-time Activity",
    title: "Open Source & GitHub",
    description: locale === "fr" 
      ? "Un aperçu de mon engagement quotidien dans le code et la communauté open source."
      : "A glimpse into my daily engagement with code and the open source community.",
    contributions: locale === "fr" ? "Contributions (1 an)" : "Contributions (1 yr)",
    repositories: locale === "fr" ? "Dépôts Publics" : "Public Repositories",
    topLanguage: locale === "fr" ? "Langage Principal" : "Top Language",
    cta: locale === "fr" ? "Voir toute mon activité" : "View all activity",
  };

  return (
    <section id="github-activity" className="relative z-10 py-16 sm:py-24">
      <Container>
        <ScrollReveal yOffset={40}>
          <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between mb-10">
            <SectionHeading eyebrow={t.eyebrow} title={t.title} description={t.description} />
            <ButtonLink href={`/${locale}/open-source`} variant="secondary" className="shrink-0 self-start md:self-auto">
              <Terminal aria-hidden="true" className="size-4" />
              {t.cta}
              <ArrowRight aria-hidden="true" className="size-4" />
            </ButtonLink>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {/* Contributions */}
            <TechnicalFrame index="01" label={t.contributions} className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <GitCommit className="size-6" />
                </div>
                <div>
                  <p className="text-3xl font-semibold text-text-primary">
                    {stats.totalContributions}
                  </p>
                  <p className="text-sm text-text-muted mt-1">{locale === "fr" ? "commits & PRs" : "commits & PRs"}</p>
                </div>
              </div>
            </TechnicalFrame>

            {/* Repositories */}
            <TechnicalFrame index="02" label={t.repositories} className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <FolderGit2 className="size-6" />
                </div>
                <div>
                  <p className="text-3xl font-semibold text-text-primary">
                    {stats.totalRepositories}
                  </p>
                  <p className="text-sm text-text-muted mt-1">{locale === "fr" ? "projets partagés" : "shared projects"}</p>
                </div>
              </div>
            </TechnicalFrame>

            {/* Top Language */}
            <TechnicalFrame index="03" label={t.topLanguage} className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <Code2 className="size-6" />
                </div>
                <div>
                  <p className="text-3xl font-semibold text-text-primary">
                    {stats.topLanguage?.name || "N/A"}
                  </p>
                  {stats.topLanguage && (
                    <div className="flex items-center gap-2 mt-1">
                      <div 
                        className="size-2.5 rounded-full" 
                        style={{ backgroundColor: stats.topLanguage.color }}
                      />
                      <p className="text-sm text-text-muted">
                        {stats.topLanguage.percentage.toFixed(1)}% {locale === "fr" ? "du code" : "of code"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TechnicalFrame>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
