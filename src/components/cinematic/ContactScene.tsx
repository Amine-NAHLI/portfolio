"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, FileText, Mail, Send } from "lucide-react";
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

  useGSAP(
    () => {
      if (typeof window === "undefined" || !containerRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      if (textRef.current) {
        gsap.fromTo(
          textRef.current,
          { opacity: 0.3, y: 40 },
          {
            opacity: 1,
            y: 0,
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

      const buttons = containerRef.current.querySelectorAll(".contact-card-btn");
      if (buttons.length > 0) {
        gsap.fromTo(
          buttons,
          { opacity: 0.3, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            stagger: 0.08,
            duration: 0.7,
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

  return (
    <section
      ref={containerRef}
      className="relative min-h-[90svh] w-full bg-[#101015] py-28 px-4 sm:px-8 lg:px-14 border-t border-white/5 flex flex-col justify-between overflow-hidden"
    >
      {/* Background Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 bottom-0 -translate-x-1/2 h-[500px] w-[600px] rounded-full bg-[#9A71FF]/15 blur-[160px]"
      />

      <div className="relative z-10 mx-auto max-w-7xl w-full my-auto">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1 text-xs font-mono font-semibold text-[#9A71FF] uppercase tracking-wider mb-6">
            <Mail className="size-3.5" />
            <span>{"//"} 08 — INITIATE CONTACT</span>
          </div>

          {/* Colossal Header */}
          <h2
            ref={textRef}
            className="font-display text-4xl sm:text-6xl lg:text-8xl font-black tracking-[-0.03em] text-[#f3f1f7] leading-[1.02] mb-8"
          >
            {locale === "fr" ? (
              <>
                Construisons quelque chose de <span className="text-[#9A71FF]">significatif.</span>
              </>
            ) : (
              <>
                Let&apos;s build something that <span className="text-[#9A71FF]">matters.</span>
              </>
            )}
          </h2>

          <p className="text-base sm:text-xl text-[#797681] leading-relaxed max-w-2xl mb-12">
            {locale === "fr"
              ? "Disponible pour des opportunités de stage PFE, projets d'ingénierie logicielle avancée et audits de cybersécurité."
              : "Available for high-impact internship opportunities, advanced software systems engineering, and cybersecurity audits."}
          </p>

          {/* Action Grid Buttons */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Primary Contact Link */}
            <Link
              href={`/${locale}/contact`}
              className="contact-card-btn group relative flex flex-col justify-between rounded-3xl border border-[#9A71FF]/40 bg-[#9A71FF]/10 p-6 backdrop-blur-xl transition-all duration-300 hover:bg-[#9A71FF] hover:text-[#101015]"
            >
              <div className="flex items-center justify-between pb-8">
                <Send className="size-6 text-[#9A71FF] group-hover:text-[#101015] transition-colors" />
                <ArrowUpRight className="size-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
              <div>
                <span className="font-mono text-xs text-[#f3f1f7]/70 group-hover:text-[#101015]/80 uppercase tracking-wider">
                  {locale === "fr" ? "Formulaire sécurisé" : "Secure Form"}
                </span>
                <h3 className="font-display text-xl font-bold text-[#f3f1f7] group-hover:text-[#101015] mt-1">
                  {locale === "fr" ? "M'écrire" : "Send Message"}
                </h3>
              </div>
            </Link>

            {/* Direct Email */}
            {contactLinks.email && (
              <a
                href={contactLinks.email}
                className="contact-card-btn group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-[#17161e]/80 p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/30 hover:bg-[#17161e]"
              >
                <div className="flex items-center justify-between pb-8">
                  <Mail className="size-6 text-[#797681] group-hover:text-white transition-colors" />
                  <ArrowUpRight className="size-5 text-[#797681] group-hover:text-white transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
                <div>
                  <span className="font-mono text-xs text-[#797681] uppercase tracking-wider">
                    Email Direct
                  </span>
                  <h3 className="font-display text-xl font-bold text-[#f3f1f7] mt-1">
                    nahli-ami@upf.ac.ma
                  </h3>
                </div>
              </a>
            )}

            {/* LinkedIn */}
            {contactLinks.linkedin && (
              <a
                href={contactLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="contact-card-btn group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-[#17161e]/80 p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/30 hover:bg-[#17161e]"
              >
                <div className="flex items-center justify-between pb-8">
                  <svg className="size-6 fill-[#797681] group-hover:fill-white transition-colors" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  <ArrowUpRight className="size-5 text-[#797681] group-hover:text-white transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
                <div>
                  <span className="font-mono text-xs text-[#797681] uppercase tracking-wider">
                    Réseau Professionnel
                  </span>
                  <h3 className="font-display text-xl font-bold text-[#f3f1f7] mt-1">
                    LinkedIn
                  </h3>
                </div>
              </a>
            )}

            {/* Official Resume */}
            <Link
              href={contactLinks.resume}
              target="_blank"
              rel="noreferrer"
              className="contact-card-btn group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-[#17161e]/80 p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/30 hover:bg-[#17161e]"
            >
              <div className="flex items-center justify-between pb-8">
                <FileText className="size-6 text-[#797681] group-hover:text-white transition-colors" />
                <ArrowUpRight className="size-5 text-[#797681] group-hover:text-white transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
              <div>
                <span className="font-mono text-xs text-[#797681] uppercase tracking-wider">
                  Document Officiel
                </span>
                <h3 className="font-display text-xl font-bold text-[#f3f1f7] mt-1">
                  Télécharger le CV
                </h3>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Minimal Footer Strip */}
      <div className="relative z-10 mx-auto max-w-7xl w-full pt-16 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5 text-xs font-mono text-[#797681]">
        <div>
          © {new Date().getFullYear()} AMINE NAHLI · NAHLI.DEV
        </div>
        <div className="flex items-center gap-6">
          <Link href={`/${locale === "fr" ? "en" : "fr"}`} className="hover:text-white transition-colors">
            {locale === "fr" ? "SWITCH TO ENGLISH [EN]" : "PASSER EN FRANÇAIS [FR]"}
          </Link>
          <span className="text-white/20">|</span>
          <Link href="/admin" className="hover:text-white transition-colors">
            CONSOLE CMS
          </Link>
        </div>
      </div>
    </section>
  );
}

