# Database Privacy and Retention Notes

The schema is a starting point and is not connected to the running app.

Before enabling persistence:
- Decide whether saved items are private, shared, or public.
- Define how `user_id` is issued and verified; never trust a browser-supplied identifier.
- Add authentication and per-user authorization to every read/write route.
- Set retention rules for search history and allow users to clear it where appropriate.
- Avoid storing invite tokens, API credentials, passwords, session cookies, or unnecessary personal data.
- Use parameterized queries and least-privilege database credentials.
- Encrypt connections in transit and restrict database network access.
- Test migrations on disposable development data before production.
- Document backups, restoration, deletion, and migration rollback.

Do not treat the schema alone as a secure or production-ready data system.
