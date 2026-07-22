import type { Locale } from "@/i18n/config";

export type PublicBlogPost = {
  id: string;
  slug: string;
  locale: Locale;
  title: string;
  excerpt: string;
  markdown: string;
  seoTitle: string | null;
  seoDescription: string | null;
  category: { slug: string; name: string } | null;
  tags: { slug: string; name: string }[];
  featured: boolean;
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
};
