"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Locale } from "@/i18n/config";

interface AboutSceneProps {
  locale: Locale;
  aboutTitle?: string;
  aboutBio?: string;
  proofItems?: Array<[string, string]>;
}

export default function AboutScene({
  locale,
  aboutTitle,
  aboutBio,
  proofItems,
}: AboutSceneProps) {
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
          { opacity: 0.3, scale: 0.96 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.9,
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
          { opacity: 0.3, y: 24 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.12,
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
      id="about"
      className="relative w-full bg-transparent py-24 sm:py-32 px-4 sm:px-8 lg:px-14 border-t border-border"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
          
          {/* Left Column: Clean Editorial Portrait */}
          <div ref={imageRef} className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[340px] sm:max-w-[390px]">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-border-strong bg-surface shadow-2xl">
                <Image
                  src="/nahli.png"
                  alt="Amine Nahli"
                  fill
                  priority
                  className="object-cover object-top transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 390px"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg-page/45 via-transparent to-transparent" />
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Narrative */}
          <div ref={textRef} className="lg:col-span-7 flex flex-col justify-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent mb-3">
              {locale === "fr" ? "Profil & Vision" : "Profile & Vision"}
            </span>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary leading-tight mb-6">
              {aboutTitle ? (
                <span>{aboutTitle}</span>
              ) : locale === "fr" ? (
                <>
                  Bâtir des solutions fiables, <span className="text-accent">sécurisées dès la conception.</span>
                </>
              ) : (
                <>
                  Engineering resilient systems, <span className="text-accent">secure by design.</span>
                </>
              )}
            </h2>

            <div className="space-y-5 text-sm sm:text-base text-text-secondary leading-relaxed">
              {aboutBio ? (
                <p className="about-paragraph whitespace-pre-line leading-relaxed text-text-primary/90 font-normal">
                  {aboutBio}
                </p>
              ) : (
                <>
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
                </>
              )}
            </div>

            {/* Quick Facts Strip */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-border">
              <div>
                <span className="text-xs text-text-muted block">
                  {proofItems?.[0]?.[0] || (locale === "fr" ? "Formation" : "Education")}
                </span>
                <span className="text-sm font-semibold text-text-primary mt-0.5 block">
                  {proofItems?.[0]?.[1] || "UPF Fès (Génie Info)"}
                </span>
              </div>
              <div>
                <span className="text-xs text-text-muted block">
                  {proofItems?.[1]?.[0] || (locale === "fr" ? "Expérience" : "Experience")}
                </span>
                <span className="text-sm font-semibold text-text-primary mt-0.5 block">
                  {proofItems?.[1]?.[1] || "Stage IntelTrust"}
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-xs text-text-muted block">
                  {proofItems?.[2]?.[0] || (locale === "fr" ? "Langues" : "Languages")}
                </span>
                <span className="text-sm font-semibold text-text-primary mt-0.5 block">
                  {proofItems?.[2]?.[1] || "Français · Anglais · Arabe"}
                </span>
              </div>
            </div>

            <div className="mt-7">
              <Link
                href={`/${locale}#journey`}
                className="inline-flex items-center gap-2 text-xs font-semibold text-accent hover:text-text-primary transition-colors"
              >
                <span>{locale === "fr" ? "Découvrir mon parcours complet" : "Explore full journey"}</span>
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
