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

  static async calculateXP(userId: string) {
    const events = await prisma.analyticsEvent.findMany({
      where: { userId },
    });

    const xpConfig: Record<string, number> = {
      'user_login': 10,
      'resume_generated': 50,
      'interview_started': 20,
      'interview_completed': 100,
      'skill_test_completed': 80,
      'career_recommendation_generated': 150,
      'job_applied': 40,
      'roadmap_refinement_started': 30
    };

    let totalXP = 0;
    events.forEach(event => {
      totalXP += xpConfig[event.eventType] || 5;
    });

    return totalXP;
  }

  static async calculateStreak(userId: string) {
    const events = await prisma.analyticsEvent.findMany({
      where: { userId },
      select: { createdAt: true },
      orderBy: { createdAt: 'desc' }
    });

    if (events.length === 0) return 0;

    const uniqueDays = Array.from(new Set(
      events.map(e => e.createdAt.toISOString().split('T')[0])
    ));

    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (uniqueDays[0] !== today && uniqueDays[0] !== yesterday) {
      return 0;
    }

    for (let i = 0; i < uniqueDays.length; i++) {
      const currentDay = new Date(uniqueDays[i]);
      const nextDay = new Date(today);
      nextDay.setDate(nextDay.getDate() - i);
      
      if (uniqueDays[i] === nextDay.toISOString().split('T')[0]) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  static async getDashboardStats(userId: string) {
    const events = await prisma.analyticsEvent.findMany({
        where: { userId },
    });

    const xp = await this.calculateXP(userId);
    const streak = await this.calculateStreak(userId);

    const stats = {
        resumesGenerated: events.filter(e => e.eventType === 'resume_generated').length,
        interviewsTaken: events.filter(e => e.eventType === 'interview_completed').length,
        skillsTested: events.filter(e => e.eventType === 'skill_test_completed').length,
        applicationsSent: events.filter(e => e.eventType === 'job_applied').length,
        xp,
        streak,
        level: Math.floor(xp / 1000) + 1,
        xpToNextLevel: 1000 - (xp % 1000)
    };

    return stats;
  }
}
