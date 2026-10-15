# Automated tests

Run the test suite from the repository root:

```bash
npm test
```

Tests use Node.js's built-in `node:test` runner; no test framework dependency is required.

Current coverage includes:
- Search and invite input validation
- Safe URL validation
- Formatting helpers
- Discovery state and recent-search history
- In-memory rate-limiter limits, per-client isolation, and reset behavior

Provider API tests with mocked HTTP responses and end-to-end server tests are good next additions.
