import { config } from "../server/config.js";
const checks=[
 {name:"Server host",ok:Boolean(config.host),required:true},
 {name:"Server port",ok:Number.isInteger(config.port)&&config.port>0,required:true},
 {name:"Request timeout",ok:config.requestTimeoutMs>=250,required:true},
 {name:"API rate limiting",ok:config.rateLimitMax>0&&config.rateLimitWindowMs>0,required:true},
 {name:"GitHub token",ok:Boolean(config.githubToken),required:false,note:"Optional; public search has lower unauthenticated limits."},
 {name:"Google Custom Search",ok:Boolean(config.googleKey&&config.googleEngineId),required:false,note:"Optional; configure both Google variables to enable Google search."},
 {name:"PostgreSQL",ok:Boolean(config.databaseUrl),required:false,note:"Required for account registration, sessions, synced favorites, and admin metrics."},
 {name:"AI provider",ok:Boolean(config.aiApiUrl&&config.aiApiKey&&config.aiModel),required:false,note:"Optional; configure AI_API_URL, AI_API_KEY, and AI_MODEL to enable summaries."}
];
let failures=0;
for(const c of checks){const state=c.ok?"OK":c.required?"MISSING/INVALID":"OPTIONAL";console.log("["+state+"] "+c.name);if(!c.ok&&c.note)console.log("  "+c.note);if(!c.ok&&c.required)failures++;}
if(failures){console.error("\n"+failures+" required configuration check(s) failed.");process.exitCode=1;}else console.log("\nRequired configuration looks valid.");
