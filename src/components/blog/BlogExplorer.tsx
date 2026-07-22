"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import Badge from "@/components/ui/Badge";
import type { PublicBlogPost } from "@/features/blog/types";
import type { Locale } from "@/i18n/config";

const PAGE_SIZE = 9;

export function BlogExplorer({ posts, locale }: { posts: PublicBlogPost[]; locale: Locale }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const categories = useMemo(() => [...new Map(posts.flatMap((post) => post.category ? [[post.category.slug, post.category.name] as const] : [])).entries()], [posts]);
  const normalizedQuery = query.trim().toLocaleLowerCase(locale);
  const filtered = useMemo(() => posts.filter((post) => {
    const text = [post.title, post.excerpt, ...post.tags.map((tag) => tag.name)].join(" ").toLocaleLowerCase(locale);
    return (!normalizedQuery || text.includes(normalizedQuery)) && (category === "all" || post.category?.slug === category);
  }), [category, locale, normalizedQuery, posts]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const labels = locale === "fr"
    ? { search: "Rechercher un article", all: "Toutes les catégories", empty: "Aucun article ne correspond à ces critères.", read: "Lire l’article", min: "min de lecture", previous: "Précédent", next: "Suivant" }
    : { search: "Search articles", all: "All categories", empty: "No article matches these filters.", read: "Read article", min: "min read", previous: "Previous", next: "Next" };

  return (
    <div>
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 md:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">{labels.search}</span>
          <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
          <input type="search" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder={`${labels.search}…`} className="min-h-11 pl-10 pr-4 text-sm" />
        </label>
        <label className="md:w-60">
          <span className="sr-only">{labels.all}</span>
          <select value={category} onChange={(event) => { setCategory(event.target.value); setPage(1); }} className="min-h-11 px-3 text-sm">
            <option value="all">{labels.all}</option>
            {categories.map(([slug, name]) => <option key={slug} value={slug}>{name}</option>)}
          </select>
        </label>
      </div>

      <p aria-live="polite" className="mt-4 text-sm text-text-muted">{filtered.length} article{filtered.length > 1 ? "s" : ""}</p>
      {visible.length === 0 ? <div className="mt-5 rounded-xl border border-dashed border-border-strong p-10 text-center text-text-muted">{labels.empty}</div> : (
        <div className="mt-5 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {visible.map((post) => (
            <article key={post.id} className="surface-card flex h-full flex-col p-6">
              <div className="flex flex-wrap items-center gap-2">
                {post.featured ? <Badge>{locale === "fr" ? "À la une" : "Featured"}</Badge> : null}
                {post.category ? <span className="font-mono text-xs text-accent">{post.category.name}</span> : null}
              </div>
              <h2 className="mt-5 text-xl font-semibold"><Link className="hover:text-accent" href={`/${locale}/blog/${post.slug}`}>{post.title}</Link></h2>
              <p className="mt-3 line-clamp-4 flex-1 text-sm leading-6 text-text-secondary">{post.excerpt}</p>
              <div className="mt-5 flex flex-wrap gap-2">{post.tags.slice(0, 4).map((tag) => <span key={tag.slug} className="rounded-full border border-border px-2.5 py-1 text-xs text-text-muted">{tag.name}</span>)}</div>
              <div className="mt-6 flex items-center justify-between gap-4 border-t border-border pt-4 text-xs text-text-muted">
                <span>{new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(post.publishedAt))} · {post.readingMinutes} {labels.min}</span>
                <Link href={`/${locale}/blog/${post.slug}`} className="inline-flex min-h-11 items-center gap-1 font-semibold text-accent" aria-label={`${labels.read} : ${post.title}`}><ArrowUpRight aria-hidden="true" className="size-4" /></Link>
              </div>
            </article>
          ))}
        </div>
      )}

      {pageCount > 1 ? <nav aria-label="Pagination" className="mt-8 flex items-center justify-between"><button className="button-secondary" type="button" disabled={safePage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>{labels.previous}</button><span className="text-sm text-text-muted">{safePage} / {pageCount}</span><button className="button-secondary" type="button" disabled={safePage === pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))}>{labels.next}</button></nav> : null}
    </div>
  );
}
