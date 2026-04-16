import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function enablePgVector() {
  const client = await pool.connect();
  try {
    console.log('Enabling pgvector extension...');
    await client.query('CREATE EXTENSION IF NOT EXISTS vector;');
    console.log('pgvector extension enabled successfully!');
  } catch (err) {
    console.error('Error enabling pgvector extension:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

enablePgVector();
