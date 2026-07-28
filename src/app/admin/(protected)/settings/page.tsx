import { Settings } from "lucide-react";
import { requireAdminPage } from "@/lib/auth/admin";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { ContactLinksForm } from "@/components/admin/ContactLinksForm";
import { createClient } from "@/lib/supabase/server";
import { siteConfig } from "@/config/site";

export const metadata = { title: "Paramètres du Compte" };

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

  return (
    <div className="max-w-3xl w-full mx-auto animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-8 border-b border-border/50 pb-6">
        <div className="p-3 bg-surface border border-border/50 rounded-sm">
          <Settings className="size-6 text-accent" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary uppercase tracking-tight">Paramètres du Compte</h1>
          <p className="font-mono text-xs text-text-secondary uppercase tracking-widest mt-1">Gérez vos informations de connexion</p>
        </div>
      </div>

      <div className="bg-surface rounded-sm border border-border/50 p-6 shadow-sm mb-8">
        <h2 className="font-display text-lg font-semibold text-text-primary mb-6">Liens de Contact</h2>
        <ContactLinksForm 
          currentEmail={currentEmail} 
          currentGithub={currentGithub} 
          currentLinkedin={currentLinkedin} 
        />
      </div>

      <div className="bg-surface rounded-sm border border-border/50 p-6 shadow-sm">
        <h2 className="font-display text-lg font-semibold text-text-primary mb-6">Informations d&apos;identification</h2>
        <SettingsForm currentEmail={user?.email || ""} />
      </div>
    </div>
  );
}
