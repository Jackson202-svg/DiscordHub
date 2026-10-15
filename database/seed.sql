-- Optional local development examples. Review before running.
-- This file intentionally contains no real users, credentials, or invite tokens.
INSERT INTO saved_items (user_id, provider, title, url, description)
VALUES
  ('local-demo', 'github', 'Example open-source project', 'https://github.com/topics/open-source', 'Example bookmark for local UI development')
ON CONFLICT DO NOTHING;
