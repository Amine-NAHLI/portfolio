begin;

select plan(14);

select ok(
  not exists (
    select 1
    from unnest(array[
      'admin_users', 'projects', 'project_translations', 'skill_categories', 'skills', 'project_skills',
      'certifications', 'experiences', 'education', 'timeline_entries', 'now_entries',
      'categories', 'tags', 'blog_posts', 'blog_post_translations', 'blog_post_tags',
      'contact_messages', 'media_assets', 'site_settings', 'ai_jobs', 'audit_logs',
      'testimonials', 'analytics_daily'
    ]) as expected(table_name)
    left join pg_class on pg_class.oid = format('public.%I', expected.table_name)::regclass
    where not pg_class.relrowsecurity
  ),
  'RLS is enabled on every exposed public table'
);

select ok(not has_table_privilege('anon', 'public.contact_messages', 'SELECT'), 'anonymous users cannot read contact messages');
select ok(not has_table_privilege('anon', 'public.contact_messages', 'INSERT'), 'anonymous users cannot insert contact messages directly');
select ok(not has_table_privilege('anon', 'public.ai_jobs', 'SELECT'), 'anonymous users cannot read AI drafts');
select ok(not has_table_privilege('authenticated', 'public.audit_logs', 'UPDATE'), 'audit logs cannot be updated');
select ok(not has_table_privilege('authenticated', 'public.audit_logs', 'DELETE'), 'audit logs cannot be deleted');
select ok(
  not has_function_privilege('anon', 'public.increment_analytics_daily(text,text,text)', 'EXECUTE'),
  'anonymous users cannot increment analytics outside the server route'
);
select ok(
  (select prosecdef and coalesce(proconfig, '{}') @> array['search_path=""'] from pg_proc where oid = 'private.is_admin()'::regprocedure),
  'admin authorization is a security-definer function with an empty search path'
);
select ok(
  (select not public and file_size_limit = 5242880 from storage.buckets where id = 'portfolio-media'),
  'media storage is private and limited to 5 MiB'
);

select ok(not has_table_privilege('anon', 'public.testimonials', 'INSERT'), 'anonymous users cannot insert recommendations directly');

insert into public.testimonials (
  name, first_name, last_name, job_title, message, status, consent_to_publish
)
values
  ('Visible Person', 'Visible', 'Person', 'Encadrant', repeat('A', 40), 'confirmed', true),
  ('Pending Person', 'Pending', 'Person', 'Professeur', repeat('B', 40), 'pending', true),
  ('No Consent', 'No', 'Consent', 'Collègue', repeat('C', 40), 'confirmed', false);

set local role anon;
select is(
  (select array_agg(name order by name) from public.testimonials),
  array['Visible Person']::text[],
  'anonymous users only read confirmed recommendations with publication consent'
);
reset role;

insert into public.skill_categories (slug, name_fr, name_en, publication_status)
values
  ('pgtap-public-category', 'Publique', 'Public', 'published'),
  ('pgtap-draft-category', 'Brouillon', 'Draft', 'draft');

set local role anon;
select is(
  (select array_agg(slug order by slug) from public.skill_categories where slug like 'pgtap-%'),
  array['pgtap-public-category']::text[],
  'anonymous users only read published skill categories'
);
reset role;

select ok(
  exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'testimonials' and policyname = 'testimonials_admin_all'
  ),
  'recommendations have an administrator-only mutation policy'
);

insert into public.projects (id, slug)
values
  ('00000000-0000-4000-8000-000000000001', 'pgtap-published'),
  ('00000000-0000-4000-8000-000000000002', 'pgtap-draft');

insert into public.project_translations (
  project_id, locale, title, summary, problem, objectives, solution, architecture, results, review_status
)
select
  '00000000-0000-4000-8000-000000000001', locale, 'Title', 'Summary', 'Problem',
  '["Objective"]'::jsonb, 'Solution', '["Architecture"]'::jsonb, '["Result"]'::jsonb, 'validated'
from unnest(array['fr', 'en']) as locale;

update public.projects
set publication_status = 'published', published_at = now()
where id = '00000000-0000-4000-8000-000000000001';

set local role anon;
select is(
  (select array_agg(slug order by slug) from public.projects where slug like 'pgtap-%'),
  array['pgtap-published']::text[],
  'anonymous users can read published projects but not drafts'
);
reset role;

select * from finish();
rollback;
