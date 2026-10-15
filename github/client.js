import { fetchJson } from "../integrations/http.js";
import { config } from "../server/config.js";
export async function searchGitHub(query) {
  const url = new URL("https://api.github.com/search/repositories");
  url.searchParams.set("q",query); url.searchParams.set("sort","stars"); url.searchParams.set("order","desc"); url.searchParams.set("per_page","12");
  const headers = { "x-github-api-version":"2022-11-28" };
  if (config.githubToken) headers.authorization = "Bearer " + config.githubToken;
  const data = await fetchJson(url,{headers,timeoutMs:config.requestTimeoutMs});
  return { provider:"github",items:(data.items||[]).map(item=>({name:item.full_name,description:item.description||"",url:item.html_url,language:item.language||"",stars:item.stargazers_count||0,updated:item.updated_at?item.updated_at.slice(0,10):""})) };
}
