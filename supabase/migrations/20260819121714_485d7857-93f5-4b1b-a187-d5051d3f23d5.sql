-- Lock down handle_new_user() so it can only ever be invoked by its trigger.
-- REVOKE on a privilege that isn't currently granted is a no-op, so this is
-- already idempotent, but we guard on the function's existence in case this
-- migration is ever replayed before migration 1 in a partial/manual apply.
do $$
begin
  if exists (
    select 1 from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'handle_new_user'
  ) then
    revoke execute on function public.handle_new_user() from anon, authenticated, public;
  end if;
end $$;
