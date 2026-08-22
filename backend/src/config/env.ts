import dotenv from 'dotenv';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';

dotenv.config();

// Fallback for Clerk Keyless mode in development
const searchPaths = [
  path.join(process.cwd(), '../skillist/.clerk/.tmp/keyless.json'),
  path.join(process.cwd(), 'skillist/.clerk/.tmp/keyless.json'),
  path.join(__dirname, '../../../../skillist/.clerk/.tmp/keyless.json'),
  path.join(__dirname, '../../../skillist/.clerk/.tmp/keyless.json'),
];

const keylessPath = searchPaths.find(p => fs.existsSync(p));

if (process.env.NODE_ENV !== 'production' && keylessPath) {
  try {
    const keylessData = JSON.parse(fs.readFileSync(keylessPath, 'utf-8'));
    if (keylessData.publishableKey && !process.env.CLERK_PUBLISHABLE_KEY) {
      process.env.CLERK_PUBLISHABLE_KEY = keylessData.publishableKey;
      console.log(`🗝️ Loaded CLERK_PUBLISHABLE_KEY from ${keylessPath}`);
    }
    if (keylessData.secretKey && !process.env.CLERK_SECRET_KEY) {
      process.env.CLERK_SECRET_KEY = keylessData.secretKey;
      console.log(`🗝️ Loaded CLERK_SECRET_KEY from ${keylessPath}`);
    }
  } catch (e) {
    console.warn('⚠️ Failed to load keyless.json:', e);
  }
}

const envSchema = z.object({
  PORT: z.string().default('3001'),
  DATABASE_URL: z.string(),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  CLERK_SECRET_KEY: z.string(),
  CLERK_PUBLISHABLE_KEY: z.string(),
  GEMINI_API_KEY: z.string(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  ALLOWED_ORIGINS: z.string().default('http://localhost:3000'),
  RENDER_EXTERNAL_URL: z.string().optional(),
  BACKEND_URL: z.string().optional(),
  KEEP_ALIVE_URL: z.string().optional(),
  ENABLE_KEEP_ALIVE: z.string().default('true'),
  KEEP_ALIVE_INTERVAL_MS: z.string().default('600000'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
