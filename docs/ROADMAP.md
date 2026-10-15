# DiscordHub Roadmap

## Phase 1 — Discovery foundation
- [x] Responsive discovery page
- [x] GitHub repository search
- [x] Optional Google Custom Search
- [x] Discord invite lookup
- [x] Basic input validation and provider timeout handling
- [x] Starter PHP admin dashboard
- [ ] Saved items in the UI
- [ ] Recent search history in the UI
- [ ] Shared rate limiting and structured logs

## Phase 2 — User experience
- [ ] Provider filters and sort controls
- [ ] Pagination where supported
- [ ] Keyboard-accessible result actions
- [ ] Loading, empty, error, and offline states
- [ ] Accessible color contrast and automated accessibility checks

## Phase 3 — Persistence
- [ ] Select and configure a database provider
- [ ] Add migrations and database integration tests
- [ ] Define user identity and data retention
- [ ] Add saved-item CRUD routes with authorization
- [ ] Add backups and migration rollback procedures

## Phase 4 — Integrations
- [ ] GitHub rate-limit awareness
- [ ] Google quota diagnostics
- [ ] Optional Discord OAuth only if a clear product need exists
- [ ] AI summaries behind an optional server-side provider adapter

## Phase 5 — Production
- [ ] Authentication and authorization threat model
- [ ] IP-aware rate limiting
- [ ] Security headers reviewed for deployed domains
- [ ] CI linting, tests, dependency review, and release process
- [ ] Monitoring, incident response, and backup runbooks

Items marked incomplete are planned work, not features that already exist.
