const checks = [
  ["Node.js version", Number(process.versions.node.split(".")[0]) >= 20, "Install Node.js 20 or newer."],
  ["GitHub token (optional)", Boolean(process.env.GITHUB_TOKEN), "Public search may still work with lower API limits."],
  ["Google API key and engine ID", Boolean(process.env.GOOGLE_SEARCH_API_KEY && process.env.GOOGLE_SEARCH_ENGINE_ID), "Google search will report not configured until both are set."],
  ["PHP admin password hash (optional)", Boolean(process.env.ADMIN_PASSWORD_HASH), "Configure this on the PHP host, not in a committed file."]
];
let warnings = 0;
console.log("DiscordHub environment doctor\n");
for (const [label, ok, hint] of checks) {
  const optional = label.includes("optional") || label.includes("Optional");
  console.log((ok ? "✓" : "•") + " " + label + ": " + (ok ? "ready" : "not configured"));
  if (!ok) { console.log("  " + hint); if (!optional) warnings++; }
}
console.log("\nDiagnostics complete. No credential values were printed.");
if (warnings) process.exitCode = 1;
