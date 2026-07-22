export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type WorkflowStatus =
  | "draft"
  | "review_required"
  | "scheduled"
  | "published"
  | "unpublished"
  | "archived"
  | "error";

type TableDefinition<Row extends Record<string, unknown>> = {
  Row: Row;
  Insert: Partial<Row>;
  Update: Partial<Row>;
  Relationships: [];
};

type Timestamped = {
  created_at: string;
  updated_at: string;
};

export type AdminUserRow = {
  user_id: string;
  email_snapshot: string | null;
  active: boolean;
  created_at: string;
  last_seen_at: string | null;
};

export type ProjectRow = Timestamped & {
  id: string;
  slug: string;
  source_kind: "academic" | "personal" | "professional" | "open_source";
  publication_status: WorkflowStatus;
  featured: boolean;
  categories: string[];
  sort_order: number;
  github_url: string | null;
  demo_url: string | null;
  repository_full_name: string | null;
  primary_language: string | null;
  published_at: string | null;
  created_by: string | null;
  updated_by: string | null;
};

export type ProjectTranslationRow = Timestamped & {
  id: string;
  project_id: string;
  locale: "fr" | "en";
  title: string;
  subtitle: string | null;
  summary: string;
  problem: string | null;
  objectives: Json;
  solution: string | null;
  architecture: Json;
  results: Json;
  seo_title: string | null;
  seo_description: string | null;
  review_status: "draft" | "review_required" | "validated";
};

export type SkillRow = Timestamped & {
  id: string;
  slug: string;
  category_id: string | null;
  group_key: string;
  name: string;
  description_fr: string | null;
  description_en: string | null;
  learning_status: "active" | "learning" | "historical";
  publication_status: WorkflowStatus;
  sort_order: number;
  last_used_on: string | null;
};

export type SkillCategoryRow = Timestamped & {
  id: string;
  slug: string;
  name_fr: string;
  name_en: string;
  description_fr: string | null;
  description_en: string | null;
  publication_status: WorkflowStatus;
  sort_order: number;
};

export type CertificationRow = Timestamped & {
  id: string;
  slug: string;
  name_fr: string;
  name_en: string;
  issuer: string | null;
  credential_status: "completed" | "in_progress" | "expired";
  publication_status: WorkflowStatus;
  issued_on: string | null;
  expires_on: string | null;
  verification_url: string | null;
  badge_media_id: string | null;
  document_media_id: string | null;
  skills: string[];
  sort_order: number;
};

export type ExperienceRow = Timestamped & {
  id: string;
  slug: string;
  title_fr: string;
  title_en: string;
  organization: string;
  location_fr: string | null;
  location_en: string | null;
  summary_fr: string;
  summary_en: string;
  details_fr: Json;
  details_en: Json;
  started_on: string;
  ended_on: string | null;
  publication_status: WorkflowStatus;
  sort_order: number;
};

export type EducationRow = Timestamped & {
  id: string;
  slug: string;
  title_fr: string;
  title_en: string;
  institution: string;
  location_fr: string | null;
  location_en: string | null;
  summary_fr: string | null;
  summary_en: string | null;
  started_on: string;
  ended_on: string | null;
  publication_status: WorkflowStatus;
  sort_order: number;
};

export type TimelineEntryRow = Timestamped & {
  id: string;
  entry_type: "education" | "experience" | "project" | "certification" | "event" | "responsibility";
  title_fr: string;
  title_en: string;
  description_fr: string;
  description_en: string;
  event_date: string;
  related_entity_type: string | null;
  related_entity_id: string | null;
  publication_status: WorkflowStatus;
  sort_order: number;
};

export type NowEntryRow = Timestamped & {
  id: string;
  title_fr: string;
  title_en: string;
  content_fr: string;
  content_en: string;
  entry_kind: "project" | "learning" | "objective" | "activity";
  effective_on: string;
  publication_status: WorkflowStatus;
  sort_order: number;
};

export type BlogPostRow = Timestamped & {
  id: string;
  slug: string;
  category_id: string | null;
  publication_status: WorkflowStatus;
  featured: boolean;
  cover_media_id: string | null;
  published_at: string | null;
  created_by: string | null;
  updated_by: string | null;
};

export type BlogPostTranslationRow = Timestamped & {
  id: string;
  blog_post_id: string;
  locale: "fr" | "en";
  title: string;
  excerpt: string;
  markdown: string;
  seo_title: string | null;
  seo_description: string | null;
  review_status: "draft" | "review_required" | "validated";
};

export type ContactMessageRow = {
  id: string;
  sender_name: string;
  sender_email: string;
  subject: string;
  message: string;
  locale: "fr" | "en";
  status: "new" | "read" | "replied" | "archived" | "spam";
  fingerprint_hash: string | null;
  user_agent_summary: string | null;
  created_at: string;
  read_at: string | null;
  archived_at: string | null;
};

export type MediaAssetRow = Timestamped & {
  id: string;
  bucket_id: string;
  storage_path: string;
  original_name: string;
  mime_type: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
  alt_fr: string | null;
  alt_en: string | null;
  credit: string | null;
  publication_status: "draft" | "review_required" | "published" | "unpublished" | "archived" | "error";
  created_by: string | null;
};

export type AiJobRow = Timestamped & {
  id: string;
  job_type: "repository_analysis" | "project_draft" | "translation_draft" | "article_draft";
  provider: string;
  model: string | null;
  status: "queued" | "running" | "draft_ready" | "review_required" | "validated" | "error" | "cancelled";
  source_reference: string | null;
  input: Json;
  draft: Json | null;
  facts: Json;
  inferences: Json;
  missing_information: Json;
  reviewed_by: string | null;
  reviewed_at: string | null;
  error_code: string | null;
  created_by: string | null;
};

export type AuditLogRow = {
  id: number;
  actor_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: Json;
  created_at: string;
};

export type AnalyticsDailyRow = {
  event_date: string;
  event_name: "page_view" | "project_view" | "article_view" | "github_click" | "demo_click" | "cv_open" | "contact_submit" | "language_change";
  path: string;
  locale: "fr" | "en";
  event_count: number;
  updated_at: string;
};

type NamedRow = { id: string; slug: string; name: string; created_at: string };
type CategoryRow = Timestamped & { id: string; slug: string; name_fr: string; name_en: string };
type SiteSettingRow = { key: string; value: Json; is_public: boolean; description: string | null; updated_by: string | null; updated_at: string };
type ProjectSkillRow = { project_id: string; skill_id: string; created_at: string };
type BlogPostTagRow = { blog_post_id: string; tag_id: string; created_at: string };
export type TestimonialRow = Timestamped & {
  id: string;
  name: string;
  first_name: string;
  last_name: string;
  role: string | null;
  company: string | null;
  job_title: string | null;
  organization: string | null;
  message: string;
  rating: number;
  locale: "fr" | "en";
  status: "pending" | "confirmed" | "rejected";
  consent_to_publish: boolean;
  fingerprint_hash: string | null;
  moderated_by: string | null;
  moderated_at: string | null;
};

export type Database = {
  public: {
    Tables: {
      admin_users: TableDefinition<AdminUserRow>;
      projects: TableDefinition<ProjectRow>;
      project_translations: TableDefinition<ProjectTranslationRow>;
      skill_categories: TableDefinition<SkillCategoryRow>;
      skills: TableDefinition<SkillRow>;
      project_skills: TableDefinition<ProjectSkillRow>;
      certifications: TableDefinition<CertificationRow>;
      experiences: TableDefinition<ExperienceRow>;
      education: TableDefinition<EducationRow>;
      timeline_entries: TableDefinition<TimelineEntryRow>;
      now_entries: TableDefinition<NowEntryRow>;
      categories: TableDefinition<CategoryRow>;
      tags: TableDefinition<NamedRow>;
      blog_posts: TableDefinition<BlogPostRow>;
      blog_post_translations: TableDefinition<BlogPostTranslationRow>;
      blog_post_tags: TableDefinition<BlogPostTagRow>;
      contact_messages: TableDefinition<ContactMessageRow>;
      media_assets: TableDefinition<MediaAssetRow>;
      site_settings: TableDefinition<SiteSettingRow>;
      ai_jobs: TableDefinition<AiJobRow>;
      audit_logs: TableDefinition<AuditLogRow>;
      analytics_daily: TableDefinition<AnalyticsDailyRow>;
      testimonials: TableDefinition<TestimonialRow>;
    };
    Views: Record<string, never>;
    Functions: {
      increment_analytics_daily: {
        Args: { event_name_value: string; path_value: string; locale_value: string };
        Returns: undefined;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type TableName = keyof Database["public"]["Tables"];
export type RowOf<T extends TableName> = Database["public"]["Tables"][T]["Row"];
