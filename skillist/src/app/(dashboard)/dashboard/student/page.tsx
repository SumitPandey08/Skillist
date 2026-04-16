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
import { CheckCircle2 } from 'lucide-react'
import { fetchGitHubStats } from '@/lib/integrations/github'
import { fetchLeetCodeStats } from '@/lib/integrations/leetcode'
import { fetchCodeforcesStats } from '@/lib/integrations/codeforces'
import { PlatformStats } from '@/components/portfolio/platform-stats'

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

            <div className="p-5 rounded-2xl bg-gradient-to-br from-green-500/5 to-green-500/0 border border-green-500/15">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-green-500/10">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                </div>
                <h3 className="text-sm font-bold">Resource Hub</h3>
              </div>
              <p className="text-xs text-muted-foreground/70 mb-4">
                Personalized resources to boost your employability.
              </p>
              <div className="space-y-2">
                 <div className="p-3 rounded-xl bg-muted/40 hover:bg-muted/60 border border-transparent hover:border-primary/20 transition-all cursor-pointer">
                    <p className="text-xs font-semibold">Resume Optimization Guide</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5">Free Resource</p>
                 </div>
                 <div className="p-3 rounded-xl bg-muted/40 hover:bg-muted/60 border border-transparent hover:border-primary/20 transition-all cursor-pointer">
                    <p className="text-xs font-semibold">Interview Mastery AI</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5">Beta Access</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudentDashboardLayout>
  )
}
