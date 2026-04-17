"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationService = void 0;
const prisma_1 = require("../../lib/prisma");
const github_1 = require("../../lib/integrations/github");
const leetcode_1 = require("../../lib/integrations/leetcode");
const codeforces_1 = require("../../lib/integrations/codeforces");
const nanoid_1 = require("nanoid");
const logger_1 = __importDefault(require("../../core/logger"));
class IntegrationService {
    /**
     * Sync GitHub data and extract preliminary skill markers.
     */
    static async syncGitHub(studentId, username) {
        logger_1.default.info(`Syncing GitHub for student ${studentId} (${username})`);
        const stats = await (0, github_1.fetchGitHubStats)(username);
        if (!stats)
            return null;
        const account = await prisma_1.prisma.externalAccount.upsert({
            where: { studentId_platform: { studentId, platform: 'github' } },
            update: { username, lastSynced: new Date() },
            create: { id: (0, nanoid_1.nanoid)(), studentId, platform: 'github', username, lastSynced: new Date() }
        });
        await prisma_1.prisma.gitHubData.upsert({
            where: { externalAccountId: account.id },
            update: {
                reposCount: stats.publicRepos,
                followers: stats.followers,
                totalStars: stats.totalStars,
                topLanguages: JSON.stringify(stats.topLanguages),
                lastUpdated: new Date()
            },
            create: {
                id: (0, nanoid_1.nanoid)(),
                externalAccountId: account.id,
                reposCount: stats.publicRepos,
                followers: stats.followers,
                totalStars: stats.totalStars,
                topLanguages: JSON.stringify(stats.topLanguages),
            }
        });
        // Extract skills from languages
        for (const lang of stats.topLanguages) {
            await prisma_1.prisma.normalizedSkill.upsert({
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
    static async syncLeetCode(studentId, username) {
        logger_1.default.info(`Syncing LeetCode for student ${studentId} (${username})`);
        const stats = await (0, leetcode_1.fetchLeetCodeStats)(username);
        if (!stats)
            return null;
        const account = await prisma_1.prisma.externalAccount.upsert({
            where: { studentId_platform: { studentId, platform: 'leetcode' } },
            update: { username, lastSynced: new Date() },
            create: { id: (0, nanoid_1.nanoid)(), studentId, platform: 'leetcode', username, lastSynced: new Date() }
        });
        await prisma_1.prisma.leetCodeData.upsert({
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
                id: (0, nanoid_1.nanoid)(),
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
        await prisma_1.prisma.normalizedSkill.upsert({
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
    static async syncCodeforces(studentId, username) {
        logger_1.default.info(`Syncing Codeforces for student ${studentId} (${username})`);
        const stats = await (0, codeforces_1.fetchCodeforcesStats)(username);
        if (!stats)
            return null;
        await prisma_1.prisma.externalAccount.upsert({
            where: { studentId_platform: { studentId, platform: 'codeforces' } },
            update: { username, lastSynced: new Date() },
            create: { id: (0, nanoid_1.nanoid)(), studentId, platform: 'codeforces', username, lastSynced: new Date() }
        });
        // Codeforces doesn't have a dedicated table in current schema yet, 
        // but we can save rating in normalized skills or update student directly if needed.
        // Let's add it to normalized skills for now.
        await prisma_1.prisma.normalizedSkill.upsert({
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
    static async calculateScores(studentId) {
        const student = await prisma_1.prisma.student.findUnique({
            where: { id: studentId },
            include: {
                externalAccounts: {
                    include: { githubData: true, leetcodeData: true }
                },
                normalizedSkills: true,
                projects: true,
                experience: true
            }
        });
        if (!student)
            return null;
        const gh = student.externalAccounts.find((a) => a.platform === 'github')?.githubData;
        const lc = student.externalAccounts.find((a) => a.platform === 'leetcode')?.leetcodeData;
        // Check if codeforces skill exists
        const cfSkill = student.normalizedSkills.find((s) => s.source === 'codeforces');
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
            if (lc.contestRating && lc.contestRating > 1500)
                problemSolvingScore += 10;
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
        if (lc && lc.totalSolved > 50)
            consistencyScore += 20;
        if (gh && gh.reposCount > 5)
            consistencyScore += 20;
        consistencyScore = Math.min(100, consistencyScore);
        // Overall Score
        const overallScore = Math.round((proficiencyScore * 0.3) +
            (projectQualityScore * 0.25) +
            (problemSolvingScore * 0.2) +
            (consistencyScore * 0.15) +
            (Math.min(100, student.experience.length * 20) * 0.1));
        // Insights Generation (Simplified)
        const insights = [];
        if (problemSolvingScore > 80)
            insights.push("Top 10% in Problem Solving");
        if (projectQualityScore > 70)
            insights.push("High project quality / Open source active");
        if (proficiencyScore < 50)
            insights.push("Tech stack breadth needs expansion");
        const scores = await prisma_1.prisma.userScore.upsert({
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
                id: (0, nanoid_1.nanoid)(),
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
exports.IntegrationService = IntegrationService;
//# sourceMappingURL=integrations.service.js.map