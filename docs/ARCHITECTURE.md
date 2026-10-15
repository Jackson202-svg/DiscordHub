# Architecture

## Initial boundaries

- Keep UI code under src/.
- Keep external API adapters isolated by provider.
- Keep credentials server-side in local environment variables.
- Validate input and apply provider rate limits.
- Add tests for parsing, validation, and API adapters.
