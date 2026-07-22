-- Additive content-management workflows for skills, certificates and
-- professional recommendations. Legacy columns and tables remain intact.

create table if not exists public.skill_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name_fr text not null,
  name_en text not null,
  description_fr text,
  description_en text,
  publication_status text not null default 'draft'
    check (publication_status in ('draft', 'review_required', 'scheduled', 'published', 'unpublished', 'archived', 'error')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint skill_categories_name_fr_length check (char_length(btrim(name_fr)) between 1 and 120),
  constraint skill_categories_name_en_length check (char_length(btrim(name_en)) between 1 and 120)
);

alter table public.skills
  add column if not exists category_id uuid;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'skills_category_id_fkey'
      and conrelid = 'public.skills'::regclass
  ) then
    alter table public.skills
      add constraint skills_category_id_fkey
      foreign key (category_id) references public.skill_categories(id) on delete restrict;
  end if;
end
$$;

create index if not exists skills_category_sort_idx
  on public.skills (category_id, publication_status, sort_order);

alter table public.certifications
  add column if not exists document_media_id uuid;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'certifications_document_media_id_fkey'
      and conrelid = 'public.certifications'::regclass
  ) then
    alter table public.certifications
      add constraint certifications_document_media_id_fkey
      foreign key (document_media_id) references public.media_assets(id) on delete set null;
  end if;
end
$$;

create index if not exists certifications_document_media_id_idx
  on public.certifications (document_media_id)
  where document_media_id is not null;

alter table public.testimonials
  add column if not exists first_name text,
  add column if not exists last_name text,
  add column if not exists job_title text,
  add column if not exists organization text,
  add column if not exists locale text not null default 'fr',
  add column if not exists consent_to_publish boolean not null default false,
  add column if not exists fingerprint_hash text,
  add column if not exists moderated_by uuid references auth.users(id) on delete set null,
  add column if not exists moderated_at timestamptz,
  add column if not exists updated_at timestamptz not null default now();

update public.testimonials
set
  first_name = coalesce(nullif(btrim(first_name), ''), nullif(split_part(btrim(name), ' ', 1), ''), 'Non renseigné'),
  last_name = coalesce(
    nullif(btrim(last_name), ''),
    nullif(btrim(substring(btrim(name) from char_length(split_part(btrim(name), ' ', 1)) + 1)), ''),
    'Non renseigné'
  ),
  job_title = coalesce(nullif(btrim(job_title), ''), nullif(btrim(role), '')),
  organization = coalesce(nullif(btrim(organization), ''), nullif(btrim(company), '')),
  status = case when status = 'approved' then 'confirmed' else status end;

alter table public.testimonials
  alter column first_name set not null,
  alter column last_name set not null;

alter table public.testimonials
  drop constraint if exists testimonials_status_check;

alter table public.testimonials
  add constraint testimonials_status_check
    check (status in ('pending', 'confirmed', 'rejected')),
  add constraint testimonials_locale_check
    check (locale in ('fr', 'en')),
  add constraint testimonials_first_name_length
    check (char_length(btrim(first_name)) between 1 and 80),
  add constraint testimonials_last_name_length
    check (char_length(btrim(last_name)) between 1 and 80),
  add constraint testimonials_job_title_length
    check (job_title is null or char_length(btrim(job_title)) between 1 and 160),
  add constraint testimonials_organization_length
    check (organization is null or char_length(btrim(organization)) between 1 and 160),
  add constraint testimonials_message_length
    check (char_length(btrim(message)) between 20 and 2000);

create index if not exists testimonials_publication_idx
  on public.testimonials (status, created_at desc)
  where status = 'confirmed' and consent_to_publish = true;

create index if not exists testimonials_fingerprint_created_idx
  on public.testimonials (fingerprint_hash, created_at desc)
  where fingerprint_hash is not null;

drop trigger if exists skill_categories_set_updated_at on public.skill_categories;
create trigger skill_categories_set_updated_at
before update on public.skill_categories
for each row execute function private.set_updated_at();

drop trigger if exists testimonials_set_updated_at on public.testimonials;
create trigger testimonials_set_updated_at
before update on public.testimonials
for each row execute function private.set_updated_at();

alter table public.skill_categories enable row level security;
alter table public.testimonials enable row level security;

drop policy if exists skill_categories_public_read on public.skill_categories;
create policy skill_categories_public_read on public.skill_categories
for select to anon, authenticated
using (publication_status = 'published');

drop policy if exists skill_categories_admin_all on public.skill_categories;
create policy skill_categories_admin_all on public.skill_categories
for all to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

drop policy if exists testimonials_public_read on public.testimonials;
create policy testimonials_public_read on public.testimonials
for select to anon, authenticated
using (status = 'confirmed' and consent_to_publish = true);

drop policy if exists testimonials_admin_all on public.testimonials;
create policy testimonials_admin_all on public.testimonials
for all to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

grant select on public.skill_categories to anon, authenticated;
grant insert, update, delete on public.skill_categories to authenticated;

grant select on public.testimonials to anon, authenticated;
grant insert, update, delete on public.testimonials to authenticated;
revoke insert, update, delete on public.testimonials from anon;

comment on table public.skill_categories is
  'Bilingual, ordered categories used to group public portfolio skills.';
comment on column public.certifications.document_media_id is
  'Private Storage-backed PDF metadata. Public access is issued through short-lived signed URLs.';
comment on table public.testimonials is
  'Visitor-submitted professional recommendations. Only confirmed, consented rows are publicly readable.';
