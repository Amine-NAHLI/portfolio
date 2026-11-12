"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, Mail, Send } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Locale } from "@/i18n/config";

interface ContactSceneProps {
  locale: Locale;
  contactLinks: {
    github?: string;
    linkedin?: string;
    resume: string;
    email?: string;
  };
}

export default function ContactScene({ locale, contactLinks }: ContactSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (typeof window === "undefined" || !containerRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      if (textRef.current) {
        gsap.fromTo(
          textRef.current,
          { opacity: 0.3, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: textRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      const cards = cardsRef.current?.querySelectorAll(".contact-card-btn");
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0.3, y: 24 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.12,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    },
    { scope: containerRef }
  );

  const emailAddress = contactLinks.email?.replace("mailto:", "") || "nahli-ami@upf.ac.ma";

  return (
    <section
      ref={containerRef}
      id="contact"
      className="relative min-h-[80svh] w-full bg-transparent py-24 sm:py-32 px-4 sm:px-8 lg:px-14 border-t border-white/[0.08] flex flex-col justify-center overflow-hidden scroll-mt-24"
    >
      {/* Background Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 bottom-0 -translate-x-1/2 h-[500px] w-[600px] rounded-full bg-[#C8F122]/10 blur-[160px]"
      />

      {/* Main Centered Content */}
      <div className="relative z-10 mx-auto max-w-5xl w-full my-auto flex flex-col items-center text-center">
        
        {/* Eyebrow */}
        <span className="text-xs font-semibold uppercase tracking-wider text-[#C8F122] mb-4 block">
          {locale === "fr" ? "Contact & Échange" : "Get in Touch"}
        </span>

        {/* Centered Headline */}
        <h2
          ref={textRef}
          className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#FFFFFF] leading-tight mb-6 max-w-3xl mx-auto"
        >
          {locale === "fr" ? (
            <>
              Construisons quelque chose de <span className="text-[#C8F122]">significatif.</span>
            </>
          ) : (
            <>
              Let&apos;s build something that <span className="text-[#C8F122]">matters.</span>
            </>
          )}
        </h2>

        {/* Centered Subtitle */}
        <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed max-w-xl mx-auto mb-12 font-normal">
          {locale === "fr"
            ? "Disponible pour des opportunités de stage PFE, projets d'ingénierie logicielle avancée et missions de cybersécurité."
            : "Available for engineering internship opportunities, advanced software systems engineering, and cybersecurity audits."}
        </p>

        {/* 3 Prominent Centered Contact Cards */}
        <div
          ref={cardsRef}
          className="grid gap-5 sm:grid-cols-3 w-full max-w-4xl mx-auto text-left"
        >
          {/* Card 1: Formulaire Sécurisé */}
          <Link
            href={`/${locale}/contact`}
            className="contact-card-btn group relative flex flex-col justify-between rounded-2xl border border-[#C8F122]/30 bg-[#C8F122]/10 p-6 backdrop-blur-xl transition-all duration-300 hover:bg-[#C8F122] hover:text-[#0B0B0C] hover:border-[#C8F122] hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between pb-8">
              <div className="size-10 rounded-xl bg-white/[0.08] flex items-center justify-center text-[#C8F122] group-hover:bg-[#0B0B0C]/10 group-hover:text-[#0B0B0C] transition-colors">
                <Send className="size-5" />
              </div>
              <ArrowUpRight className="size-4 text-[#C8F122] group-hover:text-[#0B0B0C] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-[#FFFFFF]/70 group-hover:text-[#0B0B0C]/80 font-medium block">
                {locale === "fr" ? "Formulaire sécurisé" : "Secure Form"}
              </span>
              <h3 className="font-display text-xl font-bold text-[#FFFFFF] group-hover:text-[#0B0B0C] mt-1">
                {locale === "fr" ? "M'écrire" : "Send Message"}
              </h3>
            </div>
          </Link>

          {/* Card 2: Email Direct */}
          <a
            href={`mailto:${emailAddress}`}
            className="contact-card-btn group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#141518] p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/25 hover:bg-[#1f1e29] hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between pb-8">
              <div className="size-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#A1A1AA] group-hover:text-white transition-colors">
                <Mail className="size-5" />
              </div>
              <ArrowUpRight className="size-4 text-[#A1A1AA] group-hover:text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-[#A1A1AA] font-medium block">
                Email Direct
              </span>
              <h3 className="font-display text-base sm:text-lg font-bold text-[#FFFFFF] mt-1 truncate" title={emailAddress}>
                {emailAddress}
              </h3>
            </div>
          </a>

          {/* Card 3: LinkedIn */}
          {contactLinks.linkedin && (
            <a
              href={contactLinks.linkedin}
              target="_blank"
              rel="noreferrer"
              className="contact-card-btn group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#141518] p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/25 hover:bg-[#1f1e29] hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between pb-8">
                <div className="size-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#A1A1AA] group-hover:text-white transition-colors">
                  <svg className="size-5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </div>
                <ArrowUpRight className="size-4 text-[#A1A1AA] group-hover:text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-[#A1A1AA] font-medium block">
                  Réseau Professionnel
                </span>
                <h3 className="font-display text-xl font-bold text-[#FFFFFF] mt-1">
                  LinkedIn
                </h3>
              </div>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
