"use client";

import { useCallback, useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Check, Eye, FileUp, Pencil, Plus, Trash2, X, Star } from "lucide-react";

export type AdminWorkspaceSection = "projects" | "journey" | "certifications" | "testimonials" | "messages";
type RecordValue = Record<string, unknown>;



const labels: Record<AdminWorkspaceSection, { title: string; description: string; create?: string }> = {
  projects: { title: "Projets", description: "Créez et modifiez les projets, leurs deux descriptions et leurs technologies au même endroit.", create: "Ajouter un projet" },
  journey: { title: "Parcours", description: "Gérez les expériences et les formations dans un seul parcours.", create: "Ajouter au parcours" },
  certifications: { title: "Certifications", description: "Ajoutez les certifications et leur PDF directement dans ce formulaire.", create: "Ajouter une certification" },
  testimonials: { title: "Avis", description: "Consultez puis modérez les avis reçus.", create: undefined },
  messages: { title: "Messages", description: "Consultez les messages envoyés depuis le formulaire Contact.", create: undefined },
};

function emptyValues(section: AdminWorkspaceSection): RecordValue {
  if (section === "projects") return { title: "", subtitle_fr: "", subtitle_en: "", description_fr: "", description_en: "", problem_fr: "", problem_en: "", solution_fr: "", solution_en: "", objectives_fr: "", objectives_en: "", architecture_fr: "", architecture_en: "", results_fr: "", results_en: "", github_url: "", demo_url: "", categories: "", technologies: "", sort_order: 0, featured: 0 };
  if (section === "journey") return { kind: "experience", title_fr: "", title_en: "", organization: "", summary_fr: "", summary_en: "", started_on: "", ended_on: "", sort_order: 0 };
  if (section === "certifications") return { title: "", issuer: "", issued_on: "", description_fr: "", description_en: "", document_media_id: "" };
  return {};
}

function fromRecord(section: AdminWorkspaceSection, record: RecordValue): RecordValue {
  if (section === "projects") return { ...emptyValues(section), ...record, technologies: Array.isArray(record.technologies) ? record.technologies.join(", ") : "" };
  return { ...emptyValues(section), ...record };
}

function normalizeTechnology(value: string) {
  return value.normalize("NFKC").replace(/\s+/g, " ").trim();
}

function technologyKey(value: string) {
  return normalizeTechnology(value).toLocaleLowerCase();
}

function parseTechnologies(value: unknown): string[] {
  const technologies: string[] = [];
  const keys = new Set<string>();
  for (const item of String(value ?? "").split(/[;,\n]+/)) {
    const name = normalizeTechnology(item);
    const key = technologyKey(name);
    if (name && !keys.has(key)) {
      technologies.push(name);
      keys.add(key);
    }
  }
  return technologies;
}

function useModalDialog(onClose: () => void) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    const handleClose = () => onCloseRef.current();
    dialog.addEventListener("close", handleClose);
    return () => {
      dialog.removeEventListener("close", handleClose);
      if (dialog.open) dialog.close();
    };
  }, []);

  return { dialogRef, close: () => dialogRef.current?.close() };
}

async function api(section: AdminWorkspaceSection, init?: RequestInit) {
  const response = await fetch(`/api/admin/workspace/${section}`, { headers: { Accept: "application/json", ...(init?.headers ?? {}) }, ...init });
  const result = await response.json() as RecordValue;
  if (!response.ok) throw new Error(typeof result.error === "string" ? result.error : "Opération impossible.");
  return result;
}

export function AdminWorkspace({ section }: { section: AdminWorkspaceSection }) {
  const [records, setRecords] = useState<RecordValue[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editor, setEditor] = useState<RecordValue | "new" | null>(null);
  const [detail, setDetail] = useState<RecordValue | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api(section);
      setRecords(Array.isArray(result) ? result as RecordValue[] : []);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Les données ne peuvent pas être chargées.");
    } finally {
      setLoading(false);
    }
  }, [section]);

  useEffect(() => { void load(); }, [load]);

  async function remove(record: RecordValue) {
    if (typeof record.id !== "string" || !window.confirm("Supprimer définitivement cet élément ?")) return;
    try {
      await api(section, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: record.id }) });
      setDetail(null);
      await load();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Suppression impossible."); }
  }

  async function moderate(record: RecordValue, status: "approved" | "rejected") {
    if (typeof record.id !== "string") return;
    try {
      await api("testimonials", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: record.id, values: { status } }) });
      await load();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Modération impossible."); }
  }

  async function toggleFeatured(record: RecordValue) {
    if (typeof record.id !== "string") return;
    try {
      await api("testimonials", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: record.id, values: { action: "toggle_featured", featured: !record.featured } }) });
      await load();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Mise en avant impossible."); }
  }

  async function view(record: RecordValue) {
    setDetail(record);
    if (section !== "messages" || typeof record.id !== "string" || record.status !== "new") return;
    try {
      await api("messages", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: record.id, values: {} }) });
      await load();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Message impossible à marquer comme lu."); }
  }

  const meta = labels[section];
  return (
    <div>
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div className="max-w-3xl border-b border-border pb-6"><p className="system-label">{"// Administration"}</p><h1 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">{meta.title}</h1><p className="mt-3 text-sm leading-6 text-text-secondary sm:text-base">{meta.description}</p></div>
        {meta.create ? <button className="button-primary shrink-0" type="button" onClick={() => setEditor("new")}><Plus aria-hidden="true" className="size-4" />{meta.create}</button> : null}
      </header>
      {error ? <p className="mt-6 rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger" role="alert">{error}</p> : null}
      {loading ? <p className="mt-8 text-sm text-text-muted">Chargement…</p> : section === "testimonials" ? <TestimonialsWorkspace records={records} onView={view} onDelete={remove} onModerate={moderate} onToggleFeatured={toggleFeatured} /> : <WorkspaceTable section={section} records={records} onEdit={setEditor} onView={view} onDelete={remove} onModerate={moderate} />}
      {editor && section !== "testimonials" && section !== "messages" ? <WorkspaceEditor section={section} record={editor === "new" ? null : editor} onClose={() => setEditor(null)} onSaved={async () => { setEditor(null); await load(); }} /> : null}
      {detail ? <DetailDialog section={section} record={detail} onClose={() => setDetail(null)} /> : null}
    </div>
  );
}

function WorkspaceTable({ section, records, onEdit, onView, onDelete, onModerate, onToggleFeatured }: { section: AdminWorkspaceSection; records: RecordValue[]; onEdit: (record: RecordValue) => void; onView: (record: RecordValue) => void; onDelete: (record: RecordValue) => void; onModerate: (record: RecordValue, status: "approved" | "rejected") => void; onToggleFeatured?: (record: RecordValue) => void }) {
  if (!records.length) return <div className="mt-8 border border-dashed border-border bg-surface/60 p-10 text-center text-sm text-text-muted">Aucun contenu pour le moment. Utilisez l’action d’ajout pour commencer.</div>;
  const headers = section === "projects" ? ["Titre", "GitHub", "Technologies", "Ordre"]
    : section === "journey" ? ["Type", "Titre", "Organisation", "Début"]
      : section === "certifications" ? ["Titre", "Organisme", "Date", "PDF"]
        : section === "testimonials" ? ["Nom", "Rôle", "Date", "Statut"]
          : ["Nom", "E-mail", "Sujet", "Date", "État"];
  return <div className="mt-8 overflow-x-auto border border-border"><table className="w-full min-w-[46rem] text-left text-sm"><thead className="bg-surface-subtle font-mono text-[.68rem] uppercase tracking-wider text-text-muted"><tr>{headers.map((header) => <th key={header} className="border-b border-border px-4 py-3 font-semibold">{header}</th>)}<th className="border-b border-border px-4 py-3 text-right font-semibold">Actions</th></tr></thead><tbody className="divide-y divide-border bg-surface">{records.map((record) => <tr key={String(record.id)} className={`align-top transition-colors hover:bg-surface-raised/50 ${section === "messages" && record.status === "new" ? "bg-surface-raised/30" : ""}`}><Cells section={section} record={record} /><td className="px-4 py-3"><div className="flex justify-end gap-2"><button type="button" className="grid size-10 place-items-center rounded-sm border border-border text-text-secondary hover:border-accent hover:text-text-primary" onClick={() => onView(record)} aria-label="Voir le détail"><Eye className="size-4" /></button>{["projects", "journey", "certifications"].includes(section) ? <button type="button" className="grid size-10 place-items-center rounded-sm border border-border text-text-secondary hover:border-accent hover:text-text-primary" onClick={() => onEdit(record)} aria-label="Modifier"><Pencil className="size-4" /></button> : null}{section === "testimonials" ? <>{record.status === "approved" ? <button type="button" className={`grid size-10 place-items-center rounded-sm border border-border ${record.featured ? "text-amber-500 hover:border-amber-500" : "text-text-secondary hover:border-amber-500 hover:text-amber-500"}`} onClick={() => onToggleFeatured?.(record)} aria-label={record.featured ? "Ne plus mettre en avant" : "Mettre en avant"}><Star className="size-4" fill={record.featured ? "currentColor" : "none"} /></button> : null}<button type="button" className="grid size-10 place-items-center rounded-sm border border-border text-success hover:border-success hover:text-success" onClick={() => onModerate(record, "approved")} aria-label="Approuver"><Check className="size-4" /></button><button type="button" className="button-secondary px-3 text-xs" onClick={() => onModerate(record, "rejected")}>Rejeter</button></> : null}<button type="button" className="grid size-10 place-items-center rounded-sm border border-danger text-danger" onClick={() => onDelete(record)} aria-label="Supprimer"><Trash2 className="size-4" /></button></div></td></tr>)}</tbody></table></div>;
}

function Cells({ section, record }: { section: AdminWorkspaceSection; record: RecordValue }) {
  const isUnread = section === "messages" && record.status === "new";
  const cell = (value: unknown) => <td className={`max-w-64 px-4 py-3 ${isUnread ? "text-text-primary font-semibold" : "text-text-secondary"}`}><span className="line-clamp-3">{Array.isArray(value) ? value.join(", ") : String(value || "—")}</span></td>;
  if (section === "projects") return <>{cell(record.title)}{cell(record.github_url)}{cell(record.technologies)}{cell(record.sort_order)}</>;
  if (section === "journey") return <>{cell(record.kind === "experience" ? "Expérience" : "Formation")}{cell(record.title_fr)}{cell(record.organization)}{cell(record.started_on)}</>;
  if (section === "certifications") return <>{cell(record.title)}{cell(record.issuer)}{cell(record.issued_on)}{cell(record.document_media_id ? "Ajouté" : "—")}</>;
  if (section === "testimonials") return <>{cell(`${record.first_name ?? ""} ${record.last_name ?? ""}`.trim())}{cell(record.job_title ?? record.organization)}{cell(formatDate(record.created_at))}{cell(record.status)}</>;
  return <>{cell(record.sender_name)}{cell(record.sender_email)}{cell(record.subject)}{cell(formatDate(record.created_at))}{cell(record.status === "new" ? "Non lu" : "Lu")}</>;
}

function WorkspaceEditor({ section, record, onClose, onSaved }: { section: Exclude<AdminWorkspaceSection, "testimonials" | "messages">; record: RecordValue | null; onClose: () => void; onSaved: () => Promise<void> }) {
  const [values, setValues] = useState<RecordValue>(() => record ? fromRecord(section, record) : emptyValues(section));
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [translating, setTranslating] = useState<string | null>(null);
  const [generatingCategories, setGeneratingCategories] = useState(false);
  const [pdf, setPdf] = useState<File | null>(null);
  const pdfRef = useRef<HTMLInputElement>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const galleryRef = useRef<HTMLInputElement>(null);
  const { dialogRef, close } = useModalDialog(onClose);
  const set = (key: string, value: string | number) => setValues((current) => ({ ...current, [key]: value }));

  async function translate() {
    setError(null);
    try {
      const frKeys = Object.keys(values).filter(k => k.endsWith("_fr") && typeof values[k] === "string" && (values[k] as string).trim() !== "");
      if (frKeys.length === 0) {
        setError("Saisissez d'abord du texte en français.");
        return;
      }
      
      for (const frKey of frKeys) {
        const enKey = frKey.replace("_fr", "_en");
        const source = (values[frKey] as string).trim();
        
        // Optionally skip if English field already has content, but usually we want to force translate if user clicks the button.
        setTranslating(enKey);
        
        const result = await fetch("/api/admin/translate", { 
          method: "POST", 
          headers: { "Content-Type": "application/json", Accept: "application/json" }, 
          body: JSON.stringify({ text: source }) 
        });
        
        const body = await result.json() as { translation?: string; error?: string };
        if (!result.ok || !body.translation) {
          console.error(`Traduction échouée pour ${frKey}:`, body.error);
          continue; // Continue to the next field even if one fails
        }
        
        set(enKey, body.translation);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Traduction impossible.");
    } finally {
      setTranslating(null);
    }
  }

  async function generateCategories() {
    setError(null);
    setGeneratingCategories(true);
    try {
      const sourceData = {
        title: values.title,
        description: values.description_fr || values.description_en,
        problem: values.problem_fr || values.problem_en,
        solution: values.solution_fr || values.solution_en,
        objectives: values.objectives_fr || values.objectives_en,
        architecture: values.architecture_fr || values.architecture_en,
        technologies: values.technologies,
      };
      
      const sourceText = Object.values(sourceData).filter(Boolean).join("\n");
      if (!sourceText.trim()) {
        setError("Remplissez d'abord le titre ou la description du projet.");
        return;
      }
      
      const result = await fetch("/api/admin/generate-categories", { 
        method: "POST", 
        headers: { "Content-Type": "application/json", Accept: "application/json" }, 
        body: JSON.stringify({ text: sourceText }) 
      });
      
      const body = await result.json() as { categories?: string; error?: string };
      if (!result.ok || !body.categories) {
        throw new Error(body.error ?? "Erreur lors de la génération.");
      }
      
      set("categories", body.categories);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Génération impossible.");
    } finally {
      setGeneratingCategories(false);
    }
  }

  async function uploadPdf() {
    if (!pdf) return typeof values.document_media_id === "string" ? values.document_media_id : "";
    if (pdf.type !== "application/pdf" || pdf.size <= 0 || pdf.size > 5 * 1024 * 1024) throw new Error("Le fichier doit être un PDF de 5 Mo maximum.");
    const body = new FormData();
    body.set("file", pdf);
    const response = await fetch("/api/admin/media", { method: "POST", headers: { Accept: "application/json" }, body });
    const result = await response.json() as { record?: { id?: string }; error?: string };
    if (!response.ok || !result.record?.id) throw new Error(result.error ?? "Téléversement du PDF impossible.");
    return result.record.id;
  }

  async function uploadGallery() {
    if (!galleryFiles.length) return;
    const ids: string[] = [];
    for (const file of galleryFiles) {
      if (!file.type.startsWith("image/") || file.size <= 0 || file.size > 5 * 1024 * 1024) throw new Error("Les images doivent faire moins de 5 Mo.");
      const body = new FormData();
      body.set("file", file);
      const response = await fetch("/api/admin/media", { method: "POST", headers: { Accept: "application/json" }, body });
      const result = await response.json() as { record?: { id?: string }; error?: string };
      if (response.ok && result.record?.id) {
        ids.push(result.record.id);
      }
    }
    return ids;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      const outgoing: RecordValue = { ...values };
      if (section === "projects") {
        outgoing.technologies = parseTechnologies(values.technologies);
        const newMediaIds = await uploadGallery();
        if (newMediaIds?.length) {
          outgoing.new_gallery_media_ids = newMediaIds;
        }
      }
      if (section === "certifications") {
        outgoing.document_media_id = await uploadPdf();
      }
      await api(section, { method: record ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: record?.id, values: outgoing }) });
      await onSaved();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Enregistrement impossible.");
    } finally {
      setPending(false);
    }
  }

  return (
    <dialog ref={dialogRef} onCancel={(event) => { event.preventDefault(); close(); }} className="m-auto max-h-[92vh] w-[min(52rem,calc(100%-2rem))] overflow-y-auto rounded-md border border-border bg-surface-raised p-0 text-text-secondary shadow-2xl">
      <div className="flex items-start justify-between gap-5 border-b border-border px-5 py-4 sm:px-7"><div><p className="system-label">{record ? "Modification" : "Nouveau contenu"}</p><h2 className="mt-1 text-xl font-semibold">{record ? "Modifier" : "Ajouter"}</h2></div><button type="button" className="grid size-11 place-items-center rounded-sm border border-border" onClick={close} aria-label="Fermer"><X className="size-5" /></button></div>
      <form onSubmit={submit} className="grid gap-5 p-5 sm:grid-cols-2 sm:p-7">
        <EditorFields section={section} values={values} set={set} translate={translate} translating={translating} generateCategories={generateCategories} generatingCategories={generatingCategories} pdfRef={pdfRef} pdf={pdf} setPdf={setPdf} galleryRef={galleryRef} galleryFiles={galleryFiles} setGalleryFiles={setGalleryFiles} />
        {error ? <p className="rounded-sm border border-danger/30 bg-danger/10 p-4 text-sm text-danger sm:col-span-2" role="alert">{error}</p> : null}
        <div className="flex flex-wrap justify-end gap-3 border-t border-border pt-5 sm:col-span-2">
          <button type="button" className="button-secondary" onClick={close}>Annuler</button>
          <button type="submit" className="button-primary" disabled={pending}>{pending ? "Enregistrement…" : "Enregistrer"}</button>
        </div>
      </form>
    </dialog>
  );
}

function EditorFields({ section, values, set, translate, translating, generateCategories, generatingCategories, pdfRef, pdf, setPdf, galleryRef, galleryFiles, setGalleryFiles }: { section: Exclude<AdminWorkspaceSection, "testimonials" | "messages">; values: RecordValue; set: (key: string, value: string | number) => void; translate: () => Promise<void>; translating: string | null; generateCategories?: () => Promise<void>; generatingCategories?: boolean; pdfRef: React.RefObject<HTMLInputElement | null>; pdf: File | null; setPdf: (file: File | null) => void; galleryRef?: React.RefObject<HTMLInputElement | null>; galleryFiles?: File[]; setGalleryFiles?: (files: File[]) => void }) {
  const field = (name: string, label: string, type: "text" | "date" | "number" = "text", wide = false, required = true, generatable = false) => <label className={`grid gap-2 text-sm font-semibold text-text-primary ${wide ? "sm:col-span-2" : ""}`}><span className="flex flex-wrap items-center justify-between gap-3">{label}{required ? <span className="text-danger"> *</span> : null}{generatable && generateCategories ? <button className="button-secondary px-3 py-2 text-xs" type="button" onClick={() => void generateCategories()} disabled={generatingCategories}>{generatingCategories ? "Génération en cours…" : "Générer avec Groq"}</button> : null}</span><input required={required} type={type} value={String(values[name] ?? "")} onChange={(event) => set(name, type === "number" ? Number(event.target.value) : event.target.value)} className="min-h-11 px-3 font-normal" /></label>;
  const checkbox = (name: string, label: string) => <label className="flex items-center gap-2 text-sm font-semibold text-text-primary sm:col-span-2"><input type="checkbox" checked={Boolean(values[name])} onChange={(event) => set(name, event.target.checked ? 1 : 0)} className="size-4 rounded-sm border-border text-accent focus:ring-accent" />{label}</label>;
  const textarea = (name: string, label: string, translatable = false, required = true) => <label className="grid gap-2 text-sm font-semibold text-text-primary sm:col-span-2"><span className="flex flex-wrap items-center justify-between gap-3">{label}{translatable ? <button className="button-secondary px-3 py-2 text-xs" type="button" onClick={() => void translate()} disabled={Boolean(translating)}>{translating ? "Traduction en cours…" : "Traduire TOUT en anglais avec Groq"}</button> : null}</span><textarea required={required} value={String(values[name] ?? "")} onChange={(event) => set(name, event.target.value)} rows={5} className="resize-y px-3 py-2 font-normal" /></label>;
  if (section === "projects") return <>{field("title", "Titre", "text", true)}{field("subtitle_fr", "Sous-titre FR", "text", true, false)}{field("subtitle_en", "Sous-titre EN", "text", true, false)}{textarea("description_fr", "Résumé court FR", true)}{textarea("description_en", "Résumé court EN", false, false)}{textarea("problem_fr", "Le Problème FR", false, false)}{textarea("problem_en", "Le Problème EN", false, false)}{textarea("objectives_fr", "Objectifs FR (un par ligne)", false, false)}{textarea("objectives_en", "Objectifs EN (un par ligne)", false, false)}{textarea("solution_fr", "La Solution FR", false, false)}{textarea("solution_en", "La Solution EN", false, false)}{textarea("architecture_fr", "Architecture FR (une par ligne)", false, false)}{textarea("architecture_en", "Architecture EN (une par ligne)", false, false)}{textarea("results_fr", "Résultats FR (un par ligne)", false, false)}{textarea("results_en", "Résultats EN (un par ligne)", false, false)}{field("categories", "Catégories (software, cybersecurity, artificial-intelligence, embedded - séparées par des virgules)", "text", true, false, true)}{field("technologies", "Technologies (séparées par des virgules)", "text", true, false)}{field("github_url", "Lien GitHub", "text", true, false)}{field("demo_url", "Lien Démo (URL)", "text", true, false)}{field("sort_order", "Ordre d’affichage", "number")}{checkbox("featured", "Mettre en avant sur la page d'accueil")}<div className="grid gap-2 text-sm font-semibold text-text-primary sm:col-span-2"><span>Galerie d&apos;images</span><input ref={galleryRef} type="file" multiple accept="image/*" onChange={(event: ChangeEvent<HTMLInputElement>) => setGalleryFiles?.(Array.from(event.target.files ?? []))} className="sr-only" /><button type="button" className="button-secondary w-fit" onClick={() => galleryRef?.current?.click()}><FileUp className="size-4" />{galleryFiles?.length ? `${galleryFiles.length} image(s) sélectionnée(s)` : "Ajouter des images"}</button><span className="text-xs font-normal text-text-muted">Ces images seront ajoutées à la galerie du projet (5 Mo max par image).</span></div></>;
  if (section === "journey") return <><label className="grid gap-2 text-sm font-semibold text-text-primary"><span>Type *</span><select value={String(values.kind)} onChange={(event) => set("kind", event.target.value)} className="min-h-11 px-3 font-normal"><option value="experience">Expérience</option><option value="education">Formation</option></select></label>{field("organization", values.kind === "education" ? "Établissement" : "Organisation")}{field("title_fr", "Titre FR", "text", true)}{field("title_en", "Titre EN", "text", true)}{textarea("summary_fr", "Description FR")}{textarea("summary_en", "Description EN")}{field("started_on", "Date de début", "date")}
  <div className="grid gap-2 text-sm font-semibold text-text-primary">
    <span>Date de fin prévue ou effective</span>
    <input type="date" value={String(values.ended_on ?? "")} onChange={(event) => set("ended_on", event.target.value)} className="min-h-11 px-3 font-normal" />
    <span className="text-xs font-normal text-text-muted">Si la date est vide ou dans le futur, le parcours s’affiche « En cours ». Il passera automatiquement à la date de fin une fois atteinte.</span>
  </div>
  {field("sort_order", "Ordre d’affichage", "number")}</>;
  return <>{field("title", "Titre", "text", true)}{field("issuer", "Organisme", "text", true, false)}{field("issued_on", "Date", "date")}{textarea("description_fr", "Description FR", true)}{textarea("description_en", "Description EN", false, false)}{checkbox("featured", "Mettre en avant sur la page d'accueil")}<div className="grid gap-2 text-sm font-semibold text-text-primary sm:col-span-2"><span>Fichier PDF</span><input ref={pdfRef} type="file" accept="application/pdf" onChange={(event: ChangeEvent<HTMLInputElement>) => setPdf(event.target.files?.[0] ?? null)} className="sr-only" /><button type="button" className="button-secondary w-fit" onClick={() => pdfRef.current?.click()}><FileUp className="size-4" />{pdf ? pdf.name : values.document_media_id ? "Remplacer le PDF" : "Ajouter un PDF"}</button><span className="text-xs font-normal text-text-muted">PDF uniquement, 5 Mo maximum.</span></div></>;
}

function DetailDialog({ section, record, onClose }: { section: AdminWorkspaceSection; record: RecordValue; onClose: () => void }) {
  const { dialogRef, close } = useModalDialog(onClose);
  let title = "Détail";
  let entries: Array<[string, unknown]> = [];

  switch (section) {
    case "messages":
      title = "Message reçu";
      entries = [["Nom", record.sender_name], ["E-mail", record.sender_email], ["Sujet", record.subject], ["Message", record.message], ["Date", formatDate(record.created_at)], ["État", record.status === "new" ? "Non lu" : "Lu"]];
      break;
    case "testimonials":
      title = "Avis reçu";
      entries = [["Nom", `${record.first_name ?? ""} ${record.last_name ?? ""}`.trim()], ["Rôle", record.job_title], ["Organisation", record.organization], ["Note", record.rating], ["Langue", record.locale], ["Statut", record.status], ["Avis", record.message], ["Date", formatDate(record.created_at)]];
      break;
    case "projects":
      title = "Projet";
      entries = [["Titre", record.title], ["GitHub", record.github_url], ["Technologies", Array.isArray(record.technologies) ? record.technologies.join(", ") : record.technologies], ["Statut", record.publication_status], ["Date", formatDate(record.created_at)]];
      break;
    case "journey":
      title = "Parcours";
      entries = [["Titre FR", record.title_fr], ["Titre EN", record.title_en], ["Organisation", record.organization], ["Type", record.kind === "experience" ? "Expérience" : "Formation"]];
      break;
    case "certifications":
      title = "Certification";
      entries = [["Titre", record.title], ["Organisme", record.issuer], ["Date", formatDate(record.issued_on)]];
      break;
  }

  return <dialog ref={dialogRef} onCancel={(event) => { event.preventDefault(); close(); }} className="m-auto w-[min(42rem,calc(100%-2rem))] rounded-2xl border border-border bg-surface-raised p-0 text-text-secondary shadow-2xl"><div className="flex items-start justify-between gap-5 border-b border-border px-5 py-4 sm:px-7"><div><p className="eyebrow">Détail</p><h2 className="mt-1 text-xl font-semibold">{title}</h2></div><button type="button" className="grid size-11 place-items-center rounded-lg border border-border" onClick={close} aria-label="Fermer"><X className="size-5" /></button></div><dl className="grid gap-5 p-5 sm:p-7">{entries.map(([label, value]) => <div key={label}><dt className="text-xs font-bold uppercase tracking-wider text-text-muted">{label}</dt><dd className="mt-1 whitespace-pre-wrap text-sm leading-6 text-text-primary">{String(value || "—")}</dd></div>)}</dl></dialog>;
}

function formatDate(value: unknown) {
  if (typeof value !== "string") return "—";
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? value : new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function TestimonialsWorkspace({ records, onView, onDelete, onModerate, onToggleFeatured }: { records: RecordValue[]; onView: (record: RecordValue) => void; onDelete: (record: RecordValue) => void; onModerate: (record: RecordValue, status: "approved" | "rejected") => void; onToggleFeatured: (record: RecordValue) => void }) {
  const pending = records.filter((r) => r.status === "pending" || r.status === "new");
  const approved = records.filter((r) => r.status === "approved");
  const rejected = records.filter((r) => r.status === "rejected");

  return (
    <div className="mt-8 flex flex-col gap-12">
      <section>
        <h3 className="font-display text-xl font-semibold text-text-primary">En attente ({pending.length})</h3>
        <p className="mt-1 text-sm text-text-secondary">Les nouveaux avis qui attendent votre modération. En les approuvant, ils seront automatiquement traduits.</p>
        <WorkspaceTable section="testimonials" records={pending} onEdit={() => {}} onView={onView} onDelete={onDelete} onModerate={onModerate} onToggleFeatured={onToggleFeatured} />
      </section>
      <section>
        <h3 className="font-display text-xl font-semibold text-text-primary">Approuvés ({approved.length})</h3>
        <p className="mt-1 text-sm text-text-secondary">Tous les avis approuvés et publiés sur le site (français et anglais).</p>
        <WorkspaceTable section="testimonials" records={approved} onEdit={() => {}} onView={onView} onDelete={onDelete} onModerate={onModerate} onToggleFeatured={onToggleFeatured} />
      </section>
      {rejected.length > 0 && (
        <section>
          <h3 className="font-display text-xl font-semibold text-text-primary">Rejetés ({rejected.length})</h3>
          <p className="mt-1 text-sm text-text-secondary">Les avis que vous avez refusés.</p>
          <WorkspaceTable section="testimonials" records={rejected} onEdit={() => {}} onView={onView} onDelete={onDelete} onModerate={onModerate} onToggleFeatured={onToggleFeatured} />
        </section>
      )}
    </div>
  );
}
