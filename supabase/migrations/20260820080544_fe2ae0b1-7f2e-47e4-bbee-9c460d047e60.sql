-- Academy LMS core schema: courses, lessons, enrollments, lesson progress.
-- Idempotent: safe to re-run against a database where this has already applied.

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  title text not null,
  summary text not null,
  track text not null,
  level text not null default 'Foundation',
  duration text not null default 'Self-paced',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.courses to anon, authenticated;
grant all on public.courses to service_role;
alter table public.courses enable row level security;

-- Guard against a pre-existing courses table (e.g. created outside this
-- migration) that lacks the unique constraint the ON CONFLICT below needs.
-- "create table if not exists" is a no-op on an existing table, so the
-- constraint has to be ensured separately and idempotently here.
do $$
begin
  alter table public.courses add constraint courses_slug_key unique (slug);
exception
  when duplicate_object then null; -- constraint already present
  when duplicate_table then null;  -- constraint's backing index already present
end $$;

drop policy if exists "Courses are publicly readable" on public.courses;
create policy "Courses are publicly readable" on public.courses
  for select to anon, authenticated using (true);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  body text not null,
  sort_order int not null default 0,
  minutes int not null default 15,
  created_at timestamptz not null default now()
);
grant select on public.lessons to anon, authenticated;
grant all on public.lessons to service_role;
alter table public.lessons enable row level security;

-- Same guard as above, for the (course_id, title) constraint the second
-- ON CONFLICT further down depends on.
do $$
begin
  alter table public.lessons add constraint lessons_course_id_title_key unique (course_id, title);
exception
  when duplicate_object then null;
  when duplicate_table then null;
end $$;

drop policy if exists "Lessons are publicly readable" on public.lessons;
create policy "Lessons are publicly readable" on public.lessons
  for select to anon, authenticated using (true);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, course_id)
);
grant select, insert, delete on public.enrollments to authenticated;
grant all on public.enrollments to service_role;
alter table public.enrollments enable row level security;

drop policy if exists "Users manage their own enrollments" on public.enrollments;
create policy "Users manage their own enrollments" on public.enrollments
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);
grant select, insert, delete on public.lesson_progress to authenticated;
grant all on public.lesson_progress to service_role;
alter table public.lesson_progress enable row level security;

drop policy if exists "Users manage their own progress" on public.lesson_progress;
create policy "Users manage their own progress" on public.lesson_progress
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

insert into public.courses (slug, title, summary, track, level, duration, sort_order) values
('plc-scada-fundamentals','PLC & SCADA Fundamentals','Programmable controllers, I/O wiring, ladder logic and SCADA supervision for plant operations.','Industrial Automation','Foundation','6 modules · 4 hrs',1),
('wages-metering-essentials','WAGES Metering Essentials','Water, air, gas, electricity and steam metering: selection, installation, calibration and data integrity.','Metering & Measurement','Intermediate','5 modules · 3 hrs',2),
('energy-management-iso50001','Energy Management & ISO 50001','Baselines, energy audits, load profiling and building a measurable energy performance programme.','Energy Management','Intermediate','5 modules · 3.5 hrs',3),
('industrial-networks-security','Industrial Networks & Site Security','Industrial communications, network topologies, CCTV and access control integration on live sites.','Smart Infrastructure','Foundation','4 modules · 2.5 hrs',4)
on conflict (slug) do nothing;

insert into public.lessons (course_id, title, body, sort_order, minutes)
select c.id, l.title, l.body, l.sort_order, l.minutes from public.courses c
join (values
('plc-scada-fundamentals','What a PLC actually does','A programmable logic controller is a hardened computer that scans inputs, solves logic and drives outputs on a fixed cycle. In this lesson we walk the scan cycle, the difference between discrete and analogue I/O, and how a controller fails safe when power or a sensor drops out.',1,25),
('plc-scada-fundamentals','Wiring and sizing I/O','Field devices rarely speak the controller''s language directly. We cover sinking vs sourcing digital inputs, 4-20 mA loops, isolation, surge protection and how to size a rack so the panel can grow with the plant.',2,30),
('plc-scada-fundamentals','Ladder logic you can maintain','Contacts, coils, latches, timers and counters — built up from a motor starter to a two-pump duty/standby sequence, with naming and commenting habits that make the program readable a year later.',3,35),
('plc-scada-fundamentals','Alarms and interlocks','Interlocks protect equipment and people; alarms tell operators what happened. We separate the two, look at alarm rationalisation and avoid the flood that makes an HMI useless during an upset.',4,25),
('plc-scada-fundamentals','SCADA screens that operators trust','Hierarchical screen design, tag naming, trending, and why grey backgrounds with colour reserved for abnormal states beats a colourful mimic.',5,30),
('plc-scada-fundamentals','Commissioning and handover','Loop checks, forcing safely, point-to-point testing, backup of the program, and the documentation set the client should receive at handover.',6,25),
('wages-metering-essentials','Why WAGES metering pays for itself','Water, air, gas, electricity and steam are usually billed in aggregate and consumed in detail. Sub-metering turns one invoice into an accountable cost per line, shift and product.',1,20),
('wages-metering-essentials','Choosing the right meter','Electromagnetic, ultrasonic, turbine, orifice and thermal mass — matched to fluid, pipe size, turndown and accuracy class, with installation constraints that quietly ruin accuracy.',2,30),
('wages-metering-essentials','Installation and straight-run discipline','Upstream and downstream straight lengths, orientation, air elimination, tapping points and access for future calibration.',3,25),
('wages-metering-essentials','Calibration and traceability','Reference standards, as-found and as-left records, tolerance bands and the calibration interval that keeps a meter defensible in an audit.',4,30),
('wages-metering-essentials','From pulses to dashboards','Pulse outputs, Modbus registers, data loggers and the aggregation rules that keep an energy dashboard consistent with the utility bill.',5,25),
('energy-management-iso50001','The energy management cycle','Plan-do-check-act applied to energy: policy, significant energy uses, objectives and a review rhythm that survives management change.',1,20),
('energy-management-iso50001','Building a credible baseline','Selecting a baseline period, normalising for production and weather, and regression against the right driver variables.',2,30),
('energy-management-iso50001','Running an energy audit','Walkthrough vs detailed audits, portable measurement, load profiling and separating base load from process load.',3,35),
('energy-management-iso50001','Energy performance indicators','Choosing EnPIs that a plant manager can act on, and reporting them so savings are not lost in production noise.',4,25),
('energy-management-iso50001','Turning findings into projects','Ranking measures by payback and risk, writing the business case, and measurement and verification after implementation.',5,30),
('industrial-networks-security','Industrial network fundamentals','Ethernet, serial and radio links on a plant: topologies, segmentation, cable selection and where a media converter or fibre run is unavoidable.',1,25),
('industrial-networks-security','Protocols on the plant floor','Modbus TCP/RTU, Profinet and MQTT — addressing, polling rates, and matching protocol to the availability the process needs.',2,30),
('industrial-networks-security','CCTV and video design','Camera selection, lens and coverage calculations, lighting, storage sizing and retention policy for an industrial site.',3,25),
('industrial-networks-security','Access control integration','Readers, controllers, door hardware, anti-passback and how access events tie back into the security and HR record.',4,25)
) as l(course_slug,title,body,sort_order,minutes) on l.course_slug = c.slug
on conflict (course_id, title) do nothing;
