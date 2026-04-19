import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL;
console.log('Testing Prisma connection to:', connectionString?.replace(/:[^:@]+@/, ':***@'));

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function test() {
  try {
    const start = Date.now();
    console.log('Connecting to Prisma...');
    const result = await prisma.user.findFirst();
    console.log('✅ Successfully connected Prisma in', Date.now() - start, 'ms');
    console.log('Result:', result);
  } catch (err: any) {
    console.error('❌ Prisma Connection failed:');
    console.error('Error message:', err.message);
    if (err.stack) console.error('Stack:', err.stack);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

test();
