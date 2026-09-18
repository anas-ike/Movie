import pg from 'pg';
import connectPgSimple from 'connect-pg-simple';
import session from 'express-session';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: env.isProduction ? { rejectUnauthorized: false } : false
});

pool.on('error', (err) => {
  logger.error('database_pool_error', { error: err.message });
});

export async function testDatabase() {
  const client = await pool.connect();
  try {
    await client.query('SELECT 1');
    logger.info('database_connected');
  } finally {
    client.release();
  }
}

export function createSessionStore() {
  const PgStore = connectPgSimple(session);
  return new PgStore({
    pool,
    tableName: 'user_sessions',
    createTableIfMissing: true
  });
}
