"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Locale } from "@/i18n/config";

interface ManifestoSceneProps {
  locale: Locale;
}

const statements = [
  {
    prefix: "01",
    action: "I BUILD",
    actionFr: "JE CONSTRUIS",
    tagline: "High-performance software and scalable digital architectures that solve real-world problems.",
    taglineFr: "Des logiciels haute performance et des architectures scalables résolvant des problèmes concrets.",
    accent: "var(--text-primary)",
    color: "var(--accent)",
  },
  {
    prefix: "02",
    action: "I SECURE",
    actionFr: "JE SÉCURISE",
    tagline: "Auditing systems, designing zero-trust access, and locking down vulnerabilities before they emerge.",
    taglineFr: "Audit de systèmes, architectures zéro-trust et neutralisation des vulnérabilités avant leur émergence.",
    accent: "#0284c7",
    color: "#0ea5e9",
  },
  {
    prefix: "03",
    action: "I INNOVATE",
    actionFr: "J'INNOVE",
    tagline: "Empowering systems with machine learning, automated intelligence, and adaptive algorithms.",
    taglineFr: "Augmentation des systèmes par le machine learning, l'automatisation intelligente et les algorithmes adaptatifs.",
    accent: "#9333ea",
    color: "#9333ea",
  },
];

export default function ManifestoScene({ locale }: ManifestoSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useGSAP(
    () => {
      if (typeof window === "undefined" || !containerRef.current || !pinRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      const cards = cardsRef.current.filter(Boolean);
      if (cards.length === 0) return;

      // Pin the section while scrolling through statements
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=220%",
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });

      // Explicitly initialize cards: Step 01 is immediately 100% visible, others hidden
      gsap.set(cards[0], { opacity: 1, y: 0, scale: 1 });
      for (let i = 1; i < cards.length; i++) {
        gsap.set(cards[i], { opacity: 0, y: 40, scale: 0.95 });
      }

      // Hold Step 01 so user clearly sees it upon entering the pinned section
      tl.to({}, { duration: 0.8 });

      // Step 01 -> Step 02
      if (cards[1]) {
        tl.to(
          cards[0],
          { opacity: 0, y: -40, scale: 0.95, duration: 1, ease: "power2.inOut" },
          "step-1"
        )
          .to(
            cards[1],
            { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power2.inOut" },
            "step-1"
          )
          .to({}, { duration: 0.8 }); // Hold Step 02
      }

      // Step 02 -> Step 03
      if (cards[2]) {
        tl.to(
          cards[1],
          { opacity: 0, y: -40, scale: 0.95, duration: 1, ease: "power2.inOut" },
          "step-2"
        )
          .to(
            cards[2],
            { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power2.inOut" },
            "step-2"
          )
          .to({}, { duration: 0.8 }); // Hold Step 03
      }
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-transparent text-text-primary overflow-hidden"
    >
      <div
        ref={pinRef}
        className="relative flex h-[100svh] w-full flex-col justify-between px-6 sm:px-12 lg:px-20 py-16"
      >
        {/* Subtle Ambient Glow (optimized radial gradient, zero blur filter cost) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, color-mix(in srgb, var(--accent) 12%, transparent) 0%, transparent 70%)",
          }}
        />

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-border pb-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              {locale === "fr" ? "Philosophie & Vision" : "Philosophy & Vision"}
            </span>
            <span className="hidden sm:inline-block size-1 rounded-full bg-text-primary/30" />
            <span className="hidden sm:inline-block text-xs text-text-secondary">
              {locale === "fr" ? "Exigence d'ingénierie logicielle" : "Software Engineering Standards"}
            </span>
          </div>
          <span className="text-xs text-text-secondary">Amine NAHLI</span>
        </div>

        {/* Center: Overlapping Kinetic Statements */}
        <div className="relative z-10 my-auto flex items-center justify-center min-h-[340px]">
          {statements.map((item, index) => {
            const actionText = locale === "fr" ? item.actionFr : item.action;
            const taglineText = locale === "fr" ? item.taglineFr : item.tagline;

            return (
              <div
                key={index}
                ref={(el) => {
                  if (el) cardsRef.current[index] = el;
                }}
                style={{
                  opacity: index === 0 ? 1 : 0,
                  transform: index === 0 ? "none" : "translateY(40px) scale(0.95)",
                }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center max-w-4xl mx-auto will-change-transform pointer-events-none"
              >
                <div className="font-mono text-xs sm:text-sm font-semibold tracking-widest text-text-muted uppercase mb-4">
                  [ STEP {item.prefix} ]
                </div>

                <h2 className="font-display text-5xl sm:text-7xl lg:text-9xl font-black tracking-[-0.04em] text-text-primary leading-none mb-6">
                  {actionText}
                  <span style={{ color: item.color }}>.</span>
                </h2>

                <p className="font-sans text-base sm:text-xl lg:text-2xl text-text-secondary max-w-2xl font-light leading-relaxed">
                  {taglineText}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom Bar */}
        <div className="relative z-10 flex items-center justify-between border-t border-border pt-6 text-xs text-text-muted">
          <span>{locale === "fr" ? "Architectures logicielles & Sécurité" : "Software Architectures & Security"}</span>
          <span>{locale === "fr" ? "Cycle d'Ingénieur UPF" : "UPF Engineering Cycle"}</span>
        </div>
      </div>
    </section>
  );
}

