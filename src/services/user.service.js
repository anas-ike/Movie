import { pool } from '../config/database.js';

export async function addFavorite(userId, tmdbId, mediaType) {
  const result = await pool.query(
    `
    INSERT INTO favorites (user_id, tmdb_id, media_type)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, tmdb_id, media_type) DO NOTHING
    RETURNING *
    `,
    [userId, tmdbId, mediaType]
  );
  return result.rows[0] || null;
}

export async function removeFavorite(userId, favoriteId) {
  await pool.query(`DELETE FROM favorites WHERE id = $1 AND user_id = $2`, [favoriteId, userId]);
}

export async function listFavorites(userId) {
  const result = await pool.query(
    `SELECT * FROM favorites WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
}

export async function isFavorite(userId, tmdbId, mediaType) {
  const result = await pool.query(
    `SELECT id FROM favorites WHERE user_id = $1 AND tmdb_id = $2 AND media_type = $3 LIMIT 1`,
    [userId, tmdbId, mediaType]
  );
  return !!result.rows[0];
}

export async function listHistory(userId) {
  const result = await pool.query(
    `SELECT * FROM watch_history WHERE user_id = $1 ORDER BY watched_at DESC LIMIT 100`,
    [userId]
  );
  return result.rows;
}
