import { config } from "./config.js";
let poolPromise;
export function databaseConfigured(){return Boolean(config.databaseUrl);}
export async function getPool(){
 if(!config.databaseUrl)throw Object.assign(new Error("Database not configured"),{statusCode:503,publicMessage:"This feature needs DATABASE_URL configured on the server."});
 if(!poolPromise)poolPromise=import("pg").then(({Pool})=>{const p=new Pool({connectionString:config.databaseUrl,max:10,idleTimeoutMillis:30000,connectionTimeoutMillis:5000,ssl:config.databaseSsl?{rejectUnauthorized:true}:undefined});p.on("error",()=>console.error("Database pool emitted an idle client error."));return p;}).catch(e=>{poolPromise=undefined;throw e;});
 return poolPromise;
}
export async function query(sql,values=[]){return (await getPool()).query(sql,values);}
export async function writeAudit(actor,event,metadata={}){try{await query("INSERT INTO audit_events(actor_user_id,event_type,metadata) VALUES($1,$2,$3::jsonb)",[actor??null,event,JSON.stringify(metadata)]);}catch{console.error("Could not record audit event.");}}
