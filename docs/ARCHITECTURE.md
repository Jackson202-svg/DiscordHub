# Architecture

## Runtime flow

1. The browser loads files from `public/`.
2. Browser JavaScript calls same-origin `/api/*` endpoints.
3. `server/index.js` validates requests and routes to provider adapters.
4. Provider clients call external services through `integrations/http.js`, which applies a timeout and normalizes HTTP failures.
5. `server/config.js` loads local `.env` values (without overriding existing process environment variables) and centralizes configuration.

## Boundaries

- Keep UI code under `public/` and reusable UI helpers under `src/`.
- Keep external API adapters isolated by provider.
- Keep credentials server-side in environment variables.
- Validate input before calling providers.
- Use the API rate limiter for basic abuse protection.
- Add tests for parsing, validation, API adapters, and route behavior.

## Built-in starter components

- Environment configuration loader
- Central configuration validation
- Provider HTTP timeout helper
- In-process API rate limiter
- Static-file path containment
- Security headers
- Node's built-in test runner and GitHub Actions workflow

## Scaling and production limitations

The rate limiter stores counters in process memory, so it resets on restart and is not shared across multiple server instances. Use a trusted proxy and shared store (for example Redis) for public multi-instance deployments. Do not trust arbitrary forwarded-IP headers unless the deployment proxy is configured. The database schema is not connected to the application, and authentication for end users is not implemented.
