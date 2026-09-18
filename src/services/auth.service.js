import argon2 from 'argon2';
import { pool } from '../config/database.js';

export async function registerUser({ username, email, password }) {
  const passwordHash = await argon2.hash(password);

  const result = await pool.query(
    `
    INSERT INTO users (username, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, username, email, avatar_url, created_at
    `,
    [username, email.toLowerCase(), passwordHash]
  );

  return result.rows[0];
}

export async function findUserByEmail(email) {
  const result = await pool.query(
    `SELECT * FROM users WHERE email = $1 LIMIT 1`,
    [email.toLowerCase()]
  );
  return result.rows[0] || null;
}

export async function verifyPassword(hash, password) {
  return argon2.verify(hash, password);
}

export async function findUserById(id) {
  const result = await pool.query(
    `SELECT id, username, email, avatar_url, created_at, updated_at FROM users WHERE id = $1 LIMIT 1`,
    [id]
  );
  return result.rows[0] || null;
}
