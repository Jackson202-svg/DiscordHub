export async function fetchJson(url, { headers = {}, timeoutMs = 8000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { headers: { accept:"application/json", "user-agent":"DiscordHub/0.2.0", ...headers }, signal:controller.signal });
    if (!response.ok) {
      const error = new Error("Provider returned HTTP " + response.status);
      error.statusCode = response.status;
      error.publicMessage = response.status === 429 ? "The provider rate limit was reached. Wait a moment and retry." : response.status === 401 || response.status === 403 ? "The provider denied access. Check API credentials and permissions." : "The provider could not complete this request.";
      throw error;
    }
    return await response.json();
  } catch (error) {
    if (error.name === "AbortError") { const timeoutError=new Error("Provider request timed out"); timeoutError.publicMessage="The provider took too long to respond. Try again."; throw timeoutError; }
    throw error;
  } finally { clearTimeout(timer); }
}
