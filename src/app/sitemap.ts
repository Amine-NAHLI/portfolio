import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/config/site";
import { locales } from "@/i18n/config";
import { getPublishedPosts } from "@/features/blog/data";
import { getPublishedProjects } from "@/features/projects/data";

const publicPaths = ["", "/projects", "/journey", "/skills", "/certifications", "/blog", "/now", "/contact", "/search"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const entries: MetadataRoute.Sitemap = [];
  const [frenchPosts, englishPosts, frenchProjects, englishProjects] = await Promise.all([
    getPublishedPosts("fr"),
    getPublishedPosts("en"),
    getPublishedProjects("fr"),
    getPublishedProjects("en"),
  ]);
  const blogPosts = { fr: frenchPosts, en: englishPosts } as const;
  const projectsByLocale = { fr: frenchProjects, en: englishProjects } as const;

  for (const locale of locales) {
    for (const path of publicPaths) {
      entries.push({
        url: new URL(`/${locale}${path}`, baseUrl).toString(),
        changeFrequency: path === "/blog" || path === "/now" ? "weekly" : "monthly",
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

    for (const post of blogPosts[locale]) {
      const path = `/blog/${post.slug}`;
      entries.push({
        url: new URL(`/${locale}${path}`, baseUrl).toString(),
        lastModified: new Date(post.updatedAt),
        changeFrequency: "monthly",
        priority: 0.75,
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
