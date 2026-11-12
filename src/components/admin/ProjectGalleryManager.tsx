/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  FolderKanban,
  GripVertical,
  Images,
  Loader2,
  Maximize2,
  Plus,
  RotateCcw,
  Save,
  Search,
  Star,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface AdminGalleryPhoto {
  mediaId: string;
  url: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  altFr: string | null;
  altEn: string | null;
}

export interface AdminProjectWithGallery {
  id: string;
  slug: string;
  titleFr: string;
  titleEn: string;
  photos: AdminGalleryPhoto[];
}

interface ProjectGalleryManagerProps {
  projects: AdminProjectWithGallery[];
  initialProjectId?: string;
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "—";
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export function ProjectGalleryManager({ projects: initialProjects, initialProjectId }: ProjectGalleryManagerProps) {
  const router = useRouter();
  const [projectsState, setProjectsState] = useState<AdminProjectWithGallery[]>(initialProjects);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(() => {
    if (initialProjectId && initialProjects.some((p) => p.id === initialProjectId)) {
      return initialProjectId;
    }
    return initialProjects[0]?.id ?? "";
  });

  const selectedProject = useMemo(
    () => projectsState.find((p) => p.id === selectedProjectId) ?? projectsState[0] ?? null,
    [projectsState, selectedProjectId]
  );

  const [draftPhotos, setDraftPhotos] = useState<AdminGalleryPhoto[]>(() => selectedProject?.photos ?? []);
  const [searchQuery, setSearchQuery] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<AdminGalleryPhoto | null>(null);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync draft when switching projects
  useEffect(() => {
    setDraftPhotos(selectedProject?.photos ?? []);
    setDraggedIndex(null);
    setDragOverIndex(null);
    setStatus(null);
  }, [selectedProject]);

  const savedOrderIds = useMemo(
    () => (selectedProject?.photos ?? []).map((p) => p.mediaId),
    [selectedProject]
  );

  const draftOrderIds = useMemo(
    () => draftPhotos.map((p) => p.mediaId),
    [draftPhotos]
  );

  const hasChanges = useMemo(() => {
    if (savedOrderIds.length !== draftOrderIds.length) return true;
    return savedOrderIds.some((id, index) => id !== draftOrderIds[index]);
  }, [savedOrderIds, draftOrderIds]);

  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return projectsState;
    return projectsState.filter(
      (p) =>
        p.titleFr.toLowerCase().includes(query) ||
        p.titleEn.toLowerCase().includes(query) ||
        p.slug.toLowerCase().includes(query)
    );
  }, [projectsState, searchQuery]);

  function movePhoto(fromIndex: number, toIndex: number) {
    if (
      fromIndex === toIndex ||
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= draftPhotos.length ||
      toIndex >= draftPhotos.length
    ) {
      return;
    }
    setDraftPhotos((current) => {
      const next = [...current];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
    setStatus(null);
  }

  function removePhoto(mediaId: string) {
    setDraftPhotos((current) => current.filter((photo) => photo.mediaId !== mediaId));
    setStatus(null);
  }

  function resetChanges() {
    setDraftPhotos(selectedProject?.photos ?? []);
    setStatus(null);
  }

  async function persistGallery(photosToSave: AdminGalleryPhoto[], customSuccessMessage?: string) {
    if (!selectedProject) return;
    setSaving(true);
    setStatus(null);
    try {
      const response = await fetch("/api/admin/project-gallery", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          projectId: selectedProject.id,
          mediaIds: photosToSave.map((photo) => photo.mediaId),
        }),
      });

      const payload = (await response.json()) as { error?: string; count?: number };
      if (!response.ok) {
        throw new Error(payload.error ?? "Impossible d'enregistrer la galerie.");
      }

      setProjectsState((prev) =>
        prev.map((project) =>
          project.id === selectedProject.id ? { ...project, photos: photosToSave } : project
        )
      );

      setStatus({
        type: "success",
        message:
          customSuccessMessage ??
          `✓ Ordre et photos enregistrés (${photosToSave.length} photo${photosToSave.length > 1 ? "s" : ""}) pour « ${selectedProject.titleFr} ».`,
      });
      router.refresh();
    } catch (caught) {
      setStatus({
        type: "error",
        message: caught instanceof Error ? caught.message : "Erreur lors de l'enregistrement.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleUploadFiles(files: FileList | null) {
    if (!files || files.length === 0 || !selectedProject) return;
    const validFiles = Array.from(files);

    setUploading(true);
    setStatus(null);

    try {
      const uploadedPhotos: AdminGalleryPhoto[] = [];
      for (const file of validFiles) {
        if (!file.type.startsWith("image/") || file.size <= 0 || file.size > 5 * 1024 * 1024) {
          throw new Error(`Le fichier « ${file.name} » doit être une image de 5 Mo maximum.`);
        }

        const body = new FormData();
        body.set("file", file);

        const uploadResponse = await fetch("/api/admin/media", {
          method: "POST",
          headers: { Accept: "application/json" },
          body,
        });

        const uploadPayload = (await uploadResponse.json()) as {
          record?: {
            id: string;
            storage_path: string;
            original_name: string;
            mime_type: string;
            size_bytes: number;
            alt_fr: string | null;
            alt_en: string | null;
          };
          error?: string;
        };

        if (!uploadResponse.ok || !uploadPayload.record?.id) {
          throw new Error(uploadPayload.error ?? `Téléversement échoué pour « ${file.name} ».`);
        }

        const rec = uploadPayload.record;
        const previewUrl = URL.createObjectURL(file);
        uploadedPhotos.push({
          mediaId: rec.id,
          url: previewUrl,
          originalName: rec.original_name || file.name,
          mimeType: rec.mime_type || file.type,
          sizeBytes: rec.size_bytes || file.size,
          altFr: rec.alt_fr ?? null,
          altEn: rec.alt_en ?? null,
        });
      }

      const nextPhotos = [...draftPhotos, ...uploadedPhotos];
      setDraftPhotos(nextPhotos);

      // Persist immediately so uploaded photos are linked cleanly to the project
      await persistGallery(
        nextPhotos,
        `✓ ${uploadedPhotos.length} photo${uploadedPhotos.length > 1 ? "s ajoutées" : " ajoutée"} et enregistrée${uploadedPhotos.length > 1 ? "s" : ""}. Vous pouvez maintenant ajuster leur ordre.`
      );
    } catch (caught) {
      setStatus({
        type: "error",
        message: caught instanceof Error ? caught.message : "Téléversement impossible.",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleDragStart(index: number) {
    setDraggedIndex(index);
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>, index: number) {
    event.preventDefault();
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>, targetIndex: number) {
    event.preventDefault();
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      movePhoto(draggedIndex, targetIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  }

  function handleDragEnd() {
    setDraggedIndex(null);
    setDragOverIndex(null);
  }

  if (projectsState.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-surface-subtle/60 p-10 text-center text-text-secondary">
        Aucun projet disponible. Créez d&apos;abord un projet dans « Tous les Projets ».
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      {status && (
        <div
          role="status"
          className={cn(
            "rounded-2xl border px-4 py-3 text-sm font-medium transition-all",
            status.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              : "border-danger/40 bg-danger/10 text-danger"
          )}
        >
          {status.message}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Sidebar: Project Selector */}
        <section className="lg:col-span-4 rounded-2xl border border-white/10 bg-surface-subtle/70 backdrop-blur-xl overflow-hidden">
          <div className="border-b border-white/10 p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display text-sm font-bold text-text-primary flex items-center gap-2">
                <FolderKanban className="size-4 text-accent" />
                Projets ({projectsState.length})
              </h2>
              <span className="font-mono text-[11px] text-text-muted">Sélectionner</span>
            </div>

            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filtrer par nom..."
                className="w-full rounded-xl border border-white/10 bg-bg-page/70 py-2 pl-9 pr-3 text-xs text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          <div className="max-h-[460px] lg:max-h-[680px] overflow-y-auto divide-y divide-white/[0.06]">
            {filteredProjects.map((project) => {
              const isSelected = project.id === selectedProject?.id;
              const cover = project.photos[0];
              return (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => setSelectedProjectId(project.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3.5 text-left transition-all",
                    isSelected
                      ? "bg-accent/15 border-l-2 border-l-accent"
                      : "hover:bg-white/[0.03]"
                  )}
                >
                  <div className="size-12 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-bg-page flex items-center justify-center">
                    {cover ? (
                      <img
                        src={cover.url}
                        alt={project.titleFr}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Images className="size-4 text-text-muted/60" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-text-primary">
                      {project.titleFr || project.slug}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-md px-2 py-0.5 font-mono text-[10px] font-semibold",
                          project.photos.length > 0
                            ? "bg-accent/15 text-accent"
                            : "bg-white/[0.05] text-text-muted"
                        )}
                      >
                        {project.photos.length} photo{project.photos.length > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Right Workspace: Selected Project Gallery & Ordering */}
        {selectedProject && (
          <section className="lg:col-span-8 space-y-5">
            {/* Project Action Header */}
            <div className="rounded-2xl border border-white/10 bg-surface-subtle/70 p-5 backdrop-blur-xl">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-accent">
                    <span>ORDRE D&apos;AFFICHAGE</span>
                    <span>•</span>
                    <span>{draftPhotos.length} PHOTO{draftPhotos.length > 1 ? "S" : ""}</span>
                  </div>
                  <h2 className="font-display text-xl font-bold text-text-primary">
                    {selectedProject.titleFr}
                  </h2>
                  <p className="text-xs text-text-muted">
                    Glissez-déposez les photos ou utilisez les flèches pour choisir l&apos;ordre exact sur la page projet. La photo <strong className="text-accent">#1</strong> devient l&apos;image principale / couverture.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/fr/projects/${selectedProject.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-surface px-3 py-2 text-xs font-semibold text-text-secondary hover:border-accent/40 hover:text-accent transition-all"
                  >
                    <ExternalLink className="size-3.5" />
                    Voir en ligne
                  </Link>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      void handleUploadFiles(event.target.files)
                    }
                    className="sr-only"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading || saving}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-accent/35 bg-accent/15 px-3.5 py-2 text-xs font-semibold text-accent hover:bg-accent hover:text-bg-page transition-all disabled:opacity-50"
                  >
                    {uploading ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Plus className="size-3.5" />
                    )}
                    {uploading ? "Envoi en cours..." : "Ajouter des photos"}
                  </button>
                </div>
              </div>

              {/* Save / Reset Bar */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] pt-4">
                <div className="text-xs">
                  {hasChanges ? (
                    <span className="inline-flex items-center gap-2 font-medium text-amber-300">
                      <span className="size-2 rounded-full bg-amber-400 animate-pulse" />
                      Ordre ou liste modifié — cliquez sur Enregistrer pour appliquer en ligne
                    </span>
                  ) : (
                    <span className="text-text-muted">
                      Tout est synchronisé avec le portfolio public.
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={resetChanges}
                    disabled={!hasChanges || saving}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-surface px-3 py-2 text-xs font-semibold text-text-secondary hover:bg-white/[0.06] disabled:opacity-40 transition-all"
                  >
                    <RotateCcw className="size-3.5" />
                    Réinitialiser
                  </button>
                  <button
                    type="button"
                    onClick={() => void persistGallery(draftPhotos)}
                    disabled={!hasChanges || saving}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs font-bold text-bg-page shadow-md shadow-accent/20 hover:bg-accent-hover disabled:opacity-40 transition-all"
                  >
                    {saving ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Save className="size-3.5" />
                    )}
                    {saving ? "Enregistrement..." : "Enregistrer l'ordre"}
                  </button>
                </div>
              </div>
            </div>

            {/* Photos Grid */}
            {draftPhotos.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/15 bg-surface-subtle/40 p-12 text-center space-y-4">
                <div className="mx-auto grid size-14 place-items-center rounded-2xl border border-accent/30 bg-accent/10 text-accent">
                  <UploadCloud className="size-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-text-primary">
                    Aucune photo pour ce projet
                  </h3>
                  <p className="text-xs text-text-muted max-w-md mx-auto">
                    Ajoutez des captures d&apos;écran ou schémas d&apos;architecture pour afficher une galerie interactive dans la fiche du projet.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-xs font-bold text-bg-page hover:bg-accent-hover transition-all"
                >
                  <Plus className="size-4" />
                  Importer des images
                </button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {draftPhotos.map((photo, index) => {
                  const isCover = index === 0;
                  const isDragging = draggedIndex === index;
                  const isDragOver = dragOverIndex === index && draggedIndex !== index;

                  return (
                    <div
                      key={photo.mediaId}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDrop={(e) => handleDrop(e, index)}
                      onDragEnd={handleDragEnd}
                      className={cn(
                        "group relative flex flex-col overflow-hidden rounded-2xl border bg-surface-subtle/80 transition-all",
                        isCover
                          ? "border-accent/50 ring-1 ring-accent/25"
                          : "border-white/10 hover:border-white/25",
                        isDragging && "opacity-40 scale-[0.98]",
                        isDragOver && "border-accent ring-2 ring-accent/50 scale-[1.01]"
                      )}
                    >
                      {/* Thumbnail preview */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0B0B0C]">
                        <img
                          src={photo.url}
                          alt={photo.altFr || photo.originalName}
                          className="h-full w-full object-contain p-1.5 transition-transform duration-300 group-hover:scale-[1.02]"
                        />

                        {/* Order Badge */}
                        <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 rounded-lg px-2.5 py-1 font-mono text-[11px] font-bold shadow-md backdrop-blur-md",
                              isCover
                                ? "bg-accent text-bg-page"
                                : "border border-white/15 bg-black/75 text-white"
                            )}
                          >
                            #{index + 1}
                            {isCover && " · Couverture"}
                          </span>
                        </div>

                        {/* Drag handle + zoom */}
                        <div className="absolute right-2.5 top-2.5 flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setPreviewPhoto(photo)}
                            className="grid size-8 place-items-center rounded-lg border border-white/15 bg-black/70 text-white backdrop-blur-md hover:border-accent/50 hover:text-accent transition-colors"
                            title="Aperçu grand format"
                            aria-label="Aperçu grand format"
                          >
                            <Maximize2 className="size-3.5" />
                          </button>
                          <span
                            className="grid size-8 cursor-grab place-items-center rounded-lg border border-white/15 bg-black/70 text-white/80 backdrop-blur-md active:cursor-grabbing"
                            title="Glisser pour réordonner"
                          >
                            <GripVertical className="size-4" />
                          </span>
                        </div>
                      </div>

                      {/* Metadata & Reorder Controls */}
                      <div className="flex flex-1 flex-col justify-between gap-3 p-3.5">
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-text-primary" title={photo.originalName}>
                            {photo.originalName}
                          </p>
                          <p className="mt-0.5 font-mono text-[10px] text-text-muted">
                            Position {index + 1}/{draftPhotos.length} • {formatBytes(photo.sizeBytes)}
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-1.5 border-t border-white/[0.06] pt-2.5">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => movePhoto(index, index - 1)}
                              disabled={index === 0}
                              className="inline-grid size-8 place-items-center rounded-lg border border-white/10 bg-surface text-text-secondary hover:border-accent/40 hover:text-accent disabled:opacity-30 transition-colors"
                              title="Déplacer avant"
                              aria-label={`Déplacer la photo ${index + 1} avant`}
                            >
                              <ArrowLeft className="size-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => movePhoto(index, index + 1)}
                              disabled={index === draftPhotos.length - 1}
                              className="inline-grid size-8 place-items-center rounded-lg border border-white/10 bg-surface text-text-secondary hover:border-accent/40 hover:text-accent disabled:opacity-30 transition-colors"
                              title="Déplacer après"
                              aria-label={`Déplacer la photo ${index + 1} après`}
                            >
                              <ArrowRight className="size-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => movePhoto(index, 0)}
                              disabled={isCover}
                              className={cn(
                                "inline-flex h-8 items-center gap-1 rounded-lg border px-2 text-[11px] font-semibold transition-colors",
                                isCover
                                  ? "border-accent/30 bg-accent/10 text-accent opacity-60 cursor-default"
                                  : "border-white/10 bg-surface text-text-secondary hover:border-accent/40 hover:text-accent"
                              )}
                              title="Définir comme photo #1 (couverture)"
                            >
                              <Star className="size-3" fill={isCover ? "currentColor" : "none"} />
                              <span>#1</span>
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removePhoto(photo.mediaId)}
                            className="inline-grid size-8 place-items-center rounded-lg border border-danger/30 bg-danger/10 text-danger hover:bg-danger hover:text-white transition-colors"
                            title="Retirer cette photo du projet"
                            aria-label={`Retirer ${photo.originalName}`}
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </div>

      {/* Preview Modal */}
      {previewPhoto && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          onClick={() => setPreviewPhoto(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-5xl overflow-hidden rounded-2xl border border-white/15 bg-[#121316] p-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex items-center justify-between gap-4 px-2 py-1">
              <span className="truncate text-xs font-mono text-text-secondary">
                {previewPhoto.originalName}
              </span>
              <button
                type="button"
                onClick={() => setPreviewPhoto(null)}
                className="grid size-8 place-items-center rounded-lg border border-white/15 bg-white/5 text-white hover:bg-white/15"
                aria-label="Fermer l'aperçu"
              >
                <X className="size-4" />
              </button>
            </div>
            <img
              src={previewPhoto.url}
              alt={previewPhoto.altFr || previewPhoto.originalName}
              className="max-h-[78vh] w-auto max-w-full rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}

