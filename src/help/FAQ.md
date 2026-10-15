# DiscordHub FAQ

## Can I search every Discord server?
No. Discord does not provide a general public API for searching every server. The current Discord feature checks a specific invite link that you provide.

## Why does Google Search say it is not configured?
Configure both `GOOGLE_SEARCH_API_KEY` and `GOOGLE_SEARCH_ENGINE_ID` on the server. Never place these values in browser JavaScript.

## Does GitHub search need a token?
Public repository search can work without a token, but authenticated requests generally have higher rate limits. Configure `GITHUB_TOKEN` only on the server.

## Does the app save my searches?
Not currently. A PostgreSQL schema starter is included, but the app does not connect to a database or persist search history.

## Where is the admin dashboard?
The PHP dashboard is in `webapp/`. It runs separately from the Node app and requires PHP plus a configured `ADMIN_PASSWORD_HASH`.

## Is this ready for public production?
Not yet. Add server-side rate limiting, production hosting configuration, monitoring, and reviewed authentication/authorization before public launch.
