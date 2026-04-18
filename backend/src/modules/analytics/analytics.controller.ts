import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from './analytics.service';

export const getActivity = async (req: any, res: Response, next: NextFunction) => {
  const userId = req.auth.userId;
  try {
    const activity = await AnalyticsService.getUserActivity(userId);
    res.json(activity);
  } catch (error) {
    next(error);
  }
};

export const getStats = async (req: any, res: Response, next: NextFunction) => {
  const userId = req.auth.userId;
  try {
    const stats = await AnalyticsService.getDashboardStats(userId);
    res.json(stats);
  } catch (error) {
    next(error);
  }
};
