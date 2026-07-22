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
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (configuredUrl) {
    try {
      return new URL(configuredUrl);
    } catch {
      // A safe local URL keeps metadata generation deterministic when misconfigured.
    }
  }

  return new URL("http://localhost:3000");
}
