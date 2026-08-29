/**
 * Coordinates the two places that react to a fresh SIGNED_IN event:
 *  - a page-level auth form (e.g. academy.auth.tsx) that already knows
 *    exactly where to go and calls navigate() itself right after sign-in/up
 *  - the root route's global onAuthStateChange listener, which exists to
 *    catch sign-ins that AREN'T followed by an explicit navigate (Google
 *    OAuth's full-page redirect back into the app, a magic link landing,
 *    a session refreshing while the user idles on some other page)
 *
 * Without this, both fire for the same SIGNED_IN event and each drives its
 * own beforeLoad-triggered navigation concurrently -- one settling on
 * /academy/dashboard, the other (via the _authenticated guard's redirect)
 * on /academy/onboarding -- and they can restart/interleave each other,
 * which is what caused the address bar (and the mounted route) to flicker
 * between the two after sign-up.
 *
 * Call suppressNextAuthInvalidate() immediately before an explicit
 * navigate() that follows a sign-in/up you just performed. It auto-clears
 * after one read so it never masks a later, unrelated sign-in.
 */
let suppressed = false;

export function suppressNextAuthInvalidate(): void {
  suppressed = true;
}

export function consumeAuthInvalidateSuppression(): boolean {
  if (!suppressed) return false;
  suppressed = false;
  return true;
}
