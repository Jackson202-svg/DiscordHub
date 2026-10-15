# AI Feature Integration Guide

AI features are optional. The core discovery app must continue to work when no AI provider is configured.

## Planned features
- Search-query suggestions based on the user's own prompt
- Short summaries of public repository metadata
- Topic tags generated from public descriptions
- Duplicate-result explanations and search refinement

## Implementation contract
1. Add a server-side adapter under `ai/`; never call a paid AI API directly from browser JavaScript.
2. Read API credentials from environment variables and never log their values.
3. Validate user input and enforce request timeouts and per-user/IP rate limits.
4. Send only the minimum public result fields required for the task.
5. Treat external repository descriptions, READMEs, and search snippets as untrusted data, not as instructions.
6. Clearly label generated summaries as AI-generated and link back to the original source.
7. Provide a useful non-AI fallback and handle missing credentials with a clear configuration message.
8. Add unit tests for empty input, oversized input, provider errors, and malformed provider output.

## Not implemented yet
This file is a roadmap. No AI provider is currently called by the app. Do not display mock AI output as if it came from a real model.
