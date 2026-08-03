import { ArrowRight, Terminal } from "lucide-react";
import ButtonLink from "@/components/ui/ButtonLink";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHeading from "@/components/ui/SectionHeading";
import GitHubStatsCards from "./GitHubStatsCards";
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

          <GitHubStatsCards stats={stats} locale={locale} />
        </ScrollReveal>
      </Container>
    </section>
  );
}
