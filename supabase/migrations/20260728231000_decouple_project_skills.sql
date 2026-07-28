-- 006_decouple_project_skills.sql
-- Add technologies array to projects
alter table public.projects add column if not exists technologies text[] not null default '{}';

-- Migrate existing technologies from project_skills to projects.technologies
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'project_skills') then
    with project_techs as (
      select ps.project_id, array_agg(s.name) as tech_array
      from public.project_skills ps
      join public.skills s on s.id = ps.skill_id
      group by ps.project_id
    )
    update public.projects p
    set technologies = pt.tech_array
    from project_techs pt
    where p.id = pt.project_id;
  end if;
end
$$;

-- Drop the project_skills table and any policies
drop table if exists public.project_skills;
