# DiscordHub

DiscordHub is a community discovery app for GitHub repositories, optional Google Custom Search, Discord invite lookup, account-based favorites, admin metrics, and optional AI summaries.

## Current features in source
- Responsive discovery UI and public search API routes
- GitHub repository search, optional Google Custom Search, Discord invite lookup
- PostgreSQL adapter and migration for users, sessions, favorites, and audit events
- Account registration/login, scrypt password hashing, server-side session cookies, CSRF checks
- Account favorites API and browser interface
- One-time admin bootstrap plus admin-only overview API
- Optional OpenAI-compatible AI summary API and browser form
- In-process API rate limiting, security headers, automated unit tests, GitHub Actions CI

## Quick start
Requires Node.js 20+. For database features, also requires PostgreSQL.

```bash
npm install
cp .env.example .env
```

Set `DATABASE_URL` in `.env`, then apply the migrations in order:

```bash
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f database/migrations/001_initial_schema.sql
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f database/migrations/002_platform.sql
```

Run checks and start the app:

```bash
npm run check:env
npm run check:syntax
npm test
npm start
```

Open http://127.0.0.1:3000. Search APIs can work without a database, but accounts and server-synced favorites require PostgreSQL.

## Admin bootstrap
Register the intended account through the UI. Temporarily configure a long random `ADMIN_BOOTSTRAP_TOKEN` on the server and send `POST /api/admin/bootstrap` with `Authorization: Bearer <token>` and JSON `{"email":"existing-user@example.com"}`. This only works if no admin exists. Remove the bootstrap token immediately after success.

## Optional AI summaries
Configure `AI_API_URL`, `AI_API_KEY`, and `AI_MODEL` for a trusted OpenAI-compatible chat-completions provider. Never put API keys in browser code. The AI summary feature requires an authenticated account and CSRF token.

## API routes
- `GET /api/health`
- `GET /api/github/search?q=...`
- `GET /api/google/search?q=...`
- `GET /api/discord/invite/:code`
- `POST /api/auth/register`, `POST /api/auth/login`
- `GET /api/auth/me`, `POST /api/auth/logout`
- `GET /api/favorites`, `POST /api/favorites`, `DELETE /api/favorites/:id`
- `POST /api/admin/bootstrap`, `GET /api/admin/overview`
- `POST /api/ai/summarize`

## Important limitations
This is an advanced starter, not a fully audited production service. Email verification, password reset, MFA, OAuth, account recovery, distributed rate limiting, automated database migrations, admin UI management tools, and end-to-end tests are not implemented. The PHP dashboard remains separate from the Node admin API. Configure HTTPS, database backups, host-level rate limits, and monitoring before public production use.
