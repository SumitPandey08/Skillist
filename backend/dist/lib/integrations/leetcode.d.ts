export interface LeetCodeStats {
    ranking: number;
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    contestRating?: number;
}
export declare function fetchLeetCodeStats(username: string): Promise<LeetCodeStats | null>;
