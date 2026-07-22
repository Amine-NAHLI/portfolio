import "server-only";

import { unstable_cache } from "next/cache";
import { hasSupabasePublicConfig } from "@/lib/env/supabase";
import { createPublicClient } from "@/lib/supabase/public";
import type { Locale } from "@/i18n/config";
import type { PublicBlogPost } from "@/features/blog/types";

const WORDS_PER_MINUTE = 220;

async function queryPublishedPosts(locale: Locale): Promise<PublicBlogPost[]> {
  if (!hasSupabasePublicConfig()) return [];
  const supabase = createPublicClient();
  try {
    const [{ data: posts, error: postsError }, { data: translations, error: translationsError }, categoriesResult, tagsResult, relationsResult] = await Promise.all([
      supabase.from("blog_posts").select("*").order("published_at", { ascending: false }),
      supabase.from("blog_post_translations").select("*").eq("locale", locale).eq("review_status", "validated"),
      supabase.from("categories").select("*"),
      supabase.from("tags").select("*"),
      supabase.from("blog_post_tags").select("*"),
    ] as const);
    if (postsError || translationsError || !posts || !translations) return [];

    const translationByPost = new Map(translations.map((translation) => [translation.blog_post_id, translation]));
    const categoryById = new Map((categoriesResult.data ?? []).map((category) => [category.id, category]));
    const tagById = new Map((tagsResult.data ?? []).map((tag) => [tag.id, tag]));
    const tagIdsByPost = new Map<string, string[]>();
    for (const relation of relationsResult.data ?? []) {
      const current = tagIdsByPost.get(relation.blog_post_id) ?? [];
      current.push(relation.tag_id);
      tagIdsByPost.set(relation.blog_post_id, current);
    }

    return posts.flatMap((post) => {
      const translation = translationByPost.get(post.id);
      if (!translation || !post.published_at) return [];
      const category = post.category_id ? categoryById.get(post.category_id) : null;
      const words = translation.markdown.trim().split(/\s+/u).filter(Boolean).length;
      return [{
        id: post.id,
        slug: post.slug,
        locale,
        title: translation.title,
        excerpt: translation.excerpt,
        markdown: translation.markdown,
        seoTitle: translation.seo_title,
        seoDescription: translation.seo_description,
        category: category ? { slug: category.slug, name: locale === "fr" ? category.name_fr : category.name_en } : null,
        tags: (tagIdsByPost.get(post.id) ?? []).flatMap((tagId) => {
          const tag = tagById.get(tagId);
          return tag ? [{ slug: tag.slug, name: tag.name }] : [];
        }),
        featured: post.featured,
        publishedAt: post.published_at,
        updatedAt: post.updated_at,
        readingMinutes: Math.max(1, Math.ceil(words / WORDS_PER_MINUTE)),
      } satisfies PublicBlogPost];
    });
  } catch {
    return [];
  }
}

const getFrenchPosts = unstable_cache(() => queryPublishedPosts("fr"), ["published-blog-posts-fr"], { revalidate: 900, tags: ["blog"] });
const getEnglishPosts = unstable_cache(() => queryPublishedPosts("en"), ["published-blog-posts-en"], { revalidate: 900, tags: ["blog"] });

export function getPublishedPosts(locale: Locale): Promise<PublicBlogPost[]> {
  return locale === "fr" ? getFrenchPosts() : getEnglishPosts();
}

export async function getPublishedPost(locale: Locale, slug: string): Promise<PublicBlogPost | null> {
  const posts = await getPublishedPosts(locale);
  return posts.find((post) => post.slug === slug) ?? null;
}
