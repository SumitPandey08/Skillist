export declare function calculateMatchScore(studentId: string, jobId: string): Promise<{
    totalScore: number;
    skillScore: number;
    expScore: number;
    projScore: number;
    potentialScore: number;
    analysis: string;
}>;
