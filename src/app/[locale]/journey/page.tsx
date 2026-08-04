import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import PageIntro from "@/components/ui/PageIntro";
import PortfolioEmptyState from "@/components/ui/PortfolioEmptyState";
import Roadmap from "@/components/ui/Roadmap";
import { getPublicJourney } from "@/features/portfolio/data";
import { publicCopy } from "@/content/copy";
import { isLocale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";

type JourneyPageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: JourneyPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = publicCopy[locale].journey;
  return createPageMetadata({ locale, title: copy.title, description: copy.description, path: "/journey" });
}

export default async function JourneyPage({ params }: JourneyPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = publicCopy[locale].journey;
  const entries = await getPublicJourney(locale);

  return (
    <>
      <PageIntro eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />
      <Container className="py-12 sm:py-16 lg:py-20">
        {entries.length === 0 ? <PortfolioEmptyState collection="journey" locale={locale} className="mx-auto max-w-3xl" /> : <Roadmap entries={entries} labels={{ experience: copy.experience, education: copy.education }} />}
      </Container>
    </>
  );
}
