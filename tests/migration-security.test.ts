import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";

const foundation = await readFile(new URL("../supabase/migrations/002_portfolio_foundation.sql", import.meta.url), "utf8");
const publicationGuards = await readFile(new URL("../supabase/migrations/003_editorial_publication_guards.sql", import.meta.url), "utf8");
const analytics = await readFile(new URL("../supabase/migrations/004_contact_and_private_analytics.sql", import.meta.url), "utf8");
const caseStudies = await readFile(new URL("../supabase/migrations/005_project_case_study_completeness.sql", import.meta.url), "utf8");
const adminWorkflows = await readFile(new URL("../supabase/migrations/20260720235949_admin_content_workflows.sql", import.meta.url), "utf8");

const exposedTables = [
  "admin_users", "projects", "project_translations", "skills", "project_skills", "certifications", "experiences", "education",
  "timeline_entries", "now_entries", "categories", "tags", "blog_posts", "blog_post_translations", "blog_post_tags",
  "contact_messages", "media_assets", "site_settings", "ai_jobs", "audit_logs", "testimonials",
];

describe("Supabase security migrations", () => {
  for (const table of exposedTables) {
    it(`enables RLS on ${table}`, () => {
      assert.match(foundation, new RegExp(`alter table public\\.${table} enable row level security`, "i"));
    });
  }

  it("keeps the media bucket private and bounded", () => {
    assert.match(foundation, /'portfolio-media',[\s\S]*?false,[\s\S]*?5242880/);
    assert.match(foundation, /portfolio_media_admin_all/);
  });

  it("never grants access to legacy testimonials", () => {
    assert.match(foundation, /revoke all on public\.testimonials from anon, authenticated/i);
  });

  it("only exposes confirmed and consented recommendations", () => {
    assert.match(adminWorkflows, /testimonials_public_read[\s\S]*?status = 'confirmed'[\s\S]*?consent_to_publish = true/i);
    assert.match(adminWorkflows, /revoke insert, update, delete on public\.testimonials from anon/i);
  });

  it("protects skill categories with published-only and admin policies", () => {
    assert.match(adminWorkflows, /alter table public\.skill_categories enable row level security/i);
    assert.match(adminWorkflows, /skill_categories_public_read[\s\S]*?publication_status = 'published'/i);
    assert.match(adminWorkflows, /skill_categories_admin_all[\s\S]*?private\.is_admin\(\)/i);
  });

  it("links certificate documents without cascading certificate deletion", () => {
    assert.match(adminWorkflows, /certifications_document_media_id_fkey[\s\S]*?on delete set null/i);
  });

  it("requires validated French and English translations at database level", () => {
    assert.match(publicationGuards, /count\(distinct locale\)/i);
    assert.match(publicationGuards, /validated_locales <> 2/i);
    assert.match(publicationGuards, /project_translations_public_read[\s\S]*?review_status = 'validated'/i);
    assert.match(publicationGuards, /blog_post_translations_public_read[\s\S]*?review_status = 'validated'/i);
  });

  it("restricts analytics writes to the service role", () => {
    assert.match(analytics, /revoke all on function public\.increment_analytics_daily[\s\S]*?from public, anon, authenticated/i);
    assert.match(analytics, /grant execute on function public\.increment_analytics_daily[\s\S]*?to service_role/i);
  });

  it("requires complete case studies before project publication", () => {
    assert.match(caseStudies, /char_length\(trim\(coalesce\(problem, ''\)\)\) > 0/i);
    assert.match(caseStudies, /jsonb_array_length\(objectives\) > 0/i);
    assert.match(caseStudies, /jsonb_array_length\(architecture\) > 0/i);
    assert.match(caseStudies, /jsonb_array_length\(results\) > 0/i);
    assert.match(caseStudies, /after update of title, subtitle, summary, problem, objectives, solution, architecture, results/i);
    assert.match(caseStudies, /old\.review_status = 'validated'[\s\S]*?new\.review_status := 'review_required'/i);
  });
});
