"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CertificationCard from "@/components/ui/CertificationCard";
import type { Locale } from "@/i18n/config";
import type { PublicCertification } from "@/features/portfolio/data";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { Marquee } from "@/components/magicui/marquee";

interface CertificationsSceneProps {
  locale: Locale;
  certifications?: PublicCertification[];
}

const fallbackCertifications: PublicCertification[] = [
  {
    id: "cert-cyber-1",
    name: "Pre-Security & Cyber Fundamentals",
    description: "Fondations en sécurité des réseaux, vulnérabilités web, architectures TCP/IP et protocoles d'authentification.",
    issuer: "TryHackMe",
    status: "completed",
    skills: ["Réseau", "Linux", "Web Security", "Wireshark"],
    issuedOn: "2024-06-15",
    verificationUrl: "https://tryhackme.com/p/nahliAmine",
    hasDocument: false,
    documentMimeType: null,
    featured: true,
  },
  {
    id: "cert-ai-1",
    name: "Deep Learning & Neural Networks",
    description: "Conception et entraînement de modèles de réseaux de neurones profonds, optimisation des fonctions de perte et régularisation.",
    issuer: "Coursera / DeepLearning.AI",
    status: "completed",
    skills: ["Python", "TensorFlow", "PyTorch", "Backpropagation"],
    issuedOn: "2024-04-10",
    verificationUrl: "https://coursera.org",
    hasDocument: false,
    documentMimeType: null,
    featured: true,
  },
  {
    id: "cert-net-1",
    name: "CCNA: Introduction to Networks",
    description: "Routage, commutation, sous-réseaux IPv4/IPv6, protocoles de transport et sécurité d'infrastructure de commutation.",
    issuer: "Cisco Networking Academy",
    status: "completed",
    skills: ["Routing", "Switching", "IPv4/IPv6", "Subnetting", "VLANs"],
    issuedOn: "2023-11-20",
    verificationUrl: null,
    hasDocument: false,
    documentMimeType: null,
    featured: true,
  },
];

export default function CertificationsScene({
  locale,
  certifications,
}: CertificationsSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const displayCertifications =
    certifications && certifications.length > 0
      ? certifications.slice(0, 3)
      : fallbackCertifications.slice(0, 3);

  useGSAP(
    () => {
      if (typeof window === "undefined" || !containerRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      const cards = containerRef.current.querySelectorAll(".cert-card-wrapper");
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
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

  const accreditedOrgs = [
    "TRYHACKME",
    "CISCO NETWORKING ACADEMY",
    "DEEPLEARNING.AI",
    "COURSERA",
    "GOOGLE BUILD WITH GEMMA",
    "UNIVERSITÉ PRIVÉE DE FÈS",
    "GDG ON CAMPUS",
  ];

  return (
    <section
      ref={containerRef}
      id="certifications"
      className="relative w-full bg-transparent py-28 px-4 sm:px-8 lg:px-14 border-t border-border overflow-hidden scroll-mt-24"
    >
      {/* Background Dot Pattern (Magic UI) */}
      <DotPattern
        width={24}
        height={24}
        cx={1}
        cy={1}
        cr={1}
        className="fill-white/[0.04] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_50%,transparent_100%)] -z-10"
      />

      <div className="mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-accent mb-3 block">
              {locale === "fr" ? "Diplômes & Accréditations" : "Verified Credentials"}
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-text-primary">
              {locale === "fr" ? "Certifications Officielles." : "Official Certifications."}
            </h2>
          </div>
          <p className="max-w-md text-sm text-text-secondary leading-relaxed">
            {locale === "fr"
              ? "Apprentissage continu structuré et accrédité par des organismes reconnus, avec justificatifs officiels vérifiables."
              : "Structured continuous learning and technical certifications from recognized industry bodies, with verifiable proof."}
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {displayCertifications.map((cert) => (
            <div
              key={cert.id}
              className="cert-card-wrapper h-full flex flex-col will-change-[transform,opacity]"
            >
              <CertificationCard
                certification={cert}
                locale={locale}
                copy={{
                  verify: locale === "fr" ? "Vérifier la certification" : "Verify Credential",
                  close: locale === "fr" ? "Fermer" : "Close",
                }}
              />
            </div>
          ))}
        </div>

        {/* Accredited Institutions Marquee Ribbon (Magic UI) */}
        <div className="mt-14 py-3 rounded-2xl border border-border/80 bg-surface/50 overflow-hidden backdrop-blur-sm">
          <Marquee pauseOnHover className="font-mono text-[11px] uppercase tracking-wider text-text-muted [--duration:30s]">
            {accreditedOrgs.map((org, i) => (
              <div key={i} className="flex items-center gap-8 mx-4">
                <span className="hover:text-accent transition-colors">{org}</span>
                <span className="text-accent/40">·</span>
              </div>
            ))}
          </Marquee>
        </div>

        {/* Bottom Explorer Link */}
        <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
          <Link
            href={`/${locale}/certifications`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-text-primary transition-colors"
          >
            <span>
              {locale === "fr"
                ? "Explorer toutes les certifications & documents"
                : "View all certifications & documents"}
            </span>
            <ArrowUpRight className="size-4" />
          </Link>
          <span className="text-xs text-text-muted font-medium">
            {locale === "fr" ? "Organismes accrédités & certificats originaux" : "Accredited bodies & original certificates"}
          </span>
        </div>
      </div>
    </section>
  );
}
