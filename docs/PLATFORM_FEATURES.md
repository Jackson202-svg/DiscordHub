# Advanced platform status

## Implemented in source
- PostgreSQL migration for accounts, sessions, favorites, and audit events.
- Optional PostgreSQL pool using `pg` and `DATABASE_URL`.
- Scrypt password hashes, random server-side sessions, hashed session tokens, and CSRF checks.
- Browser UI for account registration/login, account favorites, deletion, and optional AI summaries.
- API routes for registration, login, current session, logout, favorites, one-time admin bootstrap, admin metrics, and AI summaries.
- OpenAI-compatible AI adapter with server-side credentials and request timeouts.
- Auth helper tests, AI configuration test, and GitHub Actions CI for syntax/tests.

## Requires configuration
Run `npm install`, set `DATABASE_URL`, and apply migrations `001_initial_schema.sql` then `002_platform.sql`. Configure AI credentials to enable summaries.

To bootstrap the first admin, register the intended account, temporarily set a long random `ADMIN_BOOTSTRAP_TOKEN`, call `POST /api/admin/bootstrap` with a Bearer token and the existing account email, then remove the token immediately.

## Still planned
Email verification, password reset, MFA, OAuth, distributed rate limiting, automated migrations, a full admin management UI, AI usage quotas, and end-to-end tests are not implemented. The PHP dashboard remains separate from the Node API. This starter has not undergone a full production security audit.
