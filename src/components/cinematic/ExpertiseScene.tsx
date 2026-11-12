"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, Cpu, Layers, Network, ShieldAlert, Wrench } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Locale } from "@/i18n/config";

interface ExpertiseSceneProps {
  locale: Locale;
}

const skillCategories = [
  {
    id: "sec",
    icon: ShieldAlert,
    title: "Sécurité & Audit Réseau",
    titleEn: "Security & Network Audit",
    items: [
      { name: "Penetration Testing", note: "Web, API, Network Vectors" },
      { name: "Zero-Trust & IAM", note: "Access control, Auth protocols" },
      { name: "Scapy & Packet Crafting", note: "Custom telemetry analysis" },
      { name: "Wireshark & Nmap", note: "Traffic forensics & port auditing" },
      { name: "OWASP Top 10", note: "Vulnerability remediation" },
    ],
  },
  {
    id: "soft",
    icon: Layers,
    title: "Génie Logiciel & Architectures",
    titleEn: "Software & Systems Architecture",
    items: [
      { name: "Next.js & React 19", note: "App Router, SSR/ISR pipelines" },
      { name: "TypeScript Strict", note: "Type safety, robust contracts" },
      { name: "PostgreSQL & Supabase", note: "RLS, migrations, relational schemas" },
      { name: "Tailwind CSS & Motion", note: "Kinetic UI, responsive layouts" },
      { name: "RESTful & GraphQL APIs", note: "Microservices & headless data" },
    ],
  },
  {
    id: "ai",
    icon: Cpu,
    title: "Intelligence Artificielle & Vision",
    titleEn: "AI & Computer Vision",
    items: [
      { name: "Deep Learning (PyTorch/TF)", note: "CNNs, sequence architectures" },
      { name: "Computer Vision (OpenCV)", note: "Landmark tracking, edge detection" },
      { name: "LLM Orchestration (Groq)", note: "Prompt engineering, RAG pipelines" },
      { name: "MediaPipe Tracking", note: "Real-time gesture analysis" },
      { name: "Model Optimization", note: "Edge deployment & low latency" },
    ],
  },
  {
    id: "ops",
    icon: Network,
    title: "DevOps, Réseaux & Outillage",
    titleEn: "DevOps, Networks & Tooling",
    items: [
      { name: "Docker & Containerization", note: "Isolated reproducible environments" },
      { name: "Linux Administration", note: "Debian, Arch, bash automation" },
      { name: "Git & GitHub Actions", note: "CI/CD testing & verification" },
      { name: "Network Routing & DNS", note: "Subnetting, VPN, VLAN configs" },
      { name: "Playwright & E2E Testing", note: "Automated regression & accessibility" },
    ],
  },
];

const marqueeKeywords = [
  "NEXT.JS 15",
  "CYBERSECURITY",
  "REACT 19",
  "TYPESCRIPT",
  "PENTESTING",
  "TENSORFLOW",
  "POSTGRESQL",
  "ZERO-TRUST",
  "GSAP MOTION",
  "SUPABASE",
  "DOCKER",
  "WIRESHARK",
];

export default function ExpertiseScene({ locale }: ExpertiseSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (typeof window === "undefined" || !containerRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      // Smooth horizontal marquee ticker linked to scroll
      if (marqueeRef.current) {
        gsap.to(marqueeRef.current, {
          xPercent: -30,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      const blocks = containerRef.current.querySelectorAll(".skill-block");
      if (blocks.length > 0) {
        gsap.fromTo(
          blocks,
          { opacity: 0.25, y: 30 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.12,
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

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#0B0B0C] py-28 px-4 sm:px-8 lg:px-14 border-t border-white/5 overflow-hidden"
    >
      {/* Kinetic Typography Marquee Banner */}
      <div className="relative mb-20 -mx-4 sm:-mx-8 lg:-mx-14 border-y border-white/10 bg-[#141518]/40 py-5 overflow-hidden whitespace-nowrap backdrop-blur-md">
        <div ref={marqueeRef} className="flex gap-12 font-mono text-xs sm:text-sm font-semibold tracking-widest text-[#FFFFFF]/60 uppercase will-change-transform">
          {[...marqueeKeywords, ...marqueeKeywords].map((word, i) => (
            <div key={i} className="flex items-center gap-12">
              <span className="hover:text-[#C8F122] transition-colors">{word}</span>
              <span className="text-[#C8F122]/50">✦</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-[#C8F122] uppercase tracking-widest mb-3">
              <Wrench className="size-3.5" />
              <span>{"//"} 07 — EXPERTISE & DOMAINS</span>
            </div>
            <h2 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-[#FFFFFF]">
              {locale === "fr" ? "L'Outil n'est qu'un Début." : "Tools are Just the Beginning."}
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base text-[#A1A1AA] leading-relaxed">
            {locale === "fr"
              ? "Pas de pourcentages fantaisistes : une cartographie honnête des compétences articulées autour de cas d'usage réels et vérifiables."
              : "No arbitrary proficiency bars: an authentic mapping of capabilities tied directly to tested production implementations."}
          </p>
        </div>

        {/* 4 Editorial Categorical Columns */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {skillCategories.map((cat) => {
            const Icon = cat.icon;
            const title = locale === "fr" ? cat.title : cat.titleEn;

            return (
              <div
                key={cat.id}
                className="skill-block group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-[#141518]/60 p-7 backdrop-blur-xl transition-all duration-300 hover:border-[#C8F122]/40 hover:bg-[#141518]"
              >
                <div>
                  <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
                    <h3 className="font-display text-lg font-bold text-[#FFFFFF] group-hover:text-white">
                      {title}
                    </h3>
                    <Icon className="size-5 text-[#C8F122]" />
                  </div>

                  <ul className="space-y-4">
                    {cat.items.map((item, idx) => (
                      <li key={idx} className="flex flex-col">
                        <span className="font-sans text-sm font-semibold text-[#FFFFFF]/90 group-hover:text-white">
                          {item.name}
                        </span>
                        <span className="font-mono text-[11px] text-[#A1A1AA]">
                          {item.note}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between font-mono text-[10px] text-[#A1A1AA]">
                  <span>VÉRIFIÉ</span>
                  <span className="text-[#C8F122]">● ACTIF</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-14 flex items-center justify-between border-t border-white/10 pt-6">
          <Link
            href={`/${locale}/skills`}
            className="inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-[#FFFFFF] hover:text-[#C8F122] transition-colors"
          >
            <span>{locale === "fr" ? "VOIR TOUTES LES COMPÉTENCES & CERTIFICATIONS" : "VIEW DETAILED SKILLS & EVIDENCE"}</span>
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

