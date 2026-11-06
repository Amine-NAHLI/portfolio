"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, FileText, Briefcase, Mail, Award, Compass } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Locale } from "@/i18n/config";
import type { HeroActionButton } from "@/content/dynamic-copy";
import { DEFAULT_HERO_BUTTONS } from "@/content/dynamic-copy";

interface HeroSceneProps {
  locale: Locale;
  siteName: string;
  introduction?: string;
  headline?: string;
  contactLinks: {
    github?: string;
    linkedin?: string;
    resume: string;
  };
  heroButtons?: HeroActionButton[];
}

export default function HeroScene({
  locale,
  siteName,
  headline,
  contactLinks,
  heroButtons,
}: HeroSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (typeof window === "undefined" || !containerRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      // Fast, snappy parallel reveal to eliminate any delay / blank screen on refresh
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );

      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.1, ease: "power2.out" }
      );

      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.15, ease: "power2.out" }
      );

      // Subtle scroll fade
      gsap.to(contentRef.current, {
        yPercent: -15,
        opacity: 0.35,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: containerRef }
  );

  const activeButtons = (heroButtons && heroButtons.length > 0 ? heroButtons : DEFAULT_HERO_BUTTONS).filter(
    (b) => b.enabled
  );

  const getButtonIcon = (id: string) => {
    switch (id) {
      case "cv":
        return <FileText className="size-4 text-[#9A71FF]" />;
      case "projects":
        return <ArrowUpRight className="size-4" />;
      case "contact":
        return <Mail className="size-4 text-[#9A71FF]" />;
      case "journey":
        return <Compass className="size-4 text-[#9A71FF]" />;
      case "certifications":
        return <Award className="size-4 text-[#9A71FF]" />;
      default:
        return <Briefcase className="size-4" />;
    }
  };

  const resolveButtonUrl = (btn: HeroActionButton) => {
    if (btn.id === "cv") {
      return contactLinks.resume;
    }
    if (btn.url.startsWith("#")) {
      return `/${locale}${btn.url}`;
    }
    if (btn.url.startsWith("/") && !btn.url.startsWith(`/${locale}`)) {
      return `/${locale}${btn.url}`;
    }
    return btn.url;
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-transparent px-4 sm:px-8 lg:px-14 py-20 text-[#f3f1f7]"
    >
      {/* Subtle ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-[#0E161A] opacity-70 blur-[180px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-1/4 top-1/2 translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-[#0B0510] opacity-80 blur-[180px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[550px] rounded-full bg-[#9A71FF]/8 blur-[160px]"
      />

      {/* Main Centered Content Canvas */}
      <div
        ref={contentRef}
        className="relative z-10 mx-auto w-full max-w-4xl flex flex-col items-center justify-center text-center my-auto py-8"
      >
        {/* Monumental Display Name */}
        <h1
          ref={titleRef}
          aria-label={siteName}
          className="font-display text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-[#f3f1f7] leading-none"
        >
          {siteName}
        </h1>

        {/* Tagline */}
        <div ref={subtitleRef} className="mt-6 max-w-2xl mx-auto">
          <p className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#f3f1f7]/90 leading-snug">
            {headline ||
              (locale === "fr"
                ? "Concevoir des architectures logicielles fiables, sécurisées et intelligentes."
                : "Engineering robust, secure, and intelligent systems.")}
          </p>
        </div>

        {/* Dynamic Action Buttons configured from Admin */}
        <div ref={ctaRef} className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          {activeButtons.map((btn) => {
            const label = locale === "fr" ? btn.labelFr : btn.labelEn;
            const targetUrl = resolveButtonUrl(btn);
            const isExternal = btn.id === "cv" || targetUrl.startsWith("http");

            if (btn.style === "primary") {
              return (
                <Link
                  key={btn.id}
                  href={targetUrl}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noreferrer" : undefined}
                  className="inline-flex items-center gap-2 rounded-full bg-[#f3f1f7] px-6 py-3 text-xs sm:text-sm font-bold text-[#101015] shadow-lg transition-all duration-200 hover:bg-white hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>{label}</span>
                  {getButtonIcon(btn.id)}
                </Link>
              );
            }

            return (
              <Link
                key={btn.id}
                href={targetUrl}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noreferrer" : undefined}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-xs sm:text-sm font-semibold text-[#f3f1f7] transition-all duration-200 hover:bg-white/[0.08]"
              >
                {getButtonIcon(btn.id)}
                <span>{label}</span>
              </Link>
            );
          })}

          {/* Social Icons */}
          <div className="flex items-center gap-2 pl-1">
            {contactLinks.github && (
              <a
                href={contactLinks.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub Profile"
                className="inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-[#797681] hover:text-[#f3f1f7] hover:bg-white/[0.08] transition-colors"
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
                className="inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-[#797681] hover:text-[#f3f1f7] hover:bg-white/[0.08] transition-colors"
              >
                <svg className="size-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Subtle Scroll Hint */}
      <div className="absolute bottom-5 left-0 right-0 z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-8 lg:px-14 text-xs text-[#797681]">
        <span>{locale === "fr" ? "Université Privée de Fès" : "Private University of Fez"}</span>
        <div className="flex items-center gap-1.5 text-white/50">
          <span className="text-[11px] uppercase tracking-wider">{locale === "fr" ? "Défiler" : "Scroll"}</span>
          <ArrowDown className="size-3 text-[#9A71FF]" />
        </div>
        <span>{locale === "fr" ? "Fès, Maroc" : "Fez, Morocco"}</span>
      </div>
    </section>
  );
}
