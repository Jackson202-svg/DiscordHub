import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
const envFile=resolve(process.cwd(),".env");
if(existsSync(envFile)){
 for(const line of readFileSync(envFile,"utf8").split(/\r?\n/)){
  const s=line.trim();if(!s||s.startsWith("#"))continue;const i=s.indexOf("=");if(i<1)continue;
  const key=s.slice(0,i).trim();let value=s.slice(i+1).trim();
  if((value.startsWith('"')&&value.endsWith('"'))||(value.startsWith("'")&&value.endsWith("'")))value=value.slice(1,-1);else value=value.replace(/\s+#.*$/,"").trim();
  if(/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)&&process.env[key]===undefined)process.env[key]=value;
 }
}
function intEnv(value,fallback,min=1,max=Number.MAX_SAFE_INTEGER){const n=Number.parseInt(value??"",10);return Number.isInteger(n)&&n>=min&&n<=max?n:fallback;}
export const config=Object.freeze({
 host:process.env.HOST||"127.0.0.1",port:intEnv(process.env.PORT,3000,1,65535),
 githubToken:process.env.GITHUB_TOKEN||"",googleKey:process.env.GOOGLE_SEARCH_API_KEY||"",googleEngineId:process.env.GOOGLE_SEARCH_ENGINE_ID||"",
 requestTimeoutMs:intEnv(process.env.REQUEST_TIMEOUT_MS,8000,250,60000),
 rateLimitWindowMs:intEnv(process.env.RATE_LIMIT_WINDOW_MS,60000,1000,3600000),rateLimitMax:intEnv(process.env.RATE_LIMIT_MAX,60,1,10000),
 databaseUrl:process.env.DATABASE_URL||"",databaseSsl:process.env.DATABASE_SSL==="true",
 adminBootstrapToken:process.env.ADMIN_BOOTSTRAP_TOKEN||"",
 aiApiUrl:process.env.AI_API_URL||"",aiApiKey:process.env.AI_API_KEY||"",aiModel:process.env.AI_MODEL||""
});
