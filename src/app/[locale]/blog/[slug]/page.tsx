import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock3 } from "lucide-react";
import Container from "@/components/ui/Container";
import JsonLd from "@/components/ui/JsonLd";
import { MarkdownContent, getTableOfContents } from "@/features/blog/markdown";
import { getPublishedPost, getPublishedPosts } from "@/features/blog/data";
import { isLocale } from "@/i18n/config";
import { getSiteUrl, siteConfig } from "@/config/site";

type BlogArticlePageProps = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const post = await getPublishedPost(locale, slug);
  if (!post) return {};
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;
  const path = `/${locale}/blog/${post.slug}`;
  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: { fr: `/fr/blog/${post.slug}`, en: `/en/blog/${post.slug}`, "x-default": `/fr/blog/${post.slug}` },
    },
    openGraph: {
      type: "article",
      title,
      description,
      url: path,
      siteName: `${siteConfig.name} — Portfolio`,
      locale: locale === "fr" ? "fr_FR" : "en_US",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [siteConfig.name],
      tags: post.tags.map((tag) => tag.name),
    },
    twitter: { card: "summary", title, description },
  };
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const [post, posts] = await Promise.all([getPublishedPost(locale, slug), getPublishedPosts(locale)]);
  if (!post) notFound();

  const toc = getTableOfContents(post.markdown);
  const labels = locale === "fr"
    ? { back: "Retour au blog", published: "Publié le", updated: "Mis à jour le", min: "min de lecture", toc: "Dans cet article", related: "À lire ensuite" }
    : { back: "Back to the blog", published: "Published on", updated: "Updated on", min: "min read", toc: "In this article", related: "Read next" };
  const formatter = new Intl.DateTimeFormat(locale, { dateStyle: "long" });
  const related = posts.filter((candidate) => candidate.id !== post.id && (
    candidate.category?.slug === post.category?.slug || candidate.tags.some((tag) => post.tags.some((current) => current.slug === tag.slug))
  )).slice(0, 3);
  const canonicalUrl = new URL(`/${locale}/blog/${post.slug}`, getSiteUrl()).toString();

  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        inLanguage: locale,
        mainEntityOfPage: canonicalUrl,
        author: { "@type": "Person", name: siteConfig.name, url: getSiteUrl().toString() },
      }} />
      <Container className="pb-20 pt-10 sm:pt-14 lg:pb-28">
        <Link href={`/${locale}/blog`} className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-semibold text-text-secondary hover:text-text-primary"><ArrowLeft aria-hidden="true" className="size-4" />{labels.back}</Link>
        <article className="mt-8">
          <header className="mx-auto max-w-4xl border-b border-border pb-9 text-center">
            <div className="flex flex-wrap justify-center gap-2">{post.category ? <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-xs text-accent">{post.category.name}</span> : null}{post.tags.map((tag) => <span key={tag.slug} className="rounded-full border border-border px-3 py-1 text-xs text-text-muted">{tag.name}</span>)}</div>
            <h1 className="mt-6 text-balance text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">{post.title}</h1>
            <p className="mx-auto mt-5 max-w-3xl text-pretty text-lg leading-8 text-text-secondary">{post.excerpt}</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-text-muted">
              <span>{labels.published} {formatter.format(new Date(post.publishedAt))}</span>
              {post.updatedAt.slice(0, 10) !== post.publishedAt.slice(0, 10) ? <span>{labels.updated} {formatter.format(new Date(post.updatedAt))}</span> : null}
              <span className="inline-flex items-center gap-1.5"><Clock3 aria-hidden="true" className="size-4" />{post.readingMinutes} {labels.min}</span>
            </div>
          </header>

          <div className="mx-auto mt-10 grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-start">
            <MarkdownContent markdown={post.markdown} locale={locale} />
            {toc.length ? <aside className="order-first rounded-xl border border-border bg-surface p-5 lg:order-last lg:sticky lg:top-24"><h2 className="text-sm font-semibold">{labels.toc}</h2><nav aria-label={labels.toc}><ol className="mt-3 grid gap-2 text-sm text-text-muted">{toc.map((item) => <li key={item.id} style={{ paddingInlineStart: `${(item.level - 2) * 0.75}rem` }}><a className="hover:text-accent" href={`#${item.id}`}>{item.text}</a></li>)}</ol></nav></aside> : null}
          </div>
        </article>

        {related.length ? <section aria-labelledby="related-posts" className="mx-auto mt-16 max-w-6xl border-t border-border pt-10"><h2 id="related-posts" className="text-2xl font-semibold">{labels.related}</h2><div className="mt-5 grid gap-4 md:grid-cols-3">{related.map((item) => <Link key={item.id} href={`/${locale}/blog/${item.slug}`} className="surface-card p-5 hover:border-border-strong"><p className="text-xs text-accent">{item.category?.name}</p><h3 className="mt-2 font-semibold">{item.title}</h3><p className="mt-2 line-clamp-3 text-sm text-text-muted">{item.excerpt}</p></Link>)}</div></section> : null}
      </Container>
    </>
  );
}

export const revalidate = 900;
