"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchCodeforcesStats = fetchCodeforcesStats;
async function fetchCodeforcesStats(username) {
    try {
        const response = await fetch(`https://codeforces.com/api/user.info?handles=${username}`);
        if (!response.ok)
            return null;
        const { status, result } = await response.json();
        if (status !== 'OK' || !result || result.length === 0)
            return null;
        const userData = result[0];
        return {
            rating: userData.rating || 0,
            rank: userData.rank || 'N/A',
            maxRating: userData.maxRating || 0,
            maxRank: userData.maxRank || 'N/A',
        };
    }
    catch (error) {
        console.error('Error fetching Codeforces stats:', error);
        return null;
    }
}
//# sourceMappingURL=codeforces.js.map