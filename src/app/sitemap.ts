import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/config/site";
import { locales } from "@/i18n/config";
import { getPublishedProjects } from "@/features/projects/data";

const publicPaths = ["", "/projects", "/journey", "/certifications", "/contact", "/search"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const entries: MetadataRoute.Sitemap = [];
  const [frenchProjects, englishProjects] = await Promise.all([getPublishedProjects("fr"), getPublishedProjects("en")]);
  const projectsByLocale = { fr: frenchProjects, en: englishProjects } as const;

  for (const locale of locales) {
    for (const path of publicPaths) {
      entries.push({
        url: new URL(`/${locale}${path}`, baseUrl).toString(),
        changeFrequency: "monthly",
        priority: path === "" ? 1 : path === "/projects" ? 0.9 : 0.7,
        alternates: {
          languages: {
            fr: new URL(`/fr${path}`, baseUrl).toString(),
            en: new URL(`/en${path}`, baseUrl).toString(),
          },
        },
      });
    }

    for (const project of projectsByLocale[locale]) {
      const path = `/projects/${project.slug}`;
      entries.push({
        url: new URL(`/${locale}${path}`, baseUrl).toString(),
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: {
          languages: {
            fr: new URL(`/fr${path}`, baseUrl).toString(),
            en: new URL(`/en${path}`, baseUrl).toString(),
          },
        },
      });
    }

  }

  return entries;
}
