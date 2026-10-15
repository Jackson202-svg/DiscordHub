# Advanced platform setup

1. Run `npm install`.
2. Copy `.env.example` to `.env` and configure PostgreSQL `DATABASE_URL`.
3. Apply migrations in order:
   ```bash
   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f database/migrations/001_initial_schema.sql
   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f database/migrations/002_platform.sql
   ```
4. Run `npm run check:env`, `npm run check:syntax`, `npm test`, and `npm start`.
5. Register a user using `POST /api/auth/register`. Set a temporary random `ADMIN_BOOTSTRAP_TOKEN`, call `POST /api/admin/bootstrap` with a Bearer token and JSON `{"email":"existing-user@example.com"}`, then remove the token.
6. Optional AI: set `AI_API_URL`, `AI_API_KEY`, and `AI_MODEL` for an OpenAI-compatible chat-completions endpoint.

Routes: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout`, `GET/POST /api/favorites`, `DELETE /api/favorites/:id`, `POST /api/admin/bootstrap`, `GET /api/admin/overview`, `POST /api/ai/summarize`. Authenticated mutations require the session cookie and `X-CSRF-Token`.
