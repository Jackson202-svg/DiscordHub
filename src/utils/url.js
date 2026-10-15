const ALLOWED_PROTOCOLS = new Set(["https:", "http:"]);

/** Return a normalized public web URL, or null when the input is unsafe/invalid. */
export function safeExternalUrl(value) {
  if (typeof value !== "string" || value.length > 2048) return null;
  try {
    const url = new URL(value);
    if (!ALLOWED_PROTOCOLS.has(url.protocol)) return null;
    if (!url.hostname || url.username || url.password) return null;
    return url.href;
  } catch {
    return null;
  }
}
