export interface CodeforcesStats {
    rating: number;
    rank: string;
    maxRating: number;
    maxRank: string;
}
export declare function fetchCodeforcesStats(username: string): Promise<CodeforcesStats | null>;
