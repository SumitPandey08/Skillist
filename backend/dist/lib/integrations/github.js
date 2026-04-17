"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchGitHubStats = fetchGitHubStats;
async function fetchGitHubStats(username) {
    try {
        const userResponse = await fetch(`https://api.github.com/users/${username}`);
        if (!userResponse.ok)
            return null;
        const userData = await userResponse.json();
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
        const reposData = await reposResponse.json();
        let totalStars = 0;
        const languagesMap = {};
        if (Array.isArray(reposData)) {
            reposData.forEach((repo) => {
                totalStars += repo.stargazers_count;
                if (repo.language) {
                    languagesMap[repo.language] = (languagesMap[repo.language] || 0) + 1;
                }
            });
        }
        const topLanguages = Object.entries(languagesMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([lang]) => lang);
        return {
            publicRepos: userData.public_repos,
            followers: userData.followers,
            totalStars,
            topLanguages,
        };
    }
    catch (error) {
        console.error('Error fetching GitHub stats:', error);
        return null;
    }
}
//# sourceMappingURL=github.js.map