"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { X, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { Locale } from "@/i18n/config";
import { getCvDownloadProps } from "@/lib/utils";

interface FullscreenMenuProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
  contactLinks: {
    github?: string;
    linkedin?: string;
    resume: string;
    email?: string;
  };
}

const menuItems = [
  { id: "01", label: "ACCUEIL", labelEn: "HOME", href: "/" },
  { id: "02", label: "À PROPOS", labelEn: "ABOUT", href: "/#about" },
  { id: "03", label: "PROJETS", labelEn: "SELECTED WORK", href: "/projects" },
  { id: "04", label: "PARCOURS", labelEn: "JOURNEY", href: "/journey" },
  { id: "05", label: "CONTRIBUTIONS GITHUB", labelEn: "GITHUB CONTRIBUTIONS", href: "/#github" },
  { id: "06", label: "CERTIFICATIONS", labelEn: "CERTIFICATIONS", href: "/certifications" },
  { id: "07", label: "CONTACT", labelEn: "CONTACT", href: "/contact" },
];

export default function FullscreenMenu({
  isOpen,
  onClose,
  locale,
  contactLinks,
}: FullscreenMenuProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  // Close on Escape key, lock body scroll, and pause Lenis smooth scroll
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }

    if (isOpen) {
      window.__lenis?.stop();
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      window.__lenis?.start();
      document.body.style.overflow = "";
    }

    return () => {
      window.__lenis?.start();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // GSAP animation for menu open / close
  useGSAP(
    () => {
      if (!overlayRef.current) return;

      if (isOpen) {
        gsap.set(overlayRef.current, { display: "block" });

        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        tl.fromTo(
          overlayRef.current,
          { clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" },
          { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", duration: 0.6 }
        );

        const links = linksRef.current?.querySelectorAll(".menu-item");
        if (links) {
          tl.fromTo(
            links,
            { yPercent: 80, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.6, stagger: 0.04 },
            "-=0.3"
          );
        }
      } else {
        gsap.to(overlayRef.current, {
          clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
          duration: 0.45,
          ease: "power3.in",
          onComplete: () => {
            if (overlayRef.current) {
              gsap.set(overlayRef.current, { display: "none" });
            }
          },
        });
      }
    },
    { dependencies: [isOpen], scope: overlayRef }
  );

  return (
    <div
      ref={overlayRef}
      aria-hidden={!isOpen}
      role="dialog"
      aria-modal="true"
      data-lenis-prevent="true"
      data-lenis-prevent-wheel="true"
      data-lenis-prevent-touch="true"
      style={{ display: "none" }}
      className="fixed inset-0 z-50 overflow-y-auto bg-[#060605]/98 px-5 sm:px-10 lg:px-16 py-6 sm:py-8 backdrop-blur-3xl text-[#f3f1f7] overscroll-contain"
    >
      <div className="min-h-full flex flex-col justify-between max-w-6xl mx-auto w-full">
        {/* Top Bar inside Menu */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 sm:pb-5">
          <div className="font-mono text-xs font-semibold text-[#9A71FF] tracking-widest uppercase">
            NAHLI.DEV / NAVIGATION
          </div>

          <button
            onClick={onClose}
            aria-label="Fermer le menu"
            className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-xs text-[#f3f1f7] hover:border-[#9A71FF]/50 hover:bg-[#9A71FF]/20 hover:text-white transition-all cursor-pointer"
          >
            <span>FERMER</span>
            <X className="size-4 transition-transform group-hover:rotate-90" />
          </button>
        </div>

        {/* Main Big Links List */}
        <div ref={linksRef} className="py-6 sm:py-8 my-auto">
          <nav className="flex flex-col space-y-2 sm:space-y-3 lg:space-y-4">
            {menuItems.map((item) => {
              const label = locale === "fr" ? item.label : item.labelEn;
              const fullHref = item.href === "/" ? `/${locale}` : `/${locale}${item.href}`;

              return (
                <div key={item.id} className="overflow-hidden">
                  <Link
                    href={fullHref}
                    onClick={() => {
                      onClose();
                      if (item.href.includes("#")) {
                        const hash = item.href.split("#")[1];
                        if (hash) {
                          setTimeout(() => {
                            const target = document.getElementById(hash);
                            if (target) {
                              window.__lenis?.scrollTo(target, { offset: -70, duration: 1.2 });
                            }
                          }, 150);
                        }
                      }
                    }}
                    className="menu-item group flex items-baseline gap-3 sm:gap-6 font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-[#f3f1f7] transition-all duration-300 hover:text-[#9A71FF] hover:translate-x-3 will-change-transform"
                  >
                    <span className="font-mono text-xs sm:text-base lg:text-lg font-bold text-[#797681] group-hover:text-[#9A71FF] transition-colors">
                      {item.id}
                    </span>
                    <span>{label}</span>
                    <ArrowUpRight className="size-5 sm:size-6 lg:size-7 opacity-0 -translate-x-3 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-[#9A71FF]" />
                  </Link>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Bottom Footer Info inside Menu */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/10 pt-4 sm:pt-5 font-mono text-xs text-[#797681]">
          <div className="flex items-center gap-4">
            <span>{locale === "fr" ? "ÉLÈVE INGÉNIEUR EN GÉNIE INFORMATIQUE · UPF" : "COMPUTER ENGINEERING STUDENT · UPF"}</span>
          </div>

          <div className="flex items-center gap-6">
            {contactLinks.github && (
              <a
                href={contactLinks.github}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
              >
                GITHUB
              </a>
            )}
            {contactLinks.linkedin && (
              <a
                href={contactLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
              >
                LINKEDIN
              </a>
            )}
            <a
              {...getCvDownloadProps(contactLinks.resume, locale)}
              data-analytics-event="cv_open"
              onClick={onClose}
              className="hover:text-white transition-colors text-[#9A71FF]"
            >
              {locale === "fr" ? "TÉLÉCHARGER CV [PDF]" : "DOWNLOAD CV [PDF]"}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
