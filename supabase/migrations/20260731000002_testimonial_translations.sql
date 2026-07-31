alter table public.testimonials 
add column if not exists content_en text,
add column if not exists job_title_en text,
add column if not exists organization_en text;
