# Local setup

## Requirements
- Node.js 20 or newer
- npm
- Optional PHP 8.1+ to run the separate admin console

## Start the discovery app
1. Clone the repository and enter the project folder.
2. Copy `.env.example` to `.env` if you need to configure provider credentials.
3. Run `npm test`.
4. Run `npm start`.
5. Open `http://127.0.0.1:3000`.

GitHub public search works without a token at a lower rate limit. Google search requires a Google Custom Search API key and search engine ID. Discord lookup validates a supplied invite code; it does not search every Discord server.

## Run the PHP admin console separately
From the repository root, run `php -S 127.0.0.1:8080 -t webapp` and open `http://127.0.0.1:8080`. Configure `ADMIN_PASSWORD_HASH` on the PHP server before sign-in can work.

The PHP built-in server is for local development only. Do not expose it directly to the public internet.
