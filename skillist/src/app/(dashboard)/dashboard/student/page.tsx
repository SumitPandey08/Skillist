import * as React from 'react'
import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { fetchFromBackend } from '@/lib/api-server'
import { redirect } from 'next/navigation'
import { HeroSection } from '@/components/dashboard/student/hero-section'
import { TopSkills } from '@/components/dashboard/student/top-skills'
import { RecentProjects } from '@/components/dashboard/student/recent-projects'
import { RecentApplications } from '@/components/dashboard/student/recent-applications'
import { StudentDashboardLayout } from '@/components/dashboard/student/student-dashboard-layout'
import { calculateProfileCompleteness } from '@/lib/progress'
import { ProfileCompleteness } from '@/components/dashboard/profile-completeness'
import { ResumeUpload } from '@/app/dashboard/student/resume-upload'
import { CheckCircle2, ArrowRight, Trophy } from 'lucide-react'
import { fetchGitHubStats } from '@/lib/integrations/github'
import { fetchLeetCodeStats } from '@/lib/integrations/leetcode'
import { fetchCodeforcesStats } from '@/lib/integrations/codeforces'
import { PlatformStats } from '@/components/portfolio/platform-stats'
import { Badge } from '@/components/ui/badge'
import { TrackingWidget } from '@/components/dashboard/student/tracking-widget'
import { CareerPathWidget } from '@/components/dashboard/student/career-path-widget'

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  let data;
  try {
    data = await fetchFromBackend('/users/student/dashboard')
  } catch (error) {
    console.error('Failed to fetch student dashboard:', error)
    return <div>Error loading dashboard</div>
  }

  const { student } = data
  if (!student) redirect('/onboarding')

  const userSkills = student.skills.map((ss: any) => ({
    id: ss.skill.id,
    name: ss.skill.name,
    proficiency: ss.proficiency,
  }))

  const userProjects = student.projects
  const userCerts = student.certifications
  const userApplications = student.applications.map((app: any) => ({
    id: app.id,
    status: app.status,
    matchScore: app.matchScore,
    createdAt: app.createdAt,
    jobTitle: app.job.title,
    companyName: app.job.company.companyName,
  }))

  const { score, missing } = calculateProfileCompleteness({
    bio: student.bio,
    skillsCount: userSkills.length,
    projectsCount: userProjects.length,
    certsCount: userCerts.length,
  })

  // Fetch external stats in parallel
  const [githubStats, leetcodeStats, codeforcesStats] = await Promise.all([
    student.githubUsername ? fetchGitHubStats(student.githubUsername) : Promise.resolve(null),
    student.leetcodeUsername ? fetchLeetCodeStats(student.leetcodeUsername) : Promise.resolve(null),
    student.codeforcesUsername ? fetchCodeforcesStats(student.codeforcesUsername) : Promise.resolve(null),
  ])

  return (
    <StudentDashboardLayout maxWidth="max-w-[1600px]">
      <div className="flex flex-col gap-10">
        <HeroSection 
          studentName={student.name?.split(' ')[0] || 'Explorer'} 
          score={score}
          skillsCount={userSkills.length}
          certsCount={userCerts.length}
          slug={student.slug}
        />

        <CareerPathWidget 
          intent={student.intent || 'explore'} 
          currentGrade={student.currentGrade || '1st Year'}
          primarySkill={student.primarySkill || 'Not set'}
        />

        <div className="grid gap-10 lg:grid-cols-12">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-10">
            <div className="grid gap-6 md:grid-cols-2">
              <TopSkills skills={userSkills} />
              <RecentProjects projects={userProjects} />
            </div>

            {/* Platform Stats */}
            {(githubStats || leetcodeStats || codeforcesStats) && (
              <div className="p-8 rounded-[2rem] bg-background/50 border border-border/40 shadow-xl backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-primary via-indigo-500 to-purple-500 opacity-20" />
                <PlatformStats 
                  github={githubStats} 
                  leetcode={leetcodeStats} 
                  codeforces={codeforcesStats} 
                />
              </div>
            )}

            <RecentApplications applications={userApplications} />

            {/* Bio Card */}
            <div className="p-8 rounded-[2rem] bg-gradient-to-br from-muted/50 to-muted/20 border border-border/40 shadow-inner group">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-black uppercase tracking-tight">Professional Narrative</h3>
                <Trophy className="w-5 h-5 text-amber-500 opacity-40 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-base text-muted-foreground leading-relaxed italic">
                "{student.bio || "You haven't defined your bio yet. An impactful bio increases your AI matching vector score significantly."}"
              </p>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 space-y-8">
            <div className="p-6 rounded-[2rem] bg-card border border-border/40 shadow-xl hover:shadow-2xl transition-shadow duration-500">
              <ProfileCompleteness score={score} missing={missing} />
            </div>

            <TrackingWidget userId={userId} />

            <div className="p-2 rounded-[2.5rem] bg-muted/20 border border-border/30">
              <div className="p-6 rounded-[2rem] bg-background border border-border/40 shadow-sm">
                <ResumeUpload />
              </div>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-background to-muted/20 border border-border/40 shadow-2xl relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
              
              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 shadow-inner">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-lg font-black uppercase tracking-widest">Resource Hub</h3>
                    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em]">Curated Learning Kits</p>
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                 {[
                   { title: 'Resume Optimization Guide', type: 'Pro Resource', href: '/dashboard/student/resume', color: 'bg-blue-500' },
                   { title: 'Interview Mastery AI', type: 'Premium Access', href: '/dashboard/student/interviews', color: 'bg-purple-500' },
                   { title: 'System Design Primer', type: 'Curated Path', href: '/dashboard/student/system-design', color: 'bg-emerald-500' }
                 ].map((resource, i) => (
                    <Link key={i} href={resource.href}>
                        <div className="group/item p-5 rounded-[1.5rem] bg-background/50 border border-border/40 hover:border-primary/40 hover:bg-background transition-all duration-500 cursor-pointer flex items-center justify-between shadow-sm hover:shadow-md">
                            <div className="space-y-2">
                                <p className="text-sm font-black group-hover/item:text-primary transition-colors tracking-tight">{resource.title}</p>
                                <div className="flex items-center gap-2">
                                  <div className={`w-1.5 h-1.5 rounded-full ${resource.color}`} />
                                  <Badge variant="outline" className="h-5 px-2 text-[8px] font-black uppercase tracking-widest bg-muted/50 border-none">{resource.type}</Badge>
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-muted group-hover/item:bg-primary/10 flex items-center justify-center transition-all duration-500 group-hover/item:rotate-[-45deg]">
                                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover/item:text-primary transition-colors" />
                            </div>
                        </div>
                    </Link>
                 ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudentDashboardLayout>
  )
}
