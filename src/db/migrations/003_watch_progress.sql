CREATE TABLE IF NOT EXISTS watch_progress (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tmdb_id BIGINT NOT NULL,
  media_type VARCHAR(10) NOT NULL CHECK (media_type IN ('movie', 'tv')),
  season INTEGER,
  episode INTEGER,
  progress_seconds NUMERIC NOT NULL DEFAULT 0,
  duration_seconds NUMERIC NOT NULL DEFAULT 0,
  progress_percent NUMERIC NOT NULL DEFAULT 0,
  provider VARCHAR(50),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE NULLS NOT DISTINCT (user_id, tmdb_id, media_type, season, episode)
);

CREATE INDEX IF NOT EXISTS idx_watch_progress_user_updated ON watch_progress(user_id, updated_at DESC);
