import { pool } from '../config/database.js';

export async function upsertWatchProgress(userId, payload) {
  const {
    tmdbId,
    mediaType,
    season = null,
    episode = null,
    progressSeconds,
    durationSeconds,
    progressPercent,
    provider
  } = payload;

  const result = await pool.query(
    `
    INSERT INTO watch_progress (
      user_id, tmdb_id, media_type, season, episode,
      progress_seconds, duration_seconds, progress_percent, provider, updated_at
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW())
    ON CONFLICT (user_id, tmdb_id, media_type, season, episode)
    DO UPDATE SET
      progress_seconds = EXCLUDED.progress_seconds,
      duration_seconds = EXCLUDED.duration_seconds,
      progress_percent = EXCLUDED.progress_percent,
      provider = EXCLUDED.provider,
      updated_at = NOW()
    RETURNING *
    `,
    [
      userId,
      tmdbId,
      mediaType,
      season,
      episode,
      progressSeconds,
      durationSeconds,
      progressPercent,
      provider
    ]
  );

  return result.rows[0];
}

export async function getWatchProgress(userId, tmdbId, mediaType, season = null, episode = null) {
  const result = await pool.query(
    `
    SELECT *
    FROM watch_progress
    WHERE user_id = $1
      AND tmdb_id = $2
      AND media_type = $3
      AND season IS NOT DISTINCT FROM $4
      AND episode IS NOT DISTINCT FROM $5
    LIMIT 1
    `,
    [userId, tmdbId, mediaType, season, episode]
  );
  return result.rows[0] || null;
}

export async function recordHistory(userId, { tmdbId, mediaType, season = null, episode = null }) {
  const recent = await pool.query(
    `
    SELECT id
    FROM watch_history
    WHERE user_id = $1
      AND tmdb_id = $2
      AND media_type = $3
      AND season IS NOT DISTINCT FROM $4
      AND episode IS NOT DISTINCT FROM $5
      AND watched_at > NOW() - INTERVAL '6 hours'
    LIMIT 1
    `,
    [userId, tmdbId, mediaType, season, episode]
  );

  if (recent.rows[0]) {
    await pool.query(
      `UPDATE watch_history SET watched_at = NOW() WHERE id = $1`,
      [recent.rows[0].id]
    );
    return;
  }

  await pool.query(
    `
    INSERT INTO watch_history (user_id, tmdb_id, media_type, season, episode, watched_at)
    VALUES ($1,$2,$3,$4,$5,NOW())
    `,
    [userId, tmdbId, mediaType, season, episode]
  );
}

export async function getContinueWatching(userId, limit = 20) {
  const result = await pool.query(
    `
    SELECT *
    FROM watch_progress
    WHERE user_id = $1
    ORDER BY updated_at DESC
    LIMIT $2
    `,
    [userId, limit]
  );
  return result.rows;
}
