-- DiscordHub initial relational schema (PostgreSQL-compatible).
-- Run migrations only after configuring a database and reviewing the schema.
CREATE TABLE IF NOT EXISTS saved_items (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id TEXT,
  provider TEXT NOT NULL CHECK (provider IN ('github','google','discord')),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (length(title) <= 300),
  CHECK (length(url) <= 2048)
);
CREATE INDEX IF NOT EXISTS saved_items_user_created_idx ON saved_items(user_id, created_at DESC);
CREATE TABLE IF NOT EXISTS search_history (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id TEXT,
  provider TEXT NOT NULL CHECK (provider IN ('github','google','discord')),
  query TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (length(query) BETWEEN 2 AND 120)
);
CREATE INDEX IF NOT EXISTS search_history_created_idx ON search_history(created_at DESC);
-- Before production use, decide retention, user identity, access controls, and consent.
