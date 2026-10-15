# Provider integration guide

## Shared expectations

Provider adapters should return normalized objects, validate user input before making requests, use timeouts, map provider errors to safe public messages, and never log access tokens.

## GitHub
Use the official REST API. Public repository search is available in `github/client.js`. Respect API rate limits and do not request private data without explicit authorization.

## Google
The adapter uses Google Custom Search JSON API. It requires a key and a configured search engine ID. Avoid returning API keys or raw provider error payloads to clients.

## Discord
The current adapter resolves a supplied invite code. It is not a global Discord community search engine. Use only supported endpoints and respect Discord's terms and rate limits.

## Adding a provider
1. Add a provider adapter in its own folder.
2. Use the shared HTTP helper when appropriate.
3. Normalize provider responses into a small stable schema.
4. Add validation and tests.
5. Document required environment variables in `.env.example`.
6. Ensure credentials remain server-side.
