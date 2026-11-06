"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
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
      fr: "Cartographie réseau temps réel, scanning de ports passif/actif et analyse d'anomalies de sécurité.",
      en: "Real-time network mapping, active/passive port scanning, and automated security anomaly detection.",
    },
    technologies: ["Python", "Scapy", "Wireshark", "Next.js", "Docker"],
    category: "CYBERSÉCURITÉ",
    year: "2024",
  },
  {
    slug: "transport-yolo-robot",
    title: {
      fr: "Transport YOLO Robot — Vision Embarquée",
      en: "Transport YOLO Robot — Embedded Vision",
    },
    subtitle: {
      fr: "Système de détection d'obstacles et navigation autonome",
      en: "Obstacle Detection and Autonomous Navigation System",
    },
    summary: {
      fr: "Pipeline complet d'entraînement et d'inférence YOLO temps réel optimisé pour robotique de transport.",
      en: "End-to-end YOLO training and low-latency inference pipeline optimized for autonomous transport robotics.",
    },
    technologies: ["PyTorch", "YOLOv8", "OpenCV", "ROS", "Python"],
    category: "VISION PAR ORDINATEUR",
    year: "2024",
  },
  {
    slug: "e-upf-portail-gestion",
    title: {
      fr: "E-UPF — Portail Unifié Universitaire",
      en: "E-UPF — Unified Academic Management Portal",
    },
    subtitle: {
      fr: "Plateforme de gestion académique avec contrôle d'accès RBAC",
      en: "Academic Operations Platform with Fine-Grained RBAC",
    },
    summary: {
      fr: "Portail full-stack reliant étudiants, corps professoral et administration avec authentification chiffrée.",
      en: "Full-stack portal interconnecting students, faculty, and administration with encrypted role-based access.",
    },
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Supabase", "Tailwind CSS"],
    category: "GÉNIE LOGICIEL",
    year: "2024",
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
      fr: "Détection des repères des mains et classification séquentielle pour la traduction instantanée de gestes.",
      en: "Hand landmark tracking and sequence classification for real-time sign language translation.",
    },
    technologies: ["Python", "MediaPipe", "PyTorch", "OpenCV", "NumPy"],
    category: "INTELLIGENCE ARTIFICIELLE",
    year: "2024",
  },
];

export default function SelectedWorkScene({ locale, projects }: SelectedWorkSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Display the selected projects configured in Admin (up to 4 cards)
  const displayProjects = projects && projects.length > 0 ? projects.slice(0, 4) : fallbackProjects;

  useGSAP(
    () => {
      if (typeof window === "undefined" || !containerRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      const cards = gsap.utils.toArray<HTMLElement>(".stacked-project-card");
      if (cards.length === 0) return;

      cards.forEach((card, index) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top 45%",
          end: "bottom 45%",
          onEnter: () => setActiveIndex(index),
          onEnterBack: () => setActiveIndex(index),
        });

        // Card Deck Stacking: When the next card arrives, subtly compress scale & adjust opacity of previous card
        if (index < cards.length - 1) {
          gsap.to(card, {
            scale: 0.94,
            opacity: 0.8,
            transformOrigin: "top center",
            ease: "none",
            scrollTrigger: {
              trigger: cards[index + 1],
              start: "top 75%",
              end: "top 25%",
              scrub: true,
            },
          });
        }
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="work"
      className="relative w-full bg-transparent py-24 sm:py-32 px-4 sm:px-8 lg:px-14 border-t border-white/[0.08] scroll-mt-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-start">
          
          {/* Left Column: Sticky Narrative & Counter */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#9A71FF] mb-3 block">
                {locale === "fr" ? "Sélection de Réalisations" : "Featured Work"}
              </span>

              <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#f3f1f7] leading-tight mb-4">
                {locale === "fr" ? "Projets Phares." : "Work that Speaks."}
              </h2>

              <p className="text-sm sm:text-base text-[#797681] leading-relaxed mb-6 max-w-md">
                {locale === "fr"
                  ? "Chaque projet est conçu comme un système complet : problème réel identifié, architecture rigoureuse, métriques mesurées et code source documenté."
                  : "Each project is engineered as a robust system: verified problem space, rigorous architecture, measured outcomes, and documented source code."}
              </p>

              {/* Dynamic Project Index Counter */}
              <div className="flex items-center gap-3 text-xs border-t border-b border-white/[0.08] py-3.5 my-6">
                <span className="text-[#9A71FF] font-bold text-base">
                  0{activeIndex + 1}
                </span>
                <span className="text-white/20">/</span>
                <span className="text-[#797681]">
                  0{displayProjects.length}
                </span>
                <span className="ml-auto text-[#797681]">
                  {locale === "fr" ? "Cartes empilées" : "Stacked cards"}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href={`/${locale}/projects`}
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#f3f1f7] hover:text-[#9A71FF] transition-colors"
              >
                <span>{locale === "fr" ? "Consulter tous les projets" : "View all projects"}</span>
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Stacked Project Cards */}
          <div ref={cardsContainerRef} className="lg:col-span-7 flex flex-col gap-8">
            {(displayProjects as DisplayProjectItem[]).map((project, index) => {
              const projectTitle = typeof project.title === "string" ? project.title : project.title?.[locale];
              const projectSubtitle = typeof project.subtitle === "string" ? project.subtitle : project.subtitle?.[locale];
              const projectSummary = typeof project.summary === "string" ? project.summary : project.summary?.[locale];
              const techList = project.coreTechnologies || project.technologies || [];
              const categoryBadge = project.category || "PROJET INGÉNIEUR";

              return (
                <div
                  key={project.slug || index}
                  style={{
                    top: `${6.5 + index * 1.5}rem`,
                    zIndex: 10 + index,
                  }}
                  className="stacked-project-card sticky group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#0B0510] p-7 sm:p-9 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:border-[#9A71FF]/40 will-change-transform mb-12"
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-5 border-b border-white/[0.08]">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-[#9A71FF]">
                        0{index + 1}
                      </span>
                      <span className="text-xs font-medium uppercase tracking-wider text-[#797681]">
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
                          className="flex size-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-[#797681] hover:text-white transition-colors"
                        >
                          <svg className="size-3.5 fill-current" viewBox="0 0 24 24">
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
                          className="flex size-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-[#797681] hover:text-white transition-colors"
                        >
                          <ExternalLink className="size-3.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="py-6">
                    <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#f3f1f7] mb-2">
                      {projectTitle}
                    </h3>

                    {projectSubtitle && (
                      <p className="text-xs sm:text-sm font-medium text-[#f3f1f7]/80 mb-3">
                        {projectSubtitle}
                      </p>
                    )}

                    <p className="text-sm text-[#797681] leading-relaxed line-clamp-3 mb-5 font-normal">
                      {projectSummary}
                    </p>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {techList.slice(0, 5).map((tech: string) => (
                        <span
                          key={tech}
                          className="rounded-md border border-white/10 bg-white/[0.02] px-2.5 py-1 text-xs text-[#f3f1f7]/80"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-5 border-t border-white/[0.08] flex items-center justify-between">
                    <Link
                      href={`/${locale}/projects/${project.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#f3f1f7] hover:text-[#9A71FF] transition-colors"
                    >
                      <span>{locale === "fr" ? "Étude de cas détaillée" : "View Case Study"}</span>
                      <ArrowUpRight className="size-3.5" />
                    </Link>

                    <span className="text-xs text-[#797681]">
                      {project.year || "2024 - 2026"}
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
