import type { Metadata } from "next";
import JsonLd from "@/components/ui/JsonLd";
import { getSiteUrl, siteConfig } from "@/config/site";
import { getHomeCopy } from "@/content/dynamic-copy";
import {
  getPublicContactLinks,
  getPublicJourney,
  getPublicJourneyTimeline,
  getPublicCertifications,
  getFeaturedHomeProjectSlugs,
  getFeaturedHomeCertificationIds,
  getSectionsVisibility,
} from "@/features/portfolio/data";
import { getPublishedProjects } from "@/features/projects/data";
import { fetchGitHubData } from "@/lib/github";
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
  const [
    allProjects,
    journey,
    timelineItems,
    contactLinks,
    allCertifications,
    featuredSlugs,
    featuredCertIds,
    sectionsVisibility,
    githubData,
  ] = await Promise.all([
    getPublishedProjects(locale as Locale),
    getPublicJourney(locale as Locale),
    getPublicJourneyTimeline(),
    getPublicContactLinks(),
    getPublicCertifications(locale as Locale),
    getFeaturedHomeProjectSlugs(),
    getFeaturedHomeCertificationIds(),
    getSectionsVisibility(),
    fetchGitHubData(),
  ]);

  // Order projects according to the 4 featured slugs selected in Admin
  const projects: typeof allProjects = [];
  if (featuredSlugs && featuredSlugs.length > 0) {
    const projectMap = new Map(allProjects.map((p) => [p.slug, p]));
    for (const slug of featuredSlugs) {
      const found = projectMap.get(slug);
      if (found) projects.push(found);
    }
  }

  // If fewer than 4 are configured, fill up to 4 with remaining published projects
  if (projects.length < 4) {
    for (const p of allProjects) {
      if (!projects.some((sp) => sp.slug === p.slug)) {
        projects.push(p);
      }
      if (projects.length >= 4) break;
    }
  }

  // Order certifications according to the 3 featured IDs selected in Admin
  const certifications: typeof allCertifications = [];
  if (featuredCertIds && featuredCertIds.length > 0) {
    const certMap = new Map(allCertifications.map((c) => [c.id, c]));
    for (const id of featuredCertIds) {
      const found = certMap.get(id);
      if (found) certifications.push(found);
    }
  }

  // If fewer than 3 are configured, fill up to 3 with remaining certifications
  if (certifications.length < 3) {
    for (const c of allCertifications) {
      if (!certifications.some((sc) => sc.id === c.id)) {
        certifications.push(c);
      }
      if (certifications.length >= 3) break;
    }
  }

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
        dynamicCopy={copy}
        projects={projects}
        journey={journey}
        timelineItems={timelineItems}
        certifications={certifications}
        showGitHub={sectionsVisibility.github}
        githubData={githubData}
        contactLinks={contactLinks}
      />
    </>
  );
}
