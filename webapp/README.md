# Admin webapp

This folder contains a PHP-based, admin-only starter page.

## Requirements

- PHP 8.1+ with sessions enabled
- HTTPS in deployment
- A server-side `ADMIN_PASSWORD_HASH` environment variable

## Configure admin access

Generate a password hash on a trusted machine with PHP:

```bash
php -r "echo password_hash('replace-with-a-long-unique-password', PASSWORD_DEFAULT), PHP_EOL;"
```

Set the resulting hash as `ADMIN_PASSWORD_HASH` in your PHP hosting environment. Do not commit real passwords, hashes, or other secrets. If the variable is unset, the page intentionally denies access.

## Run locally

From the repository root:

```bash
php -S 127.0.0.1:8080 -t webapp
```

Open http://127.0.0.1:8080. This PHP built-in server is for local development only; do not expose it directly to the public internet.

## Security notes

- Deploy only behind HTTPS.
- Add hosting-level rate limiting and monitoring before production.
- Use secure session cookie settings in the web server/PHP configuration.
- Keep the admin page on a server that executes PHP; static hosting such as GitHub Pages will not execute `index.php`.
- The signed-in page is only a placeholder; protect every future admin API route independently.
