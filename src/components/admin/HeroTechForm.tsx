"use client";

import { useState, useTransition } from "react";
import { saveHeroTechnologies } from "@/app/admin/(protected)/hero-tech/actions";
import { Loader2, Plus, X, Save } from "lucide-react";
import SkillIcon from "@/components/ui/SkillIcon";

type Props = {
  initialTechnologies: string[];
};

export function HeroTechForm({ initialTechnologies }: Props) {
  const [technologies, setTechnologies] = useState<string[]>(initialTechnologies);
  const [newValue, setNewValue] = useState("");
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleAdd = () => {
    const val = newValue.trim().toLowerCase();
    if (val && !technologies.includes(val)) {
      setTechnologies([...technologies, val]);
      setNewValue("");
      setStatus(null);
    }
  };

  const handleRemove = (tech: string) => {
    setTechnologies(technologies.filter((t) => t !== tech));
    setStatus(null);
  };

  const handleSave = () => {
    startTransition(async () => {
      setStatus(null);
      const res = await saveHeroTechnologies(technologies);
      if (res.error) {
        setStatus({ type: "error", message: res.error });
      } else {
        setStatus({ type: "success", message: "Technologies enregistrées avec succès !" });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Ex: react, typescript, python..."
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
          className="flex h-11 w-full rounded-xl border border-white/10 bg-surface/70 px-4 text-sm placeholder:text-text-muted focus-visible:border-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent disabled:opacity-50"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center justify-center rounded-xl bg-surface-raised border border-white/10 px-5 text-sm font-semibold transition-all hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <Plus className="size-4" />
        </button>
      </div>

      <div className="flex flex-wrap gap-2.5 p-5 rounded-2xl border border-white/10 bg-surface/70 backdrop-blur-xl min-h-[100px]">
        {technologies.length === 0 ? (
          <p className="text-sm text-text-muted italic w-full text-center py-6">Aucune technologie ajoutée.</p>
        ) : (
          technologies.map((tech) => (
            <div key={tech} className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-raised/80 border border-white/10 text-text-primary text-xs font-semibold shadow-sm transition-all hover:border-accent/40">
              <SkillIcon name={tech} className="size-4" />
              <span className="capitalize">{tech}</span>
              <button
                type="button"
                onClick={() => handleRemove(tech)}
                className="ml-1 text-text-muted hover:text-danger focus:outline-none transition-colors"
                aria-label={`Supprimer ${tech}`}
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      {status?.type === "error" && (
        <p className="text-sm text-danger font-medium rounded-xl border border-danger/30 bg-danger/10 p-3">{status.message}</p>
      )}
      {status?.type === "success" && (
        <p className="text-sm text-emerald-400 font-medium rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">{status.message}</p>
      )}

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="inline-flex items-center justify-center rounded-xl bg-accent px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-text-on-accent shadow-lg shadow-accent/20 transition-all hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Sauvegarde...
            </>
          ) : (
            <>
              <Save className="mr-2 size-4" />
              Enregistrer
            </>
          )}
        </button>
      </div>
    </div>
  );
}
