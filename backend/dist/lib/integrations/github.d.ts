export interface GitHubStats {
    publicRepos: number;
    followers: number;
    totalStars: number;
    topLanguages: string[];
}
export declare function fetchGitHubStats(username: string): Promise<GitHubStats | null>;
