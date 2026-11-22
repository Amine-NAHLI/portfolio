"use client";

import { useState, useRef } from "react";
import {
  Trophy,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Award,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Palette,
  Sparkles,
  Camera,
  RotateCcw,
  Sliders,
  Maximize2,
  ArrowUpToLine,
  ArrowDownToLine,
  ListOrdered,
  Eye,
  EyeOff,
  X,
  UploadCloud,
  Image as ImageIcon,
  Search,
} from "lucide-react";
import type { JourneyTimelineItem, JourneyTag } from "@/types/journey";
import { DEFAULT_HACKATHONS } from "@/types/journey";

const COLOR_PRESETS = [
  { label: "Violet Gemma", value: "#A855F7" },
  { label: "Or / Ambre", value: "#F59E0B" },
  { label: "Émeraude", value: "#10B981" },
  { label: "Céladon Minéral", value: "#C8F122" },
  { label: "Cyan Électrique", value: "#38BDF8" },
  { label: "Rose Rubis", value: "#F43F5E" },
  { label: "Bleu Cobalt", value: "#3B82F6" },
  { label: "Orange Vif", value: "#F97316" },
];

export function JourneyManager({ initialItems }: { initialItems: JourneyTimelineItem[] }) {
  const [items, setItems] = useState<JourneyTimelineItem[]>(
    initialItems && initialItems.length > 0 ? initialItems : DEFAULT_HACKATHONS
  );
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);
  const [editorTab, setEditorTab] = useState<"info" | "photos" | "tags">("info");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showReorderModal, setShowReorderModal] = useState(false);

  // Photo Upload & Input state (Single Photo Mode)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlFallback, setShowUrlFallback] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");

  // New tag inputs state (Bilingual FR/EN)
  const [newTagName, setNewTagName] = useState("");
  const [newTagNameEn, setNewTagNameEn] = useState("");
  const [newTagMode, setNewTagMode] = useState<"standard" | "custom">("standard");
  const [newTagColor, setNewTagColor] = useState("#C8F122");

  const activeItem = items[activeItemIndex] || items[0];

  const updateItemField = <K extends keyof JourneyTimelineItem>(
    index: number,
    field: K,
    value: JourneyTimelineItem[K]
  ) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Helper to read file as Data URL (Base64) for resilient local/offline preview
  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // --- Photo Upload File Handler (Single Photo Mode) ---
  const handleUploadFiles = async (files: FileList | File[]) => {
    const fileList = Array.from(files).filter(
      (f) => f.type.startsWith("image/") && f.size <= 8 * 1024 * 1024
    );
    if (fileList.length === 0) {
      setErrorMessage("Veuillez sélectionner une image valide (PNG, JPG, WEBP, max 8 Mo).");
      return;
    }

    setIsUploadingPhotos(true);
    setErrorMessage(null);

    const file = fileList[0];
    let photoUrl = "";

    try {
      const formData = new FormData();
      formData.set("file", file);

      const response = await fetch("/api/admin/media", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      const data = await response.json();
      if (response.ok && data.publicUrl) {
        photoUrl = data.publicUrl;
      } else {
        photoUrl = await readFileAsDataUrl(file);
      }
    } catch {
      photoUrl = await readFileAsDataUrl(file);
    }

    if (photoUrl) {
      setItems((prev) => {
        const updated = [...prev];
        updated[activeItemIndex] = {
          ...updated[activeItemIndex],
          images: [photoUrl],
        };
        return updated;
      });
      setSuccessMessage("✓ Photo officielle mise à jour ! Pensez à enregistrer vos modifications.");
    }

    setIsUploadingPhotos(false);
  };

  // --- Photo Management Handlers ---
  const handleAddPhoto = (itemIndex: number) => {
    const trimmed = newPhotoUrl.trim();
    if (!trimmed) return;

    setItems((prev) => {
      const updated = [...prev];
      updated[itemIndex] = {
        ...updated[itemIndex],
        images: [trimmed],
      };
      return updated;
    });

    setNewPhotoUrl("");
    setSuccessMessage("✓ Lien de photo appliqué !");
  };

  const handleClearPhoto = (itemIndex: number) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[itemIndex] = {
        ...updated[itemIndex],
        images: [],
      };
      return updated;
    });
    setSuccessMessage("Photo retirée. Pensez à enregistrer vos modifications.");
  };

  // --- Tag Handlers ---
  const handleAddTag = (itemIndex: number) => {
    const trimmed = newTagName.trim();
    if (!trimmed) return;

    const newTag: JourneyTag = {
      name: trimmed,
      nameEn: newTagNameEn.trim() || trimmed,
      color: newTagMode === "standard" ? "standard" : newTagColor,
    };

    setItems((prev) => {
      const updated = [...prev];
      const currentTags = updated[itemIndex]?.tags || [];
      updated[itemIndex] = {
        ...updated[itemIndex],
        tags: [...currentTags, newTag],
      };
      return updated;
    });

    setNewTagName("");
    setNewTagNameEn("");
  };

  const handleRemoveTag = (itemIndex: number, tagIndex: number) => {
    setItems((prev) => {
      const updated = [...prev];
      const currentTags = updated[itemIndex]?.tags || [];
      updated[itemIndex] = {
        ...updated[itemIndex],
        tags: currentTags.filter((_, i) => i !== tagIndex),
      };
      return updated;
    });
  };

  // --- Hackathon Items Reordering & Visibility ---
  const handleMoveItem = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    setItems((prev) => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return updated;
    });

    setActiveItemIndex(targetIndex);
  };

  const handleMoveToPosition = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= items.length || fromIndex === toIndex) return;

    setItems((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });

    setActiveItemIndex(toIndex);
  };

  const handleMoveToTop = (index: number) => {
    handleMoveToPosition(index, 0);
  };

  const handleMoveToBottom = (index: number) => {
    handleMoveToPosition(index, items.length - 1);
  };

  const handleToggleVisibility = (index: number) => {
    setItems((prev) => {
      const updated = [...prev];
      const current = updated[index]?.enabled !== false;
      updated[index] = { ...updated[index], enabled: !current };
      return updated;
    });
  };

  const handleAddNewItem = () => {
    const newItem: JourneyTimelineItem = {
      id: `hackathon-${Date.now()}`,
      year: "2026 — 2027",
      title: "Nouveau Hackathon / Compétition d'Ingénierie",
      titleEn: "New Competitive Hackathon & Engineering Sprint",
      organization: "Organisateur / Événement",
      location: "Fès, Maroc",
      type: "experience",
      categoryLabel: "COMPÉTITION",
      categoryLabelEn: "COMPETITION",
      award: "Prix / Podium",
      awardEn: "Award / Podium",
      awardColor: "#A855F7",
      status: "completed",
      challenge: "Défi technique imposé lors du sprint 48H.",
      challengeEn: "Technical sprint challenge under time constraints.",
      solution: "Prototype logiciel et architecture déployés avec succès.",
      solutionEn: "Shipped software prototype and architecture.",
      githubUrl: "",
      demoUrl: "",
      images: [],
      tags: [{ name: "IA & Systèmes", color: "#A855F7" }],
    };

    setItems((prev) => [...prev, newItem]);
    setActiveItemIndex(items.length);
  };

  const handleDeleteItem = (index: number) => {
    if (items.length <= 1) {
      setErrorMessage("La section doit contenir au moins un hackathon ou sprint.");
      return;
    }
    setItems((prev) => prev.filter((_, i) => i !== index));
    setActiveItemIndex((prev) => Math.max(0, prev - 1));
  };

  const handleResetToDefaultHackathons = () => {
    if (
      window.confirm(
        "Voulez-vous charger la configuration recommandée des Hackathons (Google Build with Gemma, UPF Robotics, Prochains Sprints) ?"
      )
    ) {
      setItems(DEFAULT_HACKATHONS);
      setActiveItemIndex(0);
      setSuccessMessage("Modèle des Hackathons chargés. Pensez à enregistrer vos modifications.");
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/admin/journey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Erreur lors de l'enregistrement.");
      }

      setSuccessMessage("Hackathons, photographies et tags enregistrés avec succès !");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-white/10 bg-[#121316]/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#A855F7]/10 border border-[#A855F7]/20 text-[#A855F7]">
            <Trophy className="size-5" />
          </div>
          <div>
            <h2 className="font-display text-base font-bold text-[#FFFFFF]">
              Hackathons & Compétitions ({items.length})
            </h2>
            <p className="font-mono text-xs text-[#A1A1AA]">
              Gérez vos sprints 48H, ajoutez les photos de terrain, vos défis techniques et vos repos GitHub
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetToDefaultHackathons}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-mono font-medium text-[#A1A1AA] hover:text-[#FFFFFF] hover:border-white/20 transition-colors cursor-pointer"
            title="Charger les 3 hackathons officiels par défaut (Gemma, UPF Robotics, Upcoming)"
          >
            <RotateCcw className="size-3.5" />
            <span>Hackathons par défaut</span>
          </button>

          <button
            type="button"
            onClick={() => setShowReorderModal(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-2 text-xs font-mono font-medium text-cyan-400 hover:bg-cyan-400/20 transition-colors cursor-pointer"
            title="Ouvrir la vue pour réorganiser l'ordre de tous les hackathons"
          >
            <ListOrdered className="size-3.5" />
            <span>Organiser l&apos;Ordre ({items.length})</span>
          </button>

          <button
            type="button"
            onClick={handleAddNewItem}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-mono font-medium text-[#FFFFFF] hover:border-[#A855F7] hover:bg-[#A855F7]/10 transition-colors cursor-pointer"
          >
            <Plus className="size-4 text-[#A855F7]" />
            <span>Ajouter un Hackathon</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-lg bg-[#C8F122] px-5 py-2 font-mono text-xs font-bold text-black hover:bg-[#b0d912] transition-all shadow-md shadow-[#C8F122]/20 disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Enregistrement...</span>
              </>
            ) : (
              <>
                <Save className="size-4" />
                <span>Enregistrer les modifications</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Feedback Alerts */}
      {errorMessage && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          <AlertCircle className="size-5 shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm">
          <CheckCircle2 className="size-5 shrink-0" />
          <p>{successMessage}</p>
        </div>
      )}

      {/* Main Grid: Hackathon Selector Sidebar + Detail Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left List of Hackathons */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#A1A1AA] font-bold">
              Compétitions ({items.length})
            </span>
            <span className="text-[10px] font-mono text-cyan-400">
              Actif : #{activeItemIndex + 1}
            </span>
          </div>

          {/* Quick Search Filter */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-text-muted" />
            <input
              type="text"
              placeholder="Rechercher par titre ou année..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-xl border border-white/10 bg-white/[0.03] text-xs text-white placeholder:text-text-muted/60 focus:border-cyan-400 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-2 max-h-[750px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10">
            {items
              .map((item, index) => ({ item, index }))
              .filter(({ item }) => {
                if (!searchQuery.trim()) return true;
                const q = searchQuery.toLowerCase();
                return (
                  item.title.toLowerCase().includes(q) ||
                  item.organization.toLowerCase().includes(q) ||
                  (item.year && item.year.toLowerCase().includes(q)) ||
                  (item.award && item.award.toLowerCase().includes(q))
                );
              })
              .map(({ item, index }) => {
              const isSelected = index === activeItemIndex;
              const photoCount = item.images?.length || 0;
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveItemIndex(index)}
                  className={`group relative p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? "border-[#A855F7] bg-[#A855F7]/10 shadow-lg shadow-[#A855F7]/5"
                      : "border-white/10 bg-[#121316]/40 hover:border-white/20 hover:bg-[#121316]/80"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono text-[10px] font-bold text-[#A855F7] uppercase tracking-wider">
                      {item.year || "Date"}
                    </span>
                    <span
                      className="text-[9.5px] font-mono px-2 py-0.5 rounded-full border border-white/10"
                      style={{
                        color: item.awardColor || "#F59E0B",
                        borderColor: `${item.awardColor || "#F59E0B"}40`,
                        backgroundColor: `${item.awardColor || "#F59E0B"}15`,
                      }}
                    >
                      {item.award ? item.award.split("—")[0].trim() : "Sprint"}
                    </span>
                  </div>

                  <h4 className="font-display text-sm font-bold text-[#FFFFFF] line-clamp-1 group-hover:text-[#A855F7] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#A1A1AA] line-clamp-1 mt-0.5">
                    {item.organization}
                  </p>

                  {/* Photo count indicator, Visibility & Quick Reorder */}
                  <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/[0.06] text-[10px] font-mono">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleVisibility(index);
                        }}
                        title={
                          item.enabled !== false
                            ? "Affiché sur le site (Cliquer pour masquer)"
                            : "Masqué (Cliquer pour afficher)"
                        }
                        className={`p-1 rounded transition-colors cursor-pointer ${
                          item.enabled !== false
                            ? "text-emerald-400 hover:bg-emerald-400/20"
                            : "text-white/30 hover:bg-white/10"
                        }`}
                      >
                        {item.enabled !== false ? (
                          <Eye className="size-3.5" />
                        ) : (
                          <EyeOff className="size-3.5 text-amber-400" />
                        )}
                      </button>
                      <span className="text-[#A1A1AA] flex items-center gap-1">
                        <Camera className="size-3 text-white/50" />
                        <span>{photoCount === 0 ? "0" : `${photoCount}`}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-0.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveItem(index, "up");
                        }}
                        disabled={index === 0}
                        title="Monter d'un rang"
                        className="p-1 rounded text-white/50 hover:text-white disabled:opacity-20 cursor-pointer"
                      >
                        <ArrowUp className="size-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveItem(index, "down");
                        }}
                        disabled={index === items.length - 1}
                        title="Descendre d'un rang"
                        className="p-1 rounded text-white/50 hover:text-white disabled:opacity-20 cursor-pointer"
                      >
                        <ArrowDown className="size-3" />
                      </button>
                      <span className="font-bold text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-400/10 border border-cyan-400/20 ml-1">
                        #{index + 1}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Active Item Editor */}
        {activeItem && (
          <div className="lg:col-span-8 space-y-6 rounded-2xl border border-white/10 bg-[#121316]/50 p-6 backdrop-blur-xl">
            {/* Header: Identity & Delete */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#A855F7] uppercase tracking-wider">
                  Hackathon #{activeItemIndex + 1}
                </span>
                <span className="text-white/20">|</span>
                <span className="text-xs font-mono text-[#A1A1AA]">{activeItem.id}</span>
              </div>

              <button
                type="button"
                onClick={() => handleDeleteItem(activeItemIndex)}
                title="Supprimer ce hackathon"
                className="p-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer text-xs font-mono flex items-center gap-1.5"
              >
                <Trash2 className="size-3.5" />
                <span>Supprimer</span>
              </button>
            </div>

            {/* Barre de Contrôle : Ordre d'affichage & Visibilité */}
            <div className="p-3.5 rounded-xl border border-white/15 bg-white/[0.02] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
                  <ListOrdered className="size-4" />
                  <span>Ordre d&apos;affichage :</span>
                </span>
                <select
                  value={activeItemIndex}
                  onChange={(e) => handleMoveToPosition(activeItemIndex, Number(e.target.value))}
                  className="rounded-lg border border-white/15 bg-[#121316] px-3 py-1.5 font-mono text-xs text-white focus:border-cyan-400 focus:outline-none cursor-pointer"
                >
                  {items.map((_, pIdx) => (
                    <option key={pIdx} value={pIdx}>
                      Position #{pIdx + 1} {pIdx === 0 ? "★ (1ère carte / En avant)" : pIdx === items.length - 1 ? "(Dernière carte)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleMoveToTop(activeItemIndex)}
                  disabled={activeItemIndex === 0}
                  title="Placer en 1ère position (À la une)"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-xs font-mono text-white/80 hover:text-white hover:border-cyan-400 disabled:opacity-25 cursor-pointer"
                >
                  <ArrowUpToLine className="size-3.5 text-cyan-400" />
                  <span>1er</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveItem(activeItemIndex, "up")}
                  disabled={activeItemIndex === 0}
                  title="Monter d'un rang"
                  className="p-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-white/80 hover:text-white hover:border-white/20 disabled:opacity-25 cursor-pointer"
                >
                  <ArrowUp className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveItem(activeItemIndex, "down")}
                  disabled={activeItemIndex === items.length - 1}
                  title="Descendre d'un rang"
                  className="p-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-white/80 hover:text-white hover:border-white/20 disabled:opacity-25 cursor-pointer"
                >
                  <ArrowDown className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveToBottom(activeItemIndex)}
                  disabled={activeItemIndex === items.length - 1}
                  title="Placer en dernière position"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-xs font-mono text-white/80 hover:text-white hover:border-white/20 disabled:opacity-25 cursor-pointer"
                >
                  <ArrowDownToLine className="size-3.5" />
                  <span>Fin</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleVisibility(activeItemIndex)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                    activeItem.enabled !== false
                      ? "border border-emerald-500/30 bg-emerald-500/15 text-emerald-400 shadow-sm"
                      : "border border-amber-500/30 bg-amber-500/10 text-amber-400"
                  }`}
                >
                  {activeItem.enabled !== false ? (
                    <>
                      <Eye className="size-3.5" />
                      <span>Affiché sur le site</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="size-3.5" />
                      <span>Masqué du site</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 3 Clean Visual Navigation Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1.5 rounded-2xl bg-white/[0.03] border border-white/10">
              <button
                type="button"
                onClick={() => setEditorTab("info")}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-mono text-xs font-semibold transition-all cursor-pointer ${
                  editorTab === "info"
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-xs"
                    : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <Award className="size-3.5" />
                <span>1. Infos & Prix</span>
              </button>

              <button
                type="button"
                onClick={() => setEditorTab("photos")}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-mono text-xs font-semibold transition-all cursor-pointer ${
                  editorTab === "photos"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs"
                    : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <Camera className="size-3.5" />
                <span>2. Photos ({(activeItem.images || []).length})</span>
              </button>

              <button
                type="button"
                onClick={() => setEditorTab("tags")}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-mono text-xs font-semibold transition-all cursor-pointer ${
                  editorTab === "tags"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs"
                    : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <Palette className="size-3.5" />
                <span>3. Technologies & Tags ({activeItem.tags.length})</span>
              </button>
            </div>

            {/* TAB 1: General Info Form */}
            {editorTab === "info" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-200">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-mono text-xs uppercase tracking-wider text-[#A1A1AA]">
                  Titre du Hackathon / Compétition (Français) *
                </label>
                <input
                  type="text"
                  value={activeItem.title}
                  onChange={(e) => updateItemField(activeItemIndex, "title", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm text-[#FFFFFF] focus:border-[#A855F7] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-mono text-xs uppercase tracking-wider text-[#A1A1AA]">
                  Titre du Hackathon (Anglais - EN) *
                </label>
                <input
                  type="text"
                  value={activeItem.titleEn}
                  onChange={(e) => updateItemField(activeItemIndex, "titleEn", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm text-[#FFFFFF] focus:border-[#A855F7] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-xs uppercase tracking-wider text-[#A1A1AA]">
                  Organisateur / Entité / Événement *
                </label>
                <input
                  type="text"
                  value={activeItem.organization}
                  onChange={(e) => updateItemField(activeItemIndex, "organization", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm text-[#FFFFFF] focus:border-[#A855F7] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-xs uppercase tracking-wider text-[#A1A1AA]">
                  Période / Date (ex: Juillet 2026) *
                </label>
                <input
                  type="text"
                  value={activeItem.year}
                  onChange={(e) => updateItemField(activeItemIndex, "year", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm text-[#FFFFFF] focus:border-[#A855F7] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-xs uppercase tracking-wider text-[#A1A1AA]">
                  Lieu (ex: Afrique du Nord, Fès, Maroc)
                </label>
                <input
                  type="text"
                  value={activeItem.location}
                  onChange={(e) => updateItemField(activeItemIndex, "location", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm text-[#FFFFFF] focus:border-[#A855F7] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-xs uppercase tracking-wider text-[#A1A1AA]">
                  Statut du Hackathon
                </label>
                <select
                  value={activeItem.status || "completed"}
                  onChange={(e) =>
                    updateItemField(activeItemIndex, "status", e.target.value as "completed" | "in_progress")
                  }
                  className="w-full rounded-lg border border-white/10 bg-[#121316] px-3.5 py-2 text-sm text-[#FFFFFF] focus:border-[#A855F7] focus:outline-none cursor-pointer"
                >
                  <option value="completed">Terminé / Podium Validé</option>
                  <option value="in_progress">En cours / Inscription Confirmée</option>
                </select>
              </div>

              {/* Distinction / Prix Spécial */}
              <div className="space-y-1.5 sm:col-span-2 p-3.5 rounded-xl border border-purple-500/20 bg-purple-500/[0.04]">
                <div className="flex items-center gap-2 mb-1">
                  <Award className="size-4 text-purple-400" />
                  <span className="font-mono text-xs font-bold text-purple-300 uppercase tracking-wider">
                    Distinction, Prix ou Rang Obtenu
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-2">
                    <input
                      type="text"
                      placeholder="Ex: 1ʳᵉ Place — Champion Régional, 3ᵉ Prix National..."
                      value={activeItem.award || ""}
                      onChange={(e) => updateItemField(activeItemIndex, "award", e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm text-[#FFFFFF] focus:border-purple-400 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Ex: 1st Place — Regional Champion, 3rd National Prize..."
                      value={activeItem.awardEn || ""}
                      onChange={(e) => updateItemField(activeItemIndex, "awardEn", e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm text-[#FFFFFF] focus:border-purple-400 focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-[#A1A1AA]">Couleur :</span>
                    <input
                      type="color"
                      value={activeItem.awardColor || "#A855F7"}
                      onChange={(e) => updateItemField(activeItemIndex, "awardColor", e.target.value)}
                      className="size-8 rounded border border-white/20 bg-transparent cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GESTION DE LA PHOTO OFFICIELLE DU HACKATHON (PHOTO UNIQUE) */}
          {editorTab === "photos" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="font-display text-base font-bold text-[#FFFFFF] flex items-center gap-2">
                    <Camera className="size-4 text-cyan-400" />
                    <span>Photo Officielle du Hackathon</span>
                  </h3>
                  <p className="font-mono text-xs text-[#A1A1AA]">
                    Ajoutez la photo principale (podium, équipe, remise de prix). Le cadre s&apos;adapte automatiquement en couleurs naturelles.
                  </p>
                </div>
                <span className="font-mono text-xs text-cyan-400 font-bold px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20">
                  {(activeItem.images || []).length > 0 ? "1 Photo configurée" : "Aucune photo"}
                </span>
              </div>

              {/* Input fichier caché pour sélection */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    void handleUploadFiles(e.target.files);
                    e.target.value = "";
                  }
                }}
              />

              {/* Si une photo existe : aperçu dans son cadre adaptatif + actions directes */}
              {(activeItem.images || []).length > 0 ? (
                <div className="space-y-5">
                  <div className="p-4 sm:p-6 rounded-2xl border border-white/10 bg-[#0E0F14] space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold uppercase tracking-wider text-white/80 flex items-center gap-2">
                        <ImageIcon className="size-4 text-cyan-400" />
                        <span>Aperçu en Direct du Cadre</span>
                      </span>
                      <span className="font-mono text-[11px] text-cyan-400 font-medium">
                        {activeItem.imageFit === "contain" ? "Cadre Adapté (Photo Entière)" : "Plein Cadre (Cover)"}
                      </span>
                    </div>

                    {/* Cadre Adaptatif en Couleurs Naturelles */}
                    <div
                      className={`relative w-full rounded-2xl overflow-hidden border border-white/15 bg-black/80 flex items-center justify-center transition-all ${
                        activeItem.imageFit === "contain"
                          ? "min-h-[260px] max-h-[380px] p-2.5"
                          : "aspect-[16/10] max-h-[400px]"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={activeItem.images![0]}
                        alt={activeItem.title || "Photo hackathon"}
                        style={{
                          objectFit: activeItem.imageFit || "cover",
                          objectPosition: activeItem.imagePosition || "center",
                        }}
                        className={`transition-all duration-300 ${
                          activeItem.imageFit === "contain"
                            ? "max-h-[360px] w-auto max-w-full rounded-xl object-contain"
                            : "size-full object-cover"
                        }`}
                      />

                      {/* Badge Prix */}
                      {activeItem.award && (
                        <div className="absolute top-3.5 left-3.5 z-10">
                          <span
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border backdrop-blur-md shadow-lg"
                            style={{
                              color: activeItem.awardColor || "#38BDF8",
                              backgroundColor: "rgba(0, 0, 0, 0.75)",
                              borderColor: `${activeItem.awardColor || "#38BDF8"}60`,
                            }}
                          >
                            <span className="size-2 rounded-full animate-pulse" style={{ backgroundColor: activeItem.awardColor || "#38BDF8" }} />
                            <span>{activeItem.award}</span>
                          </span>
                        </div>
                      )}

                      {/* Badge Année */}
                      {activeItem.year && (
                        <div className="absolute top-3.5 right-3.5 z-10">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono tracking-widest text-white/90 bg-black/75 backdrop-blur-md border border-white/15">
                            {activeItem.year}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions Rapides : Remplacer ou Supprimer */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="font-mono text-xs text-white/50 truncate max-w-md" title={activeItem.images![0]}>
                        Fichier : {activeItem.images![0].startsWith("data:") ? "Image importée" : activeItem.images![0]}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploadingPhotos}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-400 text-black font-mono text-xs font-bold hover:bg-cyan-300 transition-colors cursor-pointer shadow-lg shadow-cyan-400/10 active:scale-95 disabled:opacity-50"
                        >
                          <UploadCloud className="size-4" />
                          <span>Remplacer par une autre photo</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleClearPhoto(activeItemIndex)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 font-mono text-xs font-medium hover:bg-red-500/20 transition-colors cursor-pointer active:scale-95"
                        >
                          <Trash2 className="size-3.5" />
                          <span>Retirer la photo</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Contrôles Cadrage & Dimensions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Mode d'adaptation */}
                    <div className="p-4 rounded-xl border border-white/10 bg-[#121316]/70 space-y-2.5">
                      <label className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
                        <Maximize2 className="size-3.5" />
                        <span>Mode d&apos;adaptation du cadre</span>
                      </label>
                      <p className="font-mono text-[11px] text-white/50">
                        Choisissez comment la photo s&apos;adapte aux dimensions :
                      </p>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {[
                          {
                            id: "contain",
                            label: "Photo Entière (Recommandé)",
                            desc: "Le cadre s'adapte sans rogner les têtes ou trophées",
                          },
                          {
                            id: "cover",
                            label: "Plein Cadre (Cover)",
                            desc: "Remplit tout l'espace 16:10",
                          },
                        ].map((fit) => {
                          const isSelected = (activeItem.imageFit || "cover") === fit.id;
                          return (
                            <button
                              key={fit.id}
                              type="button"
                              onClick={() => updateItemField(activeItemIndex, "imageFit", fit.id as "cover" | "contain")}
                              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                                isSelected
                                  ? "border-cyan-400 bg-cyan-400/15 text-white shadow-md shadow-cyan-400/10"
                                  : "border-white/10 bg-white/[0.02] text-white/70 hover:border-white/20 hover:text-white"
                              }`}
                            >
                              <div className="font-mono text-xs font-bold">{fit.label}</div>
                              <div className="text-[10px] text-white/50 mt-1 leading-tight">{fit.desc}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Point Focal Vertical */}
                    <div className="p-4 rounded-xl border border-white/10 bg-[#121316]/70 space-y-2.5">
                      <label className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
                        <Sliders className="size-3.5" />
                        <span>Alignement focal vertical</span>
                      </label>
                      <p className="font-mono text-[11px] text-white/50">
                        Zone à centrer en priorité dans le cadre :
                      </p>
                      <div className="grid grid-cols-3 gap-2 pt-1">
                        {[
                          { id: "top", label: "Haut", desc: "Visages & Trophées" },
                          { id: "center", label: "Centre", desc: "Équilibré standard" },
                          { id: "bottom", label: "Bas", desc: "Robots & Matériel" },
                        ].map((pos) => {
                          const isSelected = (activeItem.imagePosition || "center") === pos.id;
                          return (
                            <button
                              key={pos.id}
                              type="button"
                              onClick={() => updateItemField(activeItemIndex, "imagePosition", pos.id)}
                              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                                isSelected
                                  ? "border-cyan-400 bg-cyan-400/15 text-white shadow-md shadow-cyan-400/10"
                                  : "border-white/10 bg-white/[0.02] text-white/70 hover:border-white/20 hover:text-white"
                              }`}
                            >
                              <div className="font-mono text-xs font-bold">{pos.label}</div>
                              <div className="text-[10px] text-white/50 mt-1 leading-tight">{pos.desc}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Zone d'importation pour une photo unique */
                <div className="space-y-4">
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                        void handleUploadFiles(e.dataTransfer.files);
                      }
                    }}
                    onClick={() => {
                      if (!isUploadingPhotos) {
                        fileInputRef.current?.click();
                      }
                    }}
                    className={`relative p-8 sm:p-12 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center group select-none ${
                      isDragging
                        ? "border-cyan-400 bg-cyan-400/[0.08] scale-[1.01]"
                        : "border-white/15 bg-white/[0.02] hover:border-cyan-400/50 hover:bg-white/[0.04]"
                    }`}
                  >
                    {isUploadingPhotos ? (
                      <div className="flex flex-col items-center justify-center py-4 space-y-3">
                        <Loader2 className="size-10 text-cyan-400 animate-spin" />
                        <div className="font-mono text-sm font-bold text-white">
                          Importation de votre photo en cours...
                        </div>
                        <p className="font-mono text-xs text-white/50">
                          Traitement haute résolution en cours
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="size-16 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-400/20 transition-all shadow-md shadow-cyan-400/5">
                          <UploadCloud className="size-8" />
                        </div>
                        <div className="space-y-1">
                          <div className="font-mono text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                            Glissez votre photo ici ou cliquez pour choisir
                          </div>
                          <p className="font-mono text-xs text-white/50">
                            PNG, JPG, WEBP jusqu&apos;à 8 Mo · Une seule photo par hackathon
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-400 text-black font-mono text-xs font-bold shadow-lg shadow-cyan-400/15 group-hover:bg-cyan-300 transition-colors">
                          <ImageIcon className="size-4" />
                          <span>Choisir une photo sur mon ordinateur</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Fallback URL externe */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setShowUrlFallback(!showUrlFallback)}
                      className="font-mono text-[11px] text-white/40 hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <span>{showUrlFallback ? "▼ Masquer l'ajout par URL" : "▶ Ou coller une URL d'image externe"}</span>
                    </button>

                    {showUrlFallback && (
                      <div className="mt-2.5 p-3.5 rounded-xl border border-white/10 bg-[#121316]/60 space-y-2">
                        <div className="flex flex-col sm:flex-row gap-2.5">
                          <input
                            type="text"
                            placeholder="https://..."
                            value={newPhotoUrl}
                            onChange={(e) => setNewPhotoUrl(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddPhoto(activeItemIndex);
                              }
                            }}
                            className="flex-1 rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs text-[#FFFFFF] focus:border-cyan-400 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddPhoto(activeItemIndex)}
                            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-cyan-400/40 bg-cyan-400/15 px-3 py-1.5 font-mono text-xs font-bold text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all cursor-pointer shrink-0"
                          >
                            <Plus className="size-3.5" />
                            <span>Valider la photo</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TAGS & STACK DU HACKATHON */}
          {editorTab === "tags" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-base font-bold text-[#FFFFFF] flex items-center gap-2">
                    <Sparkles className="size-4 text-[#C8F122]" />
                    <span>Stack Technique & Tags du Sprint</span>
                  </h3>
                  <p className="font-mono text-xs text-[#A1A1AA]">
                    Ajoutez les technologies en francais et en anglais et personnalisez leurs couleurs.
                  </p>
                </div>
              </div>

              {/* Current Tags Chips */}
              <div className="flex flex-wrap gap-2 p-3.5 rounded-xl border border-white/10 bg-white/[0.02] min-h-[50px] items-center">
                {activeItem.tags.length === 0 ? (
                  <span className="text-xs font-mono text-[#A1A1AA] italic">
                    Aucun tag technique pour le moment.
                  </span>
                ) : (
                  activeItem.tags.map((tag, tagIdx) => {
                    const isCustom = tag.color && tag.color !== "standard" && tag.color.startsWith("#");
                    return (
                      <div
                        key={tagIdx}
                        style={
                          isCustom
                            ? {
                                color: tag.color,
                                borderColor: `${tag.color}45`,
                                backgroundColor: `${tag.color}15`,
                              }
                            : undefined
                        }
                        className={`group/chip inline-flex items-center gap-2 rounded-lg border px-3 py-1 font-mono text-xs transition-all ${
                          !isCustom
                            ? "border-white/10 bg-white/[0.04] text-[#FFFFFF]/80 hover:border-white/25"
                            : "shadow-sm"
                        }`}
                      >
                        <span className="font-medium">{tag.name}</span>
                        {tag.nameEn && tag.nameEn !== tag.name && (
                          <span className="text-[10px] text-cyan-400 font-mono">
                            (EN: {tag.nameEn})
                          </span>
                        )}
                        <span className="text-[10px] opacity-60">
                          {isCustom ? tag.color : "Standard"}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(activeItemIndex, tagIdx)}
                          className="size-4 rounded-full flex items-center justify-center text-[#A1A1AA] hover:text-red-400 hover:bg-red-400/10 transition-colors ml-1 cursor-pointer"
                          title="Supprimer ce tag"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Tag Builder */}
              <div className="p-4 rounded-xl border border-white/10 bg-[#121316]/80 space-y-4">
                <div className="font-mono text-xs uppercase tracking-wider text-[#C8F122] font-bold">
                  {"// Nouveau Tag Technique (Bilingue FR / EN)"}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-mono text-[11px] text-[#A1A1AA] uppercase tracking-wider">
                      Tag en Francais (FR) *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Intelligence Artificielle, Robotique, Vision par Ordinateur..."
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag(activeItemIndex);
                        }
                      }}
                      className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm text-[#FFFFFF] focus:border-[#C8F122] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[11px] text-[#A1A1AA] uppercase tracking-wider">
                      Tag en Anglais (EN - optionnel)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Artificial Intelligence, Robotics, Computer Vision..."
                      value={newTagNameEn}
                      onChange={(e) => setNewTagNameEn(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag(activeItemIndex);
                        }
                      }}
                      className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm text-[#FFFFFF] focus:border-[#C8F122] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                  <div className="sm:col-span-8 space-y-1.5">
                    <label className="font-mono text-[11px] text-[#A1A1AA] uppercase tracking-wider">
                      Style de Couleur
                    </label>
                    <select
                      value={newTagMode}
                      onChange={(e) => setNewTagMode(e.target.value as "standard" | "custom")}
                      className="w-full rounded-lg border border-white/10 bg-[#121316] px-3 py-2 text-xs font-mono text-[#FFFFFF] focus:border-[#C8F122] focus:outline-none cursor-pointer"
                    >
                      <option value="standard">Standard (Neutre)</option>
                      <option value="custom">Personnalise</option>
                    </select>
                  </div>

                  <div className="sm:col-span-4">
                    <button
                      type="button"
                      onClick={() => handleAddTag(activeItemIndex)}
                      className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#C8F122]/40 bg-[#C8F122]/15 px-4 py-2 font-mono text-xs font-bold text-[#C8F122] hover:bg-[#C8F122] hover:text-black transition-all cursor-pointer"
                    >
                      <Plus className="size-3.5" />
                      <span>Ajouter le tag</span>
                    </button>
                  </div>
                </div>

                {/* Color Chooser */}
                {newTagMode === "custom" && (
                  <div className="pt-2 border-t border-white/[0.06] space-y-3">
                    <div className="flex items-center gap-2">
                      <Palette className="size-3.5 text-[#C8F122]" />
                      <span className="font-mono text-xs text-[#A1A1AA]">
                        Couleur prédéfinie ou libre :
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {COLOR_PRESETS.map((preset) => (
                        <button
                          key={preset.value}
                          type="button"
                          onClick={() => setNewTagColor(preset.value)}
                          style={{
                            borderColor: newTagColor === preset.value ? preset.value : "rgba(255,255,255,0.1)",
                            backgroundColor: newTagColor === preset.value ? `${preset.value}25` : "rgba(255,255,255,0.03)",
                            color: preset.value,
                          }}
                          className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-mono transition-all hover:scale-105 cursor-pointer"
                        >
                          <span
                            className="size-2 rounded-full shadow-sm"
                            style={{ backgroundColor: preset.value }}
                          />
                          <span>{preset.label}</span>
                        </button>
                      ))}

                      {/* Custom Color Input */}
                      <div className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2 py-0.5 ml-1">
                        <input
                          type="color"
                          value={newTagColor}
                          onChange={(e) => setNewTagColor(e.target.value)}
                          className="size-6 rounded border-0 bg-transparent cursor-pointer"
                          title="Sélecteur hexadécimal libre"
                        />
                        <span className="font-mono text-xs text-[#FFFFFF] uppercase">{newTagColor}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>

      {/* Modal : Réorganisation Visuelle de l'Ordre */}
      {showReorderModal && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl"
          onClick={() => setShowReorderModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-white/20 bg-[#0e0f14] p-6 shadow-2xl space-y-5 scrollbar-thin scrollbar-thumb-white/10"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <ListOrdered className="size-5 text-cyan-400" />
                <div>
                  <h3 className="font-display text-lg font-bold text-white">
                    Organiser l&apos;Ordre d&apos;Affichage
                  </h3>
                  <p className="font-mono text-xs text-white/50">
                    Définissez l&apos;ordre exact des cartes dans le portfolio (1ère, 2ème, 3ème...)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowReorderModal(false)}
                className="size-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-2">
              {items.map((it, idx) => (
                <div
                  key={it.id}
                  className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition-all ${
                    idx === activeItemIndex
                      ? "border-cyan-400 bg-cyan-400/10"
                      : "border-white/10 bg-white/[0.02] hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="size-7 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center font-mono text-xs font-bold text-cyan-400 shrink-0">
                      #{idx + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="font-sans text-sm font-bold text-white truncate">
                        {it.title}
                      </div>
                      <div className="font-mono text-xs text-white/40 truncate">
                        {it.organization} · {it.year}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleVisibility(idx)}
                      title={it.enabled !== false ? "Affiché sur le site" : "Masqué"}
                      className={`p-1.5 rounded-lg border text-xs font-mono transition-colors cursor-pointer ${
                        it.enabled !== false
                          ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
                          : "border-white/10 bg-white/[0.03] text-white/30"
                      }`}
                    >
                      {it.enabled !== false ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMoveToTop(idx)}
                      disabled={idx === 0}
                      title="Placer en 1ère position"
                      className="p-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-cyan-400 hover:bg-cyan-400/20 disabled:opacity-20 cursor-pointer"
                    >
                      <ArrowUpToLine className="size-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMoveItem(idx, "up")}
                      disabled={idx === 0}
                      title="Monter d'un rang"
                      className="p-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-white/70 hover:text-white disabled:opacity-20 cursor-pointer"
                    >
                      <ArrowUp className="size-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMoveItem(idx, "down")}
                      disabled={idx === items.length - 1}
                      title="Descendre d'un rang"
                      className="p-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-white/70 hover:text-white disabled:opacity-20 cursor-pointer"
                    >
                      <ArrowDown className="size-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMoveToBottom(idx)}
                      disabled={idx === items.length - 1}
                      title="Placer en dernière position"
                      className="p-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-white/50 hover:text-white disabled:opacity-20 cursor-pointer"
                    >
                      <ArrowDownToLine className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <span className="font-mono text-xs text-white/50">
                Les modifications sont appliquées immédiatement. Pensez à enregistrer avec le bouton vert.
              </span>
              <button
                type="button"
                onClick={() => setShowReorderModal(false)}
                className="px-4 py-2 rounded-lg bg-cyan-400 text-black font-mono text-xs font-bold hover:bg-cyan-300 transition-colors cursor-pointer"
              >
                Terminer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
