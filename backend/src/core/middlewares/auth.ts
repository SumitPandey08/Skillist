import { Request, Response, NextFunction } from 'express';
import { ClerkExpressWithAuth, Clerk } from '@clerk/clerk-sdk-node';
import { prisma } from '../../lib/prisma';
import { env } from '../../config/env';

// Initialize Clerk with secret key
Clerk({ secretKey: env.CLERK_SECRET_KEY });

// Base Clerk middleware instance
const clerkAuth = ClerkExpressWithAuth();

export const requireAuth = (req: any, res: any, next: NextFunction) => {
  clerkAuth(req, res, (err?: any) => {
    if (err) {
      console.error('Clerk auth middleware error:', err);
      return next(err);
    }

    if (!req.auth?.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    next();
  });
};

export const withAuth = clerkAuth;

import fs from 'fs';
import path from 'path';
export const requireStudent = [
  requireAuth,
  async (req: any, res: any, next: NextFunction) => {
    try {
      fs.appendFileSync(path.join(process.cwd(), 'auth_debug.log'), JSON.stringify({
         url: req.url,
         auth: req.auth,
         authHeader: req.headers.authorization
      }) + '\n');
    } catch (e) {
      // Ignore log errors
    }
    console.log("requireStudent auth debug - userId:", req.auth?.userId);
    const userId = req.auth?.userId;
    if (!userId) {
      console.log("No userId found in req.auth, returning 401. Auth object:", req.auth);
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      console.log("requireStudent - fetching user from DB...");
      const user = await prisma.user.findUnique({ where: { id: userId } });
      console.log("requireStudent - user fetched:", user?.id, "role:", user?.role);
      if (user?.role !== 'student') {
        console.log(`Forbidden: User role is ${user?.role}, expected student`);
        return res.status(403).json({ error: 'Forbidden: Student access only' });
      }
      next();
    } catch (dbError: any) {
      console.error("requireStudent DB error:", dbError.message);
      next(dbError);
    }
  }
];

export const requireCompany = [
  requireAuth,
  async (req: any, res: any, next: NextFunction) => {
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.role !== 'company') {
      return res.status(403).json({ error: 'Forbidden: Company access only' });
    }
    next();
  }
];
