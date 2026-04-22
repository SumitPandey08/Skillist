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
    <StudentDashboardLayout>
      <div className="flex flex-col gap-8 max-w-7xl mx-auto">

        {/* TOP: Game Changer AI Hero */}
        <DailyMissionPanel 
          studentName={student.name?.split(' ')[0] || 'Explorer'} 
          intent={student.intent}
          score={score}
          primarySkill={student.primarySkill}
          careerRecommendation={student.careerRecommendations?.[0]}
          roadmap={student.roadmaps?.[0]}
        />

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
            </div>

            {/* Platform Stats Integration (if external accounts exist) */}
            {(githubStats || leetcodeStats || codeforcesStats) && (
              <div className="p-6 rounded-3xl bg-background/50 border border-border/30 shadow-sm backdrop-blur-md">
                <h3 className="text-sm font-black uppercase tracking-widest text-primary mb-4">Real Activity Insights</h3>
                <PlatformStats 
                  github={githubStats} 
                  leetcode={leetcodeStats} 
                  codeforces={codeforcesStats} 
                />
              </div>
            )}

            {/* Recommended Jobs Quick Access */}
            <RecommendedJobsCard jobs={recommendedJobsData} />

            {/* BOTTOM: Actionable History & Feeds */}
            <div className="grid gap-5 md:grid-cols-2">
              <SmartApplicationInsights applications={userApplications} />
              <SmartLearningFeed careerRecommendation={student.careerRecommendations?.[0]} />
            </div>

          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-4 space-y-6">
            <CareerReadinessMeter score={score} />
            <GamifiedTrackingWidget />
            <CareerPredictionPanel primarySkill={student.primarySkill} />

            <div className="p-5 rounded-3xl bg-muted/20 border border-border/40 backdrop-blur-sm">
              <h3 className="text-xs font-black uppercase tracking-widest mb-4">Resume Parsing</h3>
              <ResumeUpload />
            </div>
          </div>

        </div>
      </div>
    </StudentDashboardLayout>
  )
}
