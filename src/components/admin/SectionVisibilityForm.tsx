"use client";

import { useActionState } from "react";
import { saveSectionsVisibility } from "@/app/admin/(protected)/settings/actions";
import { Loader2, CheckCircle2 } from "lucide-react";

type VisibilitySettings = {
  github: boolean;
  projects: boolean;
  journey: boolean;
  certifications: boolean;
  testimonials: boolean;
  contact: boolean;
};

type Props = {
  currentVisibility: VisibilitySettings;
};

export function SectionVisibilityForm({ currentVisibility }: Props) {
  const [state, formAction, isPending] = useActionState(saveSectionsVisibility, null);

  return (
    <form action={formAction} className="space-y-6">
      <p className="text-sm text-text-secondary mb-4">
        Activez ou désactivez les sections qui seront affichées sur votre portfolio public. La section &quot;Accueil&quot; (Hero) reste toujours visible.
      </p>

      {state?.error && (
        <div className="rounded-sm bg-danger/10 p-4 border border-danger/20 flex items-start gap-3">
          <div className="text-sm font-medium text-danger">{state.error}</div>
        </div>
      )}

      {state?.success && (
        <div className="rounded-sm bg-success/10 p-4 border border-success/20 flex items-start gap-3">
          <CheckCircle2 className="size-5 text-success shrink-0 mt-0.5" />
          <div className="text-sm font-medium text-success">{state.message}</div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <ToggleItem name="github" label="Contributions GitHub" defaultChecked={currentVisibility.github} />
        <ToggleItem name="projects" label="Projets" defaultChecked={currentVisibility.projects} />
        <ToggleItem name="journey" label="Parcours (Journey)" defaultChecked={currentVisibility.journey} />
        <ToggleItem name="certifications" label="Certifications" defaultChecked={currentVisibility.certifications} />
        <ToggleItem name="testimonials" label="Avis Clients" defaultChecked={currentVisibility.testimonials} />
        <ToggleItem name="contact" label="Contact" defaultChecked={currentVisibility.contact} />
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center rounded-sm bg-accent px-6 py-2.5 text-sm font-medium text-text-on-accent transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Sauvegarde...
            </>
          ) : (
            "Enregistrer les modifications"
          )}
        </button>
      </div>
    </form>
  );
}

function ToggleItem({ name, label, defaultChecked }: { name: string; label: string; defaultChecked: boolean }) {
  return (
    <label className="flex items-center justify-between p-4 rounded-md border border-border/50 bg-bg-page hover:border-accent/50 cursor-pointer transition-colors group">
      <span className="text-sm font-medium text-text-primary flex items-center gap-2">
        {label}
      </span>
      <div className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" name={name} defaultChecked={defaultChecked} className="sr-only peer" />
        <div className="w-11 h-6 bg-surface-raised peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent border border-border/50"></div>
      </div>
    </label>
  );
}
