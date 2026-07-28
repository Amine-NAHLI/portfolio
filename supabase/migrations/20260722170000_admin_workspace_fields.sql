-- Fields required by the consolidated administration workspace.
-- This migration is additive except for the testimonial vocabulary correction.

alter table public.skills
  add column if not exists level text not null default 'intermediate';

alter table public.skills
  drop constraint if exists skills_level_check;

alter table public.skills
  add constraint skills_level_check
  check (level in ('beginner', 'intermediate', 'advanced'));

alter table public.certifications
  add column if not exists description_fr text,
  add column if not exists description_en text;

alter table public.testimonials
  drop constraint if exists testimonials_status_check;

update public.testimonials
set status = 'approved'
where status = 'confirmed';

alter table public.testimonials
  add constraint testimonials_status_check
  check (status in ('pending', 'approved', 'rejected'));

drop policy if exists testimonials_public_read on public.testimonials;
create policy testimonials_public_read on public.testimonials
for select to anon, authenticated
using (status = 'approved' and consent_to_publish = true);

drop index if exists public.testimonials_publication_idx;
create index testimonials_publication_idx
  on public.testimonials (status, created_at desc)
  where status = 'approved' and consent_to_publish = true;

comment on column public.skills.level is
  'Displayed proficiency level managed from the consolidated Admin workspace.';
comment on column public.certifications.description_fr is
  'French certification description managed from the consolidated Admin workspace.';
comment on column public.certifications.description_en is
  'English certification description managed from the consolidated Admin workspace.';
