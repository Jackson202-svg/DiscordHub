function intFromEnv(value, fallback) { const parsed=Number.parseInt(value??"",10); return Number.isInteger(parsed)&&parsed>0?parsed:fallback; }
export const config = Object.freeze({
  host: process.env.HOST || "127.0.0.1",
  port: intFromEnv(process.env.PORT,3000),
  githubToken: process.env.GITHUB_TOKEN || "",
  googleKey: process.env.GOOGLE_SEARCH_API_KEY || "",
  googleEngineId: process.env.GOOGLE_SEARCH_ENGINE_ID || "",
  requestTimeoutMs: intFromEnv(process.env.REQUEST_TIMEOUT_MS,8000)
});
