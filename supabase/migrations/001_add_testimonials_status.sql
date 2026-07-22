-- Legacy compatibility migration.
-- Testimonials are no longer part of the public product, but this migration is
-- kept because it may already have been applied to an existing Supabase project.
-- It deliberately creates no demo data and approves no pending submission.

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  company text,
  message text not null,
  rating smallint not null default 5 check (rating between 1 and 5),
  created_at timestamptz not null default now()
);

alter table public.testimonials
  add column if not exists status text not null default 'pending';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'testimonials_status_check'
      and conrelid = 'public.testimonials'::regclass
  ) then
    alter table public.testimonials
      add constraint testimonials_status_check
      check (status in ('pending', 'approved', 'rejected'));
  end if;
end
$$;
