import type { Locale } from "@/i18n/config";

export type LocalizedText = Record<Locale, string>;

export type ProjectCategory = string;

export type PortfolioProject = {
  slug: string;
  title: string;
  subtitle: LocalizedText;
  summary: LocalizedText;
  problem: LocalizedText;
  objectives: LocalizedText[];
  solution: LocalizedText;
  architecture: LocalizedText[];
  results: LocalizedText[];
  technologies: string[];
  coreTechnologies?: string[];
  categories: string[];
  featured: boolean;
  coverImage?: string;
  githubUrl?: string;
  demoUrl?: string;
};

export type SkillGroup = {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  skills: string[];
  evidence: string[];
};

export type Certification = {
  id: string;
  name: LocalizedText;
  issuer: string | null;
  status: "completed";
  relatedSkills: string[];
  verificationUrl?: string;
};

export type TimelineEntry = {
  id: string;
  period: LocalizedText;
  title: LocalizedText;
  organization: string;
  location?: LocalizedText;
  type: "education" | "experience";
  description: LocalizedText;
  details: LocalizedText[];
};
