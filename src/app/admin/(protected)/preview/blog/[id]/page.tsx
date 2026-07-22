import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { MarkdownContent } from "@/features/blog/markdown";
import { requireAdminPage } from "@/lib/auth/admin";

type BlogPreviewPageProps = { params: Promise<{ id: string }> };

export const metadata = { title: "Prévisualisation de l’article" };

export default async function BlogPreviewPage({ params }: BlogPreviewPageProps) {
  const { id } = await params;
  const context = await requireAdminPage();
  const { data: post, error } = await context.supabase.from("blog_posts").select("*").eq("id", id).maybeSingle();
  if (error || !post) notFound();
  const { data: translations } = await context.supabase.from("blog_post_translations").select("*").eq("blog_post_id", id).order("locale");

  return (
    <div>
      <Link href="/admin/blog" className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-semibold text-text-secondary hover:text-text-primary"><ArrowLeft aria-hidden="true" className="size-4" />Retour aux articles</Link>
      <header className="mt-6 border-b border-border pb-8"><div className="flex flex-wrap gap-3"><span className="rounded-full border border-warning/30 bg-warning/10 px-3 py-1 font-mono text-xs font-bold uppercase text-warning">Prévisualisation privée</span><span className="rounded-full border border-border px-3 py-1 text-xs text-text-muted">{post.publication_status}</span></div><h1 className="mt-5 text-4xl font-semibold">{post.slug}</h1></header>
      {!translations?.length ? <div className="mt-8 rounded-xl border border-warning/30 bg-warning/10 p-5 text-warning">Aucune traduction n’est encore disponible.</div> : (
        <div className="mt-8 grid gap-8">
          {translations.map((translation) => <article key={translation.id} lang={translation.locale} className="surface-card p-6 sm:p-9"><div className="flex justify-between gap-4"><p className="eyebrow">{translation.locale === "fr" ? "Français" : "English"}</p><span className="text-xs text-text-muted">{translation.review_status}</span></div><h2 className="mt-5 text-3xl font-semibold">{translation.title}</h2><p className="mt-3 text-lg leading-8 text-text-secondary">{translation.excerpt}</p><div className="mt-8 border-t border-border pt-8"><MarkdownContent markdown={translation.markdown} locale={translation.locale === "en" ? "en" : "fr"} /></div></article>)}
        </div>
      )}
    </div>
  );
}
