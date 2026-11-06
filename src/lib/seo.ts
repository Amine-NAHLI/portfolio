import type { Metadata } from "next";
import { siteConfig, getSiteUrl } from "@/config/site";
import type { Locale } from "@/i18n/config";

type PageMetadataInput = {
  locale: Locale;
  title: string;
  description: string;
  path?: string;
};

export function createPageMetadata({ locale, title, description, path = "" }: PageMetadataInput): Metadata {
  const baseUrl = getSiteUrl();
  const canonicalUrl = new URL(`/${locale}${path}`, baseUrl).toString();
  const frUrl = new URL(`/fr${path}`, baseUrl).toString();
  const enUrl = new URL(`/en${path}`, baseUrl).toString();

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        fr: frUrl,
        en: enUrl,
        "x-default": frUrl,
      },
    },
    openGraph: {
      title: `${title} — ${siteConfig.name}`,
      description,
      type: "website",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      url: canonicalUrl,
      siteName: `${siteConfig.name} — Portfolio`,
    },
    twitter: {
      card: "summary",
      title: `${title} — ${siteConfig.name}`,
      description,
    },
  };
}

