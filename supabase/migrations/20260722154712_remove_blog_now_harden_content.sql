-- Blog and Now are deliberately removed from the product.  This migration is
-- additive with respect to history: it removes the obsolete runtime schema.
drop table if exists public.blog_post_tags cascade;
drop table if exists public.blog_post_translations cascade;
drop table if exists public.blog_posts cascade;
drop table if exists public.tags cascade;
drop table if exists public.categories cascade;
drop table if exists public.now_entries cascade;

-- Certificates remain public only through their published metadata. PDF files
-- stay private and are delivered by the server through a short-lived signed URL.
drop policy if exists portfolio_media_public_read on storage.objects;
create policy portfolio_media_public_read on storage.objects
for select to anon, authenticated
using (
  bucket_id = 'portfolio-media'
  and exists (
    select 1
    from public.media_assets
    where media_assets.bucket_id = storage.objects.bucket_id
      and media_assets.storage_path = storage.objects.name
      and media_assets.publication_status = 'published'
      and media_assets.mime_type <> 'application/pdf'
  )
);

drop policy if exists media_assets_public_read on public.media_assets;
create policy media_assets_public_read on public.media_assets
for select to anon, authenticated
using (publication_status = 'published' and mime_type <> 'application/pdf');

-- Reassert the least-privilege access model for the final public tables.
alter table public.projects enable row level security;
alter table public.project_translations enable row level security;
alter table public.skills enable row level security;
alter table public.skill_categories enable row level security;
alter table public.project_skills enable row level security;
alter table public.certifications enable row level security;
alter table public.experiences enable row level security;
alter table public.education enable row level security;
alter table public.timeline_entries enable row level security;
alter table public.testimonials enable row level security;
alter table public.contact_messages enable row level security;
alter table public.media_assets enable row level security;
alter table public.site_settings enable row level security;
alter table public.ai_jobs enable row level security;
alter table public.audit_logs enable row level security;
alter table public.analytics_daily enable row level security;

revoke all on public.contact_messages, public.ai_jobs, public.audit_logs, public.analytics_daily from anon;
revoke insert, update, delete on public.projects, public.project_translations, public.skills,
  public.skill_categories, public.project_skills, public.certifications, public.experiences,
  public.education, public.timeline_entries, public.testimonials, public.contact_messages,
  public.media_assets, public.site_settings, public.ai_jobs from anon;

grant select on public.projects, public.project_translations, public.skills, public.skill_categories,
  public.project_skills, public.certifications, public.experiences, public.education,
  public.timeline_entries, public.testimonials, public.media_assets, public.site_settings
  to anon, authenticated;
grant select, insert, update, delete on public.projects, public.project_translations, public.skills,
  public.skill_categories, public.project_skills, public.certifications, public.experiences,
  public.education, public.timeline_entries, public.testimonials, public.contact_messages,
  public.media_assets, public.site_settings, public.ai_jobs to authenticated;

comment on table public.certifications is
  'Published certificate metadata. Linked PDFs are private Storage objects served via short-lived signed URLs.';
