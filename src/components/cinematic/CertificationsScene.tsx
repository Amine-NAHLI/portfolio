"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CertificationCard from "@/components/ui/CertificationCard";
import type { Locale } from "@/i18n/config";
import type { PublicCertification } from "@/features/portfolio/data";

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

  return (
    <section
      ref={containerRef}
      id="certifications"
      className="relative w-full bg-transparent py-28 px-4 sm:px-8 lg:px-14 border-t border-white/5 overflow-hidden scroll-mt-24"
    >
      {/* Background Accent Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-10%] top-1/3 size-[500px] rounded-full bg-[#C8F122]/10 blur-[150px]"
      />

      <div className="mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C8F122] mb-3 block">
              {locale === "fr" ? "Diplômes & Accréditations" : "Verified Credentials"}
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#FFFFFF]">
              {locale === "fr" ? "Certifications Officielles." : "Official Certifications."}
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#A1A1AA] leading-relaxed">
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
              className="cert-card-wrapper h-full flex flex-col transition-transform duration-300 hover:scale-[1.01]"
            >
              <CertificationCard
                certification={cert}
                locale={locale}
                copy={{
                  verify: locale === "fr" ? "Vérifier le certificat" : "Verify Credential",
                  close: locale === "fr" ? "Fermer" : "Close",
                }}
              />
            </div>
          ))}
        </div>

        {/* Bottom Explorer Link */}
        <div className="mt-12 flex items-center justify-between border-t border-white/[0.08] pt-6">
          <Link
            href={`/${locale}/certifications`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C8F122] hover:text-white transition-colors"
          >
            <span>
              {locale === "fr"
                ? "Explorer toutes les certifications & documents"
                : "View all certifications & documents"}
            </span>
            <ArrowUpRight className="size-4" />
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400">
            <ShieldCheck className="size-3.5" />
            <span>{locale === "fr" ? "Vérification officielle" : "Official verification"}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
