# DiscordHub

DiscordHub is a community-discovery starter that brings public GitHub repository search, Google Custom Search (when configured), and Discord invite lookup into one responsive web app.

> This is an extensible starter project, not a finished production service. Saved results and search history are stored only in the browser; server-side database persistence, user accounts, AI features, and a full Discord server search are not implemented yet.

## What works now

- Responsive browser UI in `public/`
- Node.js HTTP server and JSON API in `server/`
- GitHub public repository search via the official GitHub API
- Optional Google Custom Search JSON API adapter
- Discord invite lookup for a supplied invite code
- Input validation, provider request timeouts, safe DOM text rendering, basic security headers, and configurable in-memory API rate limiting
- Browser-local saved results, recent search history, and JSON export
- Automated validation tests with Node's built-in test runner
- Separate PHP admin starter dashboard in `webapp/`

## Project structure

```text
DiscordHub/
├── public/                 # Browser UI, CSS, and client JavaScript
├── server/                 # Node HTTP server and environment configuration
├── src/utils/              # Input validation helpers
├── github/                 # GitHub repository search adapter
├── google/                 # Google Custom Search adapter
├── discord/                # Discord invite lookup adapter
├── integrations/           # Shared HTTP client helper
├── database/               # Initial PostgreSQL schema (not wired up yet)
├── webapp/                 # Separate PHP admin console
├── admin/                  # Future Node-side admin services
├── ai/                     # Future optional AI features
├── tests/                  # Automated tests
├── docs/                   # Architecture and setup documentation
├── scripts/                # Developer utilities
├── .github/workflows/      # CI test workflow
├── .env.example            # Safe environment template
├── package.json
└── setup-discordhub.js     # Non-destructive scaffold generator
```

## Requirements

- Node.js 20 or newer
- npm
- Optional Google Custom Search credentials
- Optional GitHub token for higher API rate limits
- Optional PHP 8.1+ to run the separate admin console

## Quick start

1. Clone the repository and enter the project directory:

   ```bash
   git clone https://github.com/Jackson202-svg/DiscordHub.git
   cd DiscordHub
   ```

2. Copy the environment template:

   macOS/Linux:
   ```bash
   cp .env.example .env
   ```

   Windows PowerShell:
   ```powershell
   Copy-Item .env.example .env
   ```

3. Start the app:

   ```bash
   npm start
   ```

4. Open http://127.0.0.1:3000.

5. Run the test suite:

   ```bash
   npm test
   ```

The app uses Node built-in modules, so no third-party npm dependencies are required by the current starter. A small `.env` loader reads local configuration without overriding environment variables already set by the host.

## Search providers

- **GitHub:** public repository search works without a token, subject to unauthenticated API rate limits. Configure `GITHUB_TOKEN` on the server for authenticated requests.
- **Google:** configure `GOOGLE_SEARCH_API_KEY` and `GOOGLE_SEARCH_ENGINE_ID`. The integration uses Google Custom Search JSON API; a regular search webpage is not a general-purpose API.
- **Discord:** paste a specific `discord.gg/code` or `discord.com/invite/code` link. This calls Discord's public invite endpoint. It does not search every Discord server.

All API credentials must stay on the server. Never put real tokens in browser JavaScript or commit a real `.env` file.

## PHP admin console

The admin console is separate from the Node app and requires a PHP-capable server. From the repository root:

```bash
php -S 127.0.0.1:8080 -t webapp
```

Open http://127.0.0.1:8080. Configure a valid `ADMIN_PASSWORD_HASH` environment variable on the PHP server before sign-in can work. See [webapp/README.md](webapp/README.md).

GitHub Pages and other static-only hosts cannot execute PHP or run this Node API server.

## API routes

- `GET /api/health` — service status and provider configuration indicators
- `GET /api/github/search?q=...` — public GitHub repository search
- `GET /api/google/search?q=...` — Google Custom Search (requires credentials)
- `GET /api/discord/invite/:code` — lookup a specific Discord invite

## Security and production readiness

The starter includes basic in-memory rate limiting, but it resets on restart and is not shared between server instances. Before public deployment, add a shared rate-limit store, structured logging, production hosting configuration, a reviewed origin policy, automated dependency/security checks, and a reviewed authentication/authorization model before adding private user data or administrative API routes. The database schema is only a starting point; persistence is not yet connected to the app.

## License

No license has been selected. Until a license is added, do not assume others have permission to reuse this project's code.
