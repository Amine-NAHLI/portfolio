"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Languages, Menu, Search, X } from "lucide-react";
import Container from "@/components/ui/Container";
import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/i18n/dictionaries";
import { getAlternateLocale, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

type SiteHeaderProps = {
  locale: Locale;
  dictionary: Dictionary;
};

type NavigationItem = {
  label: string;
  href: string;
};

export default function SiteHeader({ locale, dictionary }: SiteHeaderProps) {
  const pathname = usePathname() ?? `/${locale}`;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const alternateLocale = getAlternateLocale(locale);

  const navigation = useMemo<NavigationItem[]>(
    () => [
      { label: dictionary.nav.home, href: `/${locale}` },
      { label: dictionary.nav.projects, href: `/${locale}/projects` },
      { label: dictionary.nav.journey, href: `/${locale}/journey` },
      { label: dictionary.nav.skills, href: `/${locale}/skills` },
      { label: dictionary.nav.certifications, href: `/${locale}/certifications` },
      { label: dictionary.nav.blog, href: `/${locale}/blog` },
      { label: dictionary.nav.now, href: `/${locale}/now` },
      { label: dictionary.nav.contact, href: `/${locale}/contact` },
    ],
    [dictionary, locale],
  );

  const alternatePath = useMemo(() => {
    const segments = pathname.split("/");
    segments[1] = alternateLocale;
    return segments.join("/") || `/${alternateLocale}`;
  }, [alternateLocale, pathname]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (menuOpen && !dialog.open) {
      dialog.showModal();
    } else if (!menuOpen && dialog.open) {
      dialog.close();
    }
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  function rememberLocale() {
    localStorage.setItem("portfolio-locale", alternateLocale);
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `portfolio-locale=${alternateLocale}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-bg-page/90 backdrop-blur-xl supports-[backdrop-filter]:bg-bg-page/75">
      <Container className="flex min-h-16 items-center justify-between gap-4">
        <Link
          href={`/${locale}`}
          className="group inline-flex min-h-11 items-center gap-3 rounded-lg text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label={`${siteConfig.name} — ${dictionary.nav.home}`}
        >
          <span className="grid size-9 place-items-center rounded-xl border border-border-strong bg-surface-raised text-sm font-bold text-accent transition-transform duration-200 group-hover:-rotate-3">
            AN
          </span>
          <span className="hidden text-sm font-semibold tracking-tight sm:block">{siteConfig.name}</span>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex" aria-label={dictionary.navigationLabel}>
          {navigation.map((item) => {
            const active = item.href === `/${locale}` ? pathname === item.href : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                  active ? "bg-surface-raised text-text-primary" : "text-text-secondary hover:text-text-primary",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <Link href={`/${locale}/search`} className="inline-grid size-11 place-items-center rounded-lg text-text-secondary transition-colors hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent" aria-label={dictionary.nav.search}>
            <Search aria-hidden="true" className="size-4" />
          </Link>
          <Link
            href={alternatePath}
            hrefLang={alternateLocale}
            onClick={rememberLocale}
            data-analytics-event="language_change"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-text-secondary transition-colors hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label={dictionary.switchLanguage}
          >
            <Languages aria-hidden="true" className="size-4" />
            <span className="uppercase">{alternateLocale}</span>
          </Link>

          <Link
            href={siteConfig.links.resume}
            target="_blank"
            rel="noreferrer"
            data-analytics-event="cv_open"
            className="hidden min-h-11 items-center gap-1.5 rounded-full border border-border-strong bg-surface px-4 text-sm font-semibold text-text-primary transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent lg:inline-flex"
          >
            {dictionary.nav.resume}
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>

          <button
            type="button"
            className="inline-grid size-11 place-items-center rounded-lg border border-border text-text-primary transition-colors hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent xl:hidden"
            aria-label={dictionary.openMenu}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen(true)}
          >
            <Menu aria-hidden="true" className="size-5" />
          </button>
        </div>
      </Container>

      <dialog
        ref={dialogRef}
        id="mobile-navigation"
        className="m-0 ml-auto h-dvh max-h-none w-full max-w-md border-l border-border bg-bg-page p-0 text-text-primary backdrop:bg-black/70"
        aria-label={dictionary.navigationLabel}
        onClose={() => setMenuOpen(false)}
        onCancel={() => setMenuOpen(false)}
      >
        <div className="flex min-h-full flex-col px-5 py-4 sm:px-8">
          <div className="flex min-h-12 items-center justify-between">
            <span className="text-sm font-semibold">{dictionary.navigationLabel}</span>
            <button
              type="button"
              className="inline-grid size-11 place-items-center rounded-lg border border-border text-text-primary hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label={dictionary.closeMenu}
              onClick={closeMenu}
            >
              <X aria-hidden="true" className="size-5" />
            </button>
          </div>

          <nav className="mt-10 flex flex-1 flex-col" aria-label={dictionary.navigationLabel}>
            {navigation.map((item) => {
              const active = item.href === `/${locale}` ? pathname === item.href : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={closeMenu}
                  className={cn(
                    "flex min-h-14 items-center border-b border-border text-xl font-semibold tracking-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent",
                    active ? "text-accent" : "text-text-primary hover:text-accent",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-10 grid gap-3 border-t border-border pt-6">
            <Link
              href={siteConfig.links.resume}
              target="_blank"
              rel="noreferrer"
              data-analytics-event="cv_open"
              onClick={closeMenu}
              className="button-primary"
            >
              {dictionary.nav.resume}
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
            <Link
              href={alternatePath}
              hrefLang={alternateLocale}
              onClick={() => {
                rememberLocale();
                closeMenu();
              }}
              data-analytics-event="language_change"
              className="button-secondary"
            >
              <Languages aria-hidden="true" className="size-4" />
              {dictionary.alternateLanguageName}
            </Link>
          </div>
        </div>
      </dialog>
    </header>
  );
}
