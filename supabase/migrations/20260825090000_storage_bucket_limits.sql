-- Server-side enforcement for upload limits on both storage buckets.
-- Idempotent: safe to re-run against a database where this has already applied.
--
-- src/lib/file-validation.ts already says this out loud in its own header:
-- the 25 MB client-side check is "not a substitute for a server-side/
-- bucket-level limit" -- but neither bucket (course-materials,
-- 20260822130000; blog-media, 20260822140000) ever got that limit applied.
-- A client-side check only runs inside the app's own upload form; anyone
-- calling the Storage API directly with a valid session (any course-staff
-- account, any blog-team account) currently has no size ceiling and no MIME
-- allow-list at all. Bucket-level limits close that regardless of which
-- client makes the request.
--
-- allowed_mime_types is scoped generously to what each bucket's UI already
-- offers (materials: course handouts/slides/docs; blog-media: hero images
-- only) rather than tightened to a minimal set, since narrowing it further
-- is a product decision, not a security one -- this migration only removes
-- the "anything at all, any size" gap.

update storage.buckets
set
  file_size_limit = 26214400, -- 25 MB, matching MAX_UPLOAD_BYTES in file-validation.ts
  allowed_mime_types = array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'image/png',
    'image/jpeg',
    'image/webp',
    'application/zip'
  ]
where id = 'course-materials';

update storage.buckets
set
  file_size_limit = 26214400, -- 25 MB, matching MAX_UPLOAD_BYTES in file-validation.ts
  -- Deliberately excludes image/svg+xml: an SVG can carry a <script>, and
  -- this bucket is public (getPublicUrl serves objects with no auth check —
  -- see the "defense in depth" note in 20260822140000), so anyone who can
  -- reach a served object's URL directly would execute anything embedded in
  -- it in that response's own origin.
  allowed_mime_types = array['image/png', 'image/jpeg', 'image/webp']
where id = 'blog-media';
