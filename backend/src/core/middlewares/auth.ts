import { Request, Response, NextFunction } from 'express';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import { prisma } from '../../lib/prisma';

export const requireAuth: any = ClerkExpressWithAuth();

import fs from 'fs';
import path from 'path';
export const requireStudent = [
  requireAuth,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      fs.appendFileSync(path.join(process.cwd(), 'auth_debug.log'), JSON.stringify({
         url: req.url,
         auth: req.auth,
         authHeader: req.headers.authorization
      }) + '\n');
    } catch (e) {
      // Ignore log errors
    }
    console.log("requireStudent auth debug:", req.auth, req.headers.authorization);
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.role !== 'student') {
      return res.status(403).json({ error: 'Forbidden: Student access only' });
    }
    next();
  }
];

export const requireCompany = [
  requireAuth,
  async (req: any, res: Response, next: NextFunction) => {
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.role !== 'company') {
      return res.status(403).json({ error: 'Forbidden: Company access only' });
    }
    next();
  }
];
