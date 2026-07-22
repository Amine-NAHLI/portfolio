import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/config";

type PageMetadataInput = {
  locale: Locale;
  title: string;
  description: string;
  path?: string;
};

export function createPageMetadata({ locale, title, description, path = "" }: PageMetadataInput): Metadata {
  const localizedPath = `/${locale}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: localizedPath,
      languages: {
        fr: `/fr${path}`,
        en: `/en${path}`,
        "x-default": `/fr${path}`,
      },
    },
    openGraph: {
      title: `${title} — ${siteConfig.name}`,
      description,
      type: "website",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      url: localizedPath,
      siteName: `${siteConfig.name} — Portfolio`,
    },
    twitter: {
      card: "summary",
      title: `${title} — ${siteConfig.name}`,
      description,
    },
  };
}

