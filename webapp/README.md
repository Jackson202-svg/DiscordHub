# DiscordHub Admin Webapp

This folder contains the PHP admin sign-in page and responsive starter dashboard.

## Dashboard pages

- **Overview** — session status, integration configuration count, and quick links
- **Integrations** — shows whether expected server environment variables are present; it never displays secret values
- **Settings** — deployment and security reminders
- **Sign out** — ends the authenticated session

## Security features in this starter

- Admin access stays disabled unless `ADMIN_PASSWORD_HASH` is set to a valid PHP password hash on the server
- Password verification with PHP's `password_verify()`
- CSRF tokens for login and sign-out forms
- Session ID regeneration after successful login
- HttpOnly and SameSite session cookies (Secure when HTTPS is detected)
- Automatic sign-out after 30 minutes of inactivity
- Basic login-attempt throttling within the current session
- Security response headers and escaped output
- Secret-safe integration status checks

**Important:** Session-scoped throttling is not production-grade rate limiting. Add host or reverse-proxy rate limiting before public deployment.

## Requirements

- PHP 8.1+ with sessions enabled
- A PHP-capable web server
- HTTPS in production

## Configure admin access

Generate a password hash on a trusted machine:

```bash
php -r "echo password_hash('use-a-long-unique-password', PASSWORD_DEFAULT), PHP_EOL;"
```

Set the resulting hash as the server environment variable `ADMIN_PASSWORD_HASH`. Do not put the password or hash in source control. If the variable is missing or invalid, sign-in stays disabled.

## Run locally

From the repository root:

```bash
php -S 127.0.0.1:8080 -t webapp
```

Open http://127.0.0.1:8080. The PHP built-in server is for local development only; do not expose it directly to the public internet.

## Environment variables checked by the dashboard

- `ADMIN_PASSWORD_HASH` (required for login)
- `GOOGLE_SEARCH_API_KEY` and `GOOGLE_SEARCH_ENGINE_ID`
- `DISCORD_BOT_TOKEN` and `DISCORD_CLIENT_ID`
- `GITHUB_TOKEN`
- `DATABASE_URL`

The dashboard only checks whether integration variables are present. It does not validate credentials or connect to those services yet.

## Files

- `index.php` — login, session handling, routing, and dashboard markup
- `assets/admin.css` — responsive dashboard styling
- `.htaccess` — disables directory listing on Apache-compatible hosts

## Production hardening still needed

- Configure rate limiting at the web server or reverse proxy.
- Configure trusted proxy handling deliberately if TLS terminates before PHP; do not blindly trust client-supplied forwarding headers.
- Use secure session cookie settings and HTTPS.
- Add authorization checks to every future admin endpoint; protecting this page does not automatically protect other files.
- Add audit logging, backup/restore procedures, and application-specific admin permissions before adding sensitive features.
- Deploy on a PHP-capable server. Static hosting such as GitHub Pages cannot execute PHP.
