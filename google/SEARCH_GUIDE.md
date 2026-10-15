# Google Custom Search

The Google adapter uses the Custom Search JSON API. A normal Google Search webpage URL is not a substitute for API credentials.

## Required server environment
- `GOOGLE_SEARCH_API_KEY`
- `GOOGLE_SEARCH_ENGINE_ID`

When either value is missing, the API returns a configuration error instead of pretending a search succeeded.

## Troubleshooting
- Confirm the Custom Search API is enabled for the Google Cloud project.
- Confirm billing and quota settings for the project.
- Verify the search engine ID and the sites configured in that engine.
- Check quota and permission errors without exposing the API key in logs.
- Never embed the key in `public/app.js`, HTML, or a mobile client.
