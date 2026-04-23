import { auth } from '@clerk/nextjs/server'
import { fetchFromBackend } from '@/lib/api-server'
import { redirect } from 'next/navigation'
import { StudentDashboardLayout } from '@/components/dashboard/student/student-dashboard-layout'
import { RecentApplications } from '@/components/dashboard/student/recent-applications'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Briefcase } from 'lucide-react'

export default async function ApplicationsPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  let userApplications = []
  try {
    userApplications = await fetchFromBackend('/users/student/applications')
  } catch (error) {
    console.error('Failed to fetch applications:', error)
  }

  return (
    <StudentDashboardLayout maxWidth="max-w-[1600px]">
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
              <Briefcase className="w-3 h-3" /> Job Tracking
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">Your <span className="text-primary">Applications</span></h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              Monitor your status with employers and track your AI-powered skill match scores.
            </p>
          </div>
          
          <div className="flex gap-4">
             <Card className="bg-background/40 backdrop-blur-sm border-border/40 px-6 py-4 rounded-3xl">
                <div className="text-2xl font-black">{userApplications.length}</div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Apps</div>
             </Card>
             <Card className="bg-background/40 backdrop-blur-sm border-border/40 px-6 py-4 rounded-3xl">
                <div className="text-2xl font-black text-green-500">
                  {userApplications.filter((a: any) => a.status === 'offered' || a.status === 'hired').length}
                </div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Success</div>
             </Card>
          </div>
        </div>

        <RecentApplications applications={userApplications} />
      </div>
    </StudentDashboardLayout>
  )
}

