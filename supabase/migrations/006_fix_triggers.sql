-- Fix translation triggers for projects
create or replace function private.mark_project_translation_stale()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.locale <> 'fr' then
    return new;
  end if;

  if row(old.title, old.subtitle, old.summary, old.problem, old.objectives, old.solution, old.architecture, old.results)
     is distinct from row(new.title, new.subtitle, new.summary, new.problem, new.objectives, new.solution, new.architecture, new.results) then
    update public.project_translations
    set review_status = 'review_required'
    where project_id = new.project_id and locale = 'en';
    
    update public.projects
    set publication_status = 'review_required', published_at = null
    where id = new.project_id and publication_status in ('published', 'scheduled');
  end if;

  return new;
end;
$$;

create or replace function private.require_project_translation_review()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  content_changed boolean := false;
begin
  content_changed := row(old.title, old.subtitle, old.summary, old.problem, old.objectives, old.solution, old.architecture, old.results)
    is distinct from row(new.title, new.subtitle, new.summary, new.problem, new.objectives, new.solution, new.architecture, new.results);

  if content_changed and old.review_status = 'validated' and new.review_status = old.review_status then
    new.review_status := 'review_required';
  end if;
  return new;
end;
$$;

-- Fix translation triggers for blog posts
create or replace function private.mark_blog_post_translation_stale()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.locale <> 'fr' then
    return new;
  end if;

  if row(old.title, old.excerpt, old.markdown)
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

create or replace function private.require_blog_post_translation_review()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  content_changed boolean := false;
begin
  content_changed := row(old.title, old.excerpt, old.markdown)
    is distinct from row(new.title, new.excerpt, new.markdown);

  if content_changed and old.review_status = 'validated' and new.review_status = old.review_status then
    new.review_status := 'review_required';
  end if;
  return new;
end;
$$;

-- Replace the old triggers
drop trigger if exists project_translations_mark_stale on public.project_translations;
create trigger project_translations_mark_stale
after update of title, subtitle, summary, problem, objectives, solution, architecture, results on public.project_translations
for each row execute function private.mark_project_translation_stale();

drop trigger if exists project_translations_require_review on public.project_translations;
create trigger project_translations_require_review
before update of title, subtitle, summary, problem, objectives, solution, architecture, results on public.project_translations
for each row execute function private.require_project_translation_review();

drop trigger if exists blog_post_translations_mark_stale on public.blog_post_translations;
create trigger blog_post_translations_mark_stale
after update of title, excerpt, markdown on public.blog_post_translations
for each row execute function private.mark_blog_post_translation_stale();

drop trigger if exists blog_post_translations_require_review on public.blog_post_translations;
create trigger blog_post_translations_require_review
before update of title, excerpt, markdown on public.blog_post_translations
for each row execute function private.require_blog_post_translation_review();

-- Drop the old combined functions
drop function if exists private.mark_translation_stale() cascade;
drop function if exists private.require_translation_review() cascade;
