import type { User } from "@supabase/supabase-js";
import { supabase } from "./client";

/**
 * Shared, short-lived cache around supabase.auth.getUser().
 *
 * getUser() (correctly, unlike getSession()) revalidates the session
 * against the Supabase Auth server on every call rather than trusting the
 * local token -- that's the right check for a route guard. The problem was
 * never that it checks the server; it's that a single page in this app
 * calls it from several independent places (the /academy/_authenticated
 * and /blog/studio/_authenticated route guards, AcademyShell, and most
 * individual page components/lib functions each call it again for the
 * current user's id) with no coordination between them, so one navigation
 * could fire 3-5 redundant round trips to the same endpoint for the same
 * answer -- and TanStack Router's beforeLoad reruns on every navigation
 * (it isn't covered by loader staleTime), so this repeated on every single
 * click between pages, not just on first load.
 *
 * getCurrentUser() dedupes concurrent calls and reuses the result for a
 * few seconds afterwards, and the cache is invalidated immediately on any
 * auth state change (sign-in, sign-out, token refresh, user update), so
 * correctness is never stale for longer than one auth event.
 */
const CACHE_TTL_MS = 15_000;

let cached: { user: User | null; expiresAt: number } | null = null;
let inFlight: Promise<User | null> | null = null;

async function fetchUser(): Promise<User | null> {
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export async function getCurrentUser(): Promise<User | null> {
  const now = Date.now();
  if (cached && cached.expiresAt > now) return cached.user;
  if (inFlight) return inFlight;

  inFlight = fetchUser()
    .then((user) => {
      cached = { user, expiresAt: Date.now() + CACHE_TTL_MS };
      return user;
    })
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}

/** Call after any action that changes who's signed in outside of a normal
 * auth event the listener below already catches (there currently isn't
 * one, but this stays exported as the escape hatch rather than making
 * callers poke at module internals). */
export function invalidateCurrentUser(): void {
  cached = null;
  inFlight = null;
}

// Client-only: these routes all render with ssr: false, and there's no
// meaningful "auth state" to subscribe to during a server render anyway.
if (typeof window !== "undefined") {
  supabase.auth.onAuthStateChange(() => {
    invalidateCurrentUser();
  });
}
