import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatProjectTitle(slug: string): string {
  if (!slug) return "";
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Returns the locale-aware href and target download filename for CV links.
 */
export function getCvDownloadProps(baseUrl: string, locale: "fr" | "en") {
  const filename = locale === "en" ? "Amine_Nahli_CV_EN.pdf" : "Amine_Nahli_CV.pdf";
  const isCvRoute = baseUrl === "/cv" || baseUrl.startsWith("/cv?");
  const href =
    isCvRoute && locale === "en" && !baseUrl.includes("locale=")
      ? `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}locale=en`
      : baseUrl;
  return { href, download: filename };
}
