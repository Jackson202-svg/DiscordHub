import { config } from "../server/config.js";

const checks = [
  ["Node.js version", Number(process.versions.node.split(".")[0]) >= 20, "Install Node.js 20 or newer.", true],
  ["Server port", Number.isInteger(config.port) && config.port > 0, "Choose a valid port between 1 and 65535.", true],
  ["Request timeout", config.requestTimeoutMs >= 250, "Set REQUEST_TIMEOUT_MS between 250 and 60000.", true],
  ["API rate limiting", config.rateLimitMax > 0 && config.rateLimitWindowMs > 0, "Check RATE_LIMIT_MAX and RATE_LIMIT_WINDOW_MS.", true],
  ["GitHub token", Boolean(config.githubToken), "Optional; public search has lower unauthenticated limits.", false],
  ["Google Custom Search", Boolean(config.googleKey && config.googleEngineId), "Optional; configure both Google variables to enable Google search.", false]
];

let failures = 0;
console.log("DiscordHub environment doctor\n");
for (const [name, ok, hint, required] of checks) {
  console.log(`[${ok ? "OK" : required ? "ERROR" : "OPTIONAL"}] ${name}`);
  if (!ok) {
    console.log("  " + hint);
    if (required) failures++;
  }
}
console.log("\nDiagnostics complete. Secret values were not printed.");
if (failures) process.exitCode = 1;
