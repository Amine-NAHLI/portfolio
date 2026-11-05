"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  Briefcase,
  Calendar,
  Compass,
  Cpu,
  GraduationCap,
  Milestone,
  Radio,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Locale } from "@/i18n/config";
import type { PublicJourneyEntry } from "@/features/portfolio/data";

interface JourneySceneProps {
  locale: Locale;
  journey?: PublicJourneyEntry[];
}

interface ProcessedMilestone {
  id: string;
  stationId: string;
  year: string;
  role: string;
  organization: string;
  type: "education" | "experience";
  category: "hackathon" | "internship" | "education" | "competition";
  description: string;
  tags: string[];
  highlight?: boolean;
}

const fallbackJourney: ProcessedMilestone[] = [
  {
    id: "gemma-hackathon",
    stationId: "01",
    year: "Juillet 2026",
    role: "1ʳᵉ place – Google Build with Gemma Hackathon (Afrique du Nord)",
    organization: "AI Crafters & GDG on Campus ENSA Berrechid",
    type: "experience",
    category: "hackathon",
    description:
      "Vainqueur du 1er prix régional parmi des dizaines d'équipes d'ingénieurs en concevant une solution intégrant l'écosystème open-models Google Gemma 2, le fine-tuning appliqué et une chaîne de traitement intelligente.",
    tags: ["Google Gemma 2", "1ère Place", "Fine-Tuning", "Intelligence Artificielle", "GDG"],
    highlight: true,
  },
  {
    id: "inteltrust-stage",
    stationId: "02",
    year: "Juil. – Août 2026",
    role: "Stagiaire Développeur Cybersécurité & Intelligence Artificielle",
    organization: "IntelTrust",
    type: "experience",
    category: "internship",
    description:
      "Mission industrielle spécialisée en modélisation des menaces, audit d'infrastructures d'authentification IAM et développement d'outils automatisés pour la détection proactive d'anomalies de sécurité.",
    tags: ["Cybersécurité", "IAM & Zero-Trust", "Python & Go", "Audit Réseau", "IA Défensive"],
    highlight: false,
  },
  {
    id: "robotics-upf",
    stationId: "03",
    year: "Avril 2026",
    role: "National UPF Robotics Competition – 3ème prix",
    organization: "Université Privée de Fès (UPF)",
    type: "experience",
    category: "competition",
    description:
      "Conception et programmation d'un robot autonome en équipe avec capteurs de télémétrie, traitement de trajectoire temps réel et optimisation algorithmique des déplacements.",
    tags: ["Robotique", "Systèmes Embarqués", "Algorithmique Temps Réel", "3ème Prix National"],
    highlight: false,
  },
  {
    id: "upf-cycle-ing",
    stationId: "04",
    year: "2023 — 2028 (En cours)",
    role: "Cycle d'Ingénieur d'État en Génie Informatique",
    organization: "Université Privée de Fès (UPF)",
    type: "education",
    category: "education",
    description:
      "Formation d'ingénierie d'État de 5 ans accréditée par la CTI. Spécialisation en architectures logicielles distribuées, cybersécurité offensive/défensive, réseaux informatiques et systèmes d'intelligence artificielle.",
    tags: ["Cycle Ingénieur d'État", "UPF Fès", "Cybersécurité", "Architectures Distribuées", "IA"],
    highlight: true,
  },
  {
    id: "bac-sm",
    stationId: "05",
    year: "2022 — 2023",
    role: "Baccalauréat Sciences Mathématiques",
    organization: "Fès City School",
    type: "education",
    category: "education",
    description:
      "Formation intensive d'excellence en mathématiques pures, analyse fonctionnelle, physique-chimie et raisonnement logique structuré, posant le socle fondamental pour le génie informatique.",
    tags: ["Sciences Mathématiques", "Fondations Algébriques", "Physique", "Mention"],
    highlight: false,
  },
];

function deriveCategory(title: string, org: string): ProcessedMilestone["category"] {
  const lower = (title + " " + org).toLowerCase();
  if (lower.includes("hackathon") || lower.includes("1ère place") || lower.includes("1er prix") || lower.includes("gemma")) {
    return "hackathon";
  }
  if (lower.includes("robotics") || lower.includes("robotique") || lower.includes("competition")) {
    return "competition";
  }
  if (lower.includes("stage") || lower.includes("stagiaire") || lower.includes("inteltrust")) {
    return "internship";
  }
  return "education";
}

function deriveTags(title: string, org: string, type: string): string[] {
  const lower = (title + " " + org).toLowerCase();
  const tags: string[] = [];
  if (lower.includes("gemma")) tags.push("Google Gemma 2", "Fine-Tuning", "1ère Place");
  if (lower.includes("inteltrust")) tags.push("Cybersécurité", "IAM & Zero-Trust", "Audit Menaces");
  if (lower.includes("robotics") || lower.includes("robotique")) tags.push("Robotique", "Systèmes Embarqués", "3ème Prix");
  if (lower.includes("génie informatique") || lower.includes("cycle")) tags.push("Cycle Ingénieur d'État", "UPF Fès", "Systèmes Distribués");
  if (lower.includes("mathématiques") || lower.includes("bac")) tags.push("Sciences Mathématiques", "Algèbre & Analyse");
  if (lower.includes("codex")) tags.push("OpenAI Codex", "Hackathon Casablanca");
  
  if (tags.length === 0) {
    tags.push(type === "education" ? "Formation Académique" : "Projet Ingénieur", org || "Engineering");
  }
  return tags;
}

export default function JourneyScene({ locale, journey }: JourneySceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStation, setActiveStation] = useState<number>(0);

  // Process data from database with fallback
  const processedMilestones: ProcessedMilestone[] =
    journey && journey.length > 0
      ? journey.map((item, index) => {
          const category = deriveCategory(item.title, item.organization || "");
          const isWinner = category === "hackathon" || item.title.includes("1ʳᵉ place");
          const isCurrentUPF = item.title.toLowerCase().includes("cycle d'ingénieur");
          
          return {
            id: item.id || `milestone-${index}`,
            stationId: String(index + 1).padStart(2, "0"),
            year: item.eventDate,
            role: item.title,
            organization: item.organization || (item.type === "education" ? "Université Privée de Fès" : "IntelTrust"),
            type: item.type === "experience" ? "experience" : "education",
            category,
            description: item.description,
            tags: deriveTags(item.title, item.organization || "", item.type),
            highlight: isWinner || isCurrentUPF,
          };
        })
      : fallbackJourney;

  useGSAP(
    () => {
      if (typeof window === "undefined" || !containerRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      // Station cards animation with fromTo (resilient against StrictMode double run)
      const stationCards = containerRef.current.querySelectorAll(".station-card");
      if (stationCards.length > 0) {
        gsap.fromTo(
          stationCards,
          { opacity: 0.3, y: 35 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    },
    { scope: containerRef }
  );

  const scrollToStation = (index: number) => {
    setActiveStation(index);
    const targetElement = document.getElementById(`station-${index}`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <section
      ref={containerRef}
      id="journey"
      className="relative w-full bg-[#101015] py-28 px-4 sm:px-8 lg:px-14 border-t border-white/5 overflow-hidden"
    >
      {/* Background Cyber Grid Accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(154,113,255,0.06)_0%,transparent_50%),radial-gradient(circle_at_80%_75%,rgba(56,189,248,0.05)_0%,transparent_50%)]"
      />

      <div className="mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-[#9A71FF] uppercase tracking-widest mb-3">
              <Milestone className="size-3.5" />
              <span>{"//"} 06 — TRAJECTOIRE D&apos;INGÉNIERIE</span>
            </div>
            <h2 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-[#f3f1f7]">
              {locale === "fr" ? "Le Chemin Parcouru." : "The Trajectory."}
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base text-[#797681] leading-relaxed">
            {locale === "fr"
              ? "Console de télémétrie académique et industrielle : victoires en hackathons, responsabilités en R&D et formation d'ingénieur d'État."
              : "Academic and industrial engineering telemetry: hackathon victories, R&D industrial missions, and state engineering curriculum."}
          </p>
        </div>

        {/* Interactive Station Quick-Selector Rail */}
        <div className="mb-12 overflow-x-auto pb-4 scrollbar-none">
          <div className="flex items-center gap-3 min-w-max">
            <span className="font-mono text-xs uppercase tracking-widest text-[#9A71FF] flex items-center gap-1.5 mr-2">
              <Radio className="size-3.5 animate-pulse text-emerald-400" />
              <span>STATIONS :</span>
            </span>
            {processedMilestones.map((item, idx) => {
              const isSelected = activeStation === idx;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToStation(idx)}
                  className={`group relative flex items-center gap-2.5 rounded-full border px-4 py-2 font-mono text-xs transition-all duration-300 ${
                    isSelected
                      ? "border-[#9A71FF] bg-[#9A71FF]/15 text-white shadow-[0_0_15px_rgba(154,113,255,0.3)]"
                      : "border-white/10 bg-[#17161e]/80 text-[#797681] hover:border-white/25 hover:text-[#f3f1f7]"
                  }`}
                >
                  <span
                    className={`size-2 rounded-full transition-colors ${
                      isSelected
                        ? "bg-[#9A71FF] shadow-[0_0_8px_#9A71FF]"
                        : "bg-white/20 group-hover:bg-[#9A71FF]"
                    }`}
                  />
                  <span className="font-bold text-[#f3f1f7]">
                    [{item.stationId}]
                  </span>
                  <span className="truncate max-w-[140px] sm:max-w-[200px]">
                    {item.organization}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Dual-Column Cockpit HUD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Fixed Avionics / Telemetry Console */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            <div className="rounded-3xl border border-white/10 bg-[#17161e]/90 p-6 sm:p-7 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
              {/* Pulsing Corner Laser Accent */}
              <div className="absolute top-0 right-0 size-24 bg-[#9A71FF]/10 rounded-full blur-2xl" />

              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <Compass className="size-4 text-[#9A71FF]" />
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#f3f1f7]">
                    SYSTEM TELEMETRY
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-400">
                  <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>LIVE NODE</span>
                </div>
              </div>

              {/* Real-time Status Card */}
              <div className="space-y-4 font-mono text-xs">
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 space-y-2">
                  <div className="text-[10px] text-[#797681] uppercase tracking-wider">
                    CURRENT DISCIPLINE
                  </div>
                  <div className="font-display text-base font-bold text-[#f3f1f7]">
                    Génie Informatique · 4ème Année
                  </div>
                  <div className="text-xs text-[#9A71FF]">
                    Université Privée de Fès (UPF)
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                    <div className="text-[10px] text-[#797681] uppercase">HACKATHONS</div>
                    <div className="text-sm font-bold text-amber-400 flex items-center gap-1 mt-1">
                      <Trophy className="size-3.5" />
                      <span>1ère Place NA</span>
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                    <div className="text-[10px] text-[#797681] uppercase">MISSION R&D</div>
                    <div className="text-sm font-bold text-[#38bdf8] flex items-center gap-1 mt-1">
                      <Briefcase className="size-3.5" />
                      <span>IntelTrust</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <div className="text-[10px] text-[#797681] uppercase">ACCRÉDITATION DIPLÔME</div>
                  <div className="text-xs text-[#f3f1f7] flex items-center gap-1.5 mt-1 font-sans font-medium">
                    <ShieldCheck className="size-3.5 text-emerald-400 shrink-0" />
                    <span>Diplôme d&apos;Ingénieur d&apos;État reconnu</span>
                  </div>
                </div>
              </div>

              {/* Progress Summary */}
              <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-xs font-mono text-[#797681]">
                <span>TOTAL STATIONS : {processedMilestones.length}</span>
                <span className="text-[#9A71FF] font-bold">100% VÉRIFIÉ</span>
              </div>
            </div>

            {/* Quick Link to full timeline page */}
            <Link
              href={`/${locale}/journey`}
              className="group flex items-center justify-between rounded-2xl border border-white/10 bg-[#17161e]/60 p-4 font-mono text-xs font-semibold text-[#f3f1f7] transition-all hover:border-[#9A71FF] hover:bg-[#9A71FF]/10"
            >
              <span className="flex items-center gap-2">
                <Activity className="size-4 text-[#9A71FF]" />
                <span>{locale === "fr" ? "CHRONOLOGIE DÉTAILLÉE" : "EXPANDED CHRONOLOGY"}</span>
              </span>
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#9A71FF]" />
            </Link>
          </div>

          {/* Right Column: High-Tech Station Flight Logs */}
          <div className="lg:col-span-8 space-y-8">
            {processedMilestones.map((item, index) => {
              const isHackathon = item.category === "hackathon";
              const isInternship = item.category === "internship";
              const isCompetition = item.category === "competition";

              return (
                <div
                  key={item.id}
                  id={`station-${index}`}
                  onMouseEnter={() => setActiveStation(index)}
                  className={`station-card group relative rounded-3xl border p-6 sm:p-9 backdrop-blur-xl transition-all duration-300 ${
                    item.highlight
                      ? "border-[#9A71FF]/40 bg-[#1a1926]/90 shadow-[0_10px_35px_rgba(154,113,255,0.12)] hover:border-[#9A71FF]"
                      : "border-white/10 bg-[#17161e]/80 hover:border-white/20 hover:bg-[#1a1923]"
                  }`}
                >
                  {/* Station Overhead Telemetry Ribbon */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5 mb-5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`grid size-9 place-items-center rounded-xl border font-mono text-xs font-bold ${
                          isHackathon
                            ? "border-amber-400/40 bg-amber-400/10 text-amber-300"
                            : isInternship
                            ? "border-[#38bdf8]/40 bg-[#38bdf8]/10 text-[#38bdf8]"
                            : isCompetition
                            ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                            : "border-[#9A71FF]/40 bg-[#9A71FF]/10 text-[#9A71FF]"
                        }`}
                      >
                        {isHackathon ? (
                          <Trophy className="size-4" />
                        ) : isInternship ? (
                          <Briefcase className="size-4" />
                        ) : isCompetition ? (
                          <Cpu className="size-4" />
                        ) : (
                          <GraduationCap className="size-4" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#f3f1f7]">
                            {item.organization}
                          </span>
                          {item.highlight && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-300">
                              <Sparkles className="size-2.5" />
                              <span>DISTINCTION</span>
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-[11px] text-[#797681]">
                          STATION // {item.stationId}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-xs font-semibold text-[#f3f1f7] bg-white/[0.04] px-3.5 py-1.5 rounded-full border border-white/10">
                      <Calendar className="size-3 text-[#9A71FF]" />
                      <span>{item.year}</span>
                    </div>
                  </div>

                  {/* Station Title */}
                  <h3 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-[#f3f1f7] mb-3 leading-snug">
                    {item.role}
                  </h3>

                  {/* Operational Context / Description */}
                  <p className="text-sm sm:text-base text-[#797681] leading-relaxed mb-6 font-normal">
                    {item.description}
                  </p>

                  {/* Competencies & Tech Chips Matrix */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`rounded-lg border px-2.5 py-1 font-mono text-[11px] transition-colors ${
                          tag.includes("1ère") || tag.includes("Prix")
                            ? "border-amber-400/30 bg-amber-400/10 text-amber-200"
                            : "border-white/10 bg-white/[0.03] text-[#f3f1f7]/80 hover:border-[#9A71FF]/40"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
