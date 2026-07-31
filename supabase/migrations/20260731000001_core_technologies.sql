alter table public.projects add column if not exists core_technologies text[] not null default '{}';
