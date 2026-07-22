import { RelationManager } from "@/components/admin/RelationManager";
import { requireAdminPage } from "@/lib/auth/admin";

export const metadata = { title: "Tags des articles" };

export default async function BlogTagsPage() {
  const context = await requireAdminPage();
  const [{ data: posts }, { data: tags }, { data: relations }] = await Promise.all([
    context.supabase.from("blog_posts").select("id, slug").order("slug"),
    context.supabase.from("tags").select("id, name").order("name"),
    context.supabase.from("blog_post_tags").select("blog_post_id, tag_id"),
  ]);
  return <RelationManager kind="blog-tags" title="Tags des articles" description="Reliez les articles à des tags précis pour la recherche et les recommandations." leftLabel="Article" rightLabel="Tag" leftOptions={(posts ?? []).map((item) => ({ id: item.id, label: item.slug }))} rightOptions={(tags ?? []).map((item) => ({ id: item.id, label: item.name }))} initialRelations={(relations ?? []).map((item) => ({ leftId: item.blog_post_id, rightId: item.tag_id }))} />;
}
