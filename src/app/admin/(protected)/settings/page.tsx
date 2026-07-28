import { Settings } from "lucide-react";
import { requireAdminPage } from "@/lib/auth/admin";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const metadata = { title: "Paramètres du Compte" };

export default async function SettingsPage() {
  const context = await requireAdminPage();
  const { data: { user } } = await context.supabase.auth.getUser();

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

      <div className="bg-surface rounded-sm border border-border/50 p-6 shadow-sm">
        <h2 className="font-display text-lg font-semibold text-text-primary mb-6">Informations d'identification</h2>
        <SettingsForm currentEmail={user?.email || ""} />
      </div>
    </div>
  );
}
