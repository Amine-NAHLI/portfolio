import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { PrivacyAnalytics } from "@/components/analytics/PrivacyAnalytics";
import LocaleDocumentAttributes from "@/components/layout/LocaleDocumentAttributes";
import { getSiteUrl, siteConfig } from "@/config/site";
import { getPublicContactLinks } from "@/features/portfolio/data";
import { PageLoadWrapper } from "@/components/ui/PageLoadWrapper";
import CustomCursor from "@/components/ui/CustomCursor";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import Spotlight from "@/components/ui/Spotlight";
import MouseTrail from "@/components/ui/MouseTrail";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

const metadataByLocale: Record<Locale, Pick<Metadata, "title" | "description" | "openGraph">> = {
  fr: {
    title: "Portfolio",
    description:
      "Découvrez le parcours, les projets et les compétences d'Amine Nahli en cybersécurité, intelligence artificielle et développement logiciel.",
    openGraph: {
      title: "Amine Nahli — Élève ingénieur en cybersécurité & IA",
      description:
        "Projets, parcours et apprentissages à l'intersection de la cybersécurité, de l'IA et du développement logiciel.",
      locale: "fr_FR",
      type: "website",
    },
  },
  en: {
    title: "Portfolio",
    description:
      "Explore Amine Nahli's journey, projects and skills across cybersecurity, artificial intelligence and software engineering.",
    openGraph: {
      title: "Amine Nahli — Computer engineering student, Cybersecurity & AI",
      description:
        "Projects, experience and learning at the intersection of cybersecurity, AI and software engineering.",
      locale: "en_US",
      type: "website",
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark light",
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#f7f9f9" }, { media: "(prefers-color-scheme: dark)", color: "#121416" }],
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Pick<LocaleLayoutProps, "params">): Promise<Metadata> {
  const { locale: candidate } = await params;
  if (!isLocale(candidate)) return {};

  return {
    metadataBase: getSiteUrl(),
    applicationName: `${siteConfig.name} — Portfolio`,
    ...metadataByLocale[candidate],
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    robots: { index: true, follow: true },
    alternates: {
      canonical: `/${candidate}`,
      languages: {
        fr: "/fr",
        en: "/en",
        "x-default": "/fr",
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale: candidate } = await params;
  if (!isLocale(candidate)) notFound();

  const dictionary = getDictionary(candidate);
  const contactLinks = await getPublicContactLinks();

  return (
    <PageLoadWrapper>
      <CustomCursor />
      <MouseTrail />
      <NoiseOverlay />
      <Spotlight />
      <div className="flex min-h-screen flex-col">
        <LocaleDocumentAttributes locale={candidate} />
        <a href="#main-content" className="skip-link">
          {dictionary.skipToContent}
        </a>
        <SiteHeader locale={candidate} dictionary={dictionary} resumeLink={contactLinks.resume} />
        <PrivacyAnalytics locale={candidate} />
        <main id="main-content" className="flex-1" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter locale={candidate} dictionary={dictionary} contactLinks={contactLinks} />
      </div>
    </PageLoadWrapper>
  );
}
