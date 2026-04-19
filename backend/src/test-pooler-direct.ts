import { Client } from 'pg';

const connectionString = 'postgresql://postgres:4IjcMCzKDKSZz5z0@db.kanwsfloxjkbmlsiuslh.supabase.co:6543/postgres?pgbouncer=true';

async function test() {
  console.log('Testing connection to:', connectionString.replace(/:[^:@]+@/, ':***@'));
  const client = new Client({ connectionString, connectionTimeoutMillis: 5000 });
  try {
    await client.connect();
    console.log('✅ Success!');
    const res = await client.query('SELECT NOW()');
    console.log('Result:', res.rows[0]);
    await client.end();
  } catch (err: any) {
    console.log(`❌ Failed: ${err.message}`);
  }
}

test();
