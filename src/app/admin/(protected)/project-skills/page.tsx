import { RelationManager } from "@/components/admin/RelationManager";
import { requireAdminPage } from "@/lib/auth/admin";

export const metadata = { title: "Technologies des projets" };

export default async function ProjectSkillsPage() {
  const context = await requireAdminPage();
  const [{ data: projects }, { data: skills }, { data: relations }] = await Promise.all([
    context.supabase.from("projects").select("id, slug").order("slug"),
    context.supabase.from("skills").select("id, name").order("name"),
    context.supabase.from("project_skills").select("project_id, skill_id"),
  ]);
  return <RelationManager kind="project-skills" title="Technologies des projets" description="Associez uniquement les compétences réellement mobilisées dans chaque projet." leftLabel="Projet" rightLabel="Compétence" leftOptions={(projects ?? []).map((item) => ({ id: item.id, label: item.slug }))} rightOptions={(skills ?? []).map((item) => ({ id: item.id, label: item.name }))} initialRelations={(relations ?? []).map((item) => ({ leftId: item.project_id, rightId: item.skill_id }))} />;
}
