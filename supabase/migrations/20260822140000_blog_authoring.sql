-- Blog authoring (CMS), deliberately independent of the Academy's RBAC.
-- Idempotent: safe to re-run against a database where this has already applied.
--
-- This is its own small permission system — a `blog_role` enum and a
-- `blog_editors` table, not `app_role`/`course_staff` from
-- 20260820090000_rbac_permissions.sql. A blog editor doesn't need to be an
-- Academy super_admin, instructor or anything else, and holding an Academy
-- role confers no blog access. The only thing genuinely shared is identity
-- (auth.users / public.profiles) — there's one Supabase project, so a
-- person is still one account — but *authorization* for the blog never
-- reads course_staff, user_roles or is_super_admin(). Two roles:
--   editor  full control: any post, any hero image, manages the team.
--   author  their own posts only (create/edit/delete/publish); can see the
--           team roster but not change it.
--
-- Bootstrapping: the very first editor can't be added through the app
-- (add_blog_team_member() below requires an existing editor to call it) —
-- run this once by hand in the Supabase SQL editor, with your own user id
-- (Authentication -> Users in the dashboard, or `select id from auth.users
-- where email = '...'`):
--
--   insert into public.blog_editors (user_id, role) values ('<your-uuid>', 'editor');

do $$
begin
  if not exists (select 1 from pg_type where typname = 'blog_role') then
    create type public.blog_role as enum ('editor', 'author');
  end if;
end $$;

-- ---------- blog_editors ----------
create table if not exists public.blog_editors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.blog_role not null,
  created_at timestamptz not null default now(),
  unique (user_id)
);
grant select, insert, update, delete on public.blog_editors to authenticated;
grant all on public.blog_editors to service_role;
alter table public.blog_editors enable row level security;
create index if not exists idx_blog_editors_user on public.blog_editors(user_id);

create or replace function public.is_blog_team(_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.blog_editors where user_id = _user_id);
$$;
grant execute on function public.is_blog_team(uuid) to authenticated;

create or replace function public.is_blog_editor_role(_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.blog_editors where user_id = _user_id and role = 'editor');
$$;
grant execute on function public.is_blog_editor_role(uuid) to authenticated;

drop policy if exists "Team member views their own membership" on public.blog_editors;
create policy "Team member views their own membership" on public.blog_editors
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "Editors view every membership" on public.blog_editors;
create policy "Editors view every membership" on public.blog_editors
  for select to authenticated using (public.is_blog_editor_role(auth.uid()));

drop policy if exists "Editors manage team membership" on public.blog_editors;
create policy "Editors manage team membership" on public.blog_editors
  for all to authenticated
  using (public.is_blog_editor_role(auth.uid()))
  with check (public.is_blog_editor_role(auth.uid()));

-- Looks a person up by email and adds/updates their blog_editors row.
-- security definer so it can read profiles.email regardless of the
-- caller's own profiles SELECT grants (blog editors otherwise have no
-- special read access to other people's profiles at all — see the header
-- comment above on keeping this segmented). Checks membership itself
-- rather than relying only on the table's own RLS, so the error message
-- is clear instead of a silent zero-row insert.
create or replace function public.add_blog_team_member(_email text, _role public.blog_role)
returns table (id uuid, user_id uuid, role public.blog_role, full_name text, email text)
language plpgsql
security definer
set search_path = public
as $$
declare
  _target uuid;
begin
  if not public.is_blog_editor_role(auth.uid()) then
    raise exception 'Only a blog editor can add team members';
  end if;

  select p.id into _target from public.profiles p where lower(p.email) = lower(_email);
  if _target is null then
    raise exception 'No account found for that email — they need to sign in at least once first';
  end if;

  insert into public.blog_editors (user_id, role)
  values (_target, _role)
  on conflict (user_id) do update set role = excluded.role;

  return query
    select be.id, be.user_id, be.role, p.full_name, p.email
    from public.blog_editors be
    join public.profiles p on p.id = be.user_id
    where be.user_id = _target;
end;
$$;
grant execute on function public.add_blog_team_member(text, public.blog_role) to authenticated;

-- Full roster with names/emails. Same reasoning as add_blog_team_member()
-- above: reads profiles as security definer rather than widening profiles'
-- own RLS, and is available to the whole team (not just editors) so an
-- author can at least see who else is on it.
create or replace function public.blog_team()
returns table (id uuid, user_id uuid, role public.blog_role, full_name text, email text, created_at timestamptz)
language sql
stable
security definer
set search_path = public
as $$
  select be.id, be.user_id, be.role, p.full_name, p.email, be.created_at
  from public.blog_editors be
  join public.profiles p on p.id = be.user_id
  where public.is_blog_team(auth.uid())
  order by be.created_at;
$$;
grant execute on function public.blog_team() to authenticated;

-- ---------- blog_posts ----------
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  category text not null,
  title text not null,
  summary text not null,
  hero_image_path text,
  hero_alt text,
  byline text not null default 'Quantum Basics Engineering Team',
  sections jsonb not null default '[]'::jsonb,
  read_minutes int not null default 5,
  published boolean not null default false,
  published_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.blog_posts to anon, authenticated;
grant insert, update, delete on public.blog_posts to authenticated;
grant all on public.blog_posts to service_role;
alter table public.blog_posts enable row level security;
create index if not exists idx_blog_posts_published on public.blog_posts(published, published_at desc);

do $$
begin
  alter table public.blog_posts add constraint blog_posts_slug_key unique (slug);
exception
  when duplicate_object then null;
  when duplicate_table then null;
end $$;

drop trigger if exists update_blog_posts_updated_at on public.blog_posts;
create trigger update_blog_posts_updated_at
before update on public.blog_posts
for each row execute function public.update_updated_at_column();

-- Stamps published_at the moment a post goes live, if the editor hasn't
-- already set one (e.g. backdating). Runs on insert and update alike;
-- doesn't touch published_at again once it's set, so it's a one-way stamp,
-- not a "last republished" timestamp.
create or replace function public.set_blog_published_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.published = true and new.published_at is null then
    new.published_at := now();
  end if;
  return new;
end;
$$;

drop trigger if exists before_blog_post_publish on public.blog_posts;
create trigger before_blog_post_publish
before insert or update on public.blog_posts
for each row execute function public.set_blog_published_at();

drop policy if exists "Public reads published posts" on public.blog_posts;
create policy "Public reads published posts" on public.blog_posts
  for select to anon, authenticated using (published = true);

drop policy if exists "Blog team reads every post" on public.blog_posts;
create policy "Blog team reads every post" on public.blog_posts
  for select to authenticated using (public.is_blog_team(auth.uid()));

drop policy if exists "Blog team creates posts" on public.blog_posts;
create policy "Blog team creates posts" on public.blog_posts
  for insert to authenticated
  with check (public.is_blog_team(auth.uid()) and created_by = auth.uid());

drop policy if exists "Editors update any post" on public.blog_posts;
create policy "Editors update any post" on public.blog_posts
  for update to authenticated
  using (public.is_blog_editor_role(auth.uid()))
  with check (public.is_blog_editor_role(auth.uid()));

drop policy if exists "Authors update their own post" on public.blog_posts;
create policy "Authors update their own post" on public.blog_posts
  for update to authenticated
  using (created_by = auth.uid() and public.is_blog_team(auth.uid()))
  with check (created_by = auth.uid() and public.is_blog_team(auth.uid()));

drop policy if exists "Editors delete any post" on public.blog_posts;
create policy "Editors delete any post" on public.blog_posts
  for delete to authenticated using (public.is_blog_editor_role(auth.uid()));

drop policy if exists "Authors delete their own post" on public.blog_posts;
create policy "Authors delete their own post" on public.blog_posts
  for delete to authenticated using (created_by = auth.uid() and public.is_blog_team(auth.uid()));

-- ---------- storage: blog-media ----------
-- Public bucket (hero images are public marketing content, unlike the
-- private course-materials bucket) -- getPublicUrl() serves objects
-- without an auth check, so the select policy below is defense in depth,
-- not load-bearing.
insert into storage.buckets (id, name, public)
values ('blog-media', 'blog-media', true)
on conflict (id) do nothing;

drop policy if exists "Public reads blog media" on storage.objects;
create policy "Public reads blog media" on storage.objects
  for select using (bucket_id = 'blog-media');

drop policy if exists "Blog team uploads media" on storage.objects;
create policy "Blog team uploads media" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'blog-media' and public.is_blog_team(auth.uid()));

drop policy if exists "Blog team replaces media" on storage.objects;
create policy "Blog team replaces media" on storage.objects
  for update to authenticated
  using (bucket_id = 'blog-media' and public.is_blog_team(auth.uid()))
  with check (bucket_id = 'blog-media' and public.is_blog_team(auth.uid()));

drop policy if exists "Blog team deletes media" on storage.objects;
create policy "Blog team deletes media" on storage.objects
  for delete to authenticated using (bucket_id = 'blog-media' and public.is_blog_team(auth.uid()));

-- ---------- seed: migrate the 5 posts previously hardcoded in
-- src/data/blog.ts verbatim, so the public blog doesn't go blank the
-- moment the app switches its read path to this table. Hero images are
-- NOT carried over -- they were bundled local JPGs (src/assets/*), not
-- URLs, and a SQL migration can't push binary files into Storage. Each
-- post's hero_image_path is left null (the public blog pages render
-- cleanly without one); re-upload the original file for each through the
-- new Studio editor to restore it. created_by is left null: this is
-- pre-existing content, not authored by any one tracked account. ----------
insert into public.blog_posts (slug, category, title, summary, hero_alt, byline, published, published_at, read_minutes, sections)
values
(
  'wages-metering-data-lost-in-translation',
  'Metering & Utilities',
  'Why WAGES metering data still gets lost in translation',
  'Most sites we walk into already have meters. Very few of them have a single, trustworthy number anyone will defend in a budget meeting. Here''s where that trust usually breaks down.',
  'Close-up of a water and energy metering panel with multiple gauges',
  'Quantum Basics Engineering Team',
  true,
  '2026-08-10T00:00:00Z',
  6,
  $sec0$[
  {
    "heading": "The meters were never the hard part",
    "body": "By the time we're called in, a site usually has water, air, gas, electricity and steam metering installed somewhere — sometimes several generations of it, bolted on department by department as budgets allowed. The hardware is rarely the constraint. What's missing is a single chain of custody for that data, from the sensor at the pipe to the number someone quotes in a management review."
  },
  {
    "heading": "Three places the chain breaks",
    "body": "In our audits, the loss almost always happens at one of the same three points, and it compounds because no one owns the handoff between them.",
    "bullets": [
      "Sensor to logger — pulse meters undercounting after a firmware update no one tracked, or a totaliser silently rolling over",
      "Logger to network — a data logger recording faithfully to local memory that nobody has walked out to collect in months",
      "Network to report — raw counts reaching a spreadsheet where unit conversions and calendar-month cutoffs are done differently by whoever built last year's version"
    ]
  },
  {
    "heading": "What a working system actually looks like",
    "body": "The fix isn't more metering — it's fewer manual handoffs. We standardise on one polling method per utility type, timestamp everything at the point of capture rather than the point of upload, and put unit conversions in one place, not one per report author. Once that's in place, the WAGES dashboard stops being a monthly reconciliation exercise and starts being something operations can act on the same week."
  }
]$sec0$::jsonb
),
(
  'scada-network-segmentation-warning-signs',
  'Industrial Networks',
  'Five signs your SCADA network needs a segmentation review',
  'A flat OT network is invisible right up until it isn''t. These are the symptoms we look for before anyone mentions the word ''security''.',
  'Industrial control room with SCADA monitoring screens',
  'Quantum Basics Engineering Team',
  true,
  '2026-07-22T00:00:00Z',
  7,
  $sec1$[
  {
    "heading": "It rarely starts as a security conversation",
    "body": "Nobody calls us to say 'our network isn't segmented.' They call because a PLC dropped offline during a broadcast storm caused by an unrelated device three switches away, or because a contractor's laptop on the wrong VLAN could see every controller on the floor. Segmentation shows up as an operational problem long before it shows up as a security one."
  },
  {
    "heading": "The signs worth acting on",
    "body": "None of these alone is an emergency. Together, they're a pattern we've learned to take seriously.",
    "bullets": [
      "IT and OT devices share the same broadcast domain, so a laptop reboot on one side can be felt on the other",
      "Nobody can produce an accurate as-built network diagram without walking the panels",
      "Remote access for vendors goes through the same path as everything else, with no isolation and no session logging",
      "A single managed switch failure would take down controllers across more than one process area",
      "Firmware and patch status on field devices is tracked, at best, in someone's memory"
    ]
  },
  {
    "heading": "Where we start",
    "body": "A segmentation review begins with a passive network capture, not a redesign — we want to see what's actually talking to what before we draw a single VLAN boundary. From there the plan is usually staged: isolate the highest-risk crossings first (remote access, IT/OT boundary), then work inward toward per-cell segmentation as maintenance windows allow. The goal is a network where a fault in one cell stays in that cell."
  }
]$sec1$::jsonb
),
(
  'energy-audits-field-perspective',
  'Energy Management',
  'Energy audits aren''t optional anymore: a field perspective',
  'Tariffs move faster than most facilities can plan around. What we actually find when we audit a plant''s power system — and why the easy wins are rarely where people expect.',
  'Engineer inspecting electrical distribution equipment',
  'Quantum Basics Engineering Team',
  true,
  '2026-06-30T00:00:00Z',
  5,
  $sec2$[
  {
    "heading": "The bill is a symptom, not the diagnosis",
    "body": "Most audit requests start with a number: the power bill went up, or a penalty appeared for poor power factor, and someone wants to know why. That number is useful as a trigger, but it tells you almost nothing about where the loss is actually happening upstream of the meter."
  },
  {
    "heading": "Where the easy wins usually hide",
    "body": "Facilities teams expect the fix to be equipment — a bigger generator, a newer chiller. In practice, the highest-return items we find are almost always operational rather than capital.",
    "bullets": [
      "Power factor correction sized to actual measured load, not nameplate ratings",
      "Scheduling of high-draw equipment to avoid simultaneous peak demand",
      "Standby losses on equipment left energised outside production hours",
      "Harmonic distortion quietly heating transformers and de-rating cable life"
    ]
  },
  {
    "heading": "Making the case internally",
    "body": "The hardest part of an energy audit usually isn't the engineering — it's translating findings into a business case that survives a budget cycle. We cost every recommendation against a measured baseline and a realistic payback period, and separate the list into what can be done this maintenance window versus what needs capital approval, so the audit produces a roadmap rather than just a report."
  }
]$sec2$::jsonb
),
(
  'telecom-access-network-rollout-lessons',
  'Telecommunications',
  'Inside a telecom access network rollout: lessons from the field',
  'Network rollouts across multiple countries surface the same handful of failure modes, again and again. Here''s what we plan for before the first tower goes up.',
  'Telecommunications tower against an open sky',
  'Quantum Basics Engineering Team',
  true,
  '2026-06-05T00:00:00Z',
  6,
  $sec3$[
  {
    "heading": "Planning on paper versus planning on the ground",
    "body": "A drive test and a coverage prediction model will get a rollout plan most of the way there. The gap between that plan and what a crew finds on site — access roads that don't exist yet, a landlord negotiation that stalls a build, power availability that was assumed rather than confirmed — is where schedules actually slip."
  },
  {
    "heading": "The recurring failure modes",
    "body": "Across programmes in Nigeria, Benin, Côte d'Ivoire and the Congo, the same issues resurface regardless of operator or vendor.",
    "bullets": [
      "Site acquisition timelines underestimated relative to civil works",
      "Power planning treated as an afterthought until commissioning week",
      "Optimisation deferred until after launch, so early subscriber experience sets a bad first impression",
      "Drive test data collected but not fed back into the next phase's site selection"
    ]
  },
  {
    "heading": "What we build into the schedule now",
    "body": "We now run site acquisition and civil works in parallel with power confirmation rather than in sequence, and we treat post-launch optimisation as a funded phase of the programme, not a contingency. It adds cost to the plan upfront — and removes far more cost from the programme overall."
  }
]$sec3$::jsonb
),
(
  'what-we-look-for-hiring-automation-engineers',
  'Careers & Training',
  'What we look for when hiring industrial automation engineers',
  'Certifications tell us what someone has studied. They don''t tell us what happens when a PLC program doesn''t do what the documentation says it should. Here''s what we actually screen for.',
  'Field engineer working on industrial automation equipment',
  'Quantum Basics Engineering Team',
  true,
  '2026-05-14T00:00:00Z',
  5,
  $sec4$[
  {
    "heading": "Credentials get you the interview",
    "body": "A relevant degree or certification tells us someone has covered the fundamentals — ladder logic, control theory, the basics of instrumentation. That's table stakes. It doesn't tell us how someone behaves when a system doesn't match its documentation, which is the actual day-to-day of field automation work."
  },
  {
    "heading": "What we probe for instead",
    "body": "In technical interviews, we spend most of the time on how a candidate reasons through an unfamiliar fault, not what they can recite.",
    "bullets": [
      "Can they read an unfamiliar single-line or P&ID and ask the right clarifying questions?",
      "How do they narrow down a fault when the obvious first cause turns out to be wrong?",
      "Do they think about safety and lockout implications before touching a live panel?",
      "Can they explain a technical finding to someone without an engineering background?"
    ]
  },
  {
    "heading": "Why this shapes the Academy curriculum",
    "body": "This is also why the Academy's courses are built around case studies and simulated faults rather than pure theory. We're training for the version of the job that shows up on site, not the version that shows up in a textbook — which means the strongest applicants to our own openings are often people who've already been through that kind of hands-on programme, whether ours or someone else's."
  }
]$sec4$::jsonb
)
on conflict (slug) do nothing;
