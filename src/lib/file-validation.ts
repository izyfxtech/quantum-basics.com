/** Client-side guard rail before any Supabase Storage upload — not a
 * substitute for a server-side/bucket-level limit, just stops an obviously
 * oversized or empty file from burning an upload round-trip and storage
 * quota. Keep the two upload flows (course materials, blog hero images)
 * sharing one constant rather than drifting independently. */
export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024; // 25 MB

export function validateUploadFile(file: File, maxBytes: number = MAX_UPLOAD_BYTES): string | null {
  if (file.size === 0) return `"${file.name}" is empty.`;
  if (file.size > maxBytes) {
    return `"${file.name}" is ${(file.size / (1024 * 1024)).toFixed(1)} MB — the limit is ${maxBytes / (1024 * 1024)} MB.`;
  }
  return null;
}
