import { config } from "../server/config.js";

const checks = [
  { name: "Server host", ok: Boolean(config.host), required: true },
  { name: "Server port", ok: Number.isInteger(config.port) && config.port > 0, required: true },
  { name: "Request timeout", ok: config.requestTimeoutMs >= 250, required: true },
  { name: "API rate limiting", ok: config.rateLimitMax > 0 && config.rateLimitWindowMs > 0, required: true },
  { name: "GitHub token", ok: Boolean(config.githubToken), required: false, note: "Optional; public repository search has lower unauthenticated limits." },
  { name: "Google Custom Search", ok: Boolean(config.googleKey && config.googleEngineId), required: false, note: "Optional; configure both Google variables to enable Google search." }
];

let failures = 0;
for (const check of checks) {
  const state = check.ok ? "OK" : check.required ? "MISSING/INVALID" : "OPTIONAL";
  console.log(`[${state}] ${check.name}`);
  if (!check.ok && check.note) console.log(`  ${check.note}`);
  if (!check.ok && check.required) failures++;
}
if (failures) {
  console.error(`\n${failures} required configuration check(s) failed.`);
  process.exitCode = 1;
} else {
  console.log("\nRequired configuration looks valid.");
}
