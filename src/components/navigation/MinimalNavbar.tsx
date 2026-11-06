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

  const navLinks = [
    { label: locale === "fr" ? "Projets" : "Projects", href: `/${locale}#work`, targetId: "work" },
    { label: locale === "fr" ? "Parcours" : "Journey", href: `/${locale}#journey`, targetId: "journey" },
    { label: locale === "fr" ? "Certifications" : "Certifications", href: `/${locale}#certifications`, targetId: "certifications" },
    { label: locale === "fr" ? "Contact" : "Contact", href: `/${locale}#contact`, targetId: "contact" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (typeof window === "undefined") return;
    const currentPath = window.location.pathname;
    const isHomePage = currentPath === `/${locale}` || currentPath === `/${locale}/` || currentPath === "/";

    if (isHomePage) {
      e.preventDefault();
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        window.history.pushState(null, "", `#${targetId}`);
        const lenis = window.__lenis;
        if (lenis) {
          lenis.scrollTo(targetElement, { offset: -70, duration: 1.2 });
        } else {
          targetElement.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-[#060605]/90 py-3.5 backdrop-blur-xl border-b border-white/[0.08] shadow-lg"
            : "bg-transparent py-5 sm:py-6"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-8 lg:px-14">
          
          {/* Left: Brand Monogram */}
          <Link
            href={`/${locale}`}
            className="group flex items-center gap-2 font-display text-base sm:text-lg font-bold tracking-tight text-[#f3f1f7]"
          >
            <span>Amine Nahli</span>
            <span className="size-1.5 rounded-full bg-[#9A71FF]" />
          </Link>

          {/* Center: Clean Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.targetId)}
                className="text-xs font-medium text-[#797681] hover:text-[#f3f1f7] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: Language switch + Menu Button */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Language Switcher */}
            <Link
              href={`/${locale === "fr" ? "en" : "fr"}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-[#f3f1f7] hover:bg-white/[0.08] transition-colors"
              aria-label="Changer de langue"
            >
              <Globe className="size-3 text-[#9A71FF]" />
              <span>{locale === "fr" ? "EN" : "FR"}</span>
            </Link>

            {/* Menu Trigger */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Ouvrir le menu de navigation"
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-semibold text-[#f3f1f7] hover:bg-white/10 transition-colors cursor-pointer"
            >
              <span>Menu</span>
              <Menu className="size-3.5 text-[#797681]" />
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
