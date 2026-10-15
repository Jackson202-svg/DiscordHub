const names = ["PORT","HOST","GITHUB_TOKEN","GOOGLE_SEARCH_API_KEY","GOOGLE_SEARCH_ENGINE_ID","DISCORD_BOT_TOKEN","DISCORD_CLIENT_ID","DATABASE_URL","ADMIN_PASSWORD_HASH"];
for (const name of names) {
  const configured = Boolean(process.env[name]);
  console.log(name + ": " + (configured ? "configured" : "not configured"));
}
if (process.env.GOOGLE_SEARCH_API_KEY && !process.env.GOOGLE_SEARCH_ENGINE_ID) {
  console.warn("Google Search also requires GOOGLE_SEARCH_ENGINE_ID.");
}
if (!process.env.GITHUB_TOKEN) {
  console.log("Note: public GitHub search can work without a token, but rate limits are lower.");
}
