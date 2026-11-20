"use client";

import { useRef } from "react";
import { 
  GraduationCap, 
  Trophy, 
  Briefcase, 
  Cpu, 
  ShieldCheck, 
  Sparkles, 
  MapPin, 
  Calendar, 
  ArrowUpRight, 
  Activity,
  Terminal,
  Lock,
  Binary
} from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { JourneyTimelineItem } from "@/types/journey";
import { BorderBeam } from "@/components/magicui/border-beam";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import { GridPattern } from "@/components/magicui/grid-pattern";
import { DotPattern } from "@/components/magicui/dot-pattern";

interface JourneyBentoGridProps {
  locale: Locale;
  items?: JourneyTimelineItem[];
}

export default function JourneyBentoGrid({ locale }: JourneyBentoGridProps) {
  // Refs for AnimatedBeam in Gemma Hackathon card
  const gemmaContainerRef = useRef<HTMLDivElement>(null);
  const gemmaInputRef = useRef<HTMLDivElement>(null);
  const gemmaModelRef = useRef<HTMLDivElement>(null);

  // Refs for AnimatedBeam in IntelTrust card
  const cyberContainerRef = useRef<HTMLDivElement>(null);
  const cyberProbeRef = useRef<HTMLDivElement>(null);
  const cyberGuardRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full space-y-5">
      {/* 5-Module Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        
        {/* =========================================================================
            MODULE 1 (MAIN ANCHOR): CYCLE INGÉNIEUR UPF (md:col-span-8)
            ========================================================================= */}
        <div className="md:col-span-8 group relative overflow-hidden rounded-3xl border border-border-strong bg-surface p-6 sm:p-8 shadow-xl flex flex-col justify-between transition-all duration-300 hover:border-accent/40">
          {/* Subtle Blueprint Grid Pattern in background */}
          <GridPattern
            width={32}
            height={32}
            strokeDasharray="4 2"
            className="stroke-white/[0.03] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_50%,transparent_100%)] -z-10"
          />

          {/* Active Laser Border Beam */}
          <BorderBeam
            size={260}
            duration={9}
            colorFrom="#C8F122"
            colorTo="#38BDF8"
            borderWidth={1.5}
          />

          <div>
            {/* Header pill strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <span className="size-2 rounded-full bg-accent animate-pulse" />
                <span className="font-mono text-xs font-bold text-accent uppercase tracking-wider">
                  {locale === "fr" ? "FORMATION PRINCIPALE · EN COURS" : "PRIMARY TRACK · ACTIVE"}
                </span>
                <span className="text-text-muted/40">·</span>
                <span className="font-mono text-xs text-text-muted">2023 — Présent</span>
              </div>

              <div className="flex items-center gap-1.5 font-mono text-xs text-text-secondary">
                <MapPin className="size-3.5 text-accent" />
                <span>Fès, Maroc</span>
              </div>
            </div>

            {/* Core degree title */}
            <div className="mt-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2">
                <span className="font-mono text-xs font-semibold text-text-muted uppercase tracking-widest">
                  {locale === "fr" ? "Diplôme d'Ingénieur d'État" : "State Computer Engineering Degree"}
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-black text-text-primary tracking-tight leading-snug">
                  {locale === "fr"
                    ? "Génie Informatique & Systèmes Distribués"
                    : "Computer Engineering & Distributed Systems"}
                </h3>
                <p className="text-sm sm:text-base font-semibold text-text-secondary">
                  Université Privée de Fès (UPF)
                </p>
              </div>

              <div className="size-14 rounded-2xl border border-accent/30 bg-accent/10 flex items-center justify-center text-accent shrink-0 shadow-sm">
                <GraduationCap className="size-7" />
              </div>
            </div>

            {/* Curriculum Progress Bar */}
            <div className="mt-6 p-4 rounded-2xl border border-border bg-surface-subtle/80 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-text-secondary">
                  {locale === "fr" ? "Progression du Cursus (Bac+5)" : "Curriculum Trajectory (5-Year Cycle)"}
                </span>
                <span className="font-bold text-accent">
                  {locale === "fr" ? "4ᵉ Année Active (Semestre 7/8)" : "4th Year Active (Semester 7/8)"}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-text-primary/[0.08] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-accent via-[#38BDF8] to-accent transition-all duration-1000"
                  style={{ width: "80%" }}
                />
              </div>
            </div>
          </div>

          {/* Academic pillars */}
          <div className="mt-6 pt-5 border-t border-border flex flex-wrap gap-2">
            {[
              locale === "fr" ? "Cybersécurité Défensive" : "Defensive Cyber",
              locale === "fr" ? "Architectures Logicielles" : "Software Architecture",
              locale === "fr" ? "Réseaux & Protocoles" : "Networks & Routing",
              locale === "fr" ? "Systèmes d'Exploitation (OS)" : "Operating Systems",
              locale === "fr" ? "Bases de Données Distribuées" : "Distributed DBs",
            ].map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-raised px-3 py-1 font-mono text-xs text-text-secondary"
              >
                <Activity className="size-3 text-accent" />
                <span>{skill}</span>
              </span>
            ))}
          </div>
        </div>

        {/* =========================================================================
            MODULE 2: 1ʳᵉ PLACE HACKATHON GOOGLE GEMMA (md:col-span-4)
            ========================================================================= */}
        <div className="md:col-span-4 group relative overflow-hidden rounded-3xl border border-border-strong bg-surface p-6 sm:p-7 shadow-xl flex flex-col justify-between transition-all duration-300 hover:border-purple-500/50">
          <BorderBeam
            size={180}
            duration={7}
            colorFrom="#A855F7"
            colorTo="#C8F122"
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />

          <div>
            {/* Header badge */}
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <span className="font-mono text-xs font-bold text-purple-400 uppercase tracking-wider">
                {locale === "fr" ? "1ʳᵉ PLACE RÉGIONALE" : "1ST PLACE CHAMPION"}
              </span>
              <span className="font-mono text-xs text-text-muted">Juillet 2026</span>
            </div>

            {/* Title & Icon */}
            <div className="mt-5 flex items-start justify-between gap-3">
              <div>
                <span className="font-mono text-[11px] text-text-muted uppercase">Google Build with Gemma</span>
                <h4 className="font-display text-xl font-bold text-text-primary mt-1">
                  Hackathon Afrique du Nord
                </h4>
              </div>
              <div className="size-11 rounded-xl border border-purple-500/30 bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
                <Trophy className="size-5" />
              </div>
            </div>

            <p className="mt-3 text-xs sm:text-sm text-text-secondary leading-relaxed">
              {locale === "fr"
                ? "Victoire régionale avec SignBridge : système de vision temps réel et fine-tuning de Google Gemma 2 (LoRA) pour la transcription de langue des signes."
                : "Regional victory with SignBridge: real-time computer vision and Google Gemma 2 fine-tuning (LoRA) for sign language translation."}
            </p>

            {/* Live Beam Inactive / Active Visualization */}
            <div
              ref={gemmaContainerRef}
              className="relative mt-5 p-3 rounded-2xl border border-border bg-bg-page/70 flex items-center justify-between overflow-hidden"
            >
              <div
                ref={gemmaInputRef}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border bg-surface text-[11px] font-mono text-text-secondary z-10"
              >
                <Binary className="size-3 text-purple-400" />
                <span>MediaPipe</span>
              </div>

              <div
                ref={gemmaModelRef}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-purple-500/40 bg-purple-500/15 text-[11px] font-mono text-purple-300 font-bold z-10"
              >
                <Sparkles className="size-3 text-purple-400" />
                <span>Gemma 2B</span>
              </div>

              <AnimatedBeam
                containerRef={gemmaContainerRef}
                fromRef={gemmaInputRef}
                toRef={gemmaModelRef}
                duration={2.5}
                gradientStartColor="#A855F7"
                gradientStopColor="#C8F122"
              />
            </div>
          </div>

          <div className="pt-4 mt-5 border-t border-border flex items-center justify-between text-[11px] font-mono text-text-muted">
            <span>AI Crafters & GDG</span>
            <span className="text-purple-400 font-semibold">Trophée d&apos;Excellence</span>
          </div>
        </div>

        {/* =========================================================================
            MODULE 3: STAGE CYBERSÉCURITÉ INTELTRUST (md:col-span-4)
            ========================================================================= */}
        <div className="md:col-span-4 group relative overflow-hidden rounded-3xl border border-border-strong bg-surface p-6 sm:p-7 shadow-xl flex flex-col justify-between transition-all duration-300 hover:border-emerald-500/50">
          <BorderBeam
            size={180}
            duration={7}
            colorFrom="#10B981"
            colorTo="#38BDF8"
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />

          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider">
                {locale === "fr" ? "EXPÉRIENCE EN ENTREPRISE" : "PROFESSIONAL INTERNSHIP"}
              </span>
              <span className="font-mono text-xs text-text-muted">Juil. – Août 2026</span>
            </div>

            <div className="mt-5 flex items-start justify-between gap-3">
              <div>
                <span className="font-mono text-[11px] text-text-muted uppercase">IntelTrust</span>
                <h4 className="font-display text-xl font-bold text-text-primary mt-1">
                  {locale === "fr" ? "Cybersécurité & Audit" : "Cybersecurity & Audit"}
                </h4>
              </div>
              <div className="size-11 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="size-5" />
              </div>
            </div>

            <p className="mt-3 text-xs sm:text-sm text-text-secondary leading-relaxed">
              {locale === "fr"
                ? "Audit de surface d'attaque, contrôle des habilitations Zero-Trust (IAM), analyse de flux réseau avec Scapy et durcissement d'environnements Linux."
                : "Attack surface diagnostics, Zero-Trust IAM access enforcement, packet telemetry forensics using Scapy, and Linux server hardening."}
            </p>

            {/* Beam Security Probe Visual */}
            <div
              ref={cyberContainerRef}
              className="relative mt-5 p-3 rounded-2xl border border-border bg-bg-page/70 flex items-center justify-between overflow-hidden"
            >
              <div
                ref={cyberProbeRef}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border bg-surface text-[11px] font-mono text-text-secondary z-10"
              >
                <Terminal className="size-3 text-emerald-400" />
                <span>Scapy Sniffer</span>
              </div>

              <div
                ref={cyberGuardRef}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-emerald-500/40 bg-emerald-500/15 text-[11px] font-mono text-emerald-300 font-bold z-10"
              >
                <Lock className="size-3 text-emerald-400" />
                <span>Zero-Trust IAM</span>
              </div>

              <AnimatedBeam
                containerRef={cyberContainerRef}
                fromRef={cyberProbeRef}
                toRef={cyberGuardRef}
                duration={3}
                gradientStartColor="#10B981"
                gradientStopColor="#38BDF8"
              />
            </div>
          </div>

          <div className="pt-4 mt-5 border-t border-border flex items-center justify-between text-[11px] font-mono text-text-muted">
            <span>Environnement de Prod</span>
            <span className="text-emerald-400 font-semibold">Stage Validé</span>
          </div>
        </div>

        {/* =========================================================================
            MODULE 4: COMPÉTITION NATIONALE DE ROBOTIQUE (md:col-span-4)
            ========================================================================= */}
        <div className="md:col-span-4 group relative overflow-hidden rounded-3xl border border-border-strong bg-surface p-6 sm:p-7 shadow-xl flex flex-col justify-between transition-all duration-300 hover:border-amber-500/50">
          <BorderBeam
            size={180}
            duration={7}
            colorFrom="#F59E0B"
            colorTo="#C8F122"
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />

          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <span className="font-mono text-xs font-bold text-amber-400 uppercase tracking-wider">
                {locale === "fr" ? "3ᵉ PRIX NATIONAL" : "3RD NATIONAL PRIZE"}
              </span>
              <span className="font-mono text-xs text-text-muted">Avril 2026</span>
            </div>

            <div className="mt-5 flex items-start justify-between gap-3">
              <div>
                <span className="font-mono text-[11px] text-text-muted uppercase">9ᵉ Édition Nationale</span>
                <h4 className="font-display text-xl font-bold text-text-primary mt-1">
                  Compétition Robotique UPF
                </h4>
              </div>
              <div className="size-11 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
                <Cpu className="size-5" />
              </div>
            </div>

            <p className="mt-3 text-xs sm:text-sm text-text-secondary leading-relaxed">
              {locale === "fr"
                ? "Conception d'un robot autonome temps réel : asservissement PID en C++, traitement de télémétrie capteurs ultrasons/IR et gestion de puissance embarquée."
                : "Real-time autonomous robot engineering: embedded C++ PID loop control, ultrasonic/IR telemetry processing, and embedded power management."}
            </p>

            {/* Hardware spec pills */}
            <div className="mt-5 p-3 rounded-2xl border border-border bg-bg-page/70 space-y-2">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-text-muted">Contrôle Moteur :</span>
                <span className="text-amber-400 font-semibold">Boucle Fermée 100Hz</span>
              </div>
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-text-muted">Langage Embarqué :</span>
                <span className="text-text-primary font-semibold">C++ / Microcontrôleur</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-5 border-t border-border flex items-center justify-between text-[11px] font-mono text-text-muted">
            <span>Systèmes Embarqués</span>
            <span className="text-amber-400 font-semibold">Podium National</span>
          </div>
        </div>

        {/* =========================================================================
            MODULE 5: BACCALAURÉAT SCIENCES MATHÉMATIQUES (md:col-span-4)
            ========================================================================= */}
        <div className="md:col-span-4 group relative overflow-hidden rounded-3xl border border-border-strong bg-surface p-6 sm:p-7 shadow-xl flex flex-col justify-between transition-all duration-300 hover:border-sky-500/50">
          <BorderBeam
            size={180}
            duration={7}
            colorFrom="#38BDF8"
            colorTo="#10B981"
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />

          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <span className="font-mono text-xs font-bold text-sky-400 uppercase tracking-wider">
                {locale === "fr" ? "SOCLE FONDAMENTAL" : "ACADEMIC FOUNDATION"}
              </span>
              <span className="font-mono text-xs text-text-muted">2022 — 2023</span>
            </div>

            <div className="mt-5 flex items-start justify-between gap-3">
              <div>
                <span className="font-mono text-[11px] text-text-muted uppercase">Fès City School</span>
                <h4 className="font-display text-xl font-bold text-text-primary mt-1">
                  Bac Sciences Mathématiques
                </h4>
              </div>
              <div className="size-11 rounded-xl border border-sky-500/30 bg-sky-500/10 flex items-center justify-center text-sky-400 shrink-0">
                <Binary className="size-5" />
              </div>
            </div>

            <p className="mt-3 text-xs sm:text-sm text-text-secondary leading-relaxed">
              {locale === "fr"
                ? "Filière d'excellence : algèbre générale, calcul différentiel et intégral, arithmétique formelle et physique quantique/mécanique newtonienne."
                : "Top academic honors: abstract algebra, differential & integral calculus, formal arithmetic, and Newtonian & quantum physical mechanics."}
            </p>

            {/* Honors pill */}
            <div className="mt-5 p-3 rounded-2xl border border-sky-500/20 bg-sky-500/5 flex items-center justify-between font-mono text-xs">
              <span className="text-text-secondary">Distinction académique :</span>
              <span className="font-bold text-sky-400">Mention Très Bien</span>
            </div>
          </div>

          <div className="pt-4 mt-5 border-t border-border flex items-center justify-between text-[11px] font-mono text-text-muted">
            <span>Rigueur Logique</span>
            <span className="text-sky-400 font-semibold">Excellence Formelle</span>
          </div>
        </div>

      </div>
    </div>
  );
}
