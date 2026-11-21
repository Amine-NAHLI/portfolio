import Link from "next/link";
import { Settings, Eye, Globe, Shield, FileText, ArrowUpRight } from "lucide-react";
import { requireAdminPage } from "@/lib/auth/admin";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { ContactLinksForm } from "@/components/admin/ContactLinksForm";
import { SectionVisibilityForm } from "@/components/admin/SectionVisibilityForm";
import { createClient } from "@/lib/supabase/server";
import { siteConfig } from "@/config/site";

export const metadata = { title: "Paramètres & Visibilité — Admin" };

export default async function SettingsPage() {
  const context = await requireAdminPage();
  const { data: { user } } = await context.supabase.auth.getUser();

  const supabaseServer = await createClient();
  const { data: linksData } = await supabaseServer
    .from("site_settings")
    .select("value")
    .eq("key", "contact_links")
    .single();

  const savedLinks = (linksData?.value as Record<string, string>) || {};
  const currentEmail = savedLinks.email || siteConfig.links.email.replace("mailto:", "");
  const currentGithub = savedLinks.github || siteConfig.links.github;
  const currentLinkedin = savedLinks.linkedin || siteConfig.links.linkedin;

  const { data: visibilityData } = await supabaseServer
    .from("site_settings")
    .select("value")
    .eq("key", "sections_visibility")
    .single();
    
  const currentVisibility = (visibilityData?.value as {
    github: boolean;
    projects: boolean;
    journey: boolean;
    certifications: boolean;
    testimonials: boolean;
    contact: boolean;
  }) || {
    github: true,
    projects: true,
    journey: true,
    certifications: true,
    testimonials: true,
    contact: true,
  };

  return (
    <div className="max-w-4xl w-full mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-accent/15 border border-accent/30 rounded-2xl text-accent shadow-md">
            <Settings className="size-6" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-text-primary tracking-tight">
              Paramètres & Visibilité
            </h1>
            <p className="font-mono text-xs text-text-muted mt-0.5">
              Contrôlez l&apos;activation des sections, vos coordonnées et la sécurité de votre compte
            </p>
          </div>
        </div>

        {/* Quick Link to CV Manager */}
        <Link
          href="/admin/cv"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono text-text-primary transition-all shrink-0"
        >
          <FileText className="size-3.5 text-accent" />
          <span>Gestionnaire de CV (PDF)</span>
          <ArrowUpRight className="size-3 text-text-muted" />
        </Link>
      </div>

      {/* Section 1: Visibilité des Sections du Site */}
      <div className="rounded-2xl border border-white/10 bg-surface/60 backdrop-blur-xl p-6 sm:p-7 shadow-xl space-y-5">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="grid size-9 place-items-center rounded-xl border border-cyan-400/30 bg-cyan-400/15 text-cyan-400">
            <Eye className="size-4" />
          </div>
          <div>
            <h2 className="font-display text-base font-bold text-text-primary">
              Visibilité des Sections du Portfolio
            </h2>
            <p className="font-mono text-xs text-text-muted">
              Activez ou désactivez instantanément l&apos;affichage public de chaque section sur la page d&apos;accueil
            </p>
          </div>
        </div>
        <SectionVisibilityForm currentVisibility={currentVisibility} />
      </div>

      {/* Section 2: Liens de Contact & Profils Réseaux */}
      <div className="rounded-2xl border border-white/10 bg-surface/60 backdrop-blur-xl p-6 sm:p-7 shadow-xl space-y-5">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="grid size-9 place-items-center rounded-xl border border-accent/30 bg-accent/15 text-accent">
            <Globe className="size-4" />
          </div>
          <div>
            <h2 className="font-display text-base font-bold text-text-primary">
              Coordonnées & Liens Publics
            </h2>
            <p className="font-mono text-xs text-text-muted">
              Adresse email de réception du formulaire de contact, liens GitHub et LinkedIn
            </p>
          </div>
        </div>
        <ContactLinksForm 
          currentEmail={currentEmail} 
          currentGithub={currentGithub} 
          currentLinkedin={currentLinkedin} 
        />
      </div>

      {/* Section 3: Sécurité du Compte */}
      <div className="rounded-2xl border border-white/10 bg-surface/60 backdrop-blur-xl p-6 sm:p-7 shadow-xl space-y-5">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="grid size-9 place-items-center rounded-xl border border-purple-500/30 bg-purple-500/15 text-purple-400">
            <Shield className="size-4" />
          </div>
          <div>
            <h2 className="font-display text-base font-bold text-text-primary">
              Sécurité & Compte Administrateur
            </h2>
            <p className="font-mono text-xs text-text-muted">
              Modifier votre identifiant email ou définir un nouveau mot de passe d&apos;accès
            </p>
          </div>
        </div>
        <SettingsForm currentEmail={user?.email || ""} />
      </div>

    </div>
  );
}
