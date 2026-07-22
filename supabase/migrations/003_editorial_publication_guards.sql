-- Editorial integrity: publication is bilingual, reviewed and enforced in the database.

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
      and review_status = 'validated';
  elsif tg_table_name = 'blog_posts' then
    select count(distinct locale) into validated_locales
    from public.blog_post_translations
    where blog_post_id = new.id
      and locale in ('fr', 'en')
      and review_status = 'validated';
  end if;

  if validated_locales <> 2 then
    raise exception 'Both French and English translations must be validated before publication'
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

drop trigger if exists projects_enforce_bilingual_publication on public.projects;
create trigger projects_enforce_bilingual_publication
before insert or update of publication_status, published_at on public.projects
for each row execute function private.enforce_bilingual_publication();

drop trigger if exists blog_posts_enforce_bilingual_publication on public.blog_posts;
create trigger blog_posts_enforce_bilingual_publication
before insert or update of publication_status, published_at on public.blog_posts
for each row execute function private.enforce_bilingual_publication();

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
     and row(old.title, old.subtitle, old.summary, old.solution, old.architecture, old.results)
         is distinct from row(new.title, new.subtitle, new.summary, new.solution, new.architecture, new.results) then
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

drop trigger if exists project_translations_mark_stale on public.project_translations;
create trigger project_translations_mark_stale
after update of title, subtitle, summary, solution, architecture, results on public.project_translations
for each row execute function private.mark_translation_stale();

drop trigger if exists blog_post_translations_mark_stale on public.blog_post_translations;
create trigger blog_post_translations_mark_stale
after update of title, excerpt, markdown on public.blog_post_translations
for each row execute function private.mark_translation_stale();

create or replace function private.unpublish_parent_on_translation_loss()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'DELETE' or (old.review_status = 'validated' and new.review_status <> 'validated') then
    if tg_table_name = 'project_translations' then
      update public.projects
      set publication_status = 'review_required', published_at = null
      where id = old.project_id and publication_status in ('published', 'scheduled');
    elsif tg_table_name = 'blog_post_translations' then
      update public.blog_posts
      set publication_status = 'review_required', published_at = null
      where id = old.blog_post_id and publication_status in ('published', 'scheduled');
    end if;
  end if;
  return coalesce(new, old);
end;
$$;

revoke all on function private.unpublish_parent_on_translation_loss() from public, anon, authenticated;

drop trigger if exists project_translations_unpublish_parent on public.project_translations;
create trigger project_translations_unpublish_parent
after update of review_status or delete on public.project_translations
for each row execute function private.unpublish_parent_on_translation_loss();

drop trigger if exists blog_post_translations_unpublish_parent on public.blog_post_translations;
create trigger blog_post_translations_unpublish_parent
after update of review_status or delete on public.blog_post_translations
for each row execute function private.unpublish_parent_on_translation_loss();

-- Scheduled content becomes publicly readable only after its target date.
drop policy if exists projects_public_read on public.projects;
create policy projects_public_read on public.projects for select to anon, authenticated
using (
  publication_status = 'published'
  or (publication_status = 'scheduled' and published_at is not null and published_at <= now())
);

drop policy if exists project_translations_public_read on public.project_translations;
create policy project_translations_public_read on public.project_translations for select to anon, authenticated
using (
  review_status = 'validated'
  and exists (
    select 1 from public.projects
    where projects.id = project_translations.project_id
      and (
        projects.publication_status = 'published'
        or (projects.publication_status = 'scheduled' and projects.published_at is not null and projects.published_at <= now())
      )
  )
);

drop policy if exists blog_posts_public_read on public.blog_posts;
create policy blog_posts_public_read on public.blog_posts for select to anon, authenticated
using (
  publication_status = 'published'
  or (publication_status = 'scheduled' and published_at is not null and published_at <= now())
);

drop policy if exists blog_post_translations_public_read on public.blog_post_translations;
create policy blog_post_translations_public_read on public.blog_post_translations for select to anon, authenticated
using (
  review_status = 'validated'
  and exists (
    select 1 from public.blog_posts
    where blog_posts.id = blog_post_translations.blog_post_id
      and (
        blog_posts.publication_status = 'published'
        or (blog_posts.publication_status = 'scheduled' and blog_posts.published_at is not null and blog_posts.published_at <= now())
      )
  )
);
