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
  const { role, name, primarySkill, currentGrade, intent, companyName, industry } = req.body;

  if (!userId) {
    console.log('Onboarding failed: No userId in req.auth. Auth:', req.auth);
    return res.status(401).json({ error: 'Unauthorized' });
  }

  console.log(`Onboarding user ${userId} with role ${role}`);
  try {
    // 1. Fetch user from Clerk to get the real email
    const clerkUser = await clerkClient.users.getUser(userId);
    const email = clerkUser.emailAddresses[0]?.emailAddress || '';

    console.log(`[ONBOARDING] Fetched email from Clerk: ${email}`);

    // 2. Upsert the User record
    console.log(`[ONBOARDING] Upserting user record in DB for ${userId} with role ${role}`);
    
    // Direct update first to ensure role is set if user exists
    await prisma.user.update({
      where: { id: userId },
      data: { role, email }
    }).catch(() => {
      console.log(`[ONBOARDING] User ${userId} not found for direct update, will be created by upsert.`);
    });

    const updatedUser = await prisma.user.upsert({
      where: { id: userId },
      update: { role, email },
      create: { 
        id: userId, 
        email, 
        role 
      },
    });
    console.log(`[ONBOARDING] User record upserted successfully. ID: ${updatedUser.id}, Role in DB: ${updatedUser.role}`);

    if (role === 'student') {
      const slug = slugify(`${name}-${nanoid(4)}`, { lower: true });
      await prisma.student.upsert({
        where: { id: userId },
        update: { name, slug, primarySkill, currentGrade, intent },
        create: { id: userId, name, slug, primarySkill, currentGrade, intent },
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
    const updatedClerkUser = await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        onboardingComplete: true,
        role,
      },
    });
    console.log(`[ONBOARDING] Clerk metadata updated successfully. New metadata:`, JSON.stringify(updatedClerkUser.publicMetadata));

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
