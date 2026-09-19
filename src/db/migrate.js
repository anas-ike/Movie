import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../config/database.js';
import { validateCriticalEnv } from '../config/env.js';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function ensureMigrationsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      filename TEXT UNIQUE NOT NULL,
      executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

async function run() {
  const { missing } = validateCriticalEnv();
  if (missing.length) throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  await ensureMigrationsTable();

  const migrationsDir = path.join(__dirname, 'migrations');
  const files = (await fs.readdir(migrationsDir))
    .filter((f) => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const exists = await pool.query(
      `SELECT 1 FROM schema_migrations WHERE filename = $1 LIMIT 1`,
      [file]
    );
    if (exists.rows[0]) continue;

    const sql = await fs.readFile(path.join(migrationsDir, file), 'utf8');
    await pool.query('BEGIN');
    try {
      await pool.query(sql);
      await pool.query(
        `INSERT INTO schema_migrations (filename) VALUES ($1)`,
        [file]
      );
      await pool.query('COMMIT');
      logger.info('migration_applied', { file });
    } catch (error) {
      await pool.query('ROLLBACK');
      throw error;
    }
  }

  await pool.end();
}

run().catch(async (error) => {
  logger.error('migration_failed', { error: error.message });
  await pool.end();
  process.exit(1);
});
