import { fetchJson } from "../integrations/http.js";
import { config } from "../server/config.js";
export async function searchGoogle(query) {
  if (!config.googleKey || !config.googleEngineId) { const error=new Error("Google Search is not configured."); error.statusCode=503; error.publicMessage="Google Search needs GOOGLE_SEARCH_API_KEY and GOOGLE_SEARCH_ENGINE_ID configured on the server."; throw error; }
  const url=new URL("https://www.googleapis.com/customsearch/v1");url.searchParams.set("key",config.googleKey);url.searchParams.set("cx",config.googleEngineId);url.searchParams.set("q",query);url.searchParams.set("num","10");
  const data=await fetchJson(url,{timeoutMs:config.requestTimeoutMs});
  return {provider:"google",items:(data.items||[]).map(item=>({name:item.title||item.link,description:item.snippet||"",url:item.link}))};
}
