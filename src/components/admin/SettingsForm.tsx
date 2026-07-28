"use client";

import { useActionState } from "react";
import { Save, AlertCircle, CheckCircle2 } from "lucide-react";
import { updateAccountDetails } from "@/app/admin/(protected)/settings/actions";

export function SettingsForm({ currentEmail }: { currentEmail: string }) {
  const [state, formAction, isPending] = useActionState(updateAccountDetails, null);

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
        <label htmlFor="email" className="font-mono text-xs uppercase tracking-widest text-text-secondary">Adresse Email</label>
        <p className="text-xs text-text-muted mb-2">Laissez vide pour conserver l&apos;email actuel.</p>
        <input 
          type="email" 
          id="email" 
          name="email" 
          placeholder={currentEmail}
          className="w-full bg-surface-subtle border border-border/50 rounded-sm px-4 py-2 font-body text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="password" className="font-mono text-xs uppercase tracking-widest text-text-secondary">Nouveau Mot de passe</label>
        <p className="text-xs text-text-muted mb-2">Laissez vide pour conserver le mot de passe actuel. Minimum 6 caractères.</p>
        <input 
          type="password" 
          id="password" 
          name="password" 
          minLength={6}
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
          Enregistrer les modifications
        </button>
      </div>
    </form>
  );
}
