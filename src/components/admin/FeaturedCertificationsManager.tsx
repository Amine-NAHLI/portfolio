"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Award,
  Calendar,
  Check,
  FileText,
  Loader2,
  Plus,
  RotateCcw,
  Save,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { saveFeaturedHomeCertifications } from "@/app/admin/(protected)/featured-certifications/actions";

export interface AdminCertOption {
  id: string;
  nameFr: string;
  nameEn: string;
  issuer: string | null;
  issuedOn: string | null;
  credentialStatus: string;
  skills: string[];
  hasDocument: boolean;
  documentMimeType?: string | null;
  verificationUrl?: string | null;
}

interface FeaturedCertificationsManagerProps {
  allCertifications: AdminCertOption[];
  initialFeaturedIds: string[];
}

export function FeaturedCertificationsManager({
  allCertifications,
  initialFeaturedIds,
}: FeaturedCertificationsManagerProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialFeaturedIds);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const certMap = new Map(allCertifications.map((c) => [c.id, c]));

  const handleAddCert = (id: string) => {
    if (selectedIds.includes(id)) return;
    if (selectedIds.length >= 3) {
      setStatus({
        type: "error",
        message: "Vous avez déjà sélectionné 3 certifications. Retirez-en une pour en ajouter une autre.",
      });
      return;
    }
    setSelectedIds([...selectedIds, id]);
    setStatus(null);
  };

  const handleRemoveSlot = (index: number) => {
    const updated = selectedIds.filter((_, idx) => idx !== index);
    setSelectedIds(updated);
    setStatus(null);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...selectedIds];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setSelectedIds(updated);
    setStatus(null);
  };

  const handleMoveDown = (index: number) => {
    if (index >= selectedIds.length - 1) return;
    const updated = [...selectedIds];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setSelectedIds(updated);
    setStatus(null);
  };

  const handleReset = () => {
    setSelectedIds(initialFeaturedIds);
    setStatus(null);
  };

  const handleSave = () => {
    startTransition(async () => {
      setStatus(null);
      const res = await saveFeaturedHomeCertifications(selectedIds);
      if (res.error) {
        setStatus({ type: "error", message: res.error });
      } else {
        setStatus({
          type: "success",
          message: "✓ Configuration enregistrée ! Les 3 certifications sélectionnées sont désormais affichées sur la page d'accueil.",
        });
      }
    });
  };

  const filteredCerts = allCertifications.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.nameFr.toLowerCase().includes(q) ||
      (c.issuer && c.issuer.toLowerCase().includes(q)) ||
      c.skills.some((s) => s.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-10">
      {/* Top Banner with Stats & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-surface/70 p-5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-accent/15 border border-accent/30 text-accent">
            <Award className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-sm font-bold uppercase tracking-wider text-text-primary">
                Vitrine Certifications Accueil
              </h2>
              <span
                className={`rounded-full px-2.5 py-0.5 font-mono text-[11px] font-bold ${
                  selectedIds.length === 3
                    ? "border border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
                    : "border border-amber-500/30 bg-amber-500/15 text-amber-300"
                }`}
              >
                {selectedIds.length} / 3 Sélectionnées
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              Choisissez les 3 diplômes ou certifications officiels mis en valeur sur la première page.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-surface-raised px-4 py-2.5 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-white/10 transition-all disabled:opacity-50"
          >
            <RotateCcw className="size-3.5" />
            <span>Réinitialiser</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-xs font-bold text-text-on-accent shadow-lg shadow-accent/25 hover:bg-accent/90 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            <span>Enregistrer les 3 Certifications</span>
          </button>
        </div>
      </div>

      {/* Status Feedback Alerts */}
      {status?.type === "error" && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-medium text-red-300 animate-in fade-in">
          {status.message}
        </div>
      )}
      {status?.type === "success" && (
        <div className="flex items-center justify-between rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-medium text-emerald-300 animate-in fade-in">
          <span>{status.message}</span>
          <Link
            href="/fr#certifications"
            target="_blank"
            className="inline-flex items-center gap-1 font-mono text-xs font-bold uppercase tracking-wider text-emerald-400 hover:underline ml-4"
          >
            <span>Voir sur l&apos;accueil</span>
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      )}

      {/* The 3 Certification Slots */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-text-muted flex items-center gap-2">
            <Sparkles className="size-3.5 text-accent" />
            <span>Les 3 Cartes de la Page d&apos;Accueil</span>
          </h3>
          <span className="font-mono text-[11px] text-text-muted">
            Affichage en grille symétrique de 3 colonnes sur l&apos;accueil
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[0, 1, 2].map((slotIndex) => {
            const id = selectedIds[slotIndex];
            const cert = id ? certMap.get(id) : null;

            if (cert) {
              return (
                <div
                  key={`slot-${slotIndex}-${id}`}
                  className="group relative flex flex-col justify-between rounded-2xl border border-accent/40 bg-surface/90 p-5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-accent hover:shadow-accent/10"
                >
                  <div>
                    {/* Header Controls */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                      <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-accent">
                        <span className="grid size-5 place-items-center rounded-md bg-accent/20 text-[10px]">
                          0{slotIndex + 1}
                        </span>
                        <span className="text-[11px] uppercase tracking-wider">
                          Emplacement 0{slotIndex + 1}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveUp(slotIndex)}
                          disabled={slotIndex === 0}
                          title="Déplacer vers la gauche / haut"
                          className="grid size-7 place-items-center rounded-lg border border-white/10 bg-surface-raised text-text-secondary hover:text-white hover:bg-white/10 transition-colors disabled:opacity-25"
                        >
                          <ArrowUp className="size-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveDown(slotIndex)}
                          disabled={slotIndex === selectedIds.length - 1}
                          title="Déplacer vers la droite / bas"
                          className="grid size-7 place-items-center rounded-lg border border-white/10 bg-surface-raised text-text-secondary hover:text-white hover:bg-white/10 transition-colors disabled:opacity-25"
                        >
                          <ArrowDown className="size-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveSlot(slotIndex)}
                          title="Retirer de l'accueil"
                          className="grid size-7 place-items-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors ml-1"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    </div>

                    {/* Cert Info */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="rounded-full bg-accent/10 border border-accent/20 px-2.5 py-0.5 font-mono text-[10px] font-bold text-accent">
                        {cert.issuer || "Organisme Agréé"}
                      </span>
                      {cert.issuedOn && (
                        <span className="flex items-center gap-1 font-mono text-[10px] text-text-muted">
                          <Calendar className="size-3" />
                          {cert.issuedOn}
                        </span>
                      )}
                    </div>

                    <h4 className="font-display text-base font-bold text-text-primary leading-snug line-clamp-2 mt-2">
                      {cert.nameFr}
                    </h4>

                    {cert.hasDocument && (
                      <div className="mt-3 flex items-center gap-1.5 text-emerald-400 text-[11px] font-mono">
                        <FileText className="size-3.5" />
                        <span>Document officiel vérifiable</span>
                      </div>
                    )}
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1 pt-3 mt-3 border-t border-white/5">
                    {cert.skills.slice(0, 4).map((s) => (
                      <span
                        key={s}
                        className="rounded border border-white/10 bg-white/[0.02] px-1.5 py-0.5 font-mono text-[9px] text-text-secondary"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <div
                key={`empty-slot-${slotIndex}`}
                className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/15 bg-surface/30 p-6 text-center transition-all hover:border-accent/40 hover:bg-surface/50 min-h-[190px]"
              >
                <div className="grid size-9 place-items-center rounded-xl border border-white/10 bg-surface-raised text-text-muted mb-2 font-mono text-xs font-bold">
                  0{slotIndex + 1}
                </div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-text-primary">
                  Emplacement Libre
                </span>
                <p className="text-[11px] text-text-muted max-w-[180px] mt-1 leading-normal">
                  Cliquez sur &quot;Choisir&quot; sur une certification ci-dessous.
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Available Certifications Library */}
      <div className="space-y-6 pt-4 border-t border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-lg font-bold uppercase tracking-tight text-text-primary">
              Toutes les Certifications ({allCertifications.length})
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Sélectionnez les certifications que vous souhaitez afficher dans les 3 emplacements de l&apos;accueil.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-text-muted" />
            <input
              type="text"
              placeholder="Rechercher par titre, organisme, compétence..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-surface/70 pl-10 pr-4 py-2 text-xs text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCerts.map((cert) => {
            const isSelected = selectedIds.includes(cert.id);
            const slotIndex = selectedIds.indexOf(cert.id);

            return (
              <div
                key={cert.id}
                className={`relative flex flex-col justify-between rounded-2xl border p-4 backdrop-blur-xl transition-all duration-300 ${
                  isSelected
                    ? "border-accent/60 bg-accent/[0.04] ring-1 ring-accent/30 shadow-md"
                    : "border-white/10 bg-surface/70 hover:border-white/20 hover:bg-surface-raised/80"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5 mb-2.5">
                    <span className="font-mono text-[10px] uppercase font-bold text-accent">
                      {cert.issuer || "Certificat"}
                    </span>

                    {isSelected ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-400">
                        <Check className="size-3" />
                        <span>Slot 0{slotIndex + 1}</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleAddCert(cert.id)}
                        disabled={selectedIds.length >= 3}
                        className="inline-flex items-center gap-1 rounded-lg bg-accent/20 border border-accent/40 px-2.5 py-1 font-mono text-xs font-bold text-accent hover:bg-accent hover:text-text-on-accent transition-all disabled:opacity-30 disabled:pointer-events-none"
                      >
                        <Plus className="size-3.5" />
                        <span>Choisir</span>
                      </button>
                    )}
                  </div>

                  <h4 className="font-display text-sm font-bold text-text-primary leading-snug">
                    {cert.nameFr}
                  </h4>

                  {cert.issuedOn && (
                    <p className="text-[11px] font-mono text-text-muted mt-1">
                      Délivré en : {cert.issuedOn}
                    </p>
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] text-text-muted font-mono">
                  <span>{cert.skills.length} compétences</span>
                  {isSelected && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSlot(slotIndex)}
                      className="text-red-400 hover:text-red-300 font-semibold"
                    >
                      Retirer
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

