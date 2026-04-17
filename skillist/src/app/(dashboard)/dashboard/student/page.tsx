import * as React from 'react'
import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { fetchFromBackend } from '@/lib/api'
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
    <StudentDashboardLayout>
      <div className="flex flex-col gap-8">
        <HeroSection 
          studentName={student.name?.split(' ')[0] || 'Explorer'} 
          score={score}
          skillsCount={userSkills.length}
          certsCount={userCerts.length}
          slug={student.slug}
        />

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <TopSkills skills={userSkills} />
              <RecentProjects projects={userProjects} />
            </div>

            {/* Platform Stats */}
            {(githubStats || leetcodeStats || codeforcesStats) && (
              <div className="p-6 rounded-3xl bg-background/50 border border-border/30 shadow-sm">
                <PlatformStats 
                  github={githubStats} 
                  leetcode={leetcodeStats} 
                  codeforces={codeforcesStats} 
                />
              </div>
            )}

            <RecentApplications applications={userApplications} />

            {/* Bio Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-muted/30 to-muted/10 border border-border/30">
              <h3 className="text-lg font-bold mb-3">Professional Bio</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                "{student.bio || "You haven't defined your bio yet. An impactful bio increases your AI matching vector score significantly."}"
              </p>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 space-y-5">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border/30 shadow-sm">
              <ProfileCompleteness score={score} missing={missing} />
            </div>

            <div className="p-5 rounded-2xl bg-muted/20 border border-border/30">
              <ResumeUpload />
            </div>

            <div className="p-6 rounded-[2rem] bg-gradient-to-br from-background to-muted/20 border border-border/40 shadow-xl relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 shadow-inner">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-0.5">
                    <h3 className="text-sm font-black uppercase tracking-widest">Resource Hub</h3>
                    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase">Personalized Study Kit</p>
                </div>
              </div>

              <div className="space-y-3 relative z-10">
                 {[
                   { title: 'Resume Optimization Guide', type: 'Pro Resource', href: '/dashboard/student/resume' },
                   { title: 'Interview Mastery AI', type: 'Premium Access', href: '/dashboard/student/interviews' },
                   { title: 'System Design Primer', type: 'Curated Path', href: '/dashboard/student/system-design' }
                 ].map((resource, i) => (
                    <Link key={i} href={resource.href}>
                        <div className="group/item p-4 rounded-2xl bg-background/50 border border-border/40 hover:border-primary/40 hover:bg-background transition-all duration-300 cursor-pointer flex items-center justify-between shadow-sm">
                            <div className="space-y-1">
                                <p className="text-xs font-bold group-hover/item:text-primary transition-colors">{resource.title}</p>
                                <Badge variant="outline" className="h-5 px-1.5 text-[8px] font-black uppercase tracking-tighter bg-muted/50 border-none">{resource.type}</Badge>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-muted group-hover/item:bg-primary/10 flex items-center justify-center transition-colors">
                                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover/item:text-primary transition-colors" />
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
