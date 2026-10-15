const MAX_RECENT_SEARCHES = 12;

/** Normalize search input consistently with the API's length limits. */
export function normalizeSearchInput(value) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ").slice(0, 120);
}

/** Build a stable key for a search without storing secrets or result payloads. */
export function searchKey(provider, query) {
  return String(provider || "github").toLowerCase() + ":" + normalizeSearchInput(query).toLowerCase();
}

/** Add a recent search to a list while deduplicating and limiting its size. */
export function addRecentSearch(history, provider, query) {
  const normalized = normalizeSearchInput(query);
  if (normalized.length < 2) return Array.isArray(history) ? history.slice(0, MAX_RECENT_SEARCHES) : [];
  const item = { provider: String(provider || "github"), query: normalized, key: searchKey(provider, normalized) };
  const previous = Array.isArray(history) ? history : [];
  return [item, ...previous.filter(entry => entry?.key !== item.key)].slice(0, MAX_RECENT_SEARCHES);
}
