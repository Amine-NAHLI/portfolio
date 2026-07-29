import "server-only";

import { unstable_cache } from "next/cache";
import type { Locale } from "@/i18n/config";
import { hasSupabasePublicConfig } from "@/lib/env/supabase";
import { createPublicClient } from "@/lib/supabase/public";
import { siteConfig } from "@/config/site";

export type PublicJourneyEntry = {
  id: string;
  type: "education" | "experience" | "project" | "certification" | "event" | "responsibility";
  title: string;
  description: string;
  eventDate: string;
};

export type PublicSkill = { name: string; level: "beginner" | "intermediate" | "advanced"; evidence: string[] };
export type PublicSkillGroup = { id: string; title: string; description: string | null; skills: PublicSkill[] };
export type PublicCertification = { id: string; name: string; description: string | null; issuer: string | null; status: "completed" | "in_progress" | "expired"; skills: string[]; issuedOn: string | null; verificationUrl: string | null; hasDocument: boolean; documentMimeType: string | null };
export type PublicTestimonial = { id: string; name: string; role: string | null; organization: string | null; message: string; rating: number; locale: "fr" | "en" };

async function queryJourney(locale: Locale): Promise<PublicJourneyEntry[]> {
  if (!hasSupabasePublicConfig()) return [];
  try {
    const supabase = createPublicClient();
    const [{ data: experiences, error: expError }, { data: education, error: eduError }] = await Promise.all([
      supabase.from("experiences").select("id, title_fr, title_en, organization, summary_fr, summary_en, started_on, ended_on, sort_order").eq("publication_status", "published"),
      supabase.from("education").select("id, title_fr, title_en, institution, summary_fr, summary_en, started_on, ended_on, sort_order").eq("publication_status", "published"),
    ]);
    if (expError || eduError) return [];
    
    const rawEntries = [
      ...(experiences ?? []).map((entry) => ({ ...entry, type: "experience" as const })),
      ...(education ?? []).map((entry) => ({ ...entry, type: "education" as const })),
    ];
    
    rawEntries.sort((a, b) => {
      const dateCompare = String(a.started_on).localeCompare(String(b.started_on));
      if (dateCompare !== 0) return dateCompare;
      return a.sort_order - b.sort_order;
    });

    return rawEntries.map((entry): PublicJourneyEntry => ({
      id: entry.id,
      type: entry.type,
      title: locale === "fr" ? entry.title_fr : entry.title_en,
      description: locale === "fr" ? (entry.summary_fr ?? "") : (entry.summary_en ?? ""),
      eventDate: formatJourneyDate(entry.started_on, entry.ended_on, locale),
    }));
  } catch { return []; }
}

function formatJourneyDate(startedOn: string, endedOn: string | null, locale: Locale) {
  const startYear = startedOn.split("-")[0];
  const presentText = locale === "en" ? "Present" : "En cours";
  if (!endedOn) return `${startYear} — ${presentText}`;
  const isFuture = new Date(endedOn) > new Date();
  if (isFuture) return `${startYear} — ${presentText}`;
  const endYear = endedOn.split("-")[0];
  return startYear === endYear ? startYear : `${startYear} — ${endYear}`;
}

async function querySkills(locale: Locale): Promise<PublicSkillGroup[]> {
  if (!hasSupabasePublicConfig()) return [];
  try {
    const supabase = createPublicClient();
    const [categoryResult, skillResult, projectResult] = await Promise.all([
      supabase.from("skill_categories").select("id, slug, name_fr, name_en, description_fr, description_en").order("sort_order"),
      supabase.from("skills").select("id, category_id, group_key, name, level").order("sort_order"),
      supabase.from("projects").select("id, slug, technologies"),
    ]);
    if (categoryResult.error || skillResult.error || projectResult.error) return [];
    
    const evidenceBySkill = new Map<string, string[]>();
    for (const project of projectResult.data ?? []) {
      const techs = Array.isArray(project.technologies) ? project.technologies.filter((t): t is string => typeof t === "string") : [];
      for (const skill of skillResult.data ?? []) {
        if (techs.some((t) => t.toLowerCase() === skill.name.toLowerCase())) {
          evidenceBySkill.set(skill.id, [...(evidenceBySkill.get(skill.id) ?? []), project.slug]);
        }
      }
    }
    const skillsByCategory = new Map<string, PublicSkill[]>();
    for (const skill of skillResult.data ?? []) {
      const category = skill.category_id ?? skill.group_key;
      skillsByCategory.set(category, [...(skillsByCategory.get(category) ?? []), { name: skill.name, level: skill.level, evidence: evidenceBySkill.get(skill.id) ?? [] }]);
    }
    const categorized = (categoryResult.data ?? []).map((category) => ({
      id: category.id,
      title: locale === "fr" ? category.name_fr : category.name_en,
      description: locale === "fr" ? category.description_fr : category.description_en,
      skills: skillsByCategory.get(category.id) ?? [],
    }));
    const uncategorized = [...skillsByCategory.entries()].filter(([key]) => !(categoryResult.data ?? []).some((category) => category.id === key)).map(([key, skills]) => ({
      id: key,
      title: key.replace(/[-_]/g, " "),
      description: null,
      skills,
    }));
    return [...categorized, ...uncategorized].filter((group) => group.skills.length > 0);
  } catch { return []; }
}

async function queryCertificates(locale: Locale): Promise<PublicCertification[]> {
  if (!hasSupabasePublicConfig()) return [];
  try {
    const { data, error } = await createPublicClient()
      .from("certifications")
      .select("id, name_fr, name_en, description_fr, description_en, issuer, credential_status, skills, issued_on, verification_url, document_media_id, media_assets ( mime_type )")
      .order("sort_order")
      .order("issued_on", { ascending: false });
    if (error) return [];
    
    return (data ?? []).map((certificate) => {
      // @ts-expect-error - Supabase types don't perfectly infer the join if it's a 1:1 or 1:N
      const mimeType = certificate.media_assets?.mime_type || (Array.isArray(certificate.media_assets) ? certificate.media_assets[0]?.mime_type : null) || null;
      return { 
        id: certificate.id, 
        name: locale === "fr" ? certificate.name_fr : certificate.name_en, 
        description: locale === "fr" ? certificate.description_fr : certificate.description_en, 
        issuer: certificate.issuer, 
        status: certificate.credential_status, 
        skills: certificate.skills, 
        issuedOn: certificate.issued_on, 
        verificationUrl: certificate.verification_url, 
        hasDocument: Boolean(certificate.document_media_id),
        documentMimeType: mimeType
      };
    });
  } catch { return []; }
}

async function queryTestimonials(locale: Locale): Promise<PublicTestimonial[]> {
  if (!hasSupabasePublicConfig()) return [];
  try {
    const { data, error } = await createPublicClient().from("testimonials").select("id, first_name, last_name, job_title, organization, message, rating, locale").eq("locale", locale).order("created_at", { ascending: false });
    if (error) return [];
    return (data ?? []).map((testimonial) => ({ id: testimonial.id, name: `${testimonial.first_name} ${testimonial.last_name}`.trim(), role: testimonial.job_title, organization: testimonial.organization, message: testimonial.message, rating: testimonial.rating, locale: testimonial.locale }));
  } catch { return []; }
}

const journeyFr = unstable_cache(() => queryJourney("fr"), ["portfolio-journey-fr"], { revalidate: 900, tags: ["portfolio"] });
const journeyEn = unstable_cache(() => queryJourney("en"), ["portfolio-journey-en"], { revalidate: 900, tags: ["portfolio"] });
const skillsFr = unstable_cache(() => querySkills("fr"), ["portfolio-skills-fr"], { revalidate: 900, tags: ["portfolio"] });
const skillsEn = unstable_cache(() => querySkills("en"), ["portfolio-skills-en"], { revalidate: 900, tags: ["portfolio"] });
const certificatesFr = unstable_cache(() => queryCertificates("fr"), ["portfolio-certificates-fr"], { revalidate: 900, tags: ["portfolio"] });
const certificatesEn = unstable_cache(() => queryCertificates("en"), ["portfolio-certificates-en"], { revalidate: 900, tags: ["portfolio"] });
const testimonialsFr = unstable_cache(() => queryTestimonials("fr"), ["portfolio-testimonials-fr"], { revalidate: 900, tags: ["portfolio"] });
const testimonialsEn = unstable_cache(() => queryTestimonials("en"), ["portfolio-testimonials-en"], { revalidate: 900, tags: ["portfolio"] });

async function queryContactLinks() {
  if (!hasSupabasePublicConfig()) return siteConfig.links;
  try {
    const { data, error } = await createPublicClient().from("site_settings").select("value").eq("key", "contact_links").single();
    if (error || !data) return siteConfig.links;
    const dbLinks = data.value as Record<string, string>;
    return {
      ...siteConfig.links,
      github: dbLinks.github || siteConfig.links.github,
      linkedin: dbLinks.linkedin || siteConfig.links.linkedin,
      email: dbLinks.email ? `mailto:${dbLinks.email}` : siteConfig.links.email,
    };
  } catch {
    return siteConfig.links;
  }
}
const contactLinksCache = unstable_cache(() => queryContactLinks(), ["portfolio-contact-links"], { revalidate: 900, tags: ["portfolio", "settings"] });

export const getPublicJourney = (locale: Locale) => locale === "fr" ? journeyFr() : journeyEn();
export const getPublicSkillGroups = (locale: Locale) => locale === "fr" ? skillsFr() : skillsEn();
export const getPublicCertifications = (locale: Locale) => locale === "fr" ? certificatesFr() : certificatesEn();
export const getPublicTestimonials = (locale: Locale) => locale === "fr" ? testimonialsFr() : testimonialsEn();
export const getPublicContactLinks = () => contactLinksCache();
