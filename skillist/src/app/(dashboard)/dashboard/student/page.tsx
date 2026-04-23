import * as React from 'react'
import { auth } from '@clerk/nextjs/server'
import { fetchFromBackend } from '@/lib/api-server'
import { redirect } from 'next/navigation'

import { StudentDashboardLayout } from '@/components/dashboard/student/student-dashboard-layout'
import { calculateProfileCompleteness } from '@/lib/progress'
import { ResumeUpload } from '@/app/dashboard/student/resume-upload'
import { fetchGitHubStats } from '@/lib/integrations/github'
import { fetchLeetCodeStats } from '@/lib/integrations/leetcode'
import { fetchCodeforcesStats } from '@/lib/integrations/codeforces'

import { PlatformStats } from '@/components/portfolio/platform-stats'
<<<<<<< HEAD
import { Badge } from '@/components/ui/badge'
import { TrackingWidget } from '@/components/dashboard/student/tracking-widget'
import { CareerPathWidget } from '@/components/dashboard/student/career-path-widget'
=======
import { DailyMissionPanel } from '@/components/dashboard/student/daily-mission-panel'
import { SkillIntelligenceCard } from '@/components/dashboard/student/skill-intelligence-card'
import { ProjectImpactCard } from '@/components/dashboard/student/project-impact-card'
import { InterviewReadinessCard } from '@/components/dashboard/student/interview-readiness-card'
import { SmartApplicationInsights } from '@/components/dashboard/student/smart-application-insights'
import { CareerReadinessMeter } from '@/components/dashboard/student/career-readiness-meter'
import { GamifiedTrackingWidget } from '@/components/dashboard/student/gamified-tracking-widget'
import { CareerPredictionPanel } from '@/components/dashboard/student/career-prediction-panel'
import { SmartLearningFeed } from '@/components/dashboard/student/smart-learning-feed'
import { RecommendedJobsCard } from '@/components/dashboard/student/recommended-jobs-card'
>>>>>>> 72cc33a2cef1ea3fa5777c576f4aa5c7f00f363c

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

  // Fetch external stats and recommended jobs in parallel
  const [githubStats, leetcodeStats, codeforcesStats, recommendedJobsData] = await Promise.all([
    student.githubUsername ? fetchGitHubStats(student.githubUsername) : Promise.resolve(null),
    student.leetcodeUsername ? fetchLeetCodeStats(student.leetcodeUsername) : Promise.resolve(null),
    student.codeforcesUsername ? fetchCodeforcesStats(student.codeforcesUsername) : Promise.resolve(null),
    fetchFromBackend('/jobs/recommended')
  ])

  return (
<<<<<<< HEAD
    <StudentDashboardLayout maxWidth="max-w-[1600px]">
      <div className="flex flex-col gap-10">
        <HeroSection 
=======
    <StudentDashboardLayout>
      <div className="flex flex-col gap-8 max-w-7xl mx-auto">

        {/* TOP: Game Changer AI Hero */}
        <DailyMissionPanel 
>>>>>>> 72cc33a2cef1ea3fa5777c576f4aa5c7f00f363c
          studentName={student.name?.split(' ')[0] || 'Explorer'} 
          intent={student.intent}
          score={score}
          primarySkill={student.primarySkill}
          careerRecommendation={student.careerRecommendations?.[0]}
          roadmap={student.roadmaps?.[0]}
        />

<<<<<<< HEAD
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
=======
        <div className="grid gap-6 lg:grid-cols-12">

          {/* MAIN COLUMN (Middle & Bottom) */}
          <div className="lg:col-span-8 space-y-6">

            {/* MIDDLE: Intelligence Grid */}
            <div className="grid gap-5 md:grid-cols-2">
              <SkillIntelligenceCard 
                skills={userSkills} 
                careerRecommendation={student.careerRecommendations?.[0]} 
              />
              <div className="space-y-5 flex flex-col">
                <div className="flex-1">
                  <ProjectImpactCard projects={userProjects} />
                </div>
                <div className="shrink-0">
                  <InterviewReadinessCard mockInterviews={student.mockInterviews} />
                </div>
              </div>
>>>>>>> 72cc33a2cef1ea3fa5777c576f4aa5c7f00f363c
            </div>

            {/* Platform Stats Integration (if external accounts exist) */}
            {(githubStats || leetcodeStats || codeforcesStats) && (
<<<<<<< HEAD
              <div className="p-8 rounded-[2rem] bg-background/50 border border-border/40 shadow-xl backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-primary via-indigo-500 to-purple-500 opacity-20" />
=======
              <div className="p-6 rounded-3xl bg-background/50 border border-border/30 shadow-sm backdrop-blur-md">
                <h3 className="text-sm font-black uppercase tracking-widest text-primary mb-4">Real Activity Insights</h3>
>>>>>>> 72cc33a2cef1ea3fa5777c576f4aa5c7f00f363c
                <PlatformStats 
                  github={githubStats} 
                  leetcode={leetcodeStats} 
                  codeforces={codeforcesStats} 
                />
              </div>
            )}

            {/* Recommended Jobs Quick Access */}
            <RecommendedJobsCard jobs={recommendedJobsData} />

<<<<<<< HEAD
            {/* Bio Card */}
            <div className="p-8 rounded-[2rem] bg-gradient-to-br from-muted/50 to-muted/20 border border-border/40 shadow-inner group">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-black uppercase tracking-tight">Professional Narrative</h3>
                <Trophy className="w-5 h-5 text-amber-500 opacity-40 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-base text-muted-foreground leading-relaxed italic">
                "{student.bio || "You haven't defined your bio yet. An impactful bio increases your AI matching vector score significantly."}"
              </p>
=======
            {/* BOTTOM: Actionable History & Feeds */}
            <div className="grid gap-5 md:grid-cols-2">
              <SmartApplicationInsights applications={userApplications} />
              <SmartLearningFeed careerRecommendation={student.careerRecommendations?.[0]} />
>>>>>>> 72cc33a2cef1ea3fa5777c576f4aa5c7f00f363c
            </div>

          </div>

<<<<<<< HEAD
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
=======
          {/* SIDEBAR */}
          <div className="lg:col-span-4 space-y-6">
            <CareerReadinessMeter score={score} />
            <GamifiedTrackingWidget />
            <CareerPredictionPanel primarySkill={student.primarySkill} />

            <div className="p-5 rounded-3xl bg-muted/20 border border-border/40 backdrop-blur-sm">
              <h3 className="text-xs font-black uppercase tracking-widest mb-4">Resume Parsing</h3>
              <ResumeUpload />
            </div>
>>>>>>> 72cc33a2cef1ea3fa5777c576f4aa5c7f00f363c
          </div>

        </div>
      </div>
    </StudentDashboardLayout>
  )
}
