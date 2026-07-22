-- Portfolio production foundation
-- Additive schema, explicit grants and deny-by-default RLS policies.

create extension if not exists pgcrypto with schema extensions;

create schema if not exists private;
revoke all on schema private from public, anon;

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email_snapshot text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz
);

comment on table public.admin_users is 'Server-validated allowlist for the single portfolio administrator.';

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = (select auth.uid())
      and active = true
  );
$$;

revoke all on function private.is_admin() from public, anon;
grant usage on schema private to authenticated;
grant execute on function private.is_admin() to authenticated;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  source_kind text not null default 'personal' check (source_kind in ('academic', 'personal', 'professional', 'open_source')),
  publication_status text not null default 'draft' check (publication_status in ('draft', 'review_required', 'scheduled', 'published', 'unpublished', 'archived', 'error')),
  featured boolean not null default false,
  sort_order integer not null default 0,
  github_url text,
  demo_url text,
  repository_full_name text,
  primary_language text,
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint projects_github_url_https check (github_url is null or github_url ~ '^https://github\.com/'),
  constraint projects_demo_url_https check (demo_url is null or demo_url ~ '^https://')
);

alter table public.projects add column if not exists slug text;
alter table public.projects add column if not exists source_kind text not null default 'personal';
alter table public.projects add column if not exists publication_status text not null default 'draft';
alter table public.projects add column if not exists featured boolean not null default false;
alter table public.projects add column if not exists sort_order integer not null default 0;
alter table public.projects add column if not exists demo_url text;
alter table public.projects add column if not exists repository_full_name text;
alter table public.projects add column if not exists primary_language text;
alter table public.projects add column if not exists published_at timestamptz;
alter table public.projects add column if not exists created_by uuid references auth.users(id) on delete set null;
alter table public.projects add column if not exists updated_by uuid references auth.users(id) on delete set null;
alter table public.projects add column if not exists updated_at timestamptz not null default now();

create unique index if not exists projects_slug_unique_idx on public.projects (slug) where slug is not null;
create index if not exists projects_publication_idx on public.projects (publication_status, published_at desc, sort_order);
create index if not exists projects_featured_idx on public.projects (sort_order, published_at desc) where featured = true and publication_status = 'published';

create table if not exists public.project_translations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  locale text not null check (locale in ('fr', 'en')),
  title text not null,
  subtitle text,
  summary text not null,
  solution text,
  architecture jsonb not null default '[]'::jsonb check (jsonb_typeof(architecture) = 'array'),
  results jsonb not null default '[]'::jsonb check (jsonb_typeof(results) = 'array'),
  seo_title text,
  seo_description text,
  review_status text not null default 'draft' check (review_status in ('draft', 'review_required', 'validated')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, locale)
);

create index if not exists project_translations_project_id_idx on public.project_translations (project_id);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  group_key text not null,
  name text not null,
  description_fr text,
  description_en text,
  learning_status text not null default 'active' check (learning_status in ('active', 'learning', 'historical')),
  publication_status text not null default 'draft' check (publication_status in ('draft', 'review_required', 'scheduled', 'published', 'unpublished', 'archived', 'error')),
  sort_order integer not null default 0,
  last_used_on date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.skills add column if not exists slug text;
alter table public.skills add column if not exists group_key text not null default 'software-engineering';
alter table public.skills add column if not exists description_fr text;
alter table public.skills add column if not exists description_en text;
alter table public.skills add column if not exists learning_status text not null default 'active';
alter table public.skills add column if not exists publication_status text not null default 'draft';
alter table public.skills add column if not exists sort_order integer not null default 0;
alter table public.skills add column if not exists last_used_on date;
alter table public.skills add column if not exists updated_at timestamptz not null default now();

create unique index if not exists skills_slug_unique_idx on public.skills (slug) where slug is not null;
create index if not exists skills_publication_sort_idx on public.skills (publication_status, group_key, sort_order);

create table if not exists public.project_skills (
  project_id uuid not null references public.projects(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (project_id, skill_id)
);

create index if not exists project_skills_skill_id_idx on public.project_skills (skill_id);

create table if not exists public.certifications (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name_fr text not null,
  name_en text not null,
  issuer text,
  credential_status text not null check (credential_status in ('completed', 'in_progress', 'expired')),
  publication_status text not null default 'draft' check (publication_status in ('draft', 'review_required', 'scheduled', 'published', 'unpublished', 'archived', 'error')),
  issued_on date,
  expires_on date,
  verification_url text,
  badge_media_id uuid,
  skills text[] not null default '{}',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint certifications_dates_check check (expires_on is null or issued_on is null or expires_on >= issued_on),
  constraint certifications_verification_url_check check (verification_url is null or verification_url ~ '^https://')
);

create index if not exists certifications_publication_idx on public.certifications (publication_status, sort_order, issued_on desc);

create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title_fr text not null,
  title_en text not null,
  organization text not null,
  location_fr text,
  location_en text,
  summary_fr text not null,
  summary_en text not null,
  details_fr jsonb not null default '[]'::jsonb check (jsonb_typeof(details_fr) = 'array'),
  details_en jsonb not null default '[]'::jsonb check (jsonb_typeof(details_en) = 'array'),
  started_on date not null,
  ended_on date,
  publication_status text not null default 'draft' check (publication_status in ('draft', 'review_required', 'scheduled', 'published', 'unpublished', 'archived', 'error')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint experiences_dates_check check (ended_on is null or ended_on >= started_on)
);

create index if not exists experiences_publication_idx on public.experiences (publication_status, started_on desc);

create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title_fr text not null,
  title_en text not null,
  institution text not null,
  location_fr text,
  location_en text,
  summary_fr text,
  summary_en text,
  started_on date not null,
  ended_on date,
  publication_status text not null default 'draft' check (publication_status in ('draft', 'review_required', 'scheduled', 'published', 'unpublished', 'archived', 'error')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint education_dates_check check (ended_on is null or ended_on >= started_on)
);

create index if not exists education_publication_idx on public.education (publication_status, started_on desc);

create table if not exists public.timeline_entries (
  id uuid primary key default gen_random_uuid(),
  entry_type text not null check (entry_type in ('education', 'experience', 'project', 'certification', 'event', 'responsibility')),
  title_fr text not null,
  title_en text not null,
  description_fr text not null,
  description_en text not null,
  event_date date not null,
  related_entity_type text,
  related_entity_id uuid,
  publication_status text not null default 'draft' check (publication_status in ('draft', 'review_required', 'scheduled', 'published', 'unpublished', 'archived', 'error')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists timeline_publication_date_idx on public.timeline_entries (publication_status, event_date desc, sort_order);

create table if not exists public.now_entries (
  id uuid primary key default gen_random_uuid(),
  title_fr text not null,
  title_en text not null,
  content_fr text not null,
  content_en text not null,
  entry_kind text not null check (entry_kind in ('project', 'learning', 'objective', 'activity')),
  effective_on date not null default current_date,
  publication_status text not null default 'draft' check (publication_status in ('draft', 'review_required', 'scheduled', 'published', 'unpublished', 'archived', 'error')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists now_entries_publication_idx on public.now_entries (publication_status, effective_on desc, sort_order);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name_fr text not null,
  name_en text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  category_id uuid references public.categories(id) on delete set null,
  publication_status text not null default 'draft' check (publication_status in ('draft', 'review_required', 'scheduled', 'published', 'unpublished', 'archived', 'error')),
  featured boolean not null default false,
  cover_media_id uuid,
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_posts_category_id_idx on public.blog_posts (category_id);
create index if not exists blog_posts_publication_idx on public.blog_posts (publication_status, published_at desc);

create table if not exists public.blog_post_translations (
  id uuid primary key default gen_random_uuid(),
  blog_post_id uuid not null references public.blog_posts(id) on delete cascade,
  locale text not null check (locale in ('fr', 'en')),
  title text not null,
  excerpt text not null,
  markdown text not null,
  seo_title text,
  seo_description text,
  review_status text not null default 'draft' check (review_status in ('draft', 'review_required', 'validated')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (blog_post_id, locale)
);

create index if not exists blog_post_translations_post_id_idx on public.blog_post_translations (blog_post_id);

create table if not exists public.blog_post_tags (
  blog_post_id uuid not null references public.blog_posts(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blog_post_id, tag_id)
);

create index if not exists blog_post_tags_tag_id_idx on public.blog_post_tags (tag_id);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  sender_name text not null check (char_length(sender_name) between 2 and 100),
  sender_email text not null check (char_length(sender_email) between 5 and 254),
  subject text not null check (char_length(subject) between 3 and 160),
  message text not null check (char_length(message) between 20 and 5000),
  locale text not null default 'fr' check (locale in ('fr', 'en')),
  status text not null default 'new' check (status in ('new', 'read', 'replied', 'archived', 'spam')),
  fingerprint_hash text,
  user_agent_summary text,
  created_at timestamptz not null default now(),
  read_at timestamptz,
  archived_at timestamptz
);

create index if not exists contact_messages_status_created_idx on public.contact_messages (status, created_at desc);
create index if not exists contact_messages_fingerprint_idx on public.contact_messages (fingerprint_hash, created_at desc) where fingerprint_hash is not null;

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  bucket_id text not null default 'portfolio-media',
  storage_path text not null unique,
  original_name text not null,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 5242880),
  width integer,
  height integer,
  alt_fr text,
  alt_en text,
  credit text,
  publication_status text not null default 'draft' check (publication_status in ('draft', 'review_required', 'published', 'unpublished', 'archived', 'error')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint media_dimensions_check check ((width is null and height is null) or (width > 0 and height > 0)),
  constraint media_mime_check check (mime_type in ('image/jpeg', 'image/png', 'image/webp', 'image/avif', 'application/pdf'))
);

create index if not exists media_assets_publication_idx on public.media_assets (publication_status, created_at desc);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'certifications_badge_media_id_fkey'
      and conrelid = 'public.certifications'::regclass
  ) then
    alter table public.certifications
      add constraint certifications_badge_media_id_fkey
      foreign key (badge_media_id) references public.media_assets(id) on delete set null;
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'blog_posts_cover_media_id_fkey'
      and conrelid = 'public.blog_posts'::regclass
  ) then
    alter table public.blog_posts
      add constraint blog_posts_cover_media_id_fkey
      foreign key (cover_media_id) references public.media_assets(id) on delete set null;
  end if;
end
$$;

create table if not exists public.site_settings (
  key text primary key check (key ~ '^[a-z0-9]+(?:[._-][a-z0-9]+)*$'),
  value jsonb not null,
  is_public boolean not null default false,
  description text,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create index if not exists site_settings_public_idx on public.site_settings (key) where is_public = true;

create table if not exists public.ai_jobs (
  id uuid primary key default gen_random_uuid(),
  job_type text not null check (job_type in ('repository_analysis', 'project_draft', 'translation_draft', 'article_draft')),
  provider text not null default 'manual',
  model text,
  status text not null default 'queued' check (status in ('queued', 'running', 'draft_ready', 'review_required', 'validated', 'error', 'cancelled')),
  source_reference text,
  input jsonb not null default '{}'::jsonb check (jsonb_typeof(input) = 'object'),
  draft jsonb check (draft is null or jsonb_typeof(draft) = 'object'),
  facts jsonb not null default '[]'::jsonb check (jsonb_typeof(facts) = 'array'),
  inferences jsonb not null default '[]'::jsonb check (jsonb_typeof(inferences) = 'array'),
  missing_information jsonb not null default '[]'::jsonb check (jsonb_typeof(missing_information) = 'array'),
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  error_code text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ai_jobs_status_created_idx on public.ai_jobs (status, created_at desc);

create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  details jsonb not null default '{}'::jsonb check (jsonb_typeof(details) = 'object'),
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_actor_created_idx on public.audit_logs (actor_id, created_at desc);
create index if not exists audit_logs_entity_created_idx on public.audit_logs (entity_type, entity_id, created_at desc);

create or replace function private.prevent_audit_log_mutation()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'audit logs are append-only';
end;
$$;

drop trigger if exists audit_logs_immutable on public.audit_logs;
create trigger audit_logs_immutable
before update or delete on public.audit_logs
for each row execute function private.prevent_audit_log_mutation();

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'projects', 'project_translations', 'skills', 'certifications', 'experiences',
    'education', 'timeline_entries', 'now_entries', 'categories', 'blog_posts',
    'blog_post_translations', 'media_assets', 'site_settings', 'ai_jobs'
  ]
  loop
    execute format('drop trigger if exists %I on public.%I', table_name || '_set_updated_at', table_name);
    execute format(
      'create trigger %I before update on public.%I for each row execute function private.set_updated_at()',
      table_name || '_set_updated_at',
      table_name
    );
  end loop;
end
$$;

-- Storage is private by default. Publicly published assets can be read through RLS.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-media',
  'portfolio-media',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'application/pdf']
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- RLS is enabled on every table in the exposed public schema.
alter table public.admin_users enable row level security;
alter table public.projects enable row level security;
alter table public.project_translations enable row level security;
alter table public.skills enable row level security;
alter table public.project_skills enable row level security;
alter table public.certifications enable row level security;
alter table public.experiences enable row level security;
alter table public.education enable row level security;
alter table public.timeline_entries enable row level security;
alter table public.now_entries enable row level security;
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.blog_posts enable row level security;
alter table public.blog_post_translations enable row level security;
alter table public.blog_post_tags enable row level security;
alter table public.contact_messages enable row level security;
alter table public.media_assets enable row level security;
alter table public.site_settings enable row level security;
alter table public.ai_jobs enable row level security;
alter table public.audit_logs enable row level security;
alter table public.testimonials enable row level security;

-- The allowlist is only visible to the matching signed-in user.
drop policy if exists admin_users_select_self on public.admin_users;
create policy admin_users_select_self on public.admin_users
for select to authenticated
using (user_id = (select auth.uid()) and active = true);

-- Published-only public read policies.
drop policy if exists projects_public_read on public.projects;
create policy projects_public_read on public.projects
for select to anon, authenticated
using (publication_status = 'published' and (published_at is null or published_at <= now()));

drop policy if exists project_translations_public_read on public.project_translations;
create policy project_translations_public_read on public.project_translations
for select to anon, authenticated
using (exists (
  select 1 from public.projects
  where projects.id = project_translations.project_id
    and projects.publication_status = 'published'
    and (projects.published_at is null or projects.published_at <= now())
));

drop policy if exists skills_public_read on public.skills;
create policy skills_public_read on public.skills for select to anon, authenticated
using (publication_status = 'published');

drop policy if exists project_skills_public_read on public.project_skills;
create policy project_skills_public_read on public.project_skills for select to anon, authenticated
using (exists (
  select 1 from public.projects
  where projects.id = project_skills.project_id
    and projects.publication_status = 'published'
    and (projects.published_at is null or projects.published_at <= now())
));

drop policy if exists certifications_public_read on public.certifications;
create policy certifications_public_read on public.certifications for select to anon, authenticated
using (publication_status = 'published');

drop policy if exists experiences_public_read on public.experiences;
create policy experiences_public_read on public.experiences for select to anon, authenticated
using (publication_status = 'published');

drop policy if exists education_public_read on public.education;
create policy education_public_read on public.education for select to anon, authenticated
using (publication_status = 'published');

drop policy if exists timeline_entries_public_read on public.timeline_entries;
create policy timeline_entries_public_read on public.timeline_entries for select to anon, authenticated
using (publication_status = 'published');

drop policy if exists now_entries_public_read on public.now_entries;
create policy now_entries_public_read on public.now_entries for select to anon, authenticated
using (publication_status = 'published');

drop policy if exists categories_public_read on public.categories;
create policy categories_public_read on public.categories for select to anon, authenticated
using (exists (
  select 1 from public.blog_posts
  where blog_posts.category_id = categories.id
    and blog_posts.publication_status = 'published'
    and (blog_posts.published_at is null or blog_posts.published_at <= now())
));

drop policy if exists tags_public_read on public.tags;
create policy tags_public_read on public.tags for select to anon, authenticated
using (exists (
  select 1 from public.blog_post_tags
  join public.blog_posts on blog_posts.id = blog_post_tags.blog_post_id
  where blog_post_tags.tag_id = tags.id
    and blog_posts.publication_status = 'published'
    and (blog_posts.published_at is null or blog_posts.published_at <= now())
));

drop policy if exists blog_posts_public_read on public.blog_posts;
create policy blog_posts_public_read on public.blog_posts for select to anon, authenticated
using (publication_status = 'published' and (published_at is null or published_at <= now()));

drop policy if exists blog_post_translations_public_read on public.blog_post_translations;
create policy blog_post_translations_public_read on public.blog_post_translations for select to anon, authenticated
using (exists (
  select 1 from public.blog_posts
  where blog_posts.id = blog_post_translations.blog_post_id
    and blog_posts.publication_status = 'published'
    and (blog_posts.published_at is null or blog_posts.published_at <= now())
));

drop policy if exists blog_post_tags_public_read on public.blog_post_tags;
create policy blog_post_tags_public_read on public.blog_post_tags for select to anon, authenticated
using (exists (
  select 1 from public.blog_posts
  where blog_posts.id = blog_post_tags.blog_post_id
    and blog_posts.publication_status = 'published'
    and (blog_posts.published_at is null or blog_posts.published_at <= now())
));

drop policy if exists media_assets_public_read on public.media_assets;
create policy media_assets_public_read on public.media_assets for select to anon, authenticated
using (publication_status = 'published');

drop policy if exists site_settings_public_read on public.site_settings;
create policy site_settings_public_read on public.site_settings for select to anon, authenticated
using (is_public = true);

-- One consistent admin policy per managed table. Authorization is evaluated in
-- Postgres as well as on the Next.js server.
do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'projects', 'project_translations', 'skills', 'project_skills', 'certifications',
    'experiences', 'education', 'timeline_entries', 'now_entries', 'categories',
    'tags', 'blog_posts', 'blog_post_translations', 'blog_post_tags',
    'contact_messages', 'media_assets', 'site_settings', 'ai_jobs'
  ]
  loop
    execute format('drop policy if exists %I on public.%I', table_name || '_admin_all', table_name);
    execute format(
      'create policy %I on public.%I for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()))',
      table_name || '_admin_all',
      table_name
    );
  end loop;
end
$$;

drop policy if exists audit_logs_admin_read on public.audit_logs;
create policy audit_logs_admin_read on public.audit_logs for select to authenticated
using ((select private.is_admin()));

drop policy if exists audit_logs_admin_insert on public.audit_logs;
create policy audit_logs_admin_insert on public.audit_logs for insert to authenticated
with check ((select private.is_admin()) and actor_id = (select auth.uid()));

-- Legacy testimonials are quarantined: no anon/authenticated grants or policies.
revoke all on public.testimonials from anon, authenticated;

-- Storage object rules.
drop policy if exists portfolio_media_public_read on storage.objects;
create policy portfolio_media_public_read on storage.objects for select to anon, authenticated
using (
  bucket_id = 'portfolio-media'
  and exists (
    select 1 from public.media_assets
    where media_assets.bucket_id = storage.objects.bucket_id
      and media_assets.storage_path = storage.objects.name
      and media_assets.publication_status = 'published'
  )
);

drop policy if exists portfolio_media_admin_all on storage.objects;
create policy portfolio_media_admin_all on storage.objects for all to authenticated
using (bucket_id = 'portfolio-media' and (select private.is_admin()))
with check (bucket_id = 'portfolio-media' and (select private.is_admin()));

-- Explicit Data API privileges. RLS remains the final authorization layer.
grant usage on schema public to anon, authenticated;
grant select on public.projects, public.project_translations, public.skills,
  public.project_skills, public.certifications, public.experiences, public.education,
  public.timeline_entries, public.now_entries, public.categories, public.tags,
  public.blog_posts, public.blog_post_translations, public.blog_post_tags,
  public.media_assets, public.site_settings to anon, authenticated;

grant select, insert, update, delete on public.projects, public.project_translations,
  public.skills, public.project_skills, public.certifications, public.experiences,
  public.education, public.timeline_entries, public.now_entries, public.categories,
  public.tags, public.blog_posts, public.blog_post_translations, public.blog_post_tags,
  public.contact_messages, public.media_assets, public.site_settings, public.ai_jobs
  to authenticated;

grant select on public.admin_users to authenticated;
grant select, insert on public.audit_logs to authenticated;
grant usage, select on sequence public.audit_logs_id_seq to authenticated;
revoke insert, update, delete on public.admin_users from anon, authenticated;
revoke all on public.contact_messages, public.ai_jobs, public.audit_logs from anon;
