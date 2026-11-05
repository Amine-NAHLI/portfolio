"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ExternalLink, Layers } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Locale } from "@/i18n/config";
import type { PortfolioProject } from "@/types/content";

interface DisplayProjectItem {
  slug: string;
  title: string | Record<string, string>;
  subtitle?: string | Record<string, string>;
  summary: string | Record<string, string>;
  technologies?: string[];
  coreTechnologies?: string[];
  category?: string;
  year?: string;
  color?: string;
  githubUrl?: string;
  demoUrl?: string;
}

interface SelectedWorkSceneProps {
  locale: Locale;
  projects: PortfolioProject[];
}

const fallbackProjects = [
  {
    slug: "smart-network-mapper",
    title: "Smart Network Mapper",
    subtitle: {
      fr: "Cartographie et audit réseau actif automatisé",
      en: "Automated active network discovery and security audit",
    },
    summary: {
      fr: "Outil d'ingénierie réseau et de cybersécurité pour la découverte passive/active d'hôtes, l'analyse de ports ouverts et la détection d'anomalies en temps réel.",
      en: "Network engineering and cybersecurity engine for host discovery, port scanning, and real-time network anomaly identification.",
    },
    technologies: ["Python", "Scapy", "Nmap", "Socket", "FastAPI"],
    category: "CYBERSECURITY",
    year: "2024 - 2025",
    color: "#38bdf8",
  },
  {
    slug: "portfolify",
    title: "Portfolify",
    subtitle: {
      fr: "Générateur et gestionnaire de portfolios pour ingénieurs",
      en: "Automated portfolio generator & headless CMS for developers",
    },
    summary: {
      fr: "Plateforme web haute performance permettant aux étudiants et ingénieurs de générer et d'administrer leur vitrine professionnelle avec synchronisation GitHub.",
      en: "High-performance web system enabling engineers to deploy and manage a production-grade portfolio with automated GitHub synchronization.",
    },
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL"],
    category: "FULL-STACK PLATFORM",
    year: "2025",
    color: "#9A71FF",
  },
  {
    slug: "agrishift-ai",
    title: "Agrishift AI",
    subtitle: {
      fr: "Système de vision intelligente pour le suivi des cultures",
      en: "Intelligent computer vision for crop health monitoring",
    },
    summary: {
      fr: "Application de deep learning combinant vision par ordinateur et capteurs IoT pour la détection précoce des maladies végétales et l'optimisation des rendements.",
      en: "Deep learning engine fusing edge computer vision with IoT telemetry for early crop disease diagnosis and irrigation optimization.",
    },
    technologies: ["Python", "TensorFlow", "OpenCV", "FastAPI", "React"],
    category: "ARTIFICIAL INTELLIGENCE",
    year: "2024",
    color: "#a855f7",
  },
  {
    slug: "sign-language-ai",
    title: "Vision ASL Interpreter",
    subtitle: {
      fr: "Interprétation en temps réel de la langue des signes",
      en: "Real-time sign language gestures recognition",
    },
    summary: {
      fr: "Modèle neuronal d'analyse spatio-temporelle de points clés anatomiques (MediaPipe) pour la traduction instantanée des signes en texte synthétique.",
      en: "Neural model tracking landmark coordinates in real time to translate sign language gestures into natural language text.",
    },
    technologies: ["Python", "MediaPipe", "PyTorch", "OpenCV", "NumPy"],
    category: "COMPUTER VISION",
    year: "2024",
    color: "#ec4899",
  },
];

export default function SelectedWorkScene({ locale, projects }: SelectedWorkSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Combine provided projects from database with fallback rich metadata
  const displayProjects = projects && projects.length >= 3 ? projects.slice(0, 4) : fallbackProjects;

  useGSAP(
    () => {
      if (typeof window === "undefined" || !containerRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      const cards = gsap.utils.toArray<HTMLElement>(".stacked-project-card");
      if (cards.length === 0) return;

      cards.forEach((card, index) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top 40%",
          end: "bottom 40%",
          onEnter: () => setActiveIndex(index),
          onEnterBack: () => setActiveIndex(index),
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#101015] py-28 px-4 sm:px-8 lg:px-14 border-t border-white/5"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-start">
          
          {/* Left Column: Sticky Narrative & Counter (like in the reference video) */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1 text-xs font-mono font-semibold text-[#9A71FF] uppercase tracking-wider mb-4">
                <Layers className="size-3.5" />
                <span>{"//"} 04 — SELECTED WORK</span>
              </div>

              <h2 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-[#f3f1f7] leading-none mb-4">
                {locale === "fr" ? "Projets Phares." : "Work that Speaks."}
              </h2>

              <p className="text-base text-[#797681] leading-relaxed mb-8 max-w-md">
                {locale === "fr"
                  ? "Chaque projet est conçu comme un système complet : problème réel identifié, architecture rigoureuse, métriques mesurées et code source documenté."
                  : "Each project is engineered as a robust system: verified problem space, rigorous architecture, measured outcomes, and documented source code."}
              </p>

              {/* Dynamic Project Index Counter */}
              <div className="flex items-center gap-3 font-mono text-sm border-t border-b border-white/10 py-4 my-6">
                <span className="text-[#9A71FF] font-bold text-lg">
                  {String(activeIndex + 1).padStart(2, "0")}
                </span>
                <span className="text-white/20">/</span>
                <span className="text-[#797681]">
                  {String(displayProjects.length).padStart(2, "0")}
                </span>
                <span className="ml-auto font-sans text-xs text-[#797681]">
                  {locale === "fr" ? "Faites défiler pour empiler les cartes" : "Scroll to stack cards"}
                </span>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href={`/${locale}/projects`}
                className="group inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-[#f3f1f7] hover:text-[#9A71FF] transition-colors"
              >
                <span>{locale === "fr" ? "TOUT L'EXPLORATEUR DE PROJETS" : "EXPLORE ALL PROJECTS"}</span>
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </div>
          </div>

          {/* Right Column: Stacked Project Cards */}
          <div ref={cardsContainerRef} className="lg:col-span-7 flex flex-col gap-10">
            {(displayProjects as DisplayProjectItem[]).map((project, index) => {
              const projectTitle = typeof project.title === "string" ? project.title : project.title?.[locale];
              const projectSubtitle = typeof project.subtitle === "string" ? project.subtitle : project.subtitle?.[locale];
              const projectSummary = typeof project.summary === "string" ? project.summary : project.summary?.[locale];
              const techList = project.coreTechnologies || project.technologies || [];
              const categoryBadge = project.category || "ENGINEERING CASE";
              const accentColor = project.color || "#9A71FF";

              return (
                <div
                  key={project.slug || index}
                  style={{ top: `${6.5 + index * 1.25}rem` }}
                  className="stacked-project-card sticky group relative flex flex-col justify-between overflow-hidden rounded-[2.25rem] border border-white/10 bg-[#17161e] p-7 sm:p-9 shadow-2xl backdrop-blur-2xl transition-all duration-500 hover:border-[#9A71FF]/40 will-change-transform mb-8"
                >
                  {/* Ambient Card Backlight */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-20 -top-20 size-60 rounded-full blur-[100px] opacity-20 transition-opacity duration-500 group-hover:opacity-40"
                    style={{ backgroundColor: accentColor }}
                  />

                  {/* Card Header */}
                  <div className="relative z-10 flex items-center justify-between pb-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-[#797681]">
                        [{String(index + 1).padStart(2, "0")}]
                      </span>
                      <span
                        className="font-mono text-[11px] font-semibold tracking-widest uppercase"
                        style={{ color: accentColor }}
                      >
                        {categoryBadge}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="GitHub Repository"
                          className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-[#797681] hover:text-white hover:border-white/30 transition-colors"
                        >
                          <svg className="size-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                          </svg>
                        </a>
                      )}
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="Live Demo"
                          className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-[#797681] hover:text-white hover:border-white/30 transition-colors"
                        >
                          <ExternalLink className="size-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="relative z-10 py-6">
                    <h3 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-[#f3f1f7] group-hover:text-white mb-2">
                      {projectTitle}
                    </h3>

                    {projectSubtitle && (
                      <p className="font-sans text-sm sm:text-base font-semibold text-[#f3f1f7]/80 mb-4">
                        {projectSubtitle}
                      </p>
                    )}

                    <p className="text-sm text-[#797681] leading-relaxed line-clamp-3 mb-6">
                      {projectSummary}
                    </p>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {techList.slice(0, 5).map((tech: string) => (
                        <span
                          key={tech}
                          className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[11px] text-[#f3f1f7]/80"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between">
                    <Link
                      href={`/${locale}/projects/${project.slug}`}
                      className="group/link inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 font-sans text-xs font-bold text-[#f3f1f7] hover:bg-[#f3f1f7] hover:text-[#101015] transition-all duration-300"
                    >
                      <span>{locale === "fr" ? "Étude de Cas Détaillée" : "View Full Case Study"}</span>
                      <ArrowUpRight className="size-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                    </Link>

                    <span className="font-mono text-[11px] text-[#797681]">
                      {project.year || "2024 - 2025"}
                    </span>
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
