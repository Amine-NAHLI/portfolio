"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, FileText, ShieldCheck } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Locale } from "@/i18n/config";

interface HeroSceneProps {
  locale: Locale;
  siteName: string;
  introduction: string;
  contactLinks: {
    github?: string;
    linkedin?: string;
    resume: string;
  };
}

export default function HeroScene({
  locale,
  siteName,
  introduction,
  contactLinks,
}: HeroSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (typeof window === "undefined" || !containerRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      // Entrance animation timeline
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Animate ambient glow
      tl.fromTo(
        glowRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1.8 }
      );

      // Title characters reveal
      const chars = titleRef.current?.querySelectorAll(".hero-char");
      if (chars && chars.length > 0) {
        tl.fromTo(
          chars,
          { yPercent: 110, opacity: 0, rotateZ: 3 },
          { yPercent: 0, opacity: 1, rotateZ: 0, duration: 1.1, stagger: 0.035 },
          "-=1.4"
        );
      }

      // Subtitle & CTAs fade in
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9 },
        "-=0.7"
      );

      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.6"
      );

      // Portrait card reveal
      tl.fromTo(
        portraitRef.current,
        { opacity: 0, scale: 0.92, y: 40 },
        { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "expo.out" },
        "-=1.1"
      );

      // Scroll-driven exit/scale transformation (Scrollytelling zoom)
      gsap.to(portraitRef.current, {
        yPercent: -15,
        scale: 0.96,
        opacity: 0.85,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });

      gsap.to(titleRef.current, {
        yPercent: -20,
        opacity: 0.3,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    },
    { scope: containerRef }
  );

  const nameLetters = siteName.toUpperCase().split("");

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] w-full flex flex-col justify-between overflow-hidden bg-[#101015] px-4 sm:px-8 lg:px-14 pt-28 pb-10 selection:bg-[#9A71FF]/30 selection:text-white"
    >
      {/* Ambient Radial Backlight Glow */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute right-[-5%] top-[10%] h-[550px] w-[550px] rounded-full bg-[#9A71FF]/15 blur-[140px] will-change-transform"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-10%] bottom-[5%] h-[450px] w-[450px] rounded-full bg-blue-600/10 blur-[130px]"
      />

      {/* Subtle Cinematic Grid Mesh */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#f3f1f7_1px,transparent_1px)] [background-size:36px_36px] opacity-[0.03]"
      />

      {/* Main Content Hero Canvas */}
      <div className="relative z-10 mx-auto w-full max-w-7xl my-auto grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
        
        {/* Left Column: Oversized Typography & Storytelling */}
        <div className="flex flex-col justify-center lg:col-span-7">
          
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 backdrop-blur-xl mb-6 w-fit">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            <span className="font-mono text-[11px] font-medium tracking-widest text-[#f3f1f7]/80 uppercase">
              {locale === "fr" ? "Élève Ingénieur · UPF Fès" : "Engineering Student · UPF Fez"}
            </span>
            <span className="text-white/20 font-mono text-[10px]">|</span>
            <span className="font-mono text-[11px] text-[#9A71FF] font-semibold tracking-wider">
              CYBER · IA · SOFTWARE
            </span>
          </div>

          {/* Giant Display Name */}
          <h1
            ref={titleRef}
            aria-label={siteName}
            className="font-display text-5xl sm:text-7xl lg:text-[5.75rem] font-black tracking-[-0.04em] text-[#f3f1f7] leading-[0.95] overflow-hidden"
          >
            <span className="inline-block overflow-hidden pb-2">
              {nameLetters.map((char, index) => (
                <span
                  key={index}
                  className={`hero-char inline-block will-change-transform ${
                    char === " " ? "mr-4" : ""
                  }`}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </span>
            <span className="text-[#9A71FF] inline-block ml-1">.</span>
          </h1>

          {/* Cinematic Tagline & Bio */}
          <div ref={subtitleRef} className="mt-6 max-w-xl">
            <p className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#f3f1f7]/90 leading-snug">
              {locale === "fr"
                ? "Concevoir des idées. Bâtir ce qui vient."
                : "Engineering ideas. Building what's next."}
            </p>
            <p className="mt-3 text-sm sm:text-base text-[#797681] leading-relaxed">
              {introduction}
            </p>
          </div>

          {/* CTAs and Direct Links */}
          <div ref={ctaRef} className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href={`/${locale}/projects`}
              className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-[#f3f1f7] px-7 py-3.5 font-sans text-xs sm:text-sm font-bold text-[#101015] shadow-xl transition-all duration-300 hover:bg-white hover:shadow-[0_0_30px_rgba(243,241,247,0.3)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{locale === "fr" ? "Explorer mes projets" : "Explore Selected Work"}</span>
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            <Link
              href={contactLinks.resume}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-6 py-3.5 font-sans text-xs sm:text-sm font-semibold text-[#f3f1f7] backdrop-blur-xl transition-all duration-300 hover:border-[#9A71FF]/50 hover:bg-[#9A71FF]/10 hover:text-white"
            >
              <FileText className="size-4 text-[#9A71FF]" />
              <span>{locale === "fr" ? "Consulter mon CV" : "View Official CV"}</span>
            </Link>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pl-2">
              {contactLinks.github && (
                <a
                  href={contactLinks.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub Profile"
                  className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-[#797681] transition-all duration-300 hover:border-white/30 hover:bg-white/10 hover:text-white hover:scale-105"
                >
                  <svg className="size-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                </a>
              )}
              {contactLinks.linkedin && (
                <a
                  href={contactLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn Profile"
                  className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-[#797681] transition-all duration-300 hover:border-white/30 hover:bg-white/10 hover:text-white hover:scale-105"
                >
                  <svg className="size-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: High-Impact Cinematic Portrait Card */}
        <div
          ref={portraitRef}
          className="relative flex justify-center lg:col-span-5 lg:justify-end"
        >
          <div className="relative w-full max-w-[340px] sm:max-w-[400px]">
            
            {/* Architectural Frame Brackets */}
            <div className="pointer-events-none absolute -left-2 -top-2 size-6 border-l-2 border-t-2 border-[#9A71FF]/60" />
            <div className="pointer-events-none absolute -right-2 -top-2 size-6 border-r-2 border-t-2 border-[#9A71FF]/60" />
            <div className="pointer-events-none absolute -left-2 -bottom-2 size-6 border-l-2 border-b-2 border-[#9A71FF]/60" />
            <div className="pointer-events-none absolute -right-2 -bottom-2 size-6 border-r-2 border-b-2 border-[#9A71FF]/60" />

            {/* Portrait Image Container */}
            <div className="group relative aspect-[3/4] w-full overflow-hidden rounded-[2rem] border border-white/10 bg-[#17161e] p-2 shadow-2xl backdrop-blur-2xl transition-all duration-500 hover:border-[#9A71FF]/40 hover:shadow-[0_0_50px_rgba(154,113,255,0.2)]">
              <div className="relative size-full overflow-hidden rounded-[1.6rem]">
                <Image
                  src="/nahli.png"
                  alt={siteName}
                  fill
                  priority
                  className="object-cover object-top filter grayscale contrast-110 transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 380px"
                />

                {/* Subtle vignette gradient overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#101015]/90 via-transparent to-transparent" />

                {/* Floating Bottom Badge */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl border border-white/10 bg-[#101015]/75 px-3.5 py-2.5 backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-4 text-[#9A71FF]" />
                    <span className="font-mono text-[11px] font-semibold text-[#f3f1f7]">
                      Ingénierie & Sécurité
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-[#797681]">
                    v2026.1
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Prompt Bar */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between border-t border-white/5 pt-6 text-[11px] font-mono tracking-widest text-[#797681]">
        <div className="flex items-center gap-2">
          <span className="text-[#9A71FF]">{"//"} 01</span>
          <span>{locale === "fr" ? "PROLOGUE · PRÉSENTATION" : "PROLOGUE · OVERVIEW"}</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-white/40 animate-bounce">
          <span>{locale === "fr" ? "DÉFILER POUR EXPLORER" : "SCROLL TO EXPLORE"}</span>
          <ArrowDown className="size-3.5 text-[#9A71FF]" />
        </div>

        <div className="flex items-center gap-3">
          <span>{locale === "fr" ? "FÈS, MAROC" : "FEZ, MOROCCO"}</span>
        </div>
      </div>
    </section>
  );
}
