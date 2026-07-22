"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { Pencil, Plus, Search, Trash2, X } from "lucide-react";
import type { AdminField, AdminResourceConfig } from "@/features/admin/resources";
import type { AdminRecord } from "@/lib/admin/content-repository";

const PAGE_SIZE = 20;

type AdminResourceManagerProps = {
  config: AdminResourceConfig;
  initialRecords: AdminRecord[];
  loadError: boolean;
  toolbar?: ReactNode;
};

type EditorState = { mode: "create"; record: null } | { mode: "edit"; record: AdminRecord };

export function AdminResourceManager({ config, initialRecords, loadError, toolbar }: AdminResourceManagerProps) {
  const [records, setRecords] = useState(initialRecords);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | number | null>(null);

  const statusField = config.fields.find((field) => ["publication_status", "review_status", "status"].includes(field.name));
  const normalizedQuery = query.trim().toLocaleLowerCase("fr");
  const filteredRecords = useMemo(() => records.filter((record) => {
    const matchesQuery = !normalizedQuery || config.searchFields.some((field) => formatCell(record[field]).toLocaleLowerCase("fr").includes(normalizedQuery));
    const matchesStatus = status === "all" || (statusField ? record[statusField.name] === status : true);
    return matchesQuery && matchesStatus;
  }), [config.searchFields, normalizedQuery, records, status, statusField]);
  const pageCount = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const visibleRecords = filteredRecords.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function replaceRecord(nextRecord: AdminRecord) {
    const key = config.primaryKey;
    setRecords((current) => current.map((record) => record[key] === nextRecord[key] ? nextRecord : record));
  }

  async function deleteRecord(record: AdminRecord) {
    const id = record[config.primaryKey];
    if (typeof id !== "string" && typeof id !== "number") return;
    const title = formatCell(record[config.titleField]) || String(id);
    if (!window.confirm(`Supprimer définitivement « ${title} » ? Cette action ne peut pas être annulée.`)) return;

    setPendingDelete(id);
    setFeedback(null);
    try {
      const response = await fetch(`/api/admin/content/${config.key}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ id }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Suppression impossible.");
      setRecords((current) => current.filter((item) => item[config.primaryKey] !== id));
      setFeedback(`${config.singular} supprimé avec succès.`);
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Suppression impossible.");
    } finally {
      setPendingDelete(null);
    }
  }

  return (
    <div>
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <p className="eyebrow">Gestion de contenu</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">{config.label}</h1>
          <p className="mt-3 text-sm leading-6 text-text-secondary sm:text-base">{config.description}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          {toolbar}
          {config.canCreate ? (
            <button type="button" className="button-primary" onClick={() => setEditor({ mode: "create", record: null })}>
              <Plus aria-hidden="true" className="size-4" /> Ajouter
            </button>
          ) : null}
        </div>
      </header>

      <div className="mt-8 flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 md:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Rechercher dans {config.label.toLocaleLowerCase("fr")}</span>
          <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
          <input
            type="search"
            value={query}
            onChange={(event) => { setQuery(event.target.value); setPage(1); }}
            placeholder="Rechercher…"
            className="min-h-11 pl-10 pr-4 text-sm"
          />
        </label>
        {statusField?.options ? (
          <label className="md:w-56">
            <span className="sr-only">Filtrer par statut</span>
            <select className="min-h-11 px-3 text-sm" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}>
              <option value="all">Tous les statuts</option>
              {statusField.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
        ) : null}
      </div>

      <div aria-live="polite" className="mt-4 min-h-6 text-sm text-text-secondary">
        {feedback ? feedback : `${filteredRecords.length} résultat${filteredRecords.length > 1 ? "s" : ""}`}
      </div>

      {loadError ? (
        <div className="mt-4 rounded-xl border border-danger/30 bg-danger/10 p-5 text-sm text-danger" role="alert">
          Les données n’ont pas pu être chargées. Vérifiez que les migrations sont appliquées et que votre compte figure dans la liste des administrateurs.
        </div>
      ) : visibleRecords.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-border-strong p-10 text-center">
          <p className="font-semibold text-text-primary">Aucun contenu à afficher</p>
          <p className="mt-2 text-sm text-text-muted">Modifiez les filtres ou ajoutez le premier contenu autorisé.</p>
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[48rem] border-collapse text-left text-sm">
            <thead className="bg-surface-subtle text-xs uppercase tracking-wider text-text-muted">
              <tr>
                {config.listFields.map((field) => <th key={field} scope="col" className="border-b border-border px-4 py-3 font-semibold">{field.replaceAll("_", " ")}</th>)}
                {(config.canUpdate || config.canDelete) ? <th scope="col" className="border-b border-border px-4 py-3 text-right font-semibold">Actions</th> : null}
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {visibleRecords.map((record) => {
                const rawId = record[config.primaryKey];
                const id = typeof rawId === "string" || typeof rawId === "number" ? rawId : JSON.stringify(rawId);
                return (
                  <tr key={id} className="align-top hover:bg-surface-raised/50">
                    {config.listFields.map((field) => <td key={field} className="max-w-72 px-4 py-3 text-text-secondary"><span className="line-clamp-3">{formatCell(record[field]) || "—"}</span></td>)}
                    {(config.canUpdate || config.canDelete) ? (
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          {(config.key === "projects" || config.key === "blog") && typeof rawId === "string" ? (
                            <Link href={`/admin/preview/${config.key}/${rawId}`} className="grid size-10 place-items-center rounded-lg border border-border text-text-secondary hover:border-border-strong hover:text-text-primary" aria-label={`Prévisualiser ${formatCell(record[config.titleField])}`}>
                              <Search aria-hidden="true" className="size-4" />
                            </Link>
                          ) : null}
                          {config.canUpdate ? (
                            <button type="button" className="grid size-10 place-items-center rounded-lg border border-border text-text-secondary hover:border-border-strong hover:text-text-primary" onClick={() => setEditor({ mode: "edit", record })} aria-label={`Modifier ${formatCell(record[config.titleField])}`}>
                              <Pencil aria-hidden="true" className="size-4" />
                            </button>
                          ) : null}
                          {config.canDelete ? (
                            <button disabled={pendingDelete === rawId} type="button" className="grid size-10 place-items-center rounded-lg border border-border text-danger hover:border-danger disabled:opacity-50" onClick={() => deleteRecord(record)} aria-label={`Supprimer ${formatCell(record[config.titleField])}`}>
                              <Trash2 aria-hidden="true" className="size-4" />
                            </button>
                          ) : null}
                        </div>
                      </td>
                    ) : null}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {pageCount > 1 ? (
        <nav aria-label="Pagination" className="mt-5 flex items-center justify-between gap-4">
          <button type="button" className="button-secondary" disabled={safePage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Précédent</button>
          <span className="text-sm text-text-muted">Page {safePage} sur {pageCount}</span>
          <button type="button" className="button-secondary" disabled={safePage === pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))}>Suivant</button>
        </nav>
      ) : null}

      {editor ? (
        <ResourceEditor
          key={`${editor.mode}-${editor.mode === "edit" ? String(editor.record[config.primaryKey]) : "new"}`}
          config={config}
          editor={editor}
          onClose={() => setEditor(null)}
          onCreated={(record) => { setRecords((current) => [record, ...current]); setEditor(null); setFeedback(`${config.singular} ajouté avec succès.`); }}
          onUpdated={(record) => { replaceRecord(record); setEditor(null); setFeedback(`${config.singular} mis à jour avec succès.`); }}
        />
      ) : null}
    </div>
  );
}

type ResourceEditorProps = {
  config: AdminResourceConfig;
  editor: EditorState;
  onClose: () => void;
  onCreated: (record: AdminRecord) => void;
  onUpdated: (record: AdminRecord) => void;
};

function ResourceEditor({ config, editor, onClose, onCreated, onUpdated }: ResourceEditorProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [values, setValues] = useState<Record<string, string | boolean>>(() => createInitialValues(config, editor.record));
  const [dirty, setDirty] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    return () => dialog?.close();
  }, []);

  useEffect(() => {
    if (!dirty) return;
    const preventExit = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", preventExit);
    return () => window.removeEventListener("beforeunload", preventExit);
  }, [dirty]);

  function closeSafely() {
    if (dirty && !window.confirm("Abandonner les modifications non enregistrées ?")) return;
    onClose();
  }

  function setField(field: AdminField, value: string | boolean) {
    setValues((current) => ({ ...current, [field.name]: value }));
    setDirty(true);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const payload = serializeValues(config, values);
      const body: Record<string, unknown> = { values: payload };
      if (editor.mode === "edit") body.id = editor.record[config.primaryKey];
      const response = await fetch(`/api/admin/content/${config.key}`, {
        method: editor.mode === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body),
      });
      const result = await response.json() as { record?: AdminRecord; error?: string };
      if (!response.ok || !result.record) throw new Error(result.error ?? "Enregistrement impossible.");
      setDirty(false);
      if (editor.mode === "create") onCreated(result.record);
      else onUpdated(result.record);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Enregistrement impossible.");
      setSubmitting(false);
    }
  }

  return (
    <dialog ref={dialogRef} aria-labelledby="resource-editor-title" onCancel={(event) => { event.preventDefault(); closeSafely(); }} className="m-auto max-h-[92vh] w-[min(48rem,calc(100%-2rem))] overflow-hidden rounded-2xl border border-border bg-surface-raised p-0 text-text-secondary shadow-2xl">
      <div className="flex items-start justify-between gap-5 border-b border-border px-5 py-4 sm:px-7">
        <div>
          <p className="eyebrow">{editor.mode === "create" ? "Nouveau contenu" : "Édition"}</p>
          <h2 id="resource-editor-title" className="mt-1 text-xl font-semibold">{editor.mode === "create" ? `Ajouter un ${config.singular}` : `Modifier le ${config.singular}`}</h2>
        </div>
        <button type="button" onClick={closeSafely} className="grid size-11 shrink-0 place-items-center rounded-lg border border-border text-text-secondary hover:text-text-primary" aria-label="Fermer sans enregistrer"><X aria-hidden="true" className="size-5" /></button>
      </div>

      <form onSubmit={submit} className="flex max-h-[calc(92vh-5rem)] flex-col">
        <div className="grid gap-5 overflow-y-auto px-5 py-6 sm:grid-cols-2 sm:px-7">
          {config.fields.map((field) => <ResourceField key={field.name} field={field} value={values[field.name] ?? ""} onChange={(value) => setField(field, value)} />)}
          {error ? <p className="rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger sm:col-span-2" role="alert">{error}</p> : null}
        </div>
        <div className="flex flex-col-reverse gap-3 border-t border-border bg-surface-subtle px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
          <button type="button" className="button-secondary" onClick={closeSafely}>Annuler</button>
          <button type="submit" className="button-primary" disabled={submitting}>{submitting ? "Enregistrement…" : "Enregistrer"}</button>
        </div>
      </form>
    </dialog>
  );
}

function ResourceField({ field, value, onChange }: { field: AdminField; value: string | boolean; onChange: (value: string | boolean) => void }) {
  if (field.type === "checkbox") {
    return (
      <label className="flex min-h-12 items-center gap-3 rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-text-primary">
        <input type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(event.target.checked)} disabled={field.readOnly} className="size-5 w-auto accent-accent" />
        {field.label}
      </label>
    );
  }

  const common = {
    name: field.name,
    required: field.required,
    disabled: field.readOnly,
    value: String(value),
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => onChange(event.target.value),
  };
  const fullWidth = field.type === "textarea" || field.type === "json";

  return (
    <label className={`grid content-start gap-2 text-sm font-semibold text-text-primary ${fullWidth ? "sm:col-span-2" : ""}`}>
      <span>{field.label}{field.required ? <span aria-hidden="true" className="text-danger"> *</span> : null}</span>
      {field.type === "textarea" || field.type === "json" ? (
        <textarea {...common} rows={field.type === "json" ? 8 : 5} maxLength={field.maxLength} spellCheck={field.type !== "json"} className="resize-y px-3 py-2 font-normal disabled:opacity-70" />
      ) : field.type === "select" ? (
        <select {...common} className="min-h-11 px-3 font-normal disabled:opacity-70">
          {field.nullable ? <option value="">Non renseigné</option> : null}
          {field.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      ) : (
        <input {...common} type={field.type === "url" ? "url" : field.type === "number" ? "number" : field.type === "date" ? "date" : field.type === "datetime" ? "datetime-local" : "text"} maxLength={field.maxLength} className="min-h-11 px-3 font-normal disabled:opacity-70" />
      )}
      {field.help ? <span className="text-xs font-normal leading-5 text-text-muted">{field.help}</span> : null}
    </label>
  );
}

function createInitialValues(config: AdminResourceConfig, record: AdminRecord | null): Record<string, string | boolean> {
  const source = record ?? config.defaultValues ?? {};
  return Object.fromEntries(config.fields.map((field) => {
    const value = source[field.name];
    if (field.type === "checkbox") return [field.name, Boolean(value)];
    if (field.type === "json") return [field.name, JSON.stringify(value ?? [], null, 2)];
    if (field.type === "datetime" && typeof value === "string") return [field.name, value.slice(0, 16)];
    return [field.name, value === null || value === undefined ? "" : String(value)];
  }));
}

function serializeValues(config: AdminResourceConfig, values: Record<string, string | boolean>): Record<string, unknown> {
  return Object.fromEntries(config.fields.filter((field) => !field.readOnly).map((field) => {
    const value = values[field.name];
    if (field.type === "checkbox") return [field.name, Boolean(value)];
    if (field.type === "number") return [field.name, value === "" ? null : Number(value)];
    if (field.type === "json") {
      try { return [field.name, JSON.parse(String(value)) as unknown]; }
      catch { throw new Error(`Le champ « ${field.label} » doit contenir un JSON valide.`); }
    }
    return [field.name, value === "" && field.nullable ? null : value];
  }));
}

function formatCell(value: unknown): string {
  if (value === null || value === undefined || value === "") return "";
  if (typeof value === "boolean") return value ? "Oui" : "Non";
  if (typeof value === "object") return "Données structurées";
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    const date = new Date(value);
    if (!Number.isNaN(date.valueOf())) return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(date);
  }
  return String(value);
}
