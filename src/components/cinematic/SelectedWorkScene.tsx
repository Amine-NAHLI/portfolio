"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ExternalLink, ChevronLeft, ChevronRight, Layers } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Locale } from "@/i18n/config";
import type { PortfolioProject } from "@/types/content";

interface SelectedWorkSceneProps {
  locale: Locale;
  projects?: PortfolioProject[];
}

interface DisplayProjectItem {
  slug: string;
  title: string | { fr: string; en: string };
  subtitle?: string | { fr: string; en: string };
  summary: string | { fr: string; en: string };
  technologies: string[];
  coreTechnologies?: string[];
  category?: string;
  year?: string;
  githubUrl?: string;
  demoUrl?: string;
}

const fallbackProjects: DisplayProjectItem[] = [
  {
    slug: "smart-network-mapper",
    title: {
      fr: "Smart Network Mapper — Audit & Topologie",
      en: "Smart Network Mapper — Audit & Topology",
    },
    subtitle: {
      fr: "Plateforme d'audit et cartographie réseau intelligente",
      en: "Intelligent Network Audit and Topology Mapping Platform",
    },
    summary: {
      fr: "Application desktop de cybersécurité pour la découverte d'hôtes, le scanning de services TCP/UDP et l'analyse de vulnérabilités enrichie par IA.",
      en: "Desktop cybersecurity application for host discovery, TCP/UDP port scanning, and AI-augmented vulnerability analysis.",
    },
    technologies: ["Python", "JavaScript", "Node.js", "React", "Vite"],
    category: "CYBERSÉCURITÉ & RÉSEAU",
    year: "2024 — 2026",
  },
  {
    slug: "7yatk",
    title: {
      fr: "7YATK — Ange Gardien & Réseau Mesh",
      en: "7YATK — Guardian Angel & Mesh Network",
    },
    subtitle: {
      fr: "Application mobile de secours d'urgence sans connexion Internet",
      en: "Emergency survival and beaconing mobile app using offline mesh routing",
    },
    summary: {
      fr: "Système de télémétrie capteurs (accéléromètre, GPS) et réseau décentralisé Bluetooth/Wi-Fi Direct pour alerter les secours hors-ligne en situation de détresse.",
      en: "Sensor telemetry (accelerometer, GPS) and offline mesh networking (Bluetooth / Wi-Fi Direct) to trigger emergency rescue when cellular connectivity is unavailable.",
    },
    technologies: ["React Native", "Expo SDK", "Node.js", "Socket.io", "Express"],
    category: "SYSTÈMES EMBARQUÉS & MOBILE",
    year: "2024 — 2026",
  },
  {
    slug: "stockly-gestion-de-stock-et-commerce-de-proximite",
    title: {
      fr: "Stockly — Commerce de Proximité",
      en: "Stockly — Local Retail Inventory Engine",
    },
    subtitle: {
      fr: "Solution SaaS de traçabilité, facturation et gestion multi-dépôts",
      en: "SaaS inventory tracking, barcode POS, and multi-warehouse logistics engine",
    },
    summary: {
      fr: "Gestion des stocks en temps réel, génération automatique de factures conformes, réapprovisionnement prédictif et interface caisse haute vélocité.",
      en: "Real-time inventory ledger, automated compliant invoicing, predictive reordering alerts, and high-velocity point-of-sale terminal.",
    },
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Supabase"],
    category: "GÉNIE LOGICIEL & FULL-STACK",
    year: "2024 — 2026",
  },
  {
    slug: "asl-real-time-detection",
    title: {
      fr: "SignBridge — Traduction LSF Temps Réel",
      en: "SignBridge — Real-Time ASL Recognition",
    },
    subtitle: {
      fr: "Reconnaissance de la langue des signes par vision artificielle",
      en: "Computer Vision Sign Language Interpretation Pipeline",
    },
    summary: {
      fr: "Détection des repères articulaires des mains par MediaPipe et modèle séquentiel de classification pour la traduction instantanée de la langue des signes.",
      en: "Hand landmark tracking with MediaPipe and sequence classification neural network for instant bidirectional sign language translation.",
    },
    technologies: ["Python", "PyTorch", "OpenCV", "MediaPipe", "NumPy"],
    category: "INTELLIGENCE ARTIFICIELLE",
    year: "2024 — 2026",
  },
];

export default function SelectedWorkScene({ locale, projects }: SelectedWorkSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const scrollTriggerInstanceRef = useRef<ScrollTrigger | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);

  // Up to 4 featured projects
  const displayProjects = projects && projects.length > 0 ? projects.slice(0, 4) : fallbackProjects;
  const count = displayProjects.length;

  useGSAP(
    () => {
      if (typeof window === "undefined" || !containerRef.current || count <= 1) return;
      gsap.registerPlugin(ScrollTrigger);

      const cards = cardElementsRef.current.filter((c): c is HTMLDivElement => Boolean(c));
      if (cards.length === 0) return;

      let lastIdx = 0;

      // Shape each [k, k+1] step with brief rest plateaus and a quintic smootherstep curve
      const shapeDeckProgress = (rawP: number) => {
        const clamped = Math.max(0, Math.min(count - 1, rawP));
        const base = Math.floor(clamped);
        if (base >= count - 1) return count - 1;
        const frac = clamped - base;
        if (frac <= 0.12) return base;
        if (frac >= 0.88) return base + 1;
        const u = (frac - 0.12) / 0.76;
        const eased = u * u * u * (u * (u * 6 - 15) + 10);
        return base + eased;
      };

      const applyDeckTransforms = (ep: number) => {
        const currentIdx = Math.min(count - 1, Math.max(0, Math.round(ep)));

        if (currentIdx !== lastIdx) {
          lastIdx = currentIdx;
          setActiveIndex(currentIdx);
        }

        cards.forEach((card, idx) => {
          const d = idx - ep;
          const zIndex = (count - idx) * 10;

          if (d < 0) {
            // Top card peels gracefully off the deck to the left
            const t = Math.min(1, -d);
            const opacity = t >= 0.94 ? 0 : Math.max(0, 1 - Math.pow(t, 1.2) * 1.15);
            const isVisible = opacity > 0.01;

            gsap.set(card, {
              transformPerspective: 1600,
              transformOrigin: "center center",
              force3D: true,
              xPercent: -t * 58,
              y: -t * 14,
              scale: 1 - t * 0.12,
              rotateY: t * 18,
              rotateZ: -t * 3.5,
              opacity,
              zIndex,
            });
            card.style.visibility = isVisible ? "visible" : "hidden";
          } else {
            // Active card (d=0) centered; upcoming cards peek in layered 3D depth to the right
            let opacity = 0;
            if (d <= 1) {
              opacity = 1 - d * 0.54;
            } else if (d <= 2.4) {
              opacity = Math.max(0, 0.46 - (d - 1) * 0.32);
            }
            const isVisible = opacity > 0.01;

            gsap.set(card, {
              transformPerspective: 1600,
              transformOrigin: "center center",
              force3D: true,
              xPercent: d * 8.5,
              y: d * 10,
              scale: Math.max(0.76, 1 - d * 0.065),
              rotateY: -Math.min(18, d * 6),
              rotateZ: Math.min(3.5, d * 1.2),
              opacity,
              zIndex,
            });
            card.style.visibility = isVisible ? "visible" : "hidden";
          }

          card.style.pointerEvents =
            idx === currentIdx || idx === currentIdx + 1 ? "auto" : "none";
        });
      };

      // Set resting initial stack at progress 0
      applyDeckTransforms(0);

      const deckState = { progress: 0 };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          start: "top top",
          end: `+=${(count - 1) * 700}`,
          scrub: 0.65,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(deckState, {
        progress: count - 1,
        duration: count - 1,
        ease: "none",
        onUpdate: () => {
          applyDeckTransforms(shapeDeckProgress(deckState.progress));
        },
      });

      scrollTriggerInstanceRef.current = tl.scrollTrigger || null;
    },
    { scope: containerRef, dependencies: [count] }
  );

  const scrollToStep = (targetIndex: number) => {
    if (!scrollTriggerInstanceRef.current) return;
    const st = scrollTriggerInstanceRef.current;
    const start = st.start;
    const end = st.end;
    const progress = count > 1 ? targetIndex / (count - 1) : 0;
    const targetY = start + progress * (end - start);

    const lenis = typeof window !== "undefined" ? window.__lenis : undefined;
    if (lenis) {
      lenis.scrollTo(targetY, { duration: 0.85 });
    } else {
      window.scrollTo({
        top: targetY,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      ref={containerRef}
      id="work"
      className="relative w-full h-[100svh] min-h-[600px] bg-[#000000] pt-16 pb-4 sm:pt-[76px] sm:pb-6 px-4 sm:px-8 lg:px-14 border-t border-white/[0.08] flex flex-col items-center justify-center overflow-hidden scroll-mt-20"
    >
      {/* Background Ambient Lighting: Violet Neon & Obsidian */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[550px] w-[550px] rounded-full bg-[#8FB3A2]/8 blur-[180px] -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/4 top-1/3 h-[450px] w-[450px] rounded-full bg-[#0E161A] opacity-70 blur-[160px] -z-10"
      />

      <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-between h-full min-h-0">
        
        {/* Centered Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-2 sm:mb-4 shrink-0">
          <span className="font-mono text-[11px] sm:text-xs uppercase tracking-wider text-[#8FB3A2] block mb-1.5 font-bold">
            {locale === "fr" ? "// SÉLECTION DE RÉALISATIONS" : "// FEATURED WORK"}
          </span>
          <h2 className="font-display text-2xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight text-[#f3f1f7] leading-tight">
            {locale === "fr" ? "Projets Phares." : "Work that Speaks."}
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-[#797681] leading-relaxed max-w-xl mx-auto line-clamp-2">
            {locale === "fr"
              ? "Chaque projet est conçu comme un système complet : problème réel identifié, architecture rigoureuse, métriques mesurées et code source documenté."
              : "Each project is engineered as a robust system: verified problem space, rigorous architecture, measured outcomes, and documented source code."}
          </p>
        </div>

        {/* Vertically & Horizontally Centered 3D Stage */}
        <div className="w-full flex-1 min-h-0 flex items-center justify-center py-2 sm:py-3">
          <div
            style={{ perspective: "1600px" }}
            className="relative mx-auto w-full max-w-2xl lg:max-w-3xl h-[min(410px,100%)] min-h-[290px] flex items-center justify-center"
          >
            {displayProjects.map((project, index) => {
              const projectTitle = typeof project.title === "string" ? project.title : project.title?.[locale];
              const projectSubtitle = typeof project.subtitle === "string" ? project.subtitle : project.subtitle?.[locale];
              const projectSummary = typeof project.summary === "string" ? project.summary : project.summary?.[locale];
              const techList = project.coreTechnologies || project.technologies || [];
              const categoryBadge =
                ("categories" in project && Array.isArray(project.categories) && project.categories[0]) ||
                ("category" in project && typeof (project as DisplayProjectItem).category === "string" && (project as DisplayProjectItem).category) ||
                "PROJET INGÉNIEUR";

              const isCurrent = index === activeIndex;
              const isNextPeek = index === activeIndex + 1;

              return (
                <div
                  key={project.slug || index}
                  ref={(el) => {
                    cardElementsRef.current[index] = el;
                  }}
                  aria-hidden={!isCurrent}
                  onClick={() => {
                    if (isNextPeek) scrollToStep(index);
                  }}
                  style={{
                    backfaceVisibility: "hidden",
                    zIndex: (count - index) * 10,
                  }}
                  className={`absolute inset-0 flex flex-col justify-between overflow-hidden rounded-3xl border bg-gradient-to-br from-[#0C1210] via-[#070A09] to-[#040605] px-5 py-4 sm:px-8 sm:py-6 transition-[border-color,box-shadow] duration-300 will-change-[transform,opacity] ${
                    isCurrent
                      ? "pointer-events-auto border-white/20 shadow-[0_30px_90px_rgba(0,0,0,0.9),0_0_45px_rgba(143, 179, 162,0.1)] hover:border-[#8FB3A2]/55 hover:shadow-[0_30px_95px_rgba(143, 179, 162,0.18)]"
                      : isNextPeek
                        ? "pointer-events-auto cursor-pointer border-white/10 shadow-[0_20px_55px_rgba(0,0,0,0.85)] hover:border-[#8FB3A2]/35"
                        : "pointer-events-none border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                  }`}
                >
                  {/* Subtle top ambient sheen & inner corner highlight */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#8FB3A2]/50 to-transparent"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#8FB3A2]/10 blur-3xl"
                  />

                  {/* Top Card Bar */}
                  <div
                    className={`flex items-center justify-between pb-3 border-b border-white/[0.08] relative z-30 shrink-0 ${
                      isCurrent ? "pointer-events-auto" : "pointer-events-none"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <span className="font-mono text-xs font-bold text-[#8FB3A2] bg-[#8FB3A2]/10 border border-[#8FB3A2]/30 px-2.5 py-0.5 rounded-full shrink-0">
                        0{index + 1}
                      </span>
                      <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#797681] truncate">
                        {categoryBadge}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 relative z-30 shrink-0">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          tabIndex={isCurrent ? 0 : -1}
                          aria-label="GitHub Repository"
                          className={`flex size-8 sm:size-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[#797681] hover:text-white hover:border-[#8FB3A2]/50 hover:bg-[#8FB3A2]/20 transition-all cursor-pointer relative z-30 ${
                            isCurrent ? "pointer-events-auto" : "pointer-events-none"
                          }`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <svg className="size-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                          </svg>
                        </a>
                      )}
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          tabIndex={isCurrent ? 0 : -1}
                          aria-label="Live Demo"
                          className={`flex size-8 sm:size-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[#797681] hover:text-white hover:border-[#8FB3A2]/50 hover:bg-[#8FB3A2]/20 transition-all cursor-pointer relative z-30 ${
                            isCurrent ? "pointer-events-auto" : "pointer-events-none"
                          }`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="size-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Main Card Content */}
                  <div className="py-2 sm:py-3 flex-1 flex flex-col justify-center min-h-0 gap-1.5 sm:gap-2">
                    <h3 className="font-display text-lg sm:text-2xl lg:text-[1.75rem] font-bold tracking-tight text-[#f3f1f7] leading-snug line-clamp-2">
                      {projectTitle}
                    </h3>

                    {projectSubtitle && (
                      <p className="text-xs sm:text-sm font-medium text-[#8FB3A2] line-clamp-1">
                        {projectSubtitle}
                      </p>
                    )}

                    <p className="text-xs sm:text-sm text-[#797681] leading-relaxed line-clamp-2 sm:line-clamp-3 font-normal">
                      {projectSummary}
                    </p>

                    {/* Core Technologies Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {techList.slice(0, 6).map((tech: string) => (
                        <span
                          key={tech}
                          className="rounded-lg border border-white/10 bg-white/[0.03] px-2 py-0.5 sm:px-2.5 sm:py-1 font-mono text-[10px] sm:text-[11px] text-[#f3f1f7]/80 hover:border-white/25 transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer Bar */}
                  <div
                    className={`pt-3 border-t border-white/[0.08] flex items-center justify-between relative z-30 shrink-0 ${
                      isCurrent ? "pointer-events-auto" : "pointer-events-none"
                    }`}
                  >
                    <Link
                      href={`/${locale}/projects/${project.slug}`}
                      tabIndex={isCurrent ? 0 : -1}
                      className={`inline-flex items-center gap-2 rounded-full border border-[#8FB3A2]/30 bg-[#8FB3A2]/10 px-4 py-1.5 sm:px-5 sm:py-2 text-xs font-mono font-semibold text-[#8FB3A2] hover:bg-[#8FB3A2] hover:text-black transition-all shadow-sm cursor-pointer relative z-30 ${
                        isCurrent ? "pointer-events-auto" : "pointer-events-none"
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>{locale === "fr" ? "Étude de cas détaillée" : "View Case Study"}</span>
                      <ArrowUpRight className="size-4" />
                    </Link>

                    {"year" in project && typeof (project as DisplayProjectItem).year === "string" && (
                      <span className="font-mono text-[11px] text-[#797681]">
                        {(project as DisplayProjectItem).year}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Interactive Controls & Scroll Indicators */}
        <div className="w-full max-w-2xl lg:max-w-3xl mx-auto flex flex-col items-center gap-2.5 pt-2 shrink-0">
          
          {/* Flip Stepper Indicator & Buttons */}
          <div className="flex items-center justify-between w-full border-t border-white/[0.08] pt-3">
            
            {/* Step Counter */}
            <div className="flex items-center gap-2">
              <Layers className="size-3.5 text-[#8FB3A2]" />
              <span className="font-mono text-xs font-bold text-[#f3f1f7]">
                0{activeIndex + 1}
              </span>
              <span className="text-white/20 font-mono text-xs">/</span>
              <span className="font-mono text-xs text-[#797681]">
                0{count}
              </span>
              <span className="hidden sm:inline font-mono text-[11px] text-[#797681] ml-2">
                {locale === "fr" ? "· Deck 3D spatial au défilement" : "· Spatial 3D deck on scroll"}
              </span>
            </div>

            {/* Clickable Card Navigation Pills */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollToStep(Math.max(0, activeIndex - 1))}
                disabled={activeIndex === 0}
                aria-label="Projet précédent"
                className="size-7 rounded-full border border-white/10 flex items-center justify-center text-[#797681] hover:text-[#f3f1f7] hover:border-white/25 disabled:opacity-30 cursor-pointer transition-all"
              >
                <ChevronLeft className="size-3.5" />
              </button>

              <div className="flex items-center gap-1.5 px-2">
                {displayProjects.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => scrollToStep(dotIdx)}
                    aria-label={`Aller au projet ${dotIdx + 1}`}
                    className={`rounded-full transition-all cursor-pointer ${
                      dotIdx === activeIndex
                        ? "w-6 h-2 bg-[#8FB3A2] shadow-[0_0_10px_rgba(143, 179, 162,0.6)]"
                        : "size-2 bg-white/20 hover:bg-white/40"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => scrollToStep(Math.min(count - 1, activeIndex + 1))}
                disabled={activeIndex === count - 1}
                aria-label="Projet suivant"
                className="size-7 rounded-full border border-white/10 flex items-center justify-center text-[#797681] hover:text-[#f3f1f7] hover:border-white/25 disabled:opacity-30 cursor-pointer transition-all"
              >
                <ChevronRight className="size-3.5" />
              </button>
            </div>

            {/* Link to all projects */}
            <Link
              href={`/${locale}/projects`}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[#797681] hover:text-[#f3f1f7] transition-colors"
            >
              <span>{locale === "fr" ? "Tous les projets" : "All projects"}</span>
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>

          {/* Scroll Guide Indicator */}
          <div className="text-[11px] font-mono text-[#797681] flex items-center gap-2 text-center">
            <span className="size-1.5 rounded-full bg-[#8FB3A2] animate-pulse shrink-0" />
            <span>
              {locale === "fr"
                ? "Défilez ou utilisez les flèches pour passer d'un projet à l'autre"
                : "Scroll or use the arrows to glide smoothly between projects"}
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
