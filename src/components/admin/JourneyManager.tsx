"use client";

import { useState } from "react";
import {
  Milestone,
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
} from "lucide-react";
import type { JourneyTimelineItem, JourneyTag } from "@/types/journey";

const COLOR_PRESETS = [
  { label: "Or / Ambre", value: "#F59E0B" },
  { label: "Émeraude", value: "#10B981" },
  { label: "Céladon Minéral", value: "#C8F122" },
  { label: "Cyan Électrique", value: "#00F0FF" },
  { label: "Rose Rubis", value: "#F43F5E" },
  { label: "Bleu Cobalt", value: "#3B82F6" },
  { label: "Orange", value: "#F97316" },
  { label: "Lime", value: "#84CC16" },
];

export function JourneyManager({ initialItems }: { initialItems: JourneyTimelineItem[] }) {
  const [items, setItems] = useState<JourneyTimelineItem[]>(initialItems);
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // New tag inputs per item
  const [newTagName, setNewTagName] = useState("");
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

  const handleAddTag = (itemIndex: number) => {
    const trimmed = newTagName.trim();
    if (!trimmed) return;

    const newTag: JourneyTag = {
      name: trimmed,
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

  const handleAddNewItem = () => {
    const newItem: JourneyTimelineItem = {
      id: `journey-${Date.now()}`,
      year: "2026 — EN COURS",
      title: "Nouvelle Réalisation / Expérience",
      titleEn: "New Engineering Achievement",
      organization: "Organisation ou Établissement",
      location: "Fès, Maroc",
      type: "experience",
      categoryLabel: "EXPÉRIENCE",
      categoryLabelEn: "EXPERIENCE",
      tags: [{ name: "Ingénierie Logicielle", color: "standard" }],
    };

    setItems((prev) => [...prev, newItem]);
    setActiveItemIndex(items.length);
  };

  const handleDeleteItem = (index: number) => {
    if (items.length <= 1) {
      setErrorMessage("Le parcours doit contenir au moins une étape.");
      return;
    }
    setItems((prev) => prev.filter((_, i) => i !== index));
    setActiveItemIndex((prev) => Math.max(0, prev - 1));
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

      setSuccessMessage("Parcours et tags enregistrés avec succès !");
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
          <div className="p-2.5 rounded-lg bg-[#C8F122]/10 border border-[#C8F122]/20 text-[#C8F122]">
            <Milestone className="size-5" />
          </div>
          <div>
            <h2 className="font-display text-base font-bold text-[#FFFFFF]">
              Étapes du Parcours ({items.length})
            </h2>
            <p className="font-mono text-xs text-[#A1A1AA]">
              Gérez les formations, expériences et personnalisez les tags avec leurs couleurs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleAddNewItem}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-mono font-medium text-[#FFFFFF] hover:border-[#C8F122] hover:bg-[#C8F122]/10 transition-colors cursor-pointer"
          >
            <Plus className="size-4 text-[#C8F122]" />
            <span>Ajouter une étape</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-lg bg-[#C8F122] px-5 py-2 font-mono text-xs font-bold text-black hover:bg-[#a882ff] transition-all shadow-md shadow-[#C8F122]/20 disabled:opacity-50 cursor-pointer"
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

      {/* Main Grid: Item Selector Sidebar + Detail Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left List of Timeline Items */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#A1A1AA] px-1 mb-2">
            Chronologie ({items.length})
          </div>

          <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10">
            {items.map((item, index) => {
              const isSelected = index === activeItemIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveItemIndex(index)}
                  className={`group relative p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? "border-[#C8F122] bg-[#C8F122]/10 shadow-lg shadow-[#C8F122]/5"
                      : "border-white/10 bg-[#121316]/40 hover:border-white/20 hover:bg-[#121316]/80"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono text-[10px] font-bold text-[#C8F122] uppercase tracking-wider">
                      {item.year || "Période"}
                    </span>
                    <span className="text-[9.5px] font-mono px-2 py-0.5 rounded-full border border-white/10 bg-white/[0.04] text-[#A1A1AA]">
                      {item.type === "experience" ? "Expérience" : "Formation"}
                    </span>
                  </div>

                  <h4 className="font-display text-sm font-bold text-[#FFFFFF] line-clamp-1 group-hover:text-[#C8F122] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#A1A1AA] line-clamp-1 mt-0.5">
                    {item.organization}
                  </p>

                  {/* Tags Preview Pills */}
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {item.tags.slice(0, 3).map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        style={
                          tag.color && tag.color !== "standard"
                            ? { color: tag.color, borderColor: `${tag.color}40`, backgroundColor: `${tag.color}15` }
                            : undefined
                        }
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                          tag.color === "standard" || !tag.color
                            ? "border-white/10 bg-white/[0.04] text-[#A1A1AA]"
                            : ""
                        }`}
                      >
                        {tag.name}
                      </span>
                    ))}
                    {item.tags.length > 3 && (
                      <span className="text-[9px] font-mono text-[#A1A1AA] self-center">
                        +{item.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Active Item Editor */}
        {activeItem && (
          <div className="lg:col-span-8 space-y-6 rounded-2xl border border-white/10 bg-[#121316]/50 p-6 backdrop-blur-xl">
            {/* Header with reordering & delete */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#C8F122] uppercase tracking-wider">
                  Étape #{activeItemIndex + 1}
                </span>
                <span className="text-white/20">|</span>
                <span className="text-xs text-[#A1A1AA]">{activeItem.id}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleMoveItem(activeItemIndex, "up")}
                  disabled={activeItemIndex === 0}
                  title="Monter dans le parcours"
                  className="p-1.5 rounded-lg border border-white/10 text-[#A1A1AA] hover:text-[#FFFFFF] hover:border-white/20 disabled:opacity-30 cursor-pointer"
                >
                  <ArrowUp className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveItem(activeItemIndex, "down")}
                  disabled={activeItemIndex === items.length - 1}
                  title="Descendre dans le parcours"
                  className="p-1.5 rounded-lg border border-white/10 text-[#A1A1AA] hover:text-[#FFFFFF] hover:border-white/20 disabled:opacity-30 cursor-pointer"
                >
                  <ArrowDown className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteItem(activeItemIndex)}
                  title="Supprimer cette étape"
                  className="p-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors ml-2 cursor-pointer"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>

            {/* General Info Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-mono text-xs uppercase tracking-wider text-[#A1A1AA]">
                  Titre Français *
                </label>
                <input
                  type="text"
                  value={activeItem.title}
                  onChange={(e) => updateItemField(activeItemIndex, "title", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm text-[#FFFFFF] focus:border-[#C8F122] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-mono text-xs uppercase tracking-wider text-[#A1A1AA]">
                  Titre Anglais (EN) *
                </label>
                <input
                  type="text"
                  value={activeItem.titleEn}
                  onChange={(e) => updateItemField(activeItemIndex, "titleEn", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm text-[#FFFFFF] focus:border-[#C8F122] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-xs uppercase tracking-wider text-[#A1A1AA]">
                  Organisation / Entreprise / École *
                </label>
                <input
                  type="text"
                  value={activeItem.organization}
                  onChange={(e) => updateItemField(activeItemIndex, "organization", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm text-[#FFFFFF] focus:border-[#C8F122] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-xs uppercase tracking-wider text-[#A1A1AA]">
                  Période / Année (ex: 2023 — EN COURS) *
                </label>
                <input
                  type="text"
                  value={activeItem.year}
                  onChange={(e) => updateItemField(activeItemIndex, "year", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm text-[#FFFFFF] focus:border-[#C8F122] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-xs uppercase tracking-wider text-[#A1A1AA]">
                  Lieu (ex: Fès, Maroc)
                </label>
                <input
                  type="text"
                  value={activeItem.location}
                  onChange={(e) => updateItemField(activeItemIndex, "location", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm text-[#FFFFFF] focus:border-[#C8F122] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-xs uppercase tracking-wider text-[#A1A1AA]">
                  Type
                </label>
                <select
                  value={activeItem.type}
                  onChange={(e) =>
                    updateItemField(activeItemIndex, "type", e.target.value as "education" | "experience")
                  }
                  className="w-full rounded-lg border border-white/10 bg-[#121316] px-3.5 py-2 text-sm text-[#FFFFFF] focus:border-[#C8F122] focus:outline-none cursor-pointer"
                >
                  <option value="experience">Expérience Professionnelle / Compétition</option>
                  <option value="education">Formation / Diplôme</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-xs uppercase tracking-wider text-[#A1A1AA]">
                  Statut de l&apos;étape (En cours vs Terminé)
                </label>
                <select
                  value={activeItem.status || (activeItem.year?.toUpperCase().includes("EN COURS") ? "in_progress" : "completed")}
                  onChange={(e) =>
                    updateItemField(activeItemIndex, "status", e.target.value as "completed" | "in_progress")
                  }
                  className="w-full rounded-lg border border-white/10 bg-[#121316] px-3.5 py-2 text-sm text-[#FFFFFF] focus:border-[#C8F122] focus:outline-none cursor-pointer"
                >
                  <option value="completed">Terminé / Effectué</option>
                  <option value="in_progress">En cours actuellement</option>
                </select>
              </div>

              {/* Award / Distinction Optional */}
              <div className="space-y-1.5 sm:col-span-2 p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/[0.04]">
                <div className="flex items-center gap-2 mb-1">
                  <Award className="size-4 text-amber-400" />
                  <span className="font-mono text-xs font-bold text-amber-300 uppercase tracking-wider">
                    Distinction ou Prix Spécial (Optionnel)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-2">
                    <input
                      type="text"
                      placeholder="Distinction en français (ex: 3ème Prix National...)"
                      value={activeItem.award || ""}
                      onChange={(e) => updateItemField(activeItemIndex, "award", e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm text-[#FFFFFF] focus:border-amber-400 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Distinction en anglais (ex: 3rd National Prize, 1st Regional Place...)"
                      value={activeItem.awardEn || ""}
                      onChange={(e) => updateItemField(activeItemIndex, "awardEn", e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm text-[#FFFFFF] focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-[#A1A1AA]">Couleur :</span>
                    <input
                      type="color"
                      value={activeItem.awardColor || "#F59E0B"}
                      onChange={(e) => updateItemField(activeItemIndex, "awardColor", e.target.value)}
                      className="size-8 rounded border border-white/20 bg-transparent cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* TAGS SECTION WITH CUSTOM COLOR OR STANDARD */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-base font-bold text-[#FFFFFF] flex items-center gap-2">
                    <Sparkles className="size-4 text-[#C8F122]" />
                    <span>Tags & Compétences de cette étape</span>
                  </h3>
                  <p className="font-mono text-xs text-[#A1A1AA]">
                    Ajoutez des tags et choisissez soit la couleur standard neutre, soit vos couleurs personnalisées
                  </p>
                </div>
              </div>

              {/* Current Tags Chips */}
              <div className="flex flex-wrap gap-2 p-3.5 rounded-xl border border-white/10 bg-white/[0.02] min-h-[50px] items-center">
                {activeItem.tags.length === 0 ? (
                  <span className="text-xs font-mono text-[#A1A1AA] italic">
                    Aucun tag pour le moment. Ajoutez-en ci-dessous.
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

              {/* Tag Builder (Input + Mode + Color Presets) */}
              <div className="p-4 rounded-xl border border-white/10 bg-[#121316]/80 space-y-4">
                <div className="font-mono text-xs uppercase tracking-wider text-[#C8F122] font-bold">
                  {"// Nouveau Tag"}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                  <div className="sm:col-span-6 space-y-1.5">
                    <label className="font-mono text-[11px] text-[#A1A1AA] uppercase tracking-wider">
                      Intitulé du Tag
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Cybersécurité, Zero-Trust, Python..."
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

                  <div className="sm:col-span-3 space-y-1.5">
                    <label className="font-mono text-[11px] text-[#A1A1AA] uppercase tracking-wider">
                      Style de Couleur
                    </label>
                    <select
                      value={newTagMode}
                      onChange={(e) => setNewTagMode(e.target.value as "standard" | "custom")}
                      className="w-full rounded-lg border border-white/10 bg-[#121316] px-3 py-2 text-xs font-mono text-[#FFFFFF] focus:border-[#C8F122] focus:outline-none cursor-pointer"
                    >
                      <option value="standard">⚪ Standard (Simple)</option>
                      <option value="custom">🎨 Personnalisé</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3">
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

                {/* Color Chooser (Presets + Color Picker) when in Custom Mode */}
                {newTagMode === "custom" && (
                  <div className="pt-2 border-t border-white/[0.06] space-y-3">
                    <div className="flex items-center gap-2">
                      <Palette className="size-3.5 text-[#C8F122]" />
                      <span className="font-mono text-xs text-[#A1A1AA]">
                        Choisissez une couleur vibrante prédéfinie ou libre :
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

                    {/* Live Badge Preview */}
                    <div className="flex items-center gap-3 pt-2">
                      <span className="font-mono text-[11px] text-[#A1A1AA]">Aperçu du rendu :</span>
                      <span
                        style={{
                          color: newTagColor,
                          borderColor: `${newTagColor}45`,
                          backgroundColor: `${newTagColor}15`,
                        }}
                        className="inline-flex items-center rounded-md border px-3 py-0.5 font-mono text-xs font-semibold shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                      >
                        {newTagName.trim() || "Aperçu Tag"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
