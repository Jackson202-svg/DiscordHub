# Provider Adapter Contract

Keep provider-specific API details behind a small normalized interface.

## Guidelines
- Accept validated input from the server route.
- Use `fetchJson` for timeout handling and shared HTTP defaults.
- Return a predictable object such as `{ provider, items }`.
- Normalize optional fields to empty strings or null; do not invent metadata.
- Throw errors with a safe `publicMessage` and an appropriate `statusCode`.
- Never return API credentials, upstream request headers, or full internal stack traces.
- Keep response sizes bounded and respect provider rate limits.
- Add tests for successful, empty, malformed, timeout, and rate-limited responses.

## Current adapters
- `github/client.js`: repository search
- `google/client.js`: Custom Search JSON API
- `discord/client.js`: invite metadata lookup
