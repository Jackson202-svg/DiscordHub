import { createServer } from "node:http";
import { readFile,stat } from "node:fs/promises";
import { extname,resolve,sep } from "node:path";
import { fileURLToPath } from "node:url";
import { searchGitHub } from "../github/client.js";
import { searchGoogle } from "../google/client.js";
import { getDiscordInvite } from "../discord/client.js";
import { validateSearchQuery,validateInviteCode } from "../src/utils/validation.js";
import { safeExternalUrl } from "../src/utils/url.js";
import { config } from "./config.js";
import { createRateLimiter } from "./rate-limit.js";
import { query,databaseConfigured,writeAudit } from "./database.js";
import { registerUser,loginUser,createSession,getSessionFromRequest,verifyCsrf,revokeSession,sessionCookie,clearSessionCookie,bootstrapAdmin } from "./auth.js";
import { summarizeDiscovery } from "./ai.js";
const root=resolve(fileURLToPath(new URL("../public/",import.meta.url)));
const types={".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".js":"text/javascript; charset=utf-8",".svg":"image/svg+xml",".png":"image/png",".ico":"image/x-icon",".webmanifest":"application/manifest+json; charset=utf-8",".txt":"text/plain; charset=utf-8"};
const sendJson=(res,status,payload,headers={})=>{res.writeHead(status,{"content-type":"application/json; charset=utf-8","cache-control":"no-store","x-content-type-options":"nosniff",...headers});res.end(JSON.stringify(payload));};
const statusFor=e=>Number.isInteger(e?.statusCode)&&[400,401,403,404,409,413,429,503,504].includes(e.statusCode)?e.statusCode:502;
const limiter=createRateLimiter({windowMs:config.rateLimitWindowMs,max:config.rateLimitMax});
const secure=req=>Boolean(req.socket.encrypted)||process.env.NODE_ENV==="production";
async function readJson(req){
 const chunks=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>16384)throw Object.assign(Error("Body too large"),{statusCode:413,publicMessage:"Request body is too large."});chunks.push(chunk);}
 if(!size)return {};if(String(req.headers["content-type"]||"").split(";")[0].trim().toLowerCase()!=="application/json")throw Object.assign(Error("JSON required"),{statusCode:400,publicMessage:"Send this request as application/json."});
 try{const body=JSON.parse(Buffer.concat(chunks).toString("utf8"));if(!body||typeof body!=="object"||Array.isArray(body))throw Error();return body;}catch{throw Object.assign(Error("Invalid JSON"),{statusCode:400,publicMessage:"Request body must be valid JSON."});}
}
async function sessionFor(req){const s=await getSessionFromRequest(req);if(!s)throw Object.assign(Error("Sign in required"),{statusCode:401,publicMessage:"Sign in to use this feature."});return s;}
function csrfFor(req,s){if(!verifyCsrf(req,s))throw Object.assign(Error("CSRF rejected"),{statusCode:403,publicMessage:"Your security token is missing or expired. Refresh your session and try again."});}
function adminFor(s){if(s.user.role!=="admin")throw Object.assign(Error("Admin required"),{statusCode:403,publicMessage:"Administrator access is required."});}
function favoriteFrom(b){const provider=b.provider,title=typeof b.title==="string"?b.title.trim():"",description=typeof b.description==="string"?b.description.trim():"",url=safeExternalUrl(b.url);if(!["github","google","discord"].includes(provider)||!title||title.length>300||description.length>5000||!url)throw Object.assign(Error("Invalid favorite"),{statusCode:400,publicMessage:"Provide a supported provider, title, public HTTP/HTTPS URL, and description under 5,000 characters."});return {provider,title,description,url};}
const server=createServer(async(req,res)=>{
 if(req.headers.origin){let originValue;try{originValue=new URL(req.headers.origin).origin;}catch{sendJson(res,403,{error:"Invalid request origin."});return;}const expectedOrigin=(secure(req)?"https":"http")+"://"+String(req.headers.host||"");if(originValue!==expectedOrigin){sendJson(res,403,{error:"Cross-origin requests are not supported."});return;}}
 let url;try{url=new URL(req.url,"http://localhost");}catch{sendJson(res,400,{error:"Invalid URL."});return;}
 if(url.pathname.startsWith("/api/")){
  const limit=limiter(req.socket.remoteAddress||"unknown"),headers={"x-ratelimit-limit":String(limit.limit),"x-ratelimit-remaining":String(limit.remaining),"x-ratelimit-reset":String(Math.ceil(limit.resetAt/1000))};
  if(!limit.allowed){sendJson(res,429,{error:"Too many API requests. Wait a moment and try again."},{...headers,"retry-after":String(Math.max(1,Math.ceil((limit.resetAt-Date.now())/1000)))});return;}
  try{
   if(req.method==="GET"&&url.pathname==="/api/health"){sendJson(res,200,{status:"ok",app:"DiscordHub",version:"0.3.0",features:{github:true,google:Boolean(config.googleKey&&config.googleEngineId),discordInvite:true,database:databaseConfigured(),accounts:databaseConfigured(),favorites:databaseConfigured(),ai:Boolean(config.aiApiUrl&&config.aiApiKey&&config.aiModel)}},headers);return;}
   if(req.method==="GET"&&url.pathname==="/api/github/search"){sendJson(res,200,await searchGitHub(validateSearchQuery(url.searchParams.get("q"))),headers);return;}
   if(req.method==="GET"&&url.pathname==="/api/google/search"){sendJson(res,200,await searchGoogle(validateSearchQuery(url.searchParams.get("q"))),headers);return;}
   const invite=url.pathname.match(/^\/api\/discord\/invite\/([A-Za-z0-9-]{2,64})$/);
   if(req.method==="GET"&&invite){sendJson(res,200,await getDiscordInvite(validateInviteCode(invite[1])),headers);return;}
   if(req.method==="POST"&&url.pathname==="/api/auth/register"){const b=await readJson(req),u=await registerUser(b.email,b.password),s=await createSession(u.id);sendJson(res,201,{user:u,csrfToken:s.csrfToken},{...headers,"set-cookie":sessionCookie(s.token,secure(req))});return;}
   if(req.method==="POST"&&url.pathname==="/api/auth/login"){const b=await readJson(req),u=await loginUser(b.email,b.password);if(!u){sendJson(res,401,{error:"Email or password is incorrect."},headers);return;}const s=await createSession(u.id);sendJson(res,200,{user:u,csrfToken:s.csrfToken},{...headers,"set-cookie":sessionCookie(s.token,secure(req))});return;}
   if(req.method==="GET"&&url.pathname==="/api/auth/me"){const s=await getSessionFromRequest(req);sendJson(res,200,{user:s?.user||null,csrfToken:s?.csrfToken||null},headers);return;}
   if(req.method==="POST"&&url.pathname==="/api/auth/logout"){const s=await sessionFor(req);csrfFor(req,s);await revokeSession(s.token);sendJson(res,200,{ok:true},{...headers,"set-cookie":clearSessionCookie(secure(req))});return;}
   if(req.method==="GET"&&url.pathname==="/api/favorites"){const s=await sessionFor(req),r=await query("SELECT id,provider,title,url,description,created_at FROM favorites WHERE user_id=$1 ORDER BY created_at DESC LIMIT 500",[s.user.id]);sendJson(res,200,{items:r.rows},headers);return;}
   if(req.method==="POST"&&url.pathname==="/api/favorites"){const s=await sessionFor(req);csrfFor(req,s);const item=favoriteFrom(await readJson(req));const r=await query("INSERT INTO favorites(user_id,provider,title,url,description) VALUES($1,$2,$3,$4,$5) ON CONFLICT(user_id,url) DO UPDATE SET provider=EXCLUDED.provider,title=EXCLUDED.title,description=EXCLUDED.description RETURNING id,provider,title,url,description,created_at",[s.user.id,item.provider,item.title,item.url,item.description]);await writeAudit(s.user.id,"favorite.save",{provider:item.provider});sendJson(res,201,{item:r.rows[0]},headers);return;}
   const del=url.pathname.match(/^\/api\/favorites\/([0-9]+)$/);
   if(req.method==="DELETE"&&del){const s=await sessionFor(req);csrfFor(req,s);const r=await query("DELETE FROM favorites WHERE id=$1 AND user_id=$2 RETURNING id",[del[1],s.user.id]);if(!r.rows.length){sendJson(res,404,{error:"Favorite not found."},headers);return;}await writeAudit(s.user.id,"favorite.delete",{});sendJson(res,200,{ok:true},headers);return;}
   if(req.method==="POST"&&url.pathname==="/api/ai/summarize"){const s=await sessionFor(req);csrfFor(req,s);const b=await readJson(req),result=await summarizeDiscovery({title:b.title,description:b.description,url:b.url});await writeAudit(s.user.id,"ai.summarize",{});sendJson(res,200,result,headers);return;}
   if(req.method==="POST"&&url.pathname==="/api/admin/bootstrap"){const b=await readJson(req),token=String(req.headers.authorization||"").match(/^Bearer (.+)$/)?.[1]||"",u=await bootstrapAdmin(token,b.email);if(!u){sendJson(res,403,{error:"Admin bootstrap denied. Check the token, existing account email, and whether an admin already exists."},headers);return;}sendJson(res,200,{user:u,notice:"Remove ADMIN_BOOTSTRAP_TOKEN from the server environment now."},headers);return;}
   if(req.method==="GET"&&url.pathname==="/api/admin/overview"){const s=await sessionFor(req);adminFor(s);const counts=await query("SELECT (SELECT COUNT(*) FROM users) AS users,(SELECT COUNT(*) FROM favorites) AS favorites,(SELECT COUNT(*) FROM audit_events) AS audit_events"),recent=await query("SELECT event_type,created_at FROM audit_events ORDER BY created_at DESC LIMIT 20");sendJson(res,200,{counts:counts.rows[0],recentEvents:recent.rows},headers);return;}
   sendJson(res,404,{error:"API route not found."},headers);
  }catch(e){const status=statusFor(e);if(status>=500&&status!==503)console.error("API request failed:",url.pathname,status);sendJson(res,status,{error:e?.publicMessage||"Request failed. Check server configuration and try again."},headers);}return;
 }
 if(req.method!=="GET"&&req.method!=="HEAD"){sendJson(res,405,{error:"Method not allowed."});return;}
 let requested;try{requested=url.pathname==="/"?"index.html":decodeURIComponent(url.pathname).replace(/^\/+/, "");}catch{sendJson(res,400,{error:"Invalid path."});return;}
 const file=resolve(root,requested);if(file!==root&&!file.startsWith(root+sep)){sendJson(res,403,{error:"Forbidden."});return;}
 try{const info=await stat(file);if(!info.isFile())throw Error("Not a file");const content=await readFile(file);res.writeHead(200,{"content-type":types[extname(file)]||"application/octet-stream","x-content-type-options":"nosniff","referrer-policy":"strict-origin-when-cross-origin","content-security-policy":"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'","cache-control":extname(file)===".html"?"no-cache":"public, max-age=3600"});res.end(req.method==="HEAD"?undefined:content);}catch{sendJson(res,404,{error:"File not found."});}
});
server.listen(config.port,config.host,()=>console.log("DiscordHub listening at http://"+config.host+":"+config.port));
