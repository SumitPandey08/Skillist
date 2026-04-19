import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { env } from '../config/env';

declare global {
  var prisma: PrismaClient | undefined
}

// Prisma 7 - Using driver adapter for better compatibility with Supavisor/PgBouncer
console.log('🔌 Initializing Prisma with:', env.DATABASE_URL.replace(/:[^:@]+@/, ':***@'));

const pool = new Pool({ 
  connectionString: env.DATABASE_URL,
  max: 5, // Reduced from 20 for better stability with Supabase
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000, // Increased from 10000
});
const adapter = new PrismaPg(pool);

const prismaClientSingleton = () => new PrismaClient({ adapter })

export const prisma = global.prisma || prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}
