import { prisma } from "../../lib/prisma";
import { fetchGitHubStats } from "../../lib/integrations/github";
import { fetchLeetCodeStats } from "../../lib/integrations/leetcode";
import { fetchCodeforcesStats } from "../../lib/integrations/codeforces";
import { nanoid } from "nanoid";
import logger from "../../core/logger";

export class IntegrationService {
  /**
   * Sync GitHub data and extract preliminary skill markers.
   */
  static async syncGitHub(studentId: string, username: string) {
    logger.info(`Syncing GitHub for student ${studentId} (${username})`);
    const stats = await fetchGitHubStats(username);
    if (!stats) return null;

    const account = await prisma.externalAccount.upsert({
      where: { studentId_platform: { studentId, platform: 'github' } },
      update: { username, lastSynced: new Date() },
      create: { id: nanoid(), studentId, platform: 'github', username, lastSynced: new Date() }
    });

    await prisma.gitHubData.upsert({
      where: { externalAccountId: account.id },
      update: {
        reposCount: stats.publicRepos,
        followers: stats.followers,
        totalStars: stats.totalStars,
        topLanguages: JSON.stringify(stats.topLanguages),
        lastUpdated: new Date()
      },
      create: {
        id: nanoid(),
        externalAccountId: account.id,
        reposCount: stats.publicRepos,
        followers: stats.followers,
        totalStars: stats.totalStars,
        topLanguages: JSON.stringify(stats.topLanguages),
      }
    });

    // Extract skills from languages
    for (const lang of stats.topLanguages) {
      await prisma.normalizedSkill.upsert({
        where: { id: `gh-${studentId}-${lang}` }, // deterministic ID for language skills from GH
        update: { score: 70, confidence: 60, updatedAt: new Date() },
        create: {
          id: `gh-${studentId}-${lang}`,
          studentId,
          name: lang,
          category: 'technical',
          score: 70,
          confidence: 60,
          source: 'github'
        }
      });
    }

    return stats;
  }

  /**
   * Sync LeetCode data.
   */
  static async syncLeetCode(studentId: string, username: string) {
    logger.info(`Syncing LeetCode for student ${studentId} (${username})`);
    const stats = await fetchLeetCodeStats(username);
    if (!stats) return null;

    const account = await prisma.externalAccount.upsert({
      where: { studentId_platform: { studentId, platform: 'leetcode' } },
      update: { username, lastSynced: new Date() },
      create: { id: nanoid(), studentId, platform: 'leetcode', username, lastSynced: new Date() }
    });

    await prisma.leetCodeData.upsert({
      where: { externalAccountId: account.id },
      update: {
        ranking: stats.ranking,
        totalSolved: stats.totalSolved,
        easySolved: stats.easySolved,
        mediumSolved: stats.mediumSolved,
        hardSolved: stats.hardSolved,
        contestRating: stats.contestRating,
        lastUpdated: new Date()
      },
      create: {
        id: nanoid(),
        externalAccountId: account.id,
        ranking: stats.ranking,
        totalSolved: stats.totalSolved,
        easySolved: stats.easySolved,
        mediumSolved: stats.mediumSolved,
        hardSolved: stats.hardSolved,
        contestRating: stats.contestRating,
      }
    });

    // Mark DSA skill
    await prisma.normalizedSkill.upsert({
      where: { id: `lc-${studentId}-dsa` },
      update: { 
        score: Math.min(100, Math.round((stats.totalSolved / 500) * 100)), 
        confidence: 80, 
        updatedAt: new Date() 
      },
      create: {
        id: `lc-${studentId}-dsa`,
        studentId,
        name: 'Data Structures & Algorithms',
        category: 'dsa',
        score: Math.min(100, Math.round((stats.totalSolved / 500) * 100)),
        confidence: 80,
        source: 'leetcode'
      }
    });

    return stats;
  }

  /**
   * Sync Codeforces data.
   */
  static async syncCodeforces(studentId: string, username: string) {
    logger.info(`Syncing Codeforces for student ${studentId} (${username})`);
    const stats = await fetchCodeforcesStats(username);
    if (!stats) return null;

    await prisma.externalAccount.upsert({
      where: { studentId_platform: { studentId, platform: 'codeforces' } },
      update: { username, lastSynced: new Date() },
      create: { id: nanoid(), studentId, platform: 'codeforces', username, lastSynced: new Date() }
    });

    // Codeforces doesn't have a dedicated table in current schema yet, 
    // but we can save rating in normalized skills or update student directly if needed.
    // Let's add it to normalized skills for now.
    await prisma.normalizedSkill.upsert({
      where: { id: `cf-${studentId}-cp` },
      update: { 
        score: Math.min(100, Math.round((stats.rating / 2000) * 100)), 
        confidence: 90, 
        updatedAt: new Date() 
      },
      create: {
        id: `cf-${studentId}-cp`,
        studentId,
        name: 'Competitive Programming',
        category: 'dsa',
        score: Math.min(100, Math.round((stats.rating / 2000) * 100)),
        confidence: 90,
        source: 'codeforces'
      }
    });

    return stats;
  }

  /**
   * Calculate unified multi-dimensional scores for a student.
   */
  static async calculateScores(studentId: string) {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        externalAccounts: {
          include: { githubData: true, leetcodeData: true }
        },
        normalizedSkills: true,
        projects: true,
        experience: true
      }
    }) as any;

    if (!student) return null;

    const gh = student.externalAccounts.find((a: any) => a.platform === 'github')?.githubData;
    const lc = student.externalAccounts.find((a: any) => a.platform === 'leetcode')?.leetcodeData;
    
    // Check if codeforces skill exists
    const cfSkill = student.normalizedSkills.find((s: any) => s.source === 'codeforces');

    // 1. Proficiency Score (Average of skill scores)
    const skills = student.normalizedSkills;
    const proficiencyScore = skills.length > 0 
      ? Math.round(skills.reduce((acc, s) => acc + s.score, 0) / skills.length)
      : 0;

    // 2. Problem Solving Score (LeetCode + Codeforces focused)
    let problemSolvingScore = 0;
    let sourcesCount = 0;
    
    if (lc) {
      problemSolvingScore += Math.min(100, Math.round((lc.totalSolved / 300) * 100));
      if (lc.contestRating && lc.contestRating > 1500) problemSolvingScore += 10;
      sourcesCount++;
    }
    
    if (cfSkill) {
      problemSolvingScore += cfSkill.score;
      sourcesCount++;
    }
    
    if (sourcesCount > 0) {
      problemSolvingScore = Math.min(100, Math.round(problemSolvingScore / sourcesCount));
    }

    // 3. Project Quality Score (GitHub stars + complexity)
    let projectQualityScore = 0;
    if (gh) {
      projectQualityScore = Math.min(100, (gh.totalStars * 5) + (gh.reposCount * 2));
    }
    projectQualityScore = Math.min(100, projectQualityScore + (student.projects.length * 10));

    // 4. Consistency Score
    let consistencyScore = 50; // default
    if (lc && lc.totalSolved > 50) consistencyScore += 20;
    if (gh && gh.reposCount > 5) consistencyScore += 20;
    consistencyScore = Math.min(100, consistencyScore);

    // Overall Score
    const overallScore = Math.round(
      (proficiencyScore * 0.3) +
      (projectQualityScore * 0.25) +
      (problemSolvingScore * 0.2) +
      (consistencyScore * 0.15) +
      (Math.min(100, student.experience.length * 20) * 0.1)
    );

    // Insights Generation (Simplified)
    const insights: string[] = [];
    if (problemSolvingScore > 80) insights.push("Top 10% in Problem Solving");
    if (projectQualityScore > 70) insights.push("High project quality / Open source active");
    if (proficiencyScore < 50) insights.push("Tech stack breadth needs expansion");

    const scores = await prisma.userScore.upsert({
      where: { studentId },
      update: {
        overallScore,
        proficiencyScore,
        problemSolvingScore,
        projectQualityScore,
        consistencyScore,
        insights: JSON.stringify(insights),
        lastCalculated: new Date()
      },
      create: {
        id: nanoid(),
        studentId,
        overallScore,
        proficiencyScore,
        problemSolvingScore,
        projectQualityScore,
        consistencyScore,
        insights: JSON.stringify(insights)
      }
    });

    return scores;
  }
}
