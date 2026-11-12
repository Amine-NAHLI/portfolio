"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Globe } from "lucide-react";
import FullscreenMenu from "@/components/navigation/FullscreenMenu";
import { SITE_NAV_ITEMS, resolveNavHref, type SiteNavItem } from "@/config/navigation";
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
  const pathname = usePathname() || `/${locale}`;

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHomePage =
    pathname === `/${locale}` || pathname === `/${locale}/` || pathname === "/";

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: SiteNavItem) => {
    if (typeof window === "undefined" || !item.hashId || !isHomePage) return;

    e.preventDefault();
    const targetElement = document.getElementById(item.hashId);
    if (targetElement) {
      window.history.pushState(null, "", `#${item.hashId}`);
      const lenis = window.__lenis;
      if (lenis) {
        lenis.scrollTo(targetElement, { offset: -70, duration: 1.2 });
      } else {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const nextLocale: Locale = locale === "fr" ? "en" : "fr";
  const localeSwitchHref = /^\/(fr|en)(?=\/|$)/.test(pathname)
    ? pathname.replace(/^\/(fr|en)(?=\/|$)/, `/${nextLocale}`)
    : `/${nextLocale}`;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-[#060605]/90 py-3.5 backdrop-blur-xl border-b border-white/[0.08] shadow-lg"
            : "bg-transparent py-5 sm:py-6"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-8 lg:px-14">
          {/* Left: Brand Monogram */}
          <Link
            href={`/${locale}`}
            className="group flex shrink-0 items-center gap-2 font-display text-base sm:text-lg font-bold tracking-tight text-[#f3f1f7]"
          >
            <span>Amine Nahli</span>
            <span className="size-1.5 rounded-full bg-[#9A71FF]" />
          </Link>

          {/* Center: Desktop Navigation Links (1:1 synced with FullscreenMenu) */}
          <nav aria-label="Navigation principale" className="hidden lg:flex items-center gap-6 xl:gap-7">
            {SITE_NAV_ITEMS.map((item) => {
              const fullHref = resolveNavHref(locale, item.href);
              const isActive =
                item.href === "/"
                  ? isHomePage
                  : !item.hashId &&
                    (pathname === fullHref || pathname.startsWith(`${fullHref}/`));

              return (
                <Link
                  key={item.id}
                  href={fullHref}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`whitespace-nowrap text-xs font-medium transition-colors ${
                    isActive
                      ? "text-[#f3f1f7]"
                      : "text-[#797681] hover:text-[#f3f1f7]"
                  }`}
                >
                  {item.label[locale]}
                </Link>
              );
            })}
          </nav>

          {/* Right: Language switch + Menu Button */}
          <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">
            <Link
              href={localeSwitchHref}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-[#f3f1f7] hover:bg-white/[0.08] transition-colors"
              aria-label="Changer de langue"
            >
              <Globe className="size-3 text-[#9A71FF]" />
              <span>{locale === "fr" ? "EN" : "FR"}</span>
            </Link>

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
