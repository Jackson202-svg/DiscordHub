const form = document.querySelector("#search-form");
const input = document.querySelector("#search-query");
const provider = document.querySelector("#search-provider");
const results = document.querySelector("#results");
const statusBadge = document.querySelector("#api-status");
document.querySelector("#year").textContent = new Date().getFullYear();

const STORAGE = { saved: "discordhub.saved.v1", history: "discordhub.history.v1" };
const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
function readStore(key) {
  try { const value = JSON.parse(localStorage.getItem(key) || "[]"); return Array.isArray(value) ? value : []; }
  catch { return []; }
}
function writeStore(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch { return false; }
}
function safeUrl(value) {
  try { const url = new URL(String(value || "")); return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password ? url.href : ""; }
  catch { return ""; }
}
function showError(message) {
  results.innerHTML = '<div class="error-box" role="alert">' + esc(message) + '</div>';
}
function showEmpty(title, message) {
  results.innerHTML = '<div class="empty-state"><div class="empty-symbol">⌕</div><h3>' + esc(title) + '</h3><p>' + esc(message) + '</p></div>';
}
function addHistory(query, mode) {
  const key = mode + ":" + query.toLowerCase();
  const history = [{ key, query, mode, at: new Date().toISOString() }, ...readStore(STORAGE.history).filter(item => item.key !== key)].slice(0, 10);
  writeStore(STORAGE.history, history);
  renderHistory();
}
function saveItem(item, kind) {
  const url = safeUrl(item.url);
  if (!url) return;
  const saved = readStore(STORAGE.saved);
  if (saved.some(entry => entry.url === url)) {
    writeStore(STORAGE.saved, saved.filter(entry => entry.url !== url));
  } else {
    writeStore(STORAGE.saved, [{ name: item.name || "Untitled result", description: item.description || "", url, kind, savedAt: new Date().toISOString() }, ...saved].slice(0, 100));
  }
  renderSaved();
  renderResultsButtons();
}
function renderResultsButtons() {
  results.querySelectorAll("[data-save-url]").forEach(button => {
    const saved = readStore(STORAGE.saved).some(item => item.url === button.dataset.saveUrl);
    button.textContent = saved ? "★ Saved" : "☆ Save";
    button.setAttribute("aria-pressed", String(saved));
  });
}
function render(items, kind) {
  if (!items.length) { showEmpty("No results found", "Try a different search term or another provider."); return; }
  results.innerHTML = items.map(item => {
    const name = item.name || item.full_name || item.title || "Untitled result";
    const url = safeUrl(item.url);
    const description = item.description || item.snippet || "No description provided by the source.";
    const meta = (item.language ? '<span class="tag">' + esc(item.language) + '</span>' : "") +
      (Number.isFinite(item.stars) ? '<span class="tag">★ ' + item.stars.toLocaleString() + ' stars</span>' : "") +
      (item.updated ? '<span class="tag">Updated ' + esc(item.updated) + '</span>' : "");
    const saveButton = url ? '<button class="mini-action" type="button" data-save-url="' + esc(url) + '" data-save-name="' + esc(name) + '" data-save-description="' + esc(description) + '" data-save-kind="' + esc(kind) + '">☆ Save</button>' : "";
    return '<article class="result-card"><div class="result-top"><h3>' + esc(name) + '</h3><span class="tag">' + esc(kind) + '</span></div><p>' + esc(description) + '</p><div class="meta">' + meta + '</div><div class="result-actions">' + (url ? '<a class="open-link" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">Open source ↗</a>' : "") + saveButton + '</div></article>';
  }).join("");
  renderResultsButtons();
}
function renderSaved() {
  const saved = readStore(STORAGE.saved);
  document.querySelector("#saved-count").textContent = saved.length;
  const list = document.querySelector("#saved-results");
  if (!saved.length) { list.innerHTML = '<p class="tool-empty">Save a result to keep it here on this device.</p>'; return; }
  list.innerHTML = saved.map(item => '<div class="saved-item"><div class="saved-item-copy"><strong>' + esc(item.name) + '</strong><span>' + esc(item.kind) + '</span><a href="' + esc(safeUrl(item.url) || "#") + '" target="_blank" rel="noopener noreferrer">Open saved link ↗</a></div><button class="mini-action" type="button" data-remove-saved="' + esc(item.url) + '">Remove</button></div>').join("");
}
function renderHistory() {
  const history = readStore(STORAGE.history);
  document.querySelector("#history-count").textContent = history.length;
  const list = document.querySelector("#search-history");
  if (!history.length) { list.innerHTML = '<p class="tool-empty">Your recent searches will appear here.</p>'; return; }
  list.innerHTML = history.map(item => '<div class="history-item"><button type="button" data-repeat-query="' + esc(item.query) + '" data-repeat-mode="' + esc(item.mode) + '">' + esc(item.query) + '</button><span>' + esc(item.mode) + '</span></div>').join("");
}
async function checkHealth() {
  try {
    const response = await fetch("/api/health");
    if (!response.ok) throw new Error();
    const data = await response.json();
    statusBadge.textContent = data.status === "ok" ? "Server online" : "Server needs setup";
    statusBadge.className = "status " + (data.status === "ok" ? "ok" : "bad");
  } catch {
    statusBadge.textContent = "Server not running";
    statusBadge.className = "status bad";
  }
}
async function search() {
  const q = input.value.trim();
  if (q.length < 2) { showError("Enter at least two characters."); return; }
  const mode = provider.value;
  addHistory(q, mode);
  results.innerHTML = '<div class="loading">Searching…</div>';
  try {
    if (mode === "discord") {
      const match = q.match(/(?:https?:\/\/)?(?:www\.)?(?:discord\.gg|discord\.com\/invite)\/([A-Za-z0-9-]+)/i);
      if (!match) { showError("For Discord invite validation, enter a discord.gg/code or discord.com/invite/code link."); return; }
      const response = await fetch("/api/discord/invite/" + encodeURIComponent(match[1]));
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not validate invite.");
      render([{ name: data.guildName || "Discord community invite", description: data.description || "Invite metadata returned by Discord's public endpoint.", url: "https://discord.gg/" + encodeURIComponent(match[1]) }], "Discord invite");
      return;
    }
    const endpoint = mode === "github" ? "/api/github/search?q=" : "/api/google/search?q=";
    const response = await fetch(endpoint + encodeURIComponent(q));
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Search request failed.");
    render(data.items || [], mode === "github" ? "GitHub" : "Google");
  } catch (error) { showError(error.message || "Something went wrong. Please try again."); }
}
form.addEventListener("submit", event => { event.preventDefault(); search(); });
document.querySelectorAll("[data-query]").forEach(button => button.addEventListener("click", () => {
  input.value = button.dataset.query; provider.value = "github"; search();
}));
results.addEventListener("click", event => {
  const button = event.target.closest("[data-save-url]");
  if (button) saveItem({ name: button.dataset.saveName, description: button.dataset.saveDescription, url: button.dataset.saveUrl }, button.dataset.saveKind);
});
document.querySelector("#saved-results").addEventListener("click", event => {
  const button = event.target.closest("[data-remove-saved]");
  if (button) { writeStore(STORAGE.saved, readStore(STORAGE.saved).filter(item => item.url !== button.dataset.removeSaved)); renderSaved(); renderResultsButtons(); }
});
document.querySelector("#search-history").addEventListener("click", event => {
  const button = event.target.closest("[data-repeat-query]");
  if (button) { input.value = button.dataset.repeatQuery; provider.value = button.dataset.repeatMode; search(); }
});
document.querySelector("#clear-history").addEventListener("click", () => {
  writeStore(STORAGE.history, []); renderHistory();
});
document.querySelector("#export-saved").addEventListener("click", () => {
  const saved = readStore(STORAGE.saved);
  if (!saved.length) { alert("There are no saved results to export yet."); return; }
  const blob = new Blob([JSON.stringify(saved, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url; link.download = "discordhub-saved-results.json"; link.click();
  URL.revokeObjectURL(url);
});
renderSaved();
renderHistory();
checkHealth();
