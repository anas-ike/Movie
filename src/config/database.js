import pg from 'pg';
import connectPgSimple from 'connect-pg-simple';
import session from 'express-session';
import { env } from './env.js';
import { logger } from '../utils/logger.js';
const { Pool } = pg;
function databaseConfig() {
  if (!env.databaseUrl) return {};
  const url = new URL(env.databaseUrl);
  const sslmode = url.searchParams.get('sslmode');
  url.searchParams.delete('sslmode');
  url.searchParams.delete('channel_binding');
  const needsSsl = sslmode === 'require' || sslmode === 'verify-ca' || sslmode === 'verify-full' || env.isProduction;
  return { connectionString: url.toString(), ssl: needsSsl ? { rejectUnauthorized: sslmode === 'verify-full' } : false };
}
export const pool = new Pool(databaseConfig());
pool.on('error', (error) => logger.error('database_pool_error', { error: error.message }));
export async function testDatabase() { const client = await pool.connect(); try { await client.query('SELECT 1'); logger.info('database_connected'); } finally { client.release(); } }
export function createSessionStore() { const PgStore = connectPgSimple(session); return new PgStore({ pool, tableName: 'user_sessions', createTableIfMissing: true }); }
