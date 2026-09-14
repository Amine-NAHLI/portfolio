import { requireAdminPage } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";
import { HeroTechForm } from "@/components/admin/HeroTechForm";
import { Orbit } from "lucide-react";
import { getPublishedProjects } from "@/features/projects/data";

export const metadata = { title: "Technologies Accueil" };

export default async function HeroTechPage() {
  await requireAdminPage();
  const supabase = await createClient();
  
  const { data } = await supabase.from("site_settings").select("value").eq("key", "hero_technologies").single();
  let initialTechnologies: string[] = [];

  if (data?.value && Array.isArray(data.value)) {
    initialTechnologies = data.value as string[];
  } else {
    // Fallback to computing from projects if never saved
    const projects = await getPublishedProjects("fr");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialTechnologies = Array.from(new Set(projects.flatMap((p: any) => p.coreTechnologies || p.technologies || []))).filter(Boolean) as string[];
  }

  return (
    <div className="max-w-4xl w-full mx-auto animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-8 border-b border-border/50 pb-6">
        <div className="p-3 bg-surface border border-border/50 rounded-sm">
          <Orbit className="size-6 text-accent" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary uppercase tracking-tight">Technologies de l&apos;Accueil</h1>
          <p className="font-mono text-xs text-text-secondary uppercase tracking-widest mt-1">Gérez le cercle des technologies (TechCore)</p>
        </div>
      </div>

      <div className="bg-surface rounded-sm border border-border/50 p-6 shadow-sm">
        <p className="text-sm text-text-secondary leading-relaxed mb-6">
          Ces technologies sont affichées dans l&apos;animation circulaire sur la page d&apos;accueil. 
          Tapez le nom d&apos;une technologie (ex: <code>react</code>, <code>python</code>, <code>docker</code>) pour l&apos;ajouter. 
          Cette liste est totalement indépendante des technologies assignées à vos projets.
        </p>

        <HeroTechForm initialTechnologies={initialTechnologies} />
      </div>
    </div>
  );
}
