import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import { BlogExplorer } from "@/components/blog/BlogExplorer";
import ContentState from "@/components/ui/ContentState";
import PageIntro from "@/components/ui/PageIntro";
import { publicCopy } from "@/content/copy";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { createPageMetadata } from "@/lib/seo";
import { getPublishedPosts } from "@/features/blog/data";
import { notFound } from "next/navigation";

type BlogPageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = publicCopy[locale].blog;
  return createPageMetadata({ locale, title: copy.title, description: copy.description, path: "/blog" });
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = publicCopy[locale].blog;
  const dictionary = getDictionary(locale);
  const posts = await getPublishedPosts(locale);

  return (
    <>
      <PageIntro eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />
      <Container className="py-12 sm:py-16 lg:py-20">
        {posts.length ? <BlogExplorer posts={posts} locale={locale} /> : <ContentState kind="empty" dictionary={dictionary.states} />}
      </Container>
    </>
  );
}

export const revalidate = 900;
