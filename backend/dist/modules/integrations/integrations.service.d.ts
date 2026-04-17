export declare class IntegrationService {
    /**
     * Sync GitHub data and extract preliminary skill markers.
     */
    static syncGitHub(studentId: string, username: string): Promise<import("../../lib/integrations/github").GitHubStats | null>;
    /**
     * Sync LeetCode data.
     */
    static syncLeetCode(studentId: string, username: string): Promise<import("../../lib/integrations/leetcode").LeetCodeStats | null>;
    /**
     * Sync Codeforces data.
     */
    static syncCodeforces(studentId: string, username: string): Promise<import("../../lib/integrations/codeforces").CodeforcesStats | null>;
    /**
     * Calculate unified multi-dimensional scores for a student.
     */
    static calculateScores(studentId: string): Promise<{
        id: string;
        studentId: string;
        overallScore: number;
        proficiencyScore: number;
        consistencyScore: number;
        problemSolvingScore: number;
        projectQualityScore: number;
        insights: string | null;
        lastCalculated: Date;
    } | null>;
}
