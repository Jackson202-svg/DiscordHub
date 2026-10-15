/** Escape untrusted provider data before inserting it into HTML. */
export function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

/** Return safe HTML for a normalized search result. */
export function renderResultCard(item, provider = "Search") {
  const title = item?.name || item?.full_name || item?.title || "Untitled result";
  const description = item?.description || item?.snippet || "No description provided.";
  let href = "#";
  try {
    const candidate = new URL(String(item?.url || ""));
    if (candidate.protocol === "https:" || candidate.protocol === "http:") href = candidate.href;
  } catch { /* Keep the safe fallback link. */ }
  return '<article class="result-card"><div class="result-top"><h3>' + escapeHtml(title) +
    '</h3><span class="tag">' + escapeHtml(provider) + '</span></div><p>' +
    escapeHtml(description) + '</p><a class="open-link" href="' + escapeHtml(href) +
    '" target="_blank" rel="noopener noreferrer">Open source ↗</a></article>';
}
