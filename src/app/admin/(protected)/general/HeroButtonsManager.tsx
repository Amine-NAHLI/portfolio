"use client";

import { useState } from "react";
import { Plus, Trash2, ArrowUp, ArrowDown, Save } from "lucide-react";
import type { HeroActionButton } from "@/content/hero-buttons";
import { DEFAULT_HERO_BUTTONS } from "@/content/hero-buttons";
import { saveHeroButtons } from "./actions";

interface Props {
  initialButtons: HeroActionButton[];
}

export function HeroButtonsManager({ initialButtons }: Props) {
  const [buttons, setButtons] = useState<HeroActionButton[]>(
    initialButtons && initialButtons.length > 0 ? initialButtons : DEFAULT_HERO_BUTTONS
  );
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const toggleEnabled = (index: number) => {
    setButtons((prev) =>
      prev.map((btn, i) => (i === index ? { ...btn, enabled: !btn.enabled } : btn))
    );
  };

  const updateField = (index: number, field: keyof HeroActionButton, value: unknown) => {
    setButtons((prev) =>
      prev.map((btn, i) => (i === index ? { ...btn, [field]: value } : btn))
    );
  };

  const moveButton = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === buttons.length - 1)
    ) {
      return;
    }
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const newButtons = [...buttons];
    const temp = newButtons[index];
    newButtons[index] = newButtons[targetIndex];
    newButtons[targetIndex] = temp;
    setButtons(newButtons);
  };

  const addButton = () => {
    const newId = `btn-${Date.now()}`;
    const newBtn: HeroActionButton = {
      id: newId,
      labelFr: "Nouveau bouton",
      labelEn: "New Button",
      url: "#work",
      style: "secondary",
      enabled: true,
    };
    setButtons((prev) => [...prev, newBtn]);
  };

  const removeButton = (index: number) => {
    setButtons((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setPending(true);
    setMessage(null);
    try {
      const res = await saveHeroButtons(buttons);
      if (res.error) {
        setMessage({ type: "error", text: res.error });
      } else {
        setMessage({ type: "success", text: "Boutons de l'accueil enregistrés avec succès !" });
        setTimeout(() => setMessage(null), 5000);
      }
    } catch {
      setMessage({ type: "error", text: "Erreur lors de l'enregistrement des boutons." });
    } finally {
      setPending(false);
    }
  };

  return (
    <section className="technical-frame mt-8 p-0 flex flex-col rounded-3xl border border-white/10 bg-[#070A09] overflow-hidden shadow-2xl">
      <div className="border-b border-white/10 px-6 py-5 bg-[#060605] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#8FB3A2]">
            Configuration Visuelle
          </span>
          <h2 className="text-lg font-bold text-[#f3f1f7]">Boutons d&apos;Action de l&apos;Accueil (Hero)</h2>
          <p className="text-xs text-[#797681]">
            Activez, réordonnez et personnalisez les boutons affichés au centre sous votre nom (FR / EN).
          </p>
        </div>
        <button
          type="button"
          onClick={addButton}
          className="inline-flex items-center gap-2 rounded-xl border border-[#8FB3A2]/30 bg-[#8FB3A2]/10 px-4 py-2 text-xs font-bold text-[#8FB3A2] hover:bg-[#8FB3A2]/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="size-4" />
          <span>Ajouter un bouton</span>
        </button>
      </div>

      <div className="p-6 sm:p-8 space-y-4">
        {message && (
          <div
            className={`p-4 rounded-xl text-xs font-semibold border ${
              message.type === "success"
                ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                : "bg-rose-500/10 text-rose-300 border-rose-500/30"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="space-y-3">
          {buttons.map((btn, index) => (
            <div
              key={btn.id}
              className={`rounded-2xl border p-4 sm:p-5 transition-all flex flex-col gap-4 ${
                btn.enabled
                  ? "border-white/15 bg-[#060605]/80"
                  : "border-white/5 bg-[#060605]/30 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between gap-3 border-b border-white/5 pb-3">
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={btn.enabled}
                      onChange={() => toggleEnabled(index)}
                      className="size-4 rounded accent-[#8FB3A2] cursor-pointer"
                    />
                    <span className="text-xs font-bold text-[#f3f1f7]">
                      {btn.enabled ? "Affiché sur l'accueil" : "Masqué"}
                    </span>
                  </label>
                  <span className="text-[10px] font-mono text-[#797681]">ID: {btn.id}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveButton(index, "up")}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg text-[#797681] hover:text-[#f3f1f7] hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Monter"
                  >
                    <ArrowUp className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveButton(index, "down")}
                    disabled={index === buttons.length - 1}
                    className="p-1.5 rounded-lg text-[#797681] hover:text-[#f3f1f7] hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Descendre"
                  >
                    <ArrowDown className="size-3.5" />
                  </button>
                  {buttons.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeButton(index)}
                      className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors ml-1"
                      title="Supprimer ce bouton"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <label className="grid gap-1 font-semibold text-[#f3f1f7]">
                  <span className="text-[11px] text-[#797681]">Texte en Français</span>
                  <input
                    type="text"
                    value={btn.labelFr}
                    onChange={(e) => updateField(index, "labelFr", e.target.value)}
                    className="rounded-xl border border-white/10 bg-[#070A09] min-h-10 px-3 text-xs text-[#f3f1f7] focus:border-[#8FB3A2] focus:outline-none"
                    required
                  />
                </label>

                <label className="grid gap-1 font-semibold text-[#f3f1f7]">
                  <span className="text-[11px] text-[#797681]">Texte en Anglais</span>
                  <input
                    type="text"
                    value={btn.labelEn}
                    onChange={(e) => updateField(index, "labelEn", e.target.value)}
                    className="rounded-xl border border-white/10 bg-[#070A09] min-h-10 px-3 text-xs text-[#f3f1f7] focus:border-[#8FB3A2] focus:outline-none"
                    required
                  />
                </label>

                <label className="grid gap-1 font-semibold text-[#f3f1f7]">
                  <span className="text-[11px] text-[#797681]">Lien / Ancre</span>
                  <input
                    type="text"
                    value={btn.url}
                    onChange={(e) => updateField(index, "url", e.target.value)}
                    placeholder="#work, /cv, #contact..."
                    className="rounded-xl border border-white/10 bg-[#070A09] min-h-10 px-3 text-xs text-[#f3f1f7] font-mono focus:border-[#8FB3A2] focus:outline-none"
                    required
                  />
                </label>

                <label className="grid gap-1 font-semibold text-[#f3f1f7]">
                  <span className="text-[11px] text-[#797681]">Style Visuel</span>
                  <select
                    value={btn.style}
                    onChange={(e) =>
                      updateField(index, "style", e.target.value as "primary" | "secondary")
                    }
                    className="rounded-xl border border-white/10 bg-[#070A09] min-h-10 px-3 text-xs text-[#f3f1f7] focus:border-[#8FB3A2] focus:outline-none"
                  >
                    <option value="primary">Principal (Bouton Blanc Mis en Avant)</option>
                    <option value="secondary">Secondaire (Bouton Verre / Bordure)</option>
                  </select>
                </label>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-white/[0.08] flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-xl bg-[#8FB3A2] px-6 py-3 font-mono text-xs font-bold text-[#000000] hover:bg-[#A8C8B9] transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-[#8FB3A2]/20"
          >
            {pending ? (
              <span>Enregistrement en cours...</span>
            ) : (
              <>
                <Save className="size-4" />
                <span>Enregistrer la liste des boutons</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}