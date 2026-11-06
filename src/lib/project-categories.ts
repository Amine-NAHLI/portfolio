import type { Locale } from "@/i18n/config";

export interface CanonicalCategory {
  id: string;
  label: Record<Locale, string>;
  aliases: string[];
}

export const CANONICAL_CATEGORIES: CanonicalCategory[] = [
  {
    id: "ai",
    label: {
      fr: "Intelligence Artificielle (IA)",
      en: "Artificial Intelligence (AI)",
    },
    aliases: [
      "ai",
      "ia",
      "artificial-intelligence",
      "artificial intelligence",
      "intelligence artificielle",
      "machine learning",
      "ml",
      "deep learning",
      "dl",
      "computer vision",
      "vision par ordinateur",
      "nlp",
      "llm",
    ],
  },
  {
    id: "cybersecurity",
    label: {
      fr: "Cybersécurité",
      en: "Cybersecurity",
    },
    aliases: [
      "cyber",
      "cybersecurity",
      "cybersecurite",
      "cybersécurité",
      "security",
      "securite",
      "sécurité",
      "infosec",
      "zero-trust",
      "audit",
    ],
  },
  {
    id: "software",
    label: {
      fr: "Génie Logiciel",
      en: "Software Engineering",
    },
    aliases: [
      "software",
      "software engineering",
      "genie logiciel",
      "génie logiciel",
      "ingenierie logicielle",
      "ingénierie logicielle",
      "logiciel",
      "systems",
      "systemes",
    ],
  },
  {
    id: "dev-web",
    label: {
      fr: "Développement Web",
      en: "Web Development",
    },
    aliases: [
      "dev web",
      "dev-web",
      "web",
      "web dev",
      "web development",
      "developpement web",
      "développement web",
      "frontend",
      "backend",
      "fullstack",
    ],
  },
  {
    id: "dev-mobile",
    label: {
      fr: "Développement Mobile",
      en: "Mobile Development",
    },
    aliases: [
      "dev mobile",
      "dev-mobile",
      "mobile dev",
      "mobile",
      "mobile development",
      "developpement mobile",
      "développement mobile",
      "ios",
      "android",
      "react native",
      "flutter",
    ],
  },
  {
    id: "dev-desktop",
    label: {
      fr: "Développement Desktop",
      en: "Desktop Development",
    },
    aliases: [
      "dev desktop",
      "dev-desktop",
      "desktop dev",
      "desktop",
      "desktop development",
      "developpement desktop",
      "développement desktop",
    ],
  },
  {
    id: "embedded",
    label: {
      fr: "Systèmes Embarqués",
      en: "Embedded Systems",
    },
    aliases: [
      "embedded",
      "embedded systems",
      "systemes embarques",
      "systèmes embarqués",
      "embarque",
      "embarqué",
      "iot",
      "robotics",
      "robotique",
      "arduino",
      "raspberry pi",
      "ros",
    ],
  },
  {
    id: "data-science",
    label: {
      fr: "Data Science",
      en: "Data Science",
    },
    aliases: [
      "data science",
      "data-science",
      "datascience",
      "data",
      "big data",
      "analytics",
    ],
  },
  {
    id: "e-commerce",
    label: {
      fr: "E-Commerce",
      en: "E-Commerce",
    },
    aliases: [
      "e-commerce",
      "ecommerce",
      "commerce",
    ],
  },
];

/**
 * Normalizes any category string or alias to a standard canonical ID.
 * If not recognized, returns a sanitized lowercase slug.
 */
export function canonicalizeCategory(raw: string): string {
  if (!raw) return "";
  const cleaned = raw.trim().toLowerCase();

  for (const cat of CANONICAL_CATEGORIES) {
    if (cat.id === cleaned) return cat.id;
    if (cat.aliases.includes(cleaned)) return cat.id;
  }

  // Handle subtle edge cases like "dev-web" vs "dev web"
  const normalizedSpaces = cleaned.replace(/-/g, " ");
  for (const cat of CANONICAL_CATEGORIES) {
    if (cat.aliases.includes(normalizedSpaces)) return cat.id;
  }

  // Fallback: slugify clean
  return cleaned.replace(/\s+/g, "-");
}

/**
 * Returns a human-friendly localized label for a category.
 */
export function getCategoryLabel(category: string, locale: Locale): string {
  const canonicalId = canonicalizeCategory(category);
  const found = CANONICAL_CATEGORIES.find((c) => c.id === canonicalId);
  if (found) {
    return found.label[locale] || found.label.fr;
  }

  // Capitalize nicely if custom tag
  return category
    .split(/[-_ ]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * Takes an array of raw categories, maps them to canonical IDs,
 * and deduplicates the result.
 */
export function normalizeProjectCategories(categories: string[]): string[] {
  if (!Array.isArray(categories)) return [];
  const normalized = categories
    .map((cat) => canonicalizeCategory(cat))
    .filter(Boolean);
  return Array.from(new Set(normalized));
}

