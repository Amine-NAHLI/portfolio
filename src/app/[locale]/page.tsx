import type { Metadata } from "next";
import JsonLd from "@/components/ui/JsonLd";
import { getSiteUrl, siteConfig } from "@/config/site";
import { getHomeCopy } from "@/content/dynamic-copy";
import { getPublicContactLinks, getPublicJourney, getPublicCertifications } from "@/features/portfolio/data";
import { getPublishedProjects } from "@/features/projects/data";
import { isLocale, type Locale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import CinematicCanvas from "@/components/cinematic/CinematicCanvas";

type HomePageProps = { params: Promise<{ locale: string }> };

export const revalidate = 3600;

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = await getHomeCopy(locale);
  return createPageMetadata({ locale, title: copy.eyebrow, description: copy.introduction });
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? localeParam : "fr";
  if (!isLocale(locale)) notFound();

  const copy = await getHomeCopy(locale);
  const [projects, journey, contactLinks, certifications] = await Promise.all([
    getPublishedProjects(locale as Locale),
    getPublicJourney(locale as Locale),
    getPublicContactLinks(),
    getPublicCertifications(locale as Locale),
  ]);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Person",
              "@id": new URL("/#person", getSiteUrl()).toString(),
              name: siteConfig.name,
              url: new URL(`/${locale}`, getSiteUrl()).toString(),
              homeLocation: siteConfig.location[locale],
              sameAs: [contactLinks.github, contactLinks.linkedin, contactLinks.tryHackMe],
              alumniOf: { "@type": "CollegeOrUniversity", name: "Université Privée de Fès" },
            },
            {
              "@type": "WebSite",
              name: `${siteConfig.name} — Portfolio`,
              url: getSiteUrl().toString(),
              inLanguage: locale,
              author: { "@id": new URL("/#person", getSiteUrl()).toString() },
            },
          ],
        }}
      />

      <CinematicCanvas
        locale={locale as Locale}
        siteName={siteConfig.name}
        introduction={copy.introduction}
        projects={projects}
        journey={journey}
        certifications={certifications}
        contactLinks={contactLinks}
      />
    </>
  );
}
