-- Privacy-first operational data. No raw IP address, cookie identifier or event payload is stored.

create table if not exists public.analytics_daily (
  event_date date not null default current_date,
  event_name text not null check (event_name in ('page_view', 'project_view', 'article_view', 'github_click', 'demo_click', 'cv_open', 'contact_submit', 'language_change')),
  path text not null check (char_length(path) between 1 and 240 and path like '/%'),
  locale text not null check (locale in ('fr', 'en')),
  event_count bigint not null default 0 check (event_count >= 0),
  updated_at timestamptz not null default now(),
  primary key (event_date, event_name, path, locale)
);

create index if not exists analytics_daily_event_date_idx on public.analytics_daily (event_date desc, event_count desc);
alter table public.analytics_daily enable row level security;

drop policy if exists analytics_daily_admin_read on public.analytics_daily;
create policy analytics_daily_admin_read on public.analytics_daily for select to authenticated
using ((select private.is_admin()));

revoke all on public.analytics_daily from anon, authenticated;
grant select on public.analytics_daily to authenticated;
grant select, insert, update on public.analytics_daily to service_role;

create or replace function public.increment_analytics_daily(event_name_value text, path_value text, locale_value text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if event_name_value not in ('page_view', 'project_view', 'article_view', 'github_click', 'demo_click', 'cv_open', 'contact_submit', 'language_change')
     or locale_value not in ('fr', 'en')
     or char_length(path_value) not between 1 and 240
     or path_value not like '/%' then
    raise exception 'Invalid analytics event' using errcode = '22023';
  end if;

  insert into public.analytics_daily (event_date, event_name, path, locale, event_count)
  values (current_date, event_name_value, path_value, locale_value, 1)
  on conflict (event_date, event_name, path, locale)
  do update set event_count = public.analytics_daily.event_count + 1, updated_at = now();
end;
$$;

revoke all on function public.increment_analytics_daily(text, text, text) from public, anon, authenticated;
grant execute on function public.increment_analytics_daily(text, text, text) to service_role;

comment on table public.analytics_daily is 'Aggregate counters only; no visitor identifier or raw event payload.';
