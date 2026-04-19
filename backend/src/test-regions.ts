import { Client } from 'pg';

const regions = ['ap-south-1', 'us-east-1', 'eu-west-1', 'ap-southeast-1', 'sa-east-1'];
const projectRef = 'kanwsfloxjkbmlsiuslh';
const password = '4IjcMCzKDKSZz5z0';

async function testRegions() {
  for (const region of regions) {
    const host = `aws-0-${region}.pooler.supabase.com`;
    const connectionString = `postgresql://postgres.${projectRef}:${password}@${host}:6543/postgres?pgbouncer=true`;
    console.log(`Testing region ${region}...`);
    const client = new Client({ connectionString, connectionTimeoutMillis: 3000 });
    try {
      await client.connect();
      console.log(`✅ Success with region ${region}!`);
      const res = await client.query('SELECT NOW()');
      console.log('Result:', res.rows[0]);
      await client.end();
      return region;
    } catch (err: any) {
      console.log(`❌ Failed for region ${region}: ${err.message}`);
    }
  }
}

testRegions();
