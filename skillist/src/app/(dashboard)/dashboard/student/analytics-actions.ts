'use server'

import { fetchFromBackend } from '@/lib/api-server'

export async function getStudentAnalytics() {
  try {
    const [activity, stats] = await Promise.all([
      fetchFromBackend('/analytics/activity'),
      fetchFromBackend('/analytics/stats')
    ])
    
    return { activity, stats }
  } catch (error) {
    console.error('Failed to fetch analytics from server action:', error)
    return { activity: [], stats: null }
  }
}
