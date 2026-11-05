"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, GraduationCap, Terminal } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Locale } from "@/i18n/config";

interface AboutSceneProps {
  locale: Locale;
}

export default function AboutScene({ locale }: AboutSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (typeof window === "undefined" || !containerRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { opacity: 0.3, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      const paragraphs = textRef.current?.querySelectorAll(".about-paragraph");
      if (paragraphs && paragraphs.length > 0) {
        gsap.fromTo(
          paragraphs,
          { opacity: 0.25, y: 30 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: textRef.current,
              start: "top 85%",
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
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
          
          {/* Left Column: Stylized Portrait Frame */}
          <div ref={imageRef} className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[360px] sm:max-w-[420px]">
              
              {/* Corner Architectural Accents */}
              <div className="pointer-events-none absolute -left-2 -top-2 size-6 border-l-2 border-t-2 border-[#9A71FF]/60" />
              <div className="pointer-events-none absolute -right-2 -top-2 size-6 border-r-2 border-t-2 border-[#9A71FF]/60" />
              <div className="pointer-events-none absolute -left-2 -bottom-2 size-6 border-l-2 border-b-2 border-[#9A71FF]/60" />
              <div className="pointer-events-none absolute -right-2 -bottom-2 size-6 border-r-2 border-b-2 border-[#9A71FF]/60" />

              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.25rem] border border-white/10 bg-[#17161e] p-2.5 shadow-2xl backdrop-blur-2xl">
                <div className="relative size-full overflow-hidden rounded-[1.75rem] bg-[#101015]">
                  <Image
                    src="/nahli.png"
                    alt="Amine Nahli"
                    fill
                    className="object-cover object-top filter grayscale contrast-105 hover:grayscale-0 transition-all duration-700"
                    sizes="(max-width: 768px) 100vw, 420px"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#101015] via-transparent to-transparent opacity-80" />

                  {/* Overlay Badge */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur-md">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="size-4 text-[#9A71FF]" />
                      <span className="font-mono text-xs font-semibold text-[#f3f1f7]">
                        UPF · 4e Année Génie Info
                      </span>
                    </div>
                    <div className="flex items-center gap-1 font-mono text-[10px] text-emerald-400">
                      <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>ACTIF</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Narrative */}
          <div ref={textRef} className="lg:col-span-7 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1 text-xs font-mono font-semibold text-[#9A71FF] uppercase tracking-wider mb-4 w-fit">
              <Terminal className="size-3.5" />
              <span>{"//"} 03 — ABOUT AMINE</span>
            </div>

            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#f3f1f7] leading-tight mb-8">
              {locale === "fr" ? (
                <>
                  Bâtir des solutions fiables, <span className="text-[#9A71FF]">sécurisées dès la conception.</span>
                </>
              ) : (
                <>
                  Engineering resilient systems, <span className="text-[#9A71FF]">secure by design.</span>
                </>
              )}
            </h2>

            <div className="space-y-6 text-sm sm:text-base text-[#797681] leading-relaxed">
              <p className="about-paragraph">
                {locale === "fr"
                  ? "Élève ingénieur en 4ème année de Génie Informatique à l'Université Privée de Fès (UPF), je développe des applications logicielles complètes où la sécurité n'est pas une surcouche de fin de projet, mais le fondement même de l'architecture."
                  : "Fourth-year computer engineering student at Université Privée de Fès (UPF), I build full-stack digital systems where security is not a late addition, but the core foundation of architecture."}
              </p>

              <p className="about-paragraph">
                {locale === "fr"
                  ? "Mon expérience de stage chez IntelTrust et mes travaux personnels en cybersécurité offensive et défensive m'ont appris à identifier les vecteurs de défaillance, auditer les flux réseau et verrouiller les politiques d'accès (IAM, Zero-Trust)."
                  : "My internship experience at IntelTrust and hands-on work in both offensive and defensive cybersecurity taught me how to diagnose threat surfaces, audit network telemetry, and enforce tight access policies (IAM, Zero-Trust)."}
              </p>

              <p className="about-paragraph">
                {locale === "fr"
                  ? "En parallèle, j'applique des modèles de machine learning et de vision par ordinateur pour automatiser des tâches d'ingénierie concrètes, de la détection précoce en agritech à l'analyse de signaux en temps réel."
                  : "Concurrently, I deploy machine learning and computer vision architectures to automate tangible real-world tasks, from agritech diagnostics to real-time signal analysis."}
              </p>
            </div>

            {/* Quick Facts Strip */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10">
              <div className="flex flex-col">
                <span className="font-mono text-xs text-[#797681] uppercase tracking-wider">Formation</span>
                <span className="font-display text-base font-bold text-[#f3f1f7] mt-1">UPF Fès (Ingénieur)</span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-xs text-[#797681] uppercase tracking-wider">Expérience</span>
                <span className="font-display text-base font-bold text-[#f3f1f7] mt-1">Stage IntelTrust</span>
              </div>
              <div className="flex flex-col col-span-2 sm:col-span-1">
                <span className="font-mono text-xs text-[#797681] uppercase tracking-wider">Langues</span>
                <span className="font-display text-base font-bold text-[#f3f1f7] mt-1">FR · EN · AR</span>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <Link
                href={`/${locale}/journey`}
                className="inline-flex items-center gap-2 rounded-full bg-white/[0.05] border border-white/15 px-6 py-3 font-sans text-xs font-semibold text-[#f3f1f7] hover:bg-white/10 hover:border-white/30 transition-all"
              >
                <span>{locale === "fr" ? "Voir mon parcours complet" : "View Complete Journey"}</span>
                <ArrowUpRight className="size-4 text-[#9A71FF]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
