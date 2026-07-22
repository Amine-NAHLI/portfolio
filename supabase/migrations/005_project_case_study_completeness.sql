-- Complete, filterable case studies. Additive and safe for existing drafts.

alter table public.projects
  add column if not exists categories text[] not null default '{}'::text[];

alter table public.project_translations
  add column if not exists problem text,
  add column if not exists objectives jsonb not null default '[]'::jsonb;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'projects_categories_allowed') then
    alter table public.projects
      add constraint projects_categories_allowed
      check (categories <@ array['software', 'cybersecurity', 'artificial-intelligence', 'embedded']::text[]);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'project_translations_objectives_array') then
    alter table public.project_translations
      add constraint project_translations_objectives_array
      check (jsonb_typeof(objectives) = 'array');
  end if;
end
$$;

create or replace function private.enforce_bilingual_publication()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  validated_locales integer;
begin
  if new.publication_status not in ('published', 'scheduled') then
    return new;
  end if;

  if tg_table_name = 'projects' then
    select count(distinct locale) into validated_locales
    from public.project_translations
    where project_id = new.id
      and locale in ('fr', 'en')
      and review_status = 'validated'
      and char_length(trim(title)) > 0
      and char_length(trim(summary)) > 0
      and char_length(trim(coalesce(problem, ''))) > 0
      and char_length(trim(coalesce(solution, ''))) > 0
      and jsonb_array_length(objectives) > 0
      and jsonb_array_length(architecture) > 0
      and jsonb_array_length(results) > 0;
  elsif tg_table_name = 'blog_posts' then
    select count(distinct locale) into validated_locales
    from public.blog_post_translations
    where blog_post_id = new.id
      and locale in ('fr', 'en')
      and review_status = 'validated';
  end if;

  if validated_locales <> 2 then
    raise exception 'Both French and English translations must be complete and validated before publication'
      using errcode = '23514';
  end if;

  if new.publication_status = 'scheduled' and (new.published_at is null or new.published_at <= now()) then
    raise exception 'A scheduled publication requires a future publication date'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

revoke all on function private.enforce_bilingual_publication() from public, anon, authenticated;

create or replace function private.mark_translation_stale()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.locale <> 'fr' then
    return new;
  end if;

  if tg_table_name = 'project_translations'
     and row(old.title, old.subtitle, old.summary, old.problem, old.objectives, old.solution, old.architecture, old.results)
         is distinct from row(new.title, new.subtitle, new.summary, new.problem, new.objectives, new.solution, new.architecture, new.results) then
    update public.project_translations
    set review_status = 'review_required'
    where project_id = new.project_id and locale = 'en';
    update public.projects
    set publication_status = 'review_required', published_at = null
    where id = new.project_id and publication_status in ('published', 'scheduled');
  elsif tg_table_name = 'blog_post_translations'
        and row(old.title, old.excerpt, old.markdown)
            is distinct from row(new.title, new.excerpt, new.markdown) then
    update public.blog_post_translations
    set review_status = 'review_required'
    where blog_post_id = new.blog_post_id and locale = 'en';
    update public.blog_posts
    set publication_status = 'review_required', published_at = null
    where id = new.blog_post_id and publication_status in ('published', 'scheduled');
  end if;

  return new;
end;
$$;

revoke all on function private.mark_translation_stale() from public, anon, authenticated;

create or replace function private.require_translation_review()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  content_changed boolean := false;
begin
  if tg_table_name = 'project_translations' then
    content_changed := row(old.title, old.subtitle, old.summary, old.problem, old.objectives, old.solution, old.architecture, old.results)
      is distinct from row(new.title, new.subtitle, new.summary, new.problem, new.objectives, new.solution, new.architecture, new.results);
  elsif tg_table_name = 'blog_post_translations' then
    content_changed := row(old.title, old.excerpt, old.markdown)
      is distinct from row(new.title, new.excerpt, new.markdown);
  end if;

  if content_changed and old.review_status = 'validated' and new.review_status = old.review_status then
    new.review_status := 'review_required';
  end if;
  return new;
end;
$$;

revoke all on function private.require_translation_review() from public, anon, authenticated;

drop trigger if exists project_translations_require_review on public.project_translations;
create trigger project_translations_require_review
before update of title, subtitle, summary, problem, objectives, solution, architecture, results on public.project_translations
for each row execute function private.require_translation_review();

drop trigger if exists blog_post_translations_require_review on public.blog_post_translations;
create trigger blog_post_translations_require_review
before update of title, excerpt, markdown on public.blog_post_translations
for each row execute function private.require_translation_review();

drop trigger if exists project_translations_mark_stale on public.project_translations;
create trigger project_translations_mark_stale
after update of title, subtitle, summary, problem, objectives, solution, architecture, results on public.project_translations
for each row execute function private.mark_translation_stale();

comment on column public.projects.categories is 'Public technical domains used for case-study filtering.';
comment on column public.project_translations.problem is 'Factual problem addressed by the case study.';
comment on column public.project_translations.objectives is 'Ordered, factual case-study objectives.';
