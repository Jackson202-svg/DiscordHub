# Advanced platform status

## Implemented in source
- PostgreSQL schema/migration for accounts, sessions, favorites, and audit events.
- Optional PostgreSQL pool using `pg` and `DATABASE_URL`.
- Scrypt password hashes, server-side sessions, hashed session tokens, and CSRF validation.
- API routes for registration, login, current session, logout, favorites, one-time admin bootstrap, admin metrics, and optional AI summaries.
- Optional OpenAI-compatible AI adapter with server-side credentials, request timeouts, bounded input, and safe error messages.
- Unit tests for auth helpers and AI configuration handling; CI syntax and unit test commands.

## Requires setup
Install dependencies, configure `DATABASE_URL`, apply migrations `001_initial_schema.sql` then `002_platform.sql`, and configure AI credentials to enable summaries.

Register the intended account, temporarily set a long random `ADMIN_BOOTSTRAP_TOKEN`, call `POST /api/admin/bootstrap` with `Authorization: Bearer <token>` and the existing account email in JSON, then remove the token immediately. Bootstrap is refused if an admin already exists.

## Still planned
Email verification, password reset, MFA, OAuth, distributed rate limiting, automatic migrations, complete admin UI, AI quotas, and end-to-end tests. The PHP dashboard remains separate from the Node API. This starter is not fully audited for production use.
