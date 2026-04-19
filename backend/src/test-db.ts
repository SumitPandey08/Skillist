import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL;
console.log('Testing connection to:', connectionString?.replace(/:[^:@]+@/, ':***@'));

const pool = new Pool({
  connectionString,
  connectionTimeoutMillis: 5000,
});

async function test() {
  try {
    const start = Date.now();
    const client = await pool.connect();
    console.log('✅ Successfully connected in', Date.now() - start, 'ms');
    const res = await client.query('SELECT NOW()');
    console.log('Time from DB:', res.rows[0]);
    client.release();
  } catch (err: any) {
    console.error('❌ Connection failed:');
    console.error('Error name:', err.name);
    console.error('Error message:', err.message);
    console.error('Error code:', err.code);
    if (err.stack) console.error('Stack:', err.stack);
  } finally {
    await pool.end();
  }
}

test();
