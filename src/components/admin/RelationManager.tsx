"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Link2, Trash2 } from "lucide-react";

export type RelationOption = { id: string; label: string };
export type RelationValue = { leftId: string; rightId: string };

type RelationManagerProps = {
  kind: "project-skills" | "blog-tags";
  title: string;
  description: string;
  leftLabel: string;
  rightLabel: string;
  leftOptions: RelationOption[];
  rightOptions: RelationOption[];
  initialRelations: RelationValue[];
};

export function RelationManager(props: RelationManagerProps) {
  const [relations, setRelations] = useState(props.initialRelations);
  const [leftId, setLeftId] = useState(props.leftOptions[0]?.id ?? "");
  const [rightId, setRightId] = useState(props.rightOptions[0]?.id ?? "");
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const leftLabels = useMemo(() => new Map(props.leftOptions.map((option) => [option.id, option.label])), [props.leftOptions]);
  const rightLabels = useMemo(() => new Map(props.rightOptions.map((option) => [option.id, option.label])), [props.rightOptions]);

  async function mutate(method: "POST" | "DELETE", relation: RelationValue) {
    setPending(true);
    setFeedback(null);
    try {
      const response = await fetch(`/api/admin/relations/${props.kind}`, {
        method,
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(relation),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Opération impossible.");
      if (method === "POST") setRelations((current) => [...current, relation]);
      else setRelations((current) => current.filter((item) => item.leftId !== relation.leftId || item.rightId !== relation.rightId));
      setFeedback(method === "POST" ? "Association ajoutée." : "Association supprimée.");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Opération impossible.");
    } finally {
      setPending(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!leftId || !rightId || relations.some((item) => item.leftId === leftId && item.rightId === rightId)) return;
    void mutate("POST", { leftId, rightId });
  }

  return (
    <div>
      <header className="max-w-3xl"><p className="eyebrow">Relations de contenu</p><h1 className="mt-3 text-3xl font-semibold sm:text-4xl">{props.title}</h1><p className="mt-3 leading-7 text-text-secondary">{props.description}</p></header>
      <form onSubmit={submit} className="mt-8 grid gap-4 rounded-xl border border-border bg-surface p-5 md:grid-cols-[1fr_1fr_auto] md:items-end">
        <label className="grid gap-2 text-sm font-semibold text-text-primary">{props.leftLabel}<select value={leftId} onChange={(event) => setLeftId(event.target.value)} className="min-h-11 px-3 font-normal"><option value="">Sélectionner</option>{props.leftOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}</select></label>
        <label className="grid gap-2 text-sm font-semibold text-text-primary">{props.rightLabel}<select value={rightId} onChange={(event) => setRightId(event.target.value)} className="min-h-11 px-3 font-normal"><option value="">Sélectionner</option>{props.rightOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}</select></label>
        <button type="submit" className="button-primary" disabled={pending || !leftId || !rightId}><Link2 aria-hidden="true" className="size-4" />Associer</button>
      </form>
      <p aria-live="polite" className="mt-4 min-h-6 text-sm text-text-muted">{feedback ?? `${relations.length} association${relations.length > 1 ? "s" : ""}`}</p>
      {relations.length ? <ul className="mt-3 grid gap-3">{relations.map((relation) => <li key={`${relation.leftId}:${relation.rightId}`} className="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface p-4"><div className="min-w-0"><p className="truncate font-semibold text-text-primary">{leftLabels.get(relation.leftId) ?? relation.leftId}</p><p className="mt-1 truncate text-sm text-text-muted">{rightLabels.get(relation.rightId) ?? relation.rightId}</p></div><button type="button" disabled={pending} onClick={() => { if (window.confirm("Supprimer cette association ?")) void mutate("DELETE", relation); }} className="grid size-11 shrink-0 place-items-center rounded-lg border border-border text-danger hover:border-danger" aria-label="Supprimer l’association"><Trash2 aria-hidden="true" className="size-4" /></button></li>)}</ul> : <div className="mt-3 rounded-xl border border-dashed border-border-strong p-8 text-center text-text-muted">Aucune association.</div>}
    </div>
  );
}
