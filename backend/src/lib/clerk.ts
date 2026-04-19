import { createClerkClient } from '@clerk/clerk-sdk-node';
import { env } from '../config/env';

export const clerkClient = createClerkClient({
  secretKey: env.CLERK_SECRET_KEY,
  publishableKey: env.CLERK_PUBLISHABLE_KEY,
});
