# Admin Area Roadmap

The PHP dashboard in `webapp/` is a separate starter console. It is not currently connected to the Node API or database.

## Planned modules
- [ ] Server health and version status
- [ ] Integration configuration status (never reveal secret values)
- [ ] Read-only API request metrics
- [ ] Audit events for administrative actions
- [ ] Role-based permissions for future admin accounts
- [ ] Explicit confirmation for destructive actions
- [ ] Exportable, redacted diagnostic report

## Access-control rules
- Require authentication on every private admin endpoint, not just the dashboard page.
- Deny by default; authorize each action server-side.
- Do not trust role names, user IDs, or permissions supplied by the browser.
- Never expose API tokens, password hashes, session identifiers, or database URLs.
- Add host-level rate limiting and HTTPS before public deployment.
- Record security-relevant events without recording passwords or tokens.

## Current limitations
The dashboard is a single-user password-hash starter. Its failed-login counter is session-scoped, not a substitute for IP-based rate limiting. There is no user-management system or audit log yet.
