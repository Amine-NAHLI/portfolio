"use client";

import { useState, type KeyboardEvent } from "react";
import { Plus, X, Check, Sparkles } from "lucide-react";
import { CANONICAL_CATEGORIES, canonicalizeCategory } from "@/lib/project-categories";

interface ProjectCategoriesSelectorProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate?: () => void;
  isGenerating?: boolean;
}

export default function ProjectCategoriesSelector({
  value,
  onChange,
  onGenerate,
  isGenerating,
}: ProjectCategoriesSelectorProps) {
  const [newTagInput, setNewTagInput] = useState("");

  // Parse comma-separated list into array of trimmed strings
  const currentTags = value
    ? value
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const canonicalCurrentIds = currentTags.map((t) => canonicalizeCategory(t));

  const toggleCategory = (categoryId: string) => {
    const isSelected = canonicalCurrentIds.includes(categoryId);
    let updated: string[];

    if (isSelected) {
      // Remove any tags that map to this category ID
      updated = currentTags.filter((t) => canonicalizeCategory(t) !== categoryId);
    } else {
      // Add canonical ID
      updated = [...currentTags, categoryId];
    }

    onChange(updated.join(", "));
  };

  const addCustomTag = () => {
    const trimmed = newTagInput.trim();
    if (!trimmed) return;

    const canonicalId = canonicalizeCategory(trimmed);
    // Don't add duplicate
    if (!canonicalCurrentIds.includes(canonicalId)) {
      const updated = [...currentTags, canonicalId];
      onChange(updated.join(", "));
    }
    setNewTagInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCustomTag();
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updated = currentTags.filter((t) => t !== tagToRemove);
    onChange(updated.join(", "));
  };

  // Find any active tags that are not in the predefined canonical list
  const customActiveTags = currentTags.filter((tag) => {
    const canonical = canonicalizeCategory(tag);
    return !CANONICAL_CATEGORIES.some((c) => c.id === canonical);
  });

  return (
    <div className="grid gap-3 sm:col-span-2 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-sm font-semibold text-text-primary block">
            Domaines & Tags du Projet
          </span>
          <span className="text-xs text-text-muted">
            Sélectionnez les domaines standardisés ou ajoutez un nouveau tag personnalisé.
          </span>
        </div>

        {onGenerate && (
          <button
            type="button"
            onClick={onGenerate}
            disabled={isGenerating}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#9A71FF]/30 bg-[#9A71FF]/10 px-3 py-1.5 text-xs font-semibold text-[#9A71FF] hover:bg-[#9A71FF]/20 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="size-3.5" />
            <span>{isGenerating ? "Détection en cours…" : "Générer avec Groq"}</span>
          </button>
        )}
      </div>

      {/* Standardized Canonical Category Pills */}
      <div className="flex flex-wrap gap-2 pt-1">
        {CANONICAL_CATEGORIES.map((cat) => {
          const isSelected = canonicalCurrentIds.includes(cat.id);

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => toggleCategory(cat.id)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#9A71FF] text-[#000000] font-bold shadow-md shadow-[#9A71FF]/20"
                  : "border border-white/10 bg-white/[0.04] text-[#797681] hover:border-white/20 hover:text-[#f3f1f7]"
              }`}
            >
              {isSelected && <Check className="size-3 stroke-[3]" />}
              <span>{cat.label.fr}</span>
            </button>
          );
        })}
      </div>

      {/* Custom Active Tags (if any exist) */}
      {customActiveTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/[0.06]">
          <span className="text-[11px] font-mono text-[#797681] uppercase">Tags personnalisés :</span>
          {customActiveTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 text-xs text-[#9A71FF]"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-white transition-colors"
                title="Supprimer ce tag"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input to Add a New Custom Tag */}
      <div className="flex items-center gap-2 pt-2">
        <input
          type="text"
          value={newTagInput}
          onChange={(e) => setNewTagInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Créer un nouveau tag personnalisé..."
          className="flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-[#f3f1f7] placeholder:text-[#797681] focus:border-[#9A71FF] focus:outline-none"
        />
        <button
          type="button"
          onClick={addCustomTag}
          disabled={!newTagInput.trim()}
          className="inline-flex items-center gap-1 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-[#f3f1f7] hover:bg-white/20 transition-colors disabled:opacity-40 cursor-pointer"
        >
          <Plus className="size-3.5" />
          <span>Ajouter</span>
        </button>
      </div>
    </div>
  );
}

