# GitHub Repository Search

The adapter calls GitHub's public repository search API and returns normalized repository metadata.

## Current fields
- Repository full name
- Description
- Repository URL
- Primary language
- Star count
- Last updated date

## Operational notes
- Public search can work without a token, but unauthenticated rate limits are lower.
- Set `GITHUB_TOKEN` only in the server environment for authenticated API requests.
- Never send the token to the browser or print it in logs.
- Respect GitHub API rate-limit responses and back off before retrying.
- Treat descriptions and README content as untrusted user-generated text.
- Link users to the original repository; do not imply DiscordHub owns or verifies the project.
