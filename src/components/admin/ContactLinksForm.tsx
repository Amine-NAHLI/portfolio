"use client";

import { useActionState } from "react";
import { Save, AlertCircle, CheckCircle2 } from "lucide-react";
import { saveContactLinks } from "@/app/admin/(protected)/settings/actions";

export function ContactLinksForm({ 
  currentEmail, 
  currentGithub, 
  currentLinkedin 
}: { 
  currentEmail: string; 
  currentGithub: string; 
  currentLinkedin: string; 
}) {
  const [state, formAction, isPending] = useActionState(saveContactLinks, null);

  return (
    <form action={formAction} className="grid gap-6">
      {state?.error && (
        <div className="flex items-center gap-3 p-4 bg-danger/10 border border-danger/20 rounded-sm text-danger text-sm">
          <AlertCircle className="size-5 shrink-0" />
          <p>{state.error}</p>
        </div>
      )}
      
      {state?.success && (
        <div className="flex items-center gap-3 p-4 bg-success/10 border border-success/20 rounded-sm text-success text-sm">
          <CheckCircle2 className="size-5 shrink-0" />
          <p>{state.message}</p>
        </div>
      )}

      <div className="grid gap-2">
        <label htmlFor="contact_email" className="font-mono text-xs uppercase tracking-widest text-text-secondary">Email de contact</label>
        <p className="text-xs text-text-muted mb-2">L&apos;adresse email affichée sur le site.</p>
        <input 
          type="email" 
          id="contact_email" 
          name="email" 
          defaultValue={currentEmail}
          className="w-full bg-surface-subtle border border-border/50 rounded-sm px-4 py-2 font-body text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="github" className="font-mono text-xs uppercase tracking-widest text-text-secondary">Lien GitHub</label>
        <p className="text-xs text-text-muted mb-2">L&apos;URL complète de votre profil GitHub.</p>
        <input 
          type="url" 
          id="github" 
          name="github" 
          defaultValue={currentGithub}
          className="w-full bg-surface-subtle border border-border/50 rounded-sm px-4 py-2 font-body text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="linkedin" className="font-mono text-xs uppercase tracking-widest text-text-secondary">Lien LinkedIn</label>
        <p className="text-xs text-text-muted mb-2">L&apos;URL complète de votre profil LinkedIn.</p>
        <input 
          type="url" 
          id="linkedin" 
          name="linkedin" 
          defaultValue={currentLinkedin}
          className="w-full bg-surface-subtle border border-border/50 rounded-sm px-4 py-2 font-body text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      <div className="pt-4 border-t border-border/50">
        <button 
          type="submit" 
          disabled={isPending}
          className="flex items-center justify-center gap-2 px-6 py-2 bg-accent text-bg-page font-mono text-xs font-bold uppercase tracking-wider rounded-sm hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
             <span className="size-4 animate-spin rounded-full border-2 border-bg-page border-r-transparent" />
          ) : (
            <Save className="size-4" />
          )}
          Enregistrer les liens
        </button>
      </div>
    </form>
  );
}
