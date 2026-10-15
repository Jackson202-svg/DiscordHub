# Server Operations

## Local development
```bash
npm test
npm run check:env
npm start
```

The server defaults to `127.0.0.1:3000`. Configure `HOST` and `PORT` through environment variables when needed.

## Deployment checklist
- [ ] Use a supported Node.js LTS release (20+ per package metadata).
- [ ] Configure credentials in the hosting provider's secret manager.
- [ ] Serve behind HTTPS with a trusted reverse proxy.
- [ ] Add IP-aware rate limiting and request logging with secret redaction.
- [ ] Set provider quotas and alerts.
- [ ] Monitor API latency, failures, and rate-limit responses.
- [ ] Confirm static hosting is not being used for the Node API.
- [ ] Keep PHP admin deployment separate unless the host supports both runtimes.

## Current limitations
The server uses in-process routing and has no persistent rate limiter, user accounts, database connection, or metrics backend yet. Do not treat the current starter as production-ready for high traffic.
