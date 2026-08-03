"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Languages, Menu, Search, X } from "lucide-react";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/i18n/dictionaries";
import { getAlternateLocale, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Magnetic from "@/components/ui/Magnetic";
import TextScramble from "@/components/ui/TextScramble";

type SiteHeaderProps = { locale: Locale; dictionary: Dictionary; resumeLink: string };
type NavigationItem = { label: string; href: string };

export default function SiteHeader({ locale, dictionary, resumeLink }: SiteHeaderProps) {
  const pathname = usePathname() ?? `/${locale}`;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const alternateLocale = getAlternateLocale(locale);
  const navigation = useMemo<NavigationItem[]>(() => [
    { label: dictionary.nav.home, href: `/${locale}` }, 
    { label: dictionary.nav.projects, href: `/${locale}#projects` },
    { label: dictionary.nav.journey, href: `/${locale}#journey` }, 
    { label: dictionary.nav.certifications, href: `/${locale}#certifications` }, 
    { label: dictionary.nav.testimonials, href: `/${locale}#testimonials` },
    { label: dictionary.nav.contact, href: `/${locale}#contact` },
  ], [dictionary, locale]);
  
  const alternatePath = useMemo(() => { 
    const segments = pathname.split("/"); 
    segments[1] = alternateLocale; 
    return segments.join("/") || `/${alternateLocale}`; 
  }, [alternateLocale, pathname]);

  useEffect(() => { 
    const dialog = dialogRef.current; 
    if (!dialog) return; 
    if (menuOpen && !dialog.open) dialog.showModal(); 
    else if (!menuOpen && dialog.open) dialog.close(); 
  }, [menuOpen]);

  function closeMenu() { setMenuOpen(false); }
  function rememberLocale() { 
    localStorage.setItem("portfolio-locale", alternateLocale); 
    const secure = window.location.protocol === "https:" ? "; Secure" : ""; 
    document.cookie = `portfolio-locale=${alternateLocale}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`; 
  }

  return (
    <>
      {/* Floating Pill Navbar */}
      <header className="fixed top-4 left-1/2 z-50 -translate-x-1/2 w-[95%] max-w-[65rem]">
        <div className="flex h-14 items-center justify-between gap-3 rounded-[2rem] border border-border/50 bg-bg-page/70 px-2 backdrop-blur-2xl shadow-2xl">
          
          <Magnetic intensity={0.2}>
            <Link href={`/${locale}`} className="group flex size-10 items-center justify-center rounded-full bg-surface hover:bg-surface-raised transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ml-1" aria-label={`${siteConfig.name} — ${dictionary.nav.home}`}>
              <span className="font-display text-xs font-bold text-accent transition-transform duration-200 group-hover:-rotate-12">AN</span>
            </Link>
          </Magnetic>

          <nav className="hidden items-center gap-1 lg:flex" aria-label={dictionary.navigationLabel}>
            {navigation.map((item) => {
              const active = item.href === `/${locale}` ? pathname === item.href : pathname.startsWith(item.href);
              const LinkComponent = item.href.includes("#") ? "a" : Link;
              return (
                <LinkComponent 
                  key={item.href} 
                  href={item.href} 
                  aria-current={active ? "page" : undefined} 
                  className={cn("relative px-4 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-full")}
                >
                  <Magnetic intensity={0.1}>
                    <span className={cn("relative z-10 font-mono text-[.7rem] font-semibold uppercase tracking-[.1em] transition-colors", active ? "text-text-primary" : "text-text-secondary hover:text-text-primary")}>
                      <TextScramble>{item.label}</TextScramble>
                    </span>
                  </Magnetic>
                  
                  {active && (
                    <motion.div 
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-full bg-surface-raised/80 -z-0"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
                    />
                  )}
                </LinkComponent>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5 mr-1">
            <Magnetic intensity={0.2}>
              <ThemeToggle />
            </Magnetic>
            <Magnetic intensity={0.2}>
              <Link href={`/${locale}/search`} className="inline-grid size-10 place-items-center rounded-full text-text-secondary transition-colors hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent" aria-label={dictionary.nav.search}>
                <Search aria-hidden="true" className="size-4" />
              </Link>
            </Magnetic>
            <Magnetic intensity={0.2}>
              <Link href={alternatePath} hrefLang={alternateLocale} onClick={rememberLocale} data-analytics-event="language_change" className="inline-grid size-10 place-items-center rounded-full text-text-secondary transition-colors hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent" aria-label={dictionary.switchLanguage}>
                <Languages aria-hidden="true" className="size-4" />
              </Link>
            </Magnetic>
            <Magnetic intensity={0.1}>
              <Link href={resumeLink} target="_blank" rel="noreferrer" data-analytics-event="cv_open" className="hidden h-10 items-center gap-1.5 rounded-full bg-text-primary px-5 font-mono text-xs font-bold uppercase tracking-[.08em] text-bg-page transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent lg:inline-flex">
                {dictionary.nav.resume}
              </Link>
            </Magnetic>
            <button type="button" className="inline-grid size-10 place-items-center rounded-full border border-border text-text-primary transition-colors hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent lg:hidden" aria-label={dictionary.openMenu} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(true)}>
              <Menu aria-hidden="true" className="size-4" />
            </button>
          </div>
        </div>
      </header>

      <dialog ref={dialogRef} id="mobile-navigation" className="m-0 ml-auto h-dvh max-h-none w-full max-w-md border-l border-border bg-bg-page p-0 text-text-primary backdrop:bg-black/70" aria-label={dictionary.navigationLabel} onClose={() => setMenuOpen(false)} onCancel={() => setMenuOpen(false)}>
        <div className="flex min-h-full flex-col px-5 py-4 sm:px-8">
          <div className="flex min-h-12 items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase tracking-[.12em] text-text-muted">{dictionary.navigationLabel}</span>
            <button type="button" className="inline-grid size-11 place-items-center rounded-full border border-border text-text-primary hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent" aria-label={dictionary.closeMenu} onClick={closeMenu}><X aria-hidden="true" className="size-5" /></button>
          </div>
          <nav className="mt-10 flex flex-1 flex-col" aria-label={dictionary.navigationLabel}>
            {navigation.map((item) => { 
              const active = item.href === `/${locale}` ? pathname === item.href : pathname.startsWith(item.href); 
              const LinkComponent = item.href.includes("#") ? "a" : Link; 
              return (
                <LinkComponent key={item.href} href={item.href} aria-current={active ? "page" : undefined} onClick={closeMenu} className={cn("flex min-h-14 items-center border-b border-border font-display text-xl font-semibold tracking-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent", active ? "text-accent" : "text-text-primary hover:text-accent")}>
                  {item.label}
                </LinkComponent>
              ); 
            })}
          </nav>
          <div className="mt-10 grid gap-3 border-t border-border pt-6">
            <Link href={resumeLink} target="_blank" rel="noreferrer" data-analytics-event="cv_open" onClick={closeMenu} className="button-primary rounded-full">
              {dictionary.nav.resume}<ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
            <Link href={alternatePath} hrefLang={alternateLocale} onClick={() => { rememberLocale(); closeMenu(); }} data-analytics-event="language_change" className="button-secondary rounded-full">
              <Languages aria-hidden="true" className="size-4" />{dictionary.alternateLanguageName}
            </Link>
          </div>
        </div>
      </dialog>
    </>
  );
}
