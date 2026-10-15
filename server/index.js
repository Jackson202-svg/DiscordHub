import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { searchGitHub } from "../github/client.js";
import { searchGoogle } from "../google/client.js";
import { getDiscordInvite } from "../discord/client.js";
import { validateSearchQuery, validateInviteCode } from "../src/utils/validation.js";
import { config } from "./config.js";

const root = resolve(fileURLToPath(new URL("../public/", import.meta.url)));
const types = { ".html":"text/html; charset=utf-8", ".css":"text/css; charset=utf-8", ".js":"text/javascript; charset=utf-8", ".svg":"image/svg+xml", ".png":"image/png", ".ico":"image/x-icon" };
const sendJson = (res, status, payload) => { res.writeHead(status, { "content-type":"application/json; charset=utf-8", "cache-control":"no-store", "x-content-type-options":"nosniff" }); res.end(JSON.stringify(payload)); };
const readJsonError = error => error?.statusCode === 429 ? 429 : error?.statusCode === 401 ? 503 : 502;

const server = createServer(async (req, res) => {
  const origin = req.headers.origin;
  if (origin) { res.writeHead(403, {"content-type":"application/json"}); res.end(JSON.stringify({error:"Cross-origin requests are not supported."})); return; }
  let url;
  try { url = new URL(req.url, "http://localhost"); } catch { sendJson(res,400,{error:"Invalid URL."}); return; }
  if (req.method !== "GET" && req.method !== "HEAD") { sendJson(res,405,{error:"Method not allowed."}); return; }
  if (url.pathname === "/api/health") { sendJson(res,200,{status:"ok",app:"DiscordHub",version:"0.2.0",providers:{github:true,google:Boolean(config.googleKey&&config.googleEngineId),discordInvite:true}}); return; }
  if (url.pathname.startsWith("/api/")) {
    try {
      if (url.pathname === "/api/github/search") { const q=validateSearchQuery(url.searchParams.get("q")); sendJson(res,200,await searchGitHub(q)); return; }
      if (url.pathname === "/api/google/search") { const q=validateSearchQuery(url.searchParams.get("q")); sendJson(res,200,await searchGoogle(q)); return; }
      const inviteMatch=url.pathname.match(/^\/api\/discord\/invite\/([A-Za-z0-9-]{2,64})$/);
      if (inviteMatch) { const code=validateInviteCode(inviteMatch[1]); sendJson(res,200,await getDiscordInvite(code)); return; }
      sendJson(res,404,{error:"API route not found."});
    } catch (error) { sendJson(res,readJsonError(error),{error:error?.publicMessage||"The provider request failed. Check server configuration and try again."}); }
    return;
  }
  const requested = url.pathname === "/" ? "index.html" : decodeURIComponent(url.pathname).replace(/^\/+/, "");
  const file = resolve(root, requested);
  if (file !== root && !file.startsWith(root + sep)) { sendJson(res,403,{error:"Forbidden."}); return; }
  try {
    const info = await stat(file); if (!info.isFile()) throw new Error("Not a file");
    const content = await readFile(file);
    res.writeHead(200,{"content-type":types[extname(file)]||"application/octet-stream","x-content-type-options":"nosniff","referrer-policy":"strict-origin-when-cross-origin","content-security-policy":"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'","cache-control":extname(file)===".html"?"no-cache":"public, max-age=3600"});
    res.end(req.method==="HEAD"?undefined:content);
  } catch { sendJson(res,404,{error:"File not found."}); }
});
server.listen(config.port, config.host, () => console.log("DiscordHub listening at http://"+config.host+":"+config.port));
