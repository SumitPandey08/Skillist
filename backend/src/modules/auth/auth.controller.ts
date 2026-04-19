import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma';
import slugify from 'slugify';
import { nanoid } from 'nanoid';
import { clerkClient } from '../../lib/clerk';

export const getCurrentUser = async (req: any, res: Response, next: NextFunction) => {
  const userId = req.auth?.userId;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

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
  const userId = req.auth?.userId;
  const { role, name, primarySkill, companyName, industry } = req.body;

  if (!userId) {
    console.log('Onboarding failed: No userId in req.auth. Auth:', req.auth);
    return res.status(401).json({ error: 'Unauthorized' });
  }

  console.log(`Onboarding user ${userId} with role ${role}`);
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
    console.log(`[ONBOARDING] Updating Clerk metadata for ${userId} with onboardingComplete: true`);
    const clerkUser = await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        onboardingComplete: true,
        role,
      },
    });
    console.log(`[ONBOARDING] Clerk metadata updated successfully. New metadata:`, JSON.stringify(clerkUser.publicMetadata));

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
