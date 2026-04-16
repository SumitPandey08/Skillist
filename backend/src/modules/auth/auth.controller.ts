import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma';
import slugify from 'slugify';
import { nanoid } from 'nanoid';
import { clerkClient } from '@clerk/clerk-sdk-node';

export const getCurrentUser = async (req: any, res: Response, next: NextFunction) => {
  const { userId } = req.auth;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

export const onboarding = async (req: any, res: Response, next: NextFunction) => {
  const { userId } = req.auth;
  const { role, name, primarySkill, companyName, industry } = req.body;

  try {
    await prisma.user.upsert({
      where: { id: userId },
      update: { role },
      create: { 
        id: userId, 
        email: '', 
        role 
      },
    });

    if (role === 'student') {
      const slug = slugify(`${name}-${nanoid(4)}`, { lower: true });
      await prisma.student.upsert({
        where: { id: userId },
        update: { name, slug, primarySkill },
        create: { id: userId, name, slug, primarySkill },
      });
    } else if (role === 'company') {
      await prisma.company.upsert({
        where: { id: userId },
        update: { name, companyName, industry },
        create: { id: userId, name, companyName, industry },
      });
    }

    // Update Clerk metadata
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        onboardingComplete: true,
        role,
      },
    });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
