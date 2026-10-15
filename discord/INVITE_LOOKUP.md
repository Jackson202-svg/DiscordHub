# Discord Invite Lookup

The current Discord adapter looks up a specific invite code through Discord's public invite endpoint.

## Supported behavior
- Accept a Discord invite code, not an arbitrary URL to fetch.
- Validate the code before constructing the API URL.
- Return a normalized object with guild name, description, approximate counts when available, expiry, and canonical invite URL.
- Handle invalid, expired, unavailable, and rate-limited invites without exposing provider response internals.

## Important limits
- This is not a global Discord server search.
- Invite metadata may be unavailable or incomplete.
- Do not scrape private servers or bypass Discord access controls.
- Do not store user invite history without a clear purpose and appropriate notice.
- Do not place a bot token in frontend code. The current public invite lookup does not require one.
