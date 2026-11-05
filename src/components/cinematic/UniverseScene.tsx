"use client";

import { useRef, useState } from "react";
import { Code2, Cpu, Shield } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Locale } from "@/i18n/config";

interface UniverseSceneProps {
  locale: Locale;
}

const disciplines = [
  {
    id: "cyber",
    number: "01",
    icon: Shield,
    title: "Cybersecurity",
    titleFr: "Cybersécurité",
    tagline: "Audits, Zero-Trust, and Defensive Architecture.",
    taglineFr: "Audits d'intrusion, Zéro-Trust et architectures défensives.",
    description: "Deep hands-on experience in vulnerability assessment, IAM protocols, network scanning, and safeguarding critical infrastructure against modern threat vectors.",
    descriptionFr: "Pratique approfondie de l'évaluation de vulnérabilités, protocoles IAM, cartographie réseau et sécurisation d'infrastructures contre les menaces modernes.",
    tags: ["Pentesting", "Network Mapping", "Zero-Trust", "IAM", "Scapy", "Wireshark"],
    accentColor: "#38bdf8",
    bgGradient: "from-sky-500/10 via-transparent to-transparent",
  },
  {
    id: "software",
    number: "02",
    icon: Code2,
    title: "Software Engineering",
    titleFr: "Génie Logiciel",
    tagline: "High-Performance Full-Stack Systems & APIs.",
    taglineFr: "Systèmes Full-Stack performants & architectures résilientes.",
    description: "Building production-grade web platforms, scalable backend services, and resilient data layers with Next.js, TypeScript, PostgreSQL, and clean architecture.",
    descriptionFr: "Conception d'applications web de production, services backend évolutifs et couches de données résilientes avec Next.js, TypeScript et PostgreSQL.",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Supabase", "Docker", "Clean Architecture"],
    accentColor: "#9A71FF",
    bgGradient: "from-[#9A71FF]/10 via-transparent to-transparent",
  },
  {
    id: "ai",
    number: "03",
    icon: Cpu,
    title: "Artificial Intelligence",
    titleFr: "Intelligence Artificielle",
    tagline: "Machine Learning & Real-Time Computer Vision.",
    taglineFr: "Machine Learning & Vision par Ordinateur temps réel.",
    description: "Applying neural architectures, computer vision, and NLP models to solve complex domain challenges from agricultural monitoring to sign-language interpretation.",
    descriptionFr: "Application d'architectures neuronales, vision par ordinateur et NLP pour résoudre des problématiques réelles, de l'agritech à l'interprétation de la LSF.",
    tags: ["TensorFlow", "PyTorch", "Computer Vision", "NLP", "YOLO", "LLM Integration"],
    accentColor: "#a855f7",
    bgGradient: "from-purple-500/10 via-transparent to-transparent",
  },
];

export default function UniverseScene({ locale }: UniverseSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState(0);

  useGSAP(
    () => {
      if (typeof window === "undefined" || !containerRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      const cards = containerRef.current.querySelectorAll(".universe-card");
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { y: 40, opacity: 0.25 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.18,
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

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#101015] py-28 px-4 sm:px-8 lg:px-14 border-t border-white/5"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="font-mono text-xs font-semibold text-[#9A71FF] uppercase tracking-widest mb-3">
              {"//"} 03 — MY UNIVERSE
            </div>
            <h2 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-[#f3f1f7]">
              {locale === "fr" ? "Trois Disciplines. Un Esprit." : "Three Disciplines. One Mindset."}
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base text-[#797681] leading-relaxed">
            {locale === "fr"
              ? "La convergence du logiciel, de la sécurité offensive/défensive et de l'intelligence artificielle pour des solutions fiables et complètes."
              : "The convergence of robust software, offensive/defensive security, and artificial intelligence into reliable end-to-end systems."}
          </p>
        </div>

        {/* 3 Interactive Pillar Cards */}
        <div className="grid gap-8 lg:grid-cols-3">
          {disciplines.map((item, index) => {
            const Icon = item.icon;
            const title = locale === "fr" ? item.titleFr : item.title;
            const tagline = locale === "fr" ? item.taglineFr : item.tagline;
            const description = locale === "fr" ? item.descriptionFr : item.description;

            return (
              <div
                key={item.id}
                onMouseEnter={() => setActiveTab(index)}
                className={`universe-card group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border p-8 transition-all duration-500 backdrop-blur-xl ${
                  activeTab === index
                    ? "border-[#9A71FF]/50 bg-[#17161e] shadow-[0_0_50px_rgba(154,113,255,0.15)] scale-[1.01]"
                    : "border-white/10 bg-[#17161e]/50 hover:border-white/20 hover:bg-[#17161e]/80"
                }`}
              >
                {/* Background Ambient Gradient */}
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${item.bgGradient} opacity-60 transition-opacity duration-500 group-hover:opacity-100`}
                />

                <div className="relative z-10">
                  {/* Top Header Badge */}
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-mono text-xs font-bold text-[#797681]">
                      [ {item.number} ]
                    </span>
                    <div
                      className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] transition-transform duration-500 group-hover:scale-110"
                      style={{ color: item.accentColor }}
                    >
                      <Icon className="size-6" />
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-[#f3f1f7] mb-2 group-hover:text-white">
                    {title}
                  </h3>
                  <p
                    className="font-mono text-xs sm:text-sm font-semibold mb-6"
                    style={{ color: item.accentColor }}
                  >
                    {tagline}
                  </p>

                  <p className="text-sm text-[#797681] leading-relaxed mb-8">
                    {description}
                  </p>
                </div>

                {/* Tech Tags */}
                <div className="relative z-10 pt-6 border-t border-white/5">
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 font-mono text-[11px] text-[#f3f1f7]/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
