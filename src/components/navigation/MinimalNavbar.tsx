"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, Globe } from "lucide-react";
import FullscreenMenu from "@/components/navigation/FullscreenMenu";
import type { Locale } from "@/i18n/config";

interface MinimalNavbarProps {
  locale: Locale;
  contactLinks: {
    github?: string;
    linkedin?: string;
    resume: string;
    email?: string;
  };
}

export default function MinimalNavbar({ locale, contactLinks }: MinimalNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? "bg-[#101015]/80 py-3.5 backdrop-blur-xl border-b border-white/10 shadow-2xl"
            : "bg-transparent py-6"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-8 lg:px-14">
          
          {/* Left: Minimal Monogram Logo */}
          <Link
            href={`/${locale}`}
            className="group flex items-center gap-2 font-display text-lg font-black tracking-tighter text-[#f3f1f7]"
          >
            <span>NAHLI</span>
            <span className="size-1.5 rounded-full bg-[#9A71FF] transition-transform duration-300 group-hover:scale-150" />
          </Link>

          {/* Center: Subtle Status (Desktop) */}
          <div className="hidden md:flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1 text-[11px] font-mono backdrop-blur-md">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[#797681]">INGÉNIEUR EN FORMATION · UPF</span>
          </div>

          {/* Right: Language switch + Menu Button */}
          <div className="flex items-center gap-3">
            
            {/* Language Switcher Pill */}
            <Link
              href={`/${locale === "fr" ? "en" : "fr"}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-xs font-semibold text-[#f3f1f7] hover:border-[#9A71FF]/40 hover:bg-[#9A71FF]/10 transition-colors"
              aria-label="Changer de langue"
            >
              <Globe className="size-3 text-[#9A71FF]" />
              <span>{locale === "fr" ? "EN" : "FR"}</span>
            </Link>

            {/* Magnetic-styled Menu Pill */}
            <button
              onClick={() => setIsMenuOpen(true)}
              aria-label="Ouvrir le menu de navigation"
              className="group flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 font-mono text-xs font-bold text-[#f3f1f7] backdrop-blur-xl transition-all duration-300 hover:border-[#9A71FF] hover:bg-[#9A71FF] hover:text-[#101015] hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
            >
              <span>MENU</span>
              <Menu className="size-3.5 transition-transform group-hover:scale-110" />
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Overlay Menu */}
      <FullscreenMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        locale={locale}
        contactLinks={contactLinks}
      />
    </>
  );
}

