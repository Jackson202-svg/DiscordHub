import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

// Small .env loader keeps the starter dependency-free. Existing process variables win.
const envFile = resolve(process.cwd(), ".env");
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator < 1) continue;
    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    } else {
      value = value.replace(/\s+#.*$/, "").trim();
    }
    if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(key) && process.env[key] === undefined) process.env[key] = value;
  }
}

function intFromEnv(value, fallback, min = 1, max = Number.MAX_SAFE_INTEGER) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isInteger(parsed) && parsed >= min && parsed <= max ? parsed : fallback;
}

export const config = Object.freeze({
  host: process.env.HOST || "127.0.0.1",
  port: intFromEnv(process.env.PORT, 3000, 1, 65535),
  githubToken: process.env.GITHUB_TOKEN || "",
  googleKey: process.env.GOOGLE_SEARCH_API_KEY || "",
  googleEngineId: process.env.GOOGLE_SEARCH_ENGINE_ID || "",
  requestTimeoutMs: intFromEnv(process.env.REQUEST_TIMEOUT_MS, 8000, 250, 60000),
  rateLimitWindowMs: intFromEnv(process.env.RATE_LIMIT_WINDOW_MS, 60000, 1000, 3600000),
  rateLimitMax: intFromEnv(process.env.RATE_LIMIT_MAX, 60, 1, 10000)
});
