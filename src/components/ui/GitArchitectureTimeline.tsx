"use client";

import { useEffect, useState, useCallback, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GitBranch, 
  GitCommit, 
  Terminal, 
  Copy, 
  Check, 
  MapPin, 
  ChevronLeft, 
  ChevronRight, 
  Briefcase, 
  GraduationCap, 
  Trophy,
  Code2
} from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { JourneyTimelineItem } from "@/types/journey";
import { BorderBeam } from "@/components/magicui/border-beam";

interface GitArchitectureTimelineProps {
  locale: Locale;
  items: JourneyTimelineItem[];
}

type BranchMeta = {
  name: string;
  color: string;
  labelFr: string;
  labelEn: string;
};

const BRANCHES: Record<string, BranchMeta> = {
  main: {
    name: "main",
    color: "#38BDF8", // Sky / Cyan
    labelFr: "Tronc Académique & Fondations",
    labelEn: "Academic Core & Foundations",
  },
  "feat/cyber-defense": {
    name: "feat/cyber-defense",
    color: "#10B981", // Emerald
    labelFr: "Cybersécurité Défensive & IAM",
    labelEn: "Defensive Cyber & IAM",
  },
  "feat/ai-vision": {
    name: "feat/ai-vision",
    color: "#A855F7", // Purple
    labelFr: "IA Appliquée & Modèles Gemma",
    labelEn: "Applied AI & Gemma Models",
  },
  "feat/robotics-embedded": {
    name: "feat/robotics-embedded",
    color: "#F59E0B", // Amber
    labelFr: "Systèmes Embarqués & Robotique",
    labelEn: "Embedded Systems & Robotics",
  },
};

const ITEM_GIT_METADATA: Record<
  string,
  {
    branch: string;
    hash: string;
    scope: string;
    diffFr: string[];
    diffEn: string[];
  }
> = {
  "bac-sm": {
    branch: "main",
    hash: "8a1f09c",
    scope: "foundation",
    diffFr: [
      "+ Spécialité : Mathématiques Pures, Algèbre Abstraite & Analyse",
      "+ Établissement : Fès City School — Mention Très Bien",
      "+ Socle : Rigueur logique formelle, calcul différentiel & physique",
    ],
    diffEn: [
      "+ Track: Pure Mathematics, Abstract Algebra & Real Analysis",
      "+ Institution: Fes City School — Highest Honors",
      "+ Foundation: Formal logical deduction & physical systems modeling",
    ],
  },
  "upf-cycle-ing": {
    branch: "main",
    hash: "4c2d81b",
    scope: "engineering-core",
    diffFr: [
      "+ Cursus : Diplôme d'Ingénieur d'État en Génie Informatique (4ᵉ Année)",
      "+ Institution : Université Privée de Fès (UPF)",
      "+ Spécialisation : Cybersécurité Défensive & Systèmes Intelligents",
      "+ Architecture : Systèmes distribués, génie logiciel, réseaux & OS",
    ],
    diffEn: [
      "+ Program: State Computer Engineering Degree (4th Year active)",
      "+ Institution: Private University of Fez (UPF)",
      "+ Focus: Defensive Cybersecurity & Applied Intelligent Systems",
      "+ Systems: Distributed architecture, software engineering, OS & networks",
    ],
  },
  "robotics-upf": {
    branch: "feat/robotics-embedded",
    hash: "9d3e52f",
    scope: "hardware-rtos",
    diffFr: [
      "+ Distinction : 3ᵉ Prix National — Compétition Nationale de Robotique (9ᵉ Éd.)",
      "+ Matériel : Microcontrôleurs temps réel, télémétrie capteurs & actionneurs",
      "+ Logiciel : Algorithmique embarquée C++ et asservissement de trajectoire",
    ],
    diffEn: [
      "+ Award: 3rd National Prize — 9th National Robotics Competition",
      "+ Hardware: Real-time microcontrollers, sensor telemetry & motor drivers",
      "+ Software: Embedded C++ algorithms & closed-loop trajectory tracking",
    ],
  },
  "inteltrust-stage": {
    branch: "feat/cyber-defense",
    hash: "2e7a14d",
    scope: "security-audit",
    diffFr: [
      "+ Sécurité : Politiques Zero-Trust & gouvernance d'habilitations (IAM)",
      "+ Télémétrie : Dissection de trames réseau avec Scapy & Wireshark",
      "+ Audit : Analyse d'APIs selon OWASP et durcissement d'environnements Linux",
    ],
    diffEn: [
      "+ Security: Zero-Trust policies & strict IAM access governance",
      "+ Telemetry: Network frame dissection using Python Scapy & Wireshark",
      "+ Audit: OWASP API surface mapping & Linux server hardening",
    ],
  },
  "gemma-hackathon": {
    branch: "feat/ai-vision",
    hash: "f190c3e",
    scope: "llm-inference",
    diffFr: [
      "+ Victoire : 1ʳᵉ Place Régionale — Google Build with Gemma Hackathon",
      "+ Modèle : Fine-tuning de Google Gemma 2 (techniques LoRA / QLoRA)",
      "+ Pipeline : Traitement vidéo temps réel & inférence locale optimisée",
      "+ Jurys : Projet lauréat sélectionné par AI Crafters & GDG on Campus",
    ],
    diffEn: [
      "+ Victory: 1st Place Champion (North Africa Region)",
      "+ Model: Google Gemma 2 open LLM fine-tuning (LoRA / QLoRA)",
      "+ Pipeline: Real-time computer vision & low-latency edge inference",
      "+ Jury: Winning implementation awarded by AI Crafters & GDG on Campus",
    ],
  },
};

function getBranchForItem(item: JourneyTimelineItem) {
  if (ITEM_GIT_METADATA[item.id]) {
    return ITEM_GIT_METADATA[item.id];
  }

  const titleLower = (item.title + " " + item.categoryLabel).toLowerCase();
  let branchName = "main";
  let scope = "task";

  if (titleLower.includes("gemma") || titleLower.includes("ia") || titleLower.includes("intelligence")) {
    branchName = "feat/ai-vision";
    scope = "ai-system";
  } else if (titleLower.includes("cyber") || titleLower.includes("audit") || titleLower.includes("sécurité")) {
    branchName = "feat/cyber-defense";
    scope = "security";
  } else if (titleLower.includes("robot") || titleLower.includes("embarqu")) {
    branchName = "feat/robotics-embedded";
    scope = "embedded";
  }

  let num = 0;
  for (let i = 0; i < item.id.length; i++) num = (num << 5) - num + item.id.charCodeAt(i);
  const hash = Math.abs(num).toString(16).padStart(7, "0").slice(0, 7);

  return {
    branch: branchName,
    hash,
    scope,
    diffFr: [
      `+ Jalon : ${item.title}`,
      `+ Organisation : ${item.organization}`,
      `+ Période : ${item.year}`,
    ],
    diffEn: [
      `+ Milestone: ${item.titleEn || item.title}`,
      `+ Organization: ${item.organization}`,
      `+ Period: ${item.year}`,
    ],
  };
}

export default function GitArchitectureTimeline({ locale, items }: GitArchitectureTimelineProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const total = items.length;
  const currentItem = items[activeIndex] || items[0];
  const currentMeta = getBranchForItem(currentItem);
  const currentBranch = BRANCHES[currentMeta.branch] || BRANCHES.main;
  const isEducation = currentItem.type === "education";
  const NodeIcon = currentItem.award ? Trophy : isEducation ? GraduationCap : Briefcase;
  const title = locale === "fr" ? currentItem.title : (currentItem.titleEn || currentItem.title);
  const categoryLabel = locale === "fr" ? currentItem.categoryLabel : (currentItem.categoryLabelEn || currentItem.categoryLabel);
  const award = locale === "fr" ? currentItem.award : (currentItem.awardEn || currentItem.award);
  const diffLines = locale === "fr" ? currentMeta.diffFr : currentMeta.diffEn;

  const goToCommit = useCallback((targetIndex: number) => {
    if (targetIndex < 0 || targetIndex >= total || targetIndex === activeIndex) return;
    setDirection(targetIndex > activeIndex ? 1 : -1);
    setActiveIndex(targetIndex);
  }, [activeIndex, total]);

  const prevCommit = useCallback(() => {
    if (activeIndex > 0) {
      setDirection(-1);
      setActiveIndex((prev) => prev - 1);
    }
  }, [activeIndex]);

  const nextCommit = useCallback(() => {
    if (activeIndex < total - 1) {
      setDirection(1);
      setActiveIndex((prev) => prev + 1);
    }
  }, [activeIndex, total]);

  // Keyboard navigation (Left / Right arrows)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is inside an input or textarea
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === "ArrowLeft") {
        prevCommit();
      } else if (e.key === "ArrowRight") {
        nextCommit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevCommit, nextCommit]);

  const copyHash = (hash: string) => {
    navigator.clipboard?.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 1800);
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. Terminal Shell Header & Live Git Command */}
      <div className="rounded-2xl border border-border-strong bg-surface-raised/95 p-4 sm:p-5 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3.5 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-surface border border-border text-accent">
              <Terminal className="size-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-accent font-bold">$</span>
                <span className="text-text-primary font-semibold">
                  git checkout {currentMeta.hash} -- ({currentBranch.name})
                </span>
              </div>
              <p className="text-[11px] font-mono text-text-muted mt-0.5">
                {locale === "fr"
                  ? `Jalon ${activeIndex + 1} sur ${total} · HEAD -> ${currentBranch.name}`
                  : `Milestone ${activeIndex + 1} of ${total} · HEAD -> ${currentBranch.name}`}
              </p>
            </div>
          </div>

          {/* Direct Prev / Next Quick Controls */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={prevCommit}
              disabled={activeIndex === 0}
              aria-label="Jalon précédent"
              className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 font-mono text-xs font-semibold text-text-secondary hover:text-text-primary hover:border-accent/40 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
            >
              <ChevronLeft className="size-3.5" />
              <span className="hidden sm:inline">{locale === "fr" ? "Précédent" : "Prev"}</span>
            </button>
            <button
              type="button"
              onClick={nextCommit}
              disabled={activeIndex === total - 1}
              aria-label="Jalon suivant"
              className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 font-mono text-xs font-semibold text-text-secondary hover:text-text-primary hover:border-accent/40 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
            >
              <span className="hidden sm:inline">{locale === "fr" ? "Suivant" : "Next"}</span>
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        </div>

        {/* 2. Interactive Git Branch Scrubber Ribbon */}
        <div className="relative pt-2 pb-1 overflow-x-auto select-none no-scrollbar">
          <div className="flex items-center justify-between min-w-[580px] sm:min-w-0 relative px-4">
            
            {/* Connecting Railway Track Line */}
            <div 
              aria-hidden="true" 
              className="absolute left-6 right-6 top-4 h-0.5 bg-border -z-0"
            />
            {/* Active Progress Fill */}
            <div 
              aria-hidden="true" 
              className="absolute left-6 top-4 h-0.5 transition-all duration-300 -z-0"
              style={{
                width: `${(activeIndex / Math.max(1, total - 1)) * 100}%`,
                maxWidth: "calc(100% - 3rem)",
                backgroundColor: currentBranch.color,
              }}
            />

            {items.map((item, idx) => {
              const itemMeta = getBranchForItem(item);
              const branchMeta = BRANCHES[itemMeta.branch] || BRANCHES.main;
              const isActive = idx === activeIndex;
              const isPast = idx < activeIndex;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => goToCommit(idx)}
                  className="group/node relative z-10 flex flex-col items-center cursor-pointer transition-transform duration-200 hover:scale-105 focus:outline-none"
                >
                  {/* Git Commit Bead */}
                  <div
                    className={`size-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      isActive
                        ? "bg-bg-page scale-110 shadow-lg"
                        : isPast
                          ? "bg-bg-page"
                          : "bg-surface border-border opacity-70 group-hover/node:opacity-100"
                    }`}
                    style={{
                      borderColor: isActive || isPast ? branchMeta.color : undefined,
                      boxShadow: isActive ? `0 0 16px ${branchMeta.color}45` : undefined,
                    }}
                  >
                    <span
                      className="size-2 rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: isActive || isPast ? branchMeta.color : "currentColor",
                      }}
                    />
                  </div>

                  {/* Node Label Below */}
                  <div className="mt-2 text-center flex flex-col items-center">
                    <span
                      className={`font-mono text-[10px] tracking-wider transition-colors duration-200 ${
                        isActive
                          ? "font-bold text-text-primary"
                          : "text-text-muted group-hover/node:text-text-secondary"
                      }`}
                    >
                      {itemMeta.hash}
                    </span>
                    <span 
                      className="text-[9px] font-mono px-1.5 py-0.2 rounded mt-0.5 opacity-80"
                      style={{
                        color: branchMeta.color,
                        backgroundColor: `${branchMeta.color}14`,
                      }}
                    >
                      {branchMeta.name.replace("feat/", "")}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Cinematic Transition Stage: Displays ONLY the Active Card */}
      <div className="relative min-h-[420px] flex flex-col justify-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentItem.id}
            initial={{ opacity: 0, x: direction > 0 ? 35 : -35, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: direction > 0 ? -35 : 35, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -50) {
                nextCommit();
              } else if (info.offset.x > 50) {
                prevCommit();
              }
            }}
            className="w-full relative overflow-hidden rounded-3xl border border-border-strong bg-surface p-6 sm:p-8 shadow-2xl backdrop-blur-xl transition-colors"
          >
            {/* Dynamic Branch Laser Border Beam (Magic UI) */}
            <BorderBeam
              size={240}
              duration={8}
              colorFrom={currentBranch.color}
              colorTo="#FFFFFF"
              borderWidth={1.5}
            />

            {/* Top Commit Meta Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                {/* Branch Badge */}
                <div
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs font-semibold border shadow-xs"
                  style={{
                    borderColor: `${currentBranch.color}45`,
                    backgroundColor: `${currentBranch.color}12`,
                    color: currentBranch.color,
                  }}
                >
                  <GitBranch className="size-3" />
                  <span>{currentBranch.name}</span>
                </div>

                {/* Commit Hash Pill */}
                <button
                  type="button"
                  onClick={() => copyHash(currentMeta.hash)}
                  title="Copy commit hash"
                  className="group/hash inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-raised px-2.5 py-1 font-mono text-xs text-text-secondary hover:text-text-primary hover:border-accent/40 transition-colors cursor-pointer"
                >
                  <span className="font-semibold text-accent">commit</span>
                  <span>{currentMeta.hash}</span>
                  {copiedHash === currentMeta.hash ? (
                    <Check className="size-3 text-success ml-0.5" />
                  ) : (
                    <Copy className="size-3 opacity-50 group-hover/hash:opacity-100 transition-opacity ml-0.5" />
                  )}
                </button>
              </div>

              {/* Date & Location */}
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="font-semibold text-text-primary text-sm">{currentItem.year}</span>
                <span className="text-text-muted/40">·</span>
                <span className="text-text-muted flex items-center gap-1 text-xs">
                  <MapPin className="size-3.5 text-text-muted" />
                  {currentItem.location}
                </span>
              </div>
            </div>

            {/* Main Milestone Body */}
            <div className="py-6 sm:py-7">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
                <div className="space-y-2 max-w-3xl">
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-text-muted">
                    {categoryLabel}
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-text-primary leading-snug">
                    {title}
                  </h3>
                  <p className="text-sm sm:text-base text-text-secondary font-medium">
                    {currentItem.organization}
                  </p>
                </div>

                {/* Avatar Icon */}
                <div
                  className="size-14 rounded-2xl border flex items-center justify-center shrink-0 shadow-sm"
                  style={{
                    borderColor: `${currentBranch.color}40`,
                    backgroundColor: `${currentBranch.color}10`,
                    color: currentBranch.color,
                  }}
                >
                  <NodeIcon className="size-7" />
                </div>
              </div>

              {/* Honor / Award Highlight Banner */}
              {award && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-400 shadow-xs">
                  <Trophy className="size-4 text-amber-400 shrink-0" />
                  <span>{award}</span>
                </div>
              )}

              {/* Tech Tags */}
              <div className="flex flex-wrap gap-2 pt-5">
                {currentItem.tags.map((tag, tIdx) => {
                  const tagName = typeof tag === "string" ? tag : tag.name;
                  return (
                    <span
                      key={`${currentItem.id}-tag-${tIdx}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-raised px-3 py-1 font-mono text-xs text-text-secondary"
                    >
                      <Code2 className="size-3 text-text-muted" />
                      <span>{tagName}</span>
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Engineering Changelog & Diff Block */}
            <div className="pt-4 border-t border-border">
              <div className="rounded-2xl border border-border bg-bg-page/90 p-4 sm:p-5 font-mono text-xs space-y-2 shadow-inner">
                <div className="text-[11px] text-text-muted pb-2 border-b border-border/60 flex items-center justify-between">
                  <span>@@ capabilities / {currentItem.id} @@</span>
                  <span style={{ color: currentBranch.color }}>{currentBranch.name}</span>
                </div>
                {diffLines.map((line, dIdx) => (
                  <div
                    key={dIdx}
                    className="text-emerald-400/90 leading-relaxed font-mono flex items-start gap-2"
                  >
                    <span>{line}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Touch Hint on Mobile */}
            <div className="mt-4 flex sm:hidden items-center justify-center text-[10px] font-mono text-text-muted">
              <span>← Glissez latéralement pour naviguer →</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 4. Bottom Stepper Controls & Progress Dots */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 px-2">
        <div className="flex items-center gap-2 font-mono text-xs text-text-muted">
          <span>{locale === "fr" ? "Navigation clavier :" : "Keyboard navigation:"}</span>
          <kbd className="px-2 py-0.5 rounded bg-surface border border-border text-[10px] text-text-primary">←</kbd>
          <kbd className="px-2 py-0.5 rounded bg-surface border border-border text-[10px] text-text-primary">→</kbd>
        </div>

        {/* Milestone Indicator Dots */}
        <div className="flex items-center gap-2">
          {items.map((it, dIdx) => {
            const isDotActive = dIdx === activeIndex;
            const itMeta = getBranchForItem(it);
            const bMeta = BRANCHES[itMeta.branch] || BRANCHES.main;
            return (
              <button
                key={it.id}
                type="button"
                onClick={() => goToCommit(dIdx)}
                aria-label={`Aller au jalon ${dIdx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  isDotActive
                    ? "w-8 h-2.5 shadow-sm"
                    : "size-2.5 bg-border hover:bg-text-secondary"
                }`}
                style={isDotActive ? { backgroundColor: bMeta.color } : {}}
              />
            );
          })}
        </div>

        {/* Counter & Action */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-semibold text-text-muted">
            0{activeIndex + 1} <span className="opacity-40">/</span> 0{total}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={prevCommit}
              disabled={activeIndex === 0}
              aria-label="Commit précédent"
              className="size-8 rounded-full border border-border-strong bg-surface flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-accent disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={nextCommit}
              disabled={activeIndex === total - 1}
              aria-label="Commit suivant"
              className="size-8 rounded-full border border-border-strong bg-surface flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-accent disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
