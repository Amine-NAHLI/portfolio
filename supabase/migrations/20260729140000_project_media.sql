-- Add project_media join table for photo galleries

create table if not exists public.project_media (
  project_id uuid not null references public.projects(id) on delete cascade,
  media_id uuid not null references public.media_assets(id) on delete cascade,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  primary key (project_id, media_id)
);

create index if not exists project_media_project_id_idx on public.project_media (project_id);

alter table public.project_media enable row level security;

drop policy if exists project_media_public_read on public.project_media;
create policy project_media_public_read on public.project_media for select to anon, authenticated
using (exists (
  select 1 from public.projects
  where projects.id = project_media.project_id
    and projects.publication_status = 'published'
    and (projects.published_at is null or projects.published_at <= now())
));

drop policy if exists project_media_admin_all on public.project_media;
create policy project_media_admin_all on public.project_media for all to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

grant select on public.project_media to anon, authenticated;
grant select, insert, update, delete on public.project_media to authenticated;
