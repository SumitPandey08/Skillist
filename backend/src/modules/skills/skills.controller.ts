import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma';
import { nanoid } from 'nanoid';

export const listSkills = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(skills);
  } catch (error) {
    next(error);
  }
};

export const createSkill = async (req: Request, res: Response, next: NextFunction) => {
  const { name, category } = req.body;
  try {
    const skill = await prisma.skill.create({
      data: {
        id: nanoid(),
        name,
        category
      }
    });
    res.status(201).json(skill);
  } catch (error) {
    next(error);
  }
};
