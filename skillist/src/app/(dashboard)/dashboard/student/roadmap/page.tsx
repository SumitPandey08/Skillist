import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { StudentDashboardLayout } from '@/components/dashboard/student/student-dashboard-layout'
import { RoadmapView } from '@/components/dashboard/student/roadmap-view'
import { Target } from 'lucide-react'
import { fetchFromBackend } from '@/lib/api-server'

export default async function RoadmapPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  let userRoadmaps = []
  try {
    userRoadmaps = await fetchFromBackend('/users/student/roadmaps')
  } catch (err) {
    console.error('Error fetching roadmaps:', err)
  }

  // Cast resources for TypeScript
  const typedRoadmaps = userRoadmaps.map((r: any) => ({
    ...r,
    steps: r.steps.map((s: any) => ({
      ...s,
      resources: typeof s.resources === 'string' ? JSON.parse(s.resources) : s.resources
    }))
  }))

  return (
    <StudentDashboardLayout maxWidth="max-w-[1400px]">
      <div className="space-y-7">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em]">
              <Target className="w-3 h-3" /> Career Engine
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">Career <span className="text-emerald-600">Roadmap</span></h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              AI-generated personalized learning paths with deep study notes and curated resources.
            </p>
          </div>
        </div>

        <RoadmapView initialRoadmaps={typedRoadmaps as any} />
      </div>
    </StudentDashboardLayout>
  )
}
