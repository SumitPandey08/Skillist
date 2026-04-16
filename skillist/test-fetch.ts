import { fetchGitHubStats } from './src/lib/integrations/github';
import { fetchLeetCodeStats } from './src/lib/integrations/leetcode';

async function testFetch() {
  const githubUsername = 'SumitPandey08';
  const leetcodeUsername = 'SumitPandey08';

  console.log('Fetching GitHub stats for:', githubUsername);
  const gh = await fetchGitHubStats(githubUsername);
  console.log('GitHub result:', JSON.stringify(gh, null, 2));

  console.log('Fetching LeetCode stats for:', leetcodeUsername);
  const lc = await fetchLeetCodeStats(leetcodeUsername);
  console.log('LeetCode result:', JSON.stringify(lc, null, 2));
}

testFetch().catch(console.error);
