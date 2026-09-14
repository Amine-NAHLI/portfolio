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
          className="flex h-10 w-full rounded-sm border border-border/50 bg-surface px-3 py-2 text-sm placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center justify-center rounded-sm bg-surface-raised px-4 py-2 text-sm font-medium transition-colors hover:bg-border/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <Plus className="size-4" />
        </button>
      </div>

      <div className="flex flex-wrap gap-3 p-4 rounded-sm border border-border/50 bg-surface min-h-[100px]">
        {technologies.length === 0 ? (
          <p className="text-sm text-text-muted italic w-full text-center py-4">Aucune technologie ajoutée.</p>
        ) : (
          technologies.map((tech) => (
            <div key={tech} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-raised border border-border/50 group">
              <SkillIcon name={tech} className="size-4" />
              <span className="text-sm font-medium">{tech}</span>
              <button
                type="button"
                onClick={() => handleRemove(tech)}
                className="ml-1 text-text-muted hover:text-danger focus:outline-none"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      {status?.type === "error" && (
        <p className="text-sm text-danger font-medium">{status.message}</p>
      )}
      {status?.type === "success" && (
        <p className="text-sm text-success font-medium">{status.message}</p>
      )}

      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="inline-flex items-center justify-center rounded-sm bg-accent px-6 py-2.5 text-sm font-medium text-text-on-accent transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
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
