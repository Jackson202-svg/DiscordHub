# Admin security checklist

Before exposing any admin feature publicly:

- Require authentication on every admin route and API endpoint.
- Check authorization server-side for every operation; hiding UI links is not authorization.
- Keep secrets in deployment environment variables or a secret manager.
- Enforce HTTPS and configure secure session cookies.
- Add IP- or proxy-level login and API rate limits.
- Add audit logs for administrative changes without logging secrets.
- Protect state-changing forms against CSRF.
- Validate all inputs and escape output.
- Review backups, account recovery, and incident response.
- Test access control with unauthenticated and unauthorized requests.

The starter PHP dashboard is a foundation only; these checks do not mean a production security review has been completed.
