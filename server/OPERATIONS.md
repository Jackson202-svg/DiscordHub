# Server Operations

## Local development
```bash
npm test
npm run check:env
npm run doctor
npm start
```

The server defaults to `127.0.0.1:3000`. Configure `HOST` and `PORT` through environment variables or a local `.env` file. Existing process environment variables take precedence over `.env`.

## API rate limiting

The API uses an in-memory per-socket-peer request counter. Configure:
- `RATE_LIMIT_WINDOW_MS`: window length in milliseconds (default 60000)
- `RATE_LIMIT_MAX`: requests allowed per peer per window (default 60)

Rate-limited responses return HTTP 429, `Retry-After`, and `X-RateLimit-*` headers. Health checks are excluded. Do not blindly trust `X-Forwarded-For`; configure proxy trust explicitly if you later deploy behind a reverse proxy.

## Deployment checklist
- [ ] Use a supported Node.js LTS release (20+ per package metadata).
- [ ] Configure credentials in the hosting provider's secret manager.
- [ ] Serve behind HTTPS with a trusted reverse proxy.
- [ ] Replace in-memory rate limiting with a shared store for multiple app instances.
- [ ] Set provider quotas and alerts.
- [ ] Monitor API latency, failures, and rate-limit responses.
- [ ] Confirm static hosting is not being used for the Node API.
- [ ] Keep PHP admin deployment separate unless the host supports both runtimes.

## Current limitations
The limiter resets on restart and is not shared across instances. The server has no persistent rate-limit store, user accounts, database connection, or metrics backend yet. Do not treat the starter as production-ready for high traffic.
