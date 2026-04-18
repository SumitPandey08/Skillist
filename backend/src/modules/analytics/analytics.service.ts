import { prisma } from '../../lib/prisma';
import { nanoid } from 'nanoid';
import logger from '../../core/logger';

export type EventType = 
  | 'user_login' 
  | 'resume_generated' 
  | 'interview_started' 
  | 'interview_completed' 
  | 'skill_test_completed' 
  | 'career_recommendation_generated'
  | 'job_applied'
  | 'roadmap_refinement_started';

export class AnalyticsService {
  static async trackEvent(userId: string, eventType: EventType, payload?: any) {
    try {
      const event = await prisma.analyticsEvent.create({
        data: {
          id: nanoid(),
          userId,
          eventType,
          payload: payload ? JSON.stringify(payload) : null,
        }
      });
      logger.info(`Tracked event: ${eventType} for user: ${userId}`);
      return event;
    } catch (error: any) {
      logger.error(`Failed to track event ${eventType}: ${error.message}`);
    }
  }

  static async getUserActivity(userId: string, limit = 10) {
    return await prisma.analyticsEvent.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }

  static async getDashboardStats(userId: string) {
    const events = await prisma.analyticsEvent.findMany({
        where: { userId },
    });

    const stats = {
        resumesGenerated: events.filter(e => e.eventType === 'resume_generated').length,
        interviewsTaken: events.filter(e => e.eventType === 'interview_completed').length,
        skillsTested: events.filter(e => e.eventType === 'skill_test_completed').length,
        applicationsSent: events.filter(e => e.eventType === 'job_applied').length
    };

    return stats;
  }
}
