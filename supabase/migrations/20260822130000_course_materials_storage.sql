-- Course materials: Supabase Storage bucket + a metadata table so the UI
-- can list/title/describe uploads without parsing storage.objects paths.
-- Idempotent: safe to re-run against a database where this has already applied.
--
-- Path convention (enforced client-side by the upload helper, checked
-- server-side by the storage policies below): objects live at
-- "{course_id}/{filename}" inside the course-materials bucket, so
-- storage.foldername(name)[1] is always the owning course's id.
--
-- Write access follows the notices/course_events precedent (course_staff,
-- not instructor-only) -- see the header comment in
-- 20260822120000_teacher_dashboard_schema.sql for why that split exists.

insert into storage.buckets (id, name, public)
values ('course-materials', 'course-materials', false)
on conflict (id) do nothing;

drop policy if exists "Course staff upload materials" on storage.objects;
create policy "Course staff upload materials" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'course-materials'
    and public.is_course_staff(auth.uid(), ((storage.foldername(name))[1])::uuid)
  );

drop policy if exists "Course staff replace materials" on storage.objects;
create policy "Course staff replace materials" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'course-materials'
    and public.is_course_staff(auth.uid(), ((storage.foldername(name))[1])::uuid)
  )
  with check (
    bucket_id = 'course-materials'
    and public.is_course_staff(auth.uid(), ((storage.foldername(name))[1])::uuid)
  );

drop policy if exists "Course staff delete materials" on storage.objects;
create policy "Course staff delete materials" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'course-materials'
    and (
      public.is_course_staff(auth.uid(), ((storage.foldername(name))[1])::uuid)
      or public.is_super_admin(auth.uid())
    )
  );

drop policy if exists "Enrolled and staff read materials" on storage.objects;
create policy "Enrolled and staff read materials" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'course-materials'
    and (
      public.is_course_staff(auth.uid(), ((storage.foldername(name))[1])::uuid)
      or public.is_super_admin(auth.uid())
      or exists (
        select 1 from public.enrollments e
        where e.course_id = ((storage.foldername(name))[1])::uuid and e.user_id = auth.uid()
      )
    )
  );

-- ---------- materials metadata ----------
create table if not exists public.materials (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text,
  storage_path text not null,
  content_type text,
  size_bytes bigint,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.materials to authenticated;
grant all on public.materials to service_role;
alter table public.materials enable row level security;
create index if not exists idx_materials_course on public.materials(course_id);

drop policy if exists "materials_select" on public.materials;
create policy "materials_select" on public.materials
  for select to authenticated
  using (
    public.is_course_staff(auth.uid(), course_id)
    or public.is_super_admin(auth.uid())
    or exists (select 1 from public.enrollments e where e.course_id = materials.course_id and e.user_id = auth.uid())
  );

drop policy if exists "materials_write" on public.materials;
create policy "materials_write" on public.materials
  for all to authenticated
  using (public.is_course_staff(auth.uid(), course_id) or public.is_super_admin(auth.uid()))
  with check (public.is_course_staff(auth.uid(), course_id) or public.is_super_admin(auth.uid()));
