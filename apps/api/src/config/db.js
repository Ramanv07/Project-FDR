import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './env.js';
import { logger } from './logger.js';

const { Pool } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const pool = new Pool({
  connectionString: config.databaseUrl,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  logger.error('[PostgreSQL] Unexpected client error', err.message);
});

export async function connectDB() {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT current_database() as db, version() as ver;');
    client.release();
    logger.info(`[PostgreSQL] Connected to database: ${res.rows[0].db}`);
  } catch (error) {
    logger.warn(`[PostgreSQL] Connection check: ${error.message} (Database will connect when PostgreSQL service starts)`);
  }
}

export async function runMigrations() {
  try {
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    await pool.query(schemaSql);
    logger.info('[PostgreSQL] Database schema applied successfully');
  } catch (error) {
    logger.error(`[PostgreSQL] Migration error: ${error.message}`);
  }
}
