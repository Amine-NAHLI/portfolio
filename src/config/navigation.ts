import type { Locale } from "@/i18n/config";

export interface SiteNavItem {
  id: string;
  label: { fr: string; en: string };
  /** Path relative to `/${locale}` (e.g. "/", "/#about", "/projects") */
  href: string;
  /** Homepage section ID when link targets an on-page anchor */
  hashId?: string;
}

/** Shared navigation items consumed by both the top navbar and the fullscreen overlay menu. */
export const SITE_NAV_ITEMS: SiteNavItem[] = [
  { id: "01", label: { fr: "Accueil", en: "Home" }, href: "/" },
  { id: "02", label: { fr: "À Propos", en: "About" }, href: "/#about", hashId: "about" },
  { id: "03", label: { fr: "Projets", en: "Projects" }, href: "/projects" },
  { id: "04", label: { fr: "Parcours", en: "Journey" }, href: "/journey" },
  { id: "05", label: { fr: "Contributions", en: "Contributions" }, href: "/#github", hashId: "github" },
  { id: "06", label: { fr: "Certifications", en: "Certifications" }, href: "/certifications" },
  { id: "07", label: { fr: "Contact", en: "Contact" }, href: "/contact" },
];

export function resolveNavHref(locale: Locale, href: string): string {
  return href === "/" ? `/${locale}` : `/${locale}${href}`;
}

