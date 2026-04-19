import { Client } from 'pg';

const projectRef = 'kanwsfloxjkbmlsiuslh';
const password = '4IjcMCzKDKSZz5z0';
const region = 'ap-south-1'; // I suspect this region based on IP prefix
const host = `aws-0-${region}.pooler.supabase.com`;

async function testPooler() {
  const connectionString = `postgresql://postgres.${projectRef}:${password}@${host}:6543/postgres?pgbouncer=true`;
  console.log(`Testing pooler connection:`, connectionString.replace(/:[^:@]+@/, ':***@'));
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

testPooler();
