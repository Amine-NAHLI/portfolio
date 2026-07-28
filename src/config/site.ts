export const siteConfig = {
  name: "Amine Nahli",
  githubUsername: "Amine-NAHLI",
  location: {
    fr: "Fès, Maroc",
    en: "Fez, Morocco",
  },
  links: {
    github: "https://github.com/Amine-NAHLI",
    linkedin: "https://linkedin.com/in/AmineNAHLI",
    tryHackMe: "https://tryhackme.com/p/nahliAmine",
    email: "mailto:nahli-ami@upf.ac.ma",
    resume: "/cv",
  },
} as const;

export function getSiteUrl(): URL {
  const configuredUrls = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ];

  for (const configuredUrl of configuredUrls) {
    if (!configuredUrl) continue;
    try {
      return new URL(configuredUrl.startsWith("http") ? configuredUrl : `https://${configuredUrl}`);
    } catch {
      // Continue to the next server-controlled deployment URL.
    }
  }

  // Local development and CI intentionally keep an explicit local base URL.
  return new URL("http://localhost:3000");
}
