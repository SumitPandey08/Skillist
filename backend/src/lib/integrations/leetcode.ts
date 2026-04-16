export interface LeetCodeStats {
  ranking: number
  totalSolved: number
  easySolved: number
  mediumSolved: number
  hardSolved: number
  contestRating?: number
}

export async function fetchLeetCodeStats(username: string): Promise<LeetCodeStats | null> {
  const query = `
    query userPublicProfile($username: String!) {
      matchedUser(username: $username) {
        profile {
          ranking
        }
        submitStats {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
      userContestRanking(username: $username) {
        rating
      }
    }
  `

  try {
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
    })

    if (!response.ok) return null
    const { data } = await response.json() as any

    if (!data.matchedUser) return null

    const acStats = data.matchedUser.submitStats.acSubmissionNum
    const totalSolved = acStats.find((s: any) => s.difficulty === 'All')?.count || 0
    const easySolved = acStats.find((s: any) => s.difficulty === 'Easy')?.count || 0
    const mediumSolved = acStats.find((s: any) => s.difficulty === 'Medium')?.count || 0
    const hardSolved = acStats.find((s: any) => s.difficulty === 'Hard')?.count || 0

    return {
      ranking: data.matchedUser.profile.ranking,
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      contestRating: data.userContestRanking?.rating,
    }
  } catch (error) {
    console.error('Error fetching LeetCode stats:', error)
    return null
  }
}
