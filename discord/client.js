import { fetchJson } from "../integrations/http.js";
import { config } from "../server/config.js";
export async function getDiscordInvite(code) {
  const data=await fetchJson("https://discord.com/api/v10/invites/"+encodeURIComponent(code)+"?with_counts=true&with_expiration=true",{timeoutMs:config.requestTimeoutMs});
  return {code,guildName:data.guild?.name||"Discord community",description:data.guild?.description||"",memberCount:data.approximate_member_count??null,onlineCount:data.approximate_presence_count??null,expiresAt:data.expires_at??null,inviteUrl:"https://discord.gg/"+code};
}
