"use client";

import { useState, useRef } from "react";
import { ArrowUpRight, CheckCircle2, Code2, Cpu, Shield, Terminal } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Locale } from "@/i18n/config";

interface UniverseSceneProps {
  locale: Locale;
}

interface DisciplineDetail {
  id: string;
  icon: typeof Shield;
  codePrefix: string;
  title: string;
  titleFr: string;
  tagline: string;
  taglineFr: string;
  statement: string;
  statementFr: string;
  status: string;
  statusFr: string;
  metrics: { label: string; labelFr: string; value: string }[];
  competencies: { name: string; nameFr: string; desc: string; descFr: string }[];
  techStack: string[];
  liveCodeSnippet: {
    language: string;
    filename: string;
    lines: string[];
  };
  linkedProject: {
    title: string;
    slug: string;
  };
}

const disciplinesData: DisciplineDetail[] = [
  {
    id: "cyber",
    icon: Shield,
    codePrefix: "01",
    title: "Cybersecurity & Defensive Networks",
    titleFr: "Cybersécurité & Réseaux Défensifs",
    tagline: "Offensive diagnostics, zero-trust policies, and attack surface mitigation.",
    taglineFr: "Audit offensif, politiques Zéro-Trust et réduction de surface d'attaque.",
    statement:
      "Security is not a final perimeter layer; it is the fundamental contract of system architecture. From network telemetry forensics to strict IAM access enforcement.",
    statementFr:
      "La sécurité n'est pas une surcouche périphérique tardive, mais le contrat fondamental de toute architecture système. Du décorticage de télémétrie réseau aux politiques IAM strictes.",
    status: "MISSION-HARDENED",
    statusFr: "ENVIRONNEMENT SÉCURISÉ",
    metrics: [
      { label: "Threat Modeling", labelFr: "Modélisation Menaces", value: "OWASP Top 10" },
      { label: "Network Protocol", labelFr: "Protocoles Réseau", value: "Zero-Trust / IAM" },
      { label: "Packet Inspection", labelFr: "Analyse Traces", value: "Scapy / Wireshark" },
    ],
    competencies: [
      {
        name: "Penetration Testing & Surface Auditing",
        nameFr: "Tests d'Intrusion & Cartographie de Surface",
        desc: "Automated vulnerability scans, perimeter attack vectors diagnosis, web API security.",
        descFr: "Cartographie des vecteurs d'attaque, diagnostic d'APIs et audits web conformes OWASP.",
      },
      {
        name: "Zero-Trust & Identity Governance",
        nameFr: "Zero-Trust & Gouvernance d'Identités (IAM)",
        desc: "Role-based access controls, cryptographic tokens, strict session isolation.",
        descFr: "Gestion stricte des habilitations RBAC, jetons cryptographiques et isolation de sessions.",
      },
      {
        name: "Network Forensics & Packet Crafting",
        nameFr: "Forensics Réseau & Packet Crafting",
        desc: "Low-level protocol dissection, traffic anomaly detection using Python Scapy.",
        descFr: "Dissection bas-niveau des trames TCP/IP, détection proactive d'anomalies de trafic.",
      },
    ],
    techStack: ["Linux Hardening", "Scapy", "Wireshark", "Nmap", "Zero-Trust", "Burp Suite", "Bash Security", "Docker Isolation"],
    liveCodeSnippet: {
      language: "python",
      filename: "telemetry_threat_guard.py",
      lines: [
        "from scapy.all import sniff, IP, TCP",
        "# Real-time probe: Telemetry inspection",
        "def audit_stream(pkt):",
        "    if pkt.haslayer(IP) and pkt[TCP].flags == 'S':",
        "        threat_score = evaluate_anomaly(pkt[IP].src)",
        "        if threat_score > 0.85:",
        "            enforce_zero_trust_quarantine(pkt[IP].src)",
        "sniff(filter='tcp port 443', prn=audit_stream, store=0)",
      ],
    },
    linkedProject: {
      title: "IntelTrust Security Audit & Threat Modeling",
      slug: "inteltrust-stage",
    },
  },
  {
    id: "software",
    icon: Code2,
    codePrefix: "02",
    title: "Software Engineering & Systems",
    titleFr: "Génie Logiciel & Systèmes Distribués",
    tagline: "Resilient full-stack architectures, strict typing, and high-concurrency systems.",
    taglineFr: "Architectures web full-stack, typage strict et systèmes distribués résilients.",
    statement:
      "Engineering robust web applications with Next.js, TypeScript strict mode, relational PostgreSQL persistence, and containerized Docker pipelines.",
    statementFr:
      "Conception d'applications web de production et d'architectures orientées services : typage statique absolu, intégrité relationnelle et pipelines conteneurisés.",
    status: "PRODUCTION-READY",
    statusFr: "ARCHITECTURES VÉRIFIÉES",
    metrics: [
      { label: "Type Contract", labelFr: "Contrat de Données", value: "Strict TypeScript" },
      { label: "Persistence Engine", labelFr: "Moteur de Données", value: "PostgreSQL & RLS" },
      { label: "Deployment Pipeline", labelFr: "Conteneurisation", value: "Docker / CI-CD" },
    ],
    competencies: [
      {
        name: "Full-Stack Web Architectures",
        nameFr: "Architectures Applicatives Full-Stack",
        desc: "Next.js App Router, React 19 SSR/ISR pipelines, headless data structures.",
        descFr: "Pipelines SSR/ISR avec Next.js App Router, contrats API stricts et microservices headless.",
      },
      {
        name: "Database Design & Row-Level Security",
        nameFr: "Bases de Données & Sécurité Niveau Ligne (RLS)",
        desc: "Relational schema normalization, complex SQL migrations, multi-tenant policies.",
        descFr: "Normalisation relationnelle, politiques RLS étanches et intégrité transactionnelle PostgreSQL.",
      },
      {
        name: "DevOps & Container Orchestration",
        nameFr: "DevOps & Conteneurisation Isolée",
        desc: "Reproducible Docker environments, GitHub Actions automated CI/CD checks.",
        descFr: "Environnements reproductibles Docker, pipelines GitHub Actions et tests end-to-end automatisés.",
      },
    ],
    techStack: ["Next.js", "React 19", "TypeScript", "PostgreSQL", "Supabase", "Docker", "Tailwind CSS", "REST & GraphQL"],
    liveCodeSnippet: {
      language: "typescript",
      filename: "architecture_service_contract.ts",
      lines: [
        "interface ServicePipeline<TInput, TOutput> {",
        "  validate(payload: unknown): Result<TInput>;",
        "  execute(context: ExecutionCtx, data: TInput): Promise<TOutput>;",
        "}",
        "export async function dispatchTask<T>(pipeline: ServicePipeline<T, void>) {",
        "  const auditSession = await verifySecuritySession();",
        "  return db.transaction(async (trx) => pipeline.execute(auditSession, data));",
        "}",
      ],
    },
    linkedProject: {
      title: "Plateforme Technique Multi-Tenant & Portfolio Next.js",
      slug: "portfolio-nahli",
    },
  },
  {
    id: "ai",
    icon: Cpu,
    codePrefix: "03",
    title: "Artificial Intelligence & Vision",
    titleFr: "Intelligence Artificielle & Vision par Ordinateur",
    tagline: "Machine learning pipelines, real-time computer vision, and applied model integration.",
    taglineFr: "Pipelines de vision par ordinateur, détection temps réel et fine-tuning de modèles ouverts.",
    statement:
      "Harnessing machine learning where it creates decisive value: real-time landmark tracking, optical recognition, fine-tuned open language models, and autonomous edge reasoning.",
    statementFr:
      "Exploiter l'IA là où elle apporte une valeur concrète et vérifiable : suivi biométrique temps réel, détection d'objets YOLO, fine-tuning Google Gemma et inférence optimisée.",
    status: "APPLIED INNOVATION",
    statusFr: "MODÈLES & INFÉRENCE",
    metrics: [
      { label: "Vision Pipeline", labelFr: "Détection Visuelle", value: "YOLO & OpenCV" },
      { label: "Neural Frameworks", labelFr: "Frameworks IA", value: "PyTorch / MediaPipe" },
      { label: "Model Ecosystem", labelFr: "Modèles Ouverts", value: "Gemma 2 Fine-Tuned" },
    ],
    competencies: [
      {
        name: "Real-Time Computer Vision & Object Tracking",
        nameFr: "Vision par Ordinateur & Télémétrie Temps Réel",
        desc: "Multi-object detection, trajectory extrapolation, autonomous vehicle vision.",
        descFr: "Détection multi-objets YOLO, traitement de flux vidéo OpenCV et télémétrie robotique.",
      },
      {
        name: "Applied LLM Orchestration & Fine-Tuning",
        nameFr: "Orchestration LLM & Fine-Tuning de Modèles",
        desc: "Fine-tuning open weights models (Gemma 2), prompt routing, RAG pipelines.",
        descFr: "Adaptation de modèles ouverts (Google Gemma 2), chaînes RAG et inférence accélérée.",
      },
      {
        name: "Edge Model Deployment & Inference",
        nameFr: "Optimisation & Inférence Embarquée",
        desc: "Quantization, lightweight models for constrained edge systems and robotics.",
        descFr: "Quantification, compression de modèles et exécution fluide sur systèmes contraints.",
      },
    ],
    techStack: ["Python", "PyTorch", "OpenCV", "YOLO v8", "Google Gemma 2", "MediaPipe", "Scikit-Learn", "FastAPI"],
    liveCodeSnippet: {
      language: "python",
      filename: "vision_inference_engine.py",
      lines: [
        "import cv2, torch",
        "from ultralytics import YOLO",
        "# Load quantified vision model for high-fps inference",
        "model = YOLO('models/yolov8_optimized.pt').to('cuda')",
        "def process_frame(frame):",
        "    results = model(frame, conf=0.75, iou=0.45)",
        "    telemetry = extract_bounding_coordinates(results)",
        "    return calculate_steering_vector(telemetry)",
      ],
    },
    linkedProject: {
      title: "Google Build with Gemma Hackathon Winner & YOLO Vision Robot",
      slug: "gemma-hackathon",
    },
  },
];

export default function UniverseScene({ locale }: UniverseSceneProps) {
  const [activeTab, setActiveTab] = useState<string>("cyber");
  const containerRef = useRef<HTMLDivElement>(null);

  const current = disciplinesData.find((d) => d.id === activeTab) || disciplinesData[0];
  const Icon = current.icon;

  useGSAP(
    () => {
      if (typeof window === "undefined" || !containerRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      gsap.fromTo(
        containerRef.current.querySelector(".universe-console"),
        { opacity: 0.3, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 78%",
            toggleActions: "play none none none",
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="disciplines"
      className="relative w-full bg-transparent py-24 sm:py-32 px-4 sm:px-8 lg:px-14 border-t border-border overflow-hidden"
    >
      {/* Background Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/4 top-1/2 -translate-y-1/2 size-[600px] rounded-full bg-accent/8 blur-[160px]"
      />

      <div className="mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-accent mb-3 block">
              {locale === "fr" ? "Expertise & Pôles d'Ingénierie" : "Engineering Disciplines"}
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-text-primary">
              {locale === "fr" ? "Trois Domaines. Une Même Exigence." : "Three Disciplines. One Standard."}
            </h2>
          </div>
          <p className="max-w-md text-sm text-text-secondary leading-relaxed">
            {locale === "fr"
              ? "Une vision holistique reliant sécurité offensive/défensive, ingénierie logicielle avancée et intelligence artificielle appliquée."
              : "A holistic engineering synergy connecting cybersecurity, resilient software systems, and applied computer vision."}
          </p>
        </div>

        {/* Innovative Interactive Domain Switcher Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          {disciplinesData.map((d) => {
            const isSelected = d.id === activeTab;
            const TabIcon = d.icon;
            const title = locale === "fr" ? d.titleFr : d.title;

            return (
              <button
                key={d.id}
                type="button"
                onClick={() => setActiveTab(d.id)}
                className={`group relative flex items-center gap-3.5 rounded-2xl border p-4 sm:p-5 text-left transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? "border-accent bg-surface shadow-[0_0_25px_color-mix(in_srgb,var(--accent)_16%,transparent)] ring-1 ring-accent/40"
                    : "border-border bg-surface/55 hover:border-border-strong hover:bg-surface"
                }`}
              >
                <div
                  className={`size-10 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                    isSelected
                      ? "bg-accent text-text-on-accent"
                      : "bg-text-primary/[0.04] text-accent group-hover:bg-text-primary/[0.08]"
                  }`}
                >
                  <TabIcon className="size-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-text-muted">
                      {d.codePrefix}
                    </span>
                    <span
                      className={`text-xs font-mono font-semibold uppercase tracking-wider ${
                        isSelected ? "text-accent" : "text-text-secondary"
                      }`}
                    >
                      {locale === "fr" ? d.statusFr : d.status}
                    </span>
                  </div>
                  <h3 className="font-display text-sm sm:text-base font-bold text-text-primary truncate mt-0.5">
                    {title}
                  </h3>
                </div>
              </button>
            );
          })}
        </div>

        {/* Innovative Engineering Cockpit Console */}
        <div className="universe-console rounded-3xl border border-border-strong bg-surface p-6 sm:p-10 shadow-2xl transition-all duration-500">
          <div className="grid gap-10 lg:grid-cols-12 items-start">
            
            {/* Left 7 Columns: In-depth Technical Spec */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-11 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
                    <Icon className="size-6" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
                      {current.codePrefix} · {locale === "fr" ? current.statusFr : current.status}
                    </span>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-text-primary">
                      {locale === "fr" ? current.titleFr : current.title}
                    </h3>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-text-primary/90 leading-relaxed font-medium mb-4">
                  {locale === "fr" ? current.taglineFr : current.tagline}
                </p>

                <p className="text-sm text-text-secondary leading-relaxed mb-8">
                  {locale === "fr" ? current.statementFr : current.statement}
                </p>

                {/* 3 Live Metric Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                  {current.metrics.map((m, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-border bg-text-primary/[0.03] p-3.5"
                    >
                      <span className="text-[11px] uppercase tracking-wider text-text-muted font-mono block mb-1">
                        {locale === "fr" ? m.labelFr : m.label}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-text-primary">
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Technical Competencies Breakdown */}
                <div className="space-y-4 mb-8">
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent block">
                    {locale === "fr" ? "Compétences d'Ingénierie Spécialisées" : "Specialized Engineering Capabilities"}
                  </span>
                  {current.competencies.map((comp, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-border bg-text-primary/[0.02] p-4 transition-colors hover:border-border-strong"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <CheckCircle2 className="size-4 text-accent shrink-0" />
                        <h4 className="text-sm font-bold text-text-primary">
                          {locale === "fr" ? comp.nameFr : comp.name}
                        </h4>
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed pl-6">
                        {locale === "fr" ? comp.descFr : comp.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technologies Badges */}
              <div className="pt-6 border-t border-border">
                <span className="text-xs uppercase tracking-wider text-text-muted font-mono mb-3 block">
                  {locale === "fr" ? "Stack & Outils Vérifiés" : "Verified Stack & Tooling"}
                </span>
                <div className="flex flex-wrap gap-2">
                  {current.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-lg border border-border bg-text-primary/[0.04] px-3 py-1 text-xs font-medium text-text-primary hover:border-accent/45 hover:text-accent transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Live Architecture Terminal / Code Simulator */}
            <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6">
              <div className="rounded-2xl border border-border-strong bg-surface-raised overflow-hidden shadow-2xl">
                {/* Terminal Title Bar */}
                <div className="flex items-center justify-between border-b border-border bg-text-primary/[0.03] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-rose-500/80" />
                    <span className="size-2.5 rounded-full bg-amber-500/80" />
                    <span className="size-2.5 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 font-mono text-xs text-text-secondary">
                      {current.liveCodeSnippet.filename}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-accent uppercase tracking-wider font-semibold">
                    {current.liveCodeSnippet.language}
                  </span>
                </div>

                {/* Code Window */}
                <div className="p-4 sm:p-5 font-mono text-xs text-text-primary/90 leading-relaxed overflow-x-auto space-y-1">
                  {current.liveCodeSnippet.lines.map((line, idx) => (
                    <div key={idx} className="flex">
                      <span className="w-6 shrink-0 text-text-muted/60 select-none text-right pr-3">
                        {idx + 1}
                      </span>
                      <span className={line.startsWith("#") ? "text-text-muted" : line.includes("def ") || line.includes("interface ") ? "text-accent font-semibold" : ""}>
                        {line}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connected Real-World Project Card */}
              <div className="rounded-2xl border border-border bg-text-primary/[0.03] p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono text-accent uppercase tracking-wider font-semibold">
                    {locale === "fr" ? "Projet & Cas d'Application" : "Applied Engineering Case"}
                  </span>
                  <Terminal className="size-4 text-text-muted" />
                </div>
                <h4 className="font-display text-base font-bold text-text-primary mb-4">
                  {current.linkedProject.title}
                </h4>
                <Link
                  href={`/${locale}/projects`}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-accent hover:text-text-primary transition-colors"
                >
                  <span>{locale === "fr" ? "Consulter les projets associés" : "Explore related work"}</span>
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
