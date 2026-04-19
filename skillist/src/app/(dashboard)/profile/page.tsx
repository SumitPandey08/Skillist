import { auth } from '@clerk/nextjs/server'
import { fetchFromBackend } from '@/lib/api-server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BioEditor } from '@/components/dashboard/bio-editor'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { PlatformConnections } from '@/components/dashboard/platform-connections'

export default async function ProfilePage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  let data;
  try {
    data = await fetchFromBackend('/auth/me')
  } catch (error) {
    console.error('Failed to fetch user:', error)
    redirect('/onboarding')
  }

  const user = data?.user;
  if (!user?.role) redirect('/onboarding')

  let profileData: any = null
  try {
    if (user.role === 'student') {
      const data = await fetchFromBackend('/users/student/profile')
      profileData = data.student
    } else {
      const data = await fetchFromBackend('/users/company/profile')
      profileData = data.company
    }
  } catch (error) {
    console.error('Failed to fetch profile data:', error)
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 py-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your personal and account information.</p>
        </header>

        <main className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="w-full shadow-sm">
              <CardHeader className="border-b bg-slate-50/50 dark:bg-slate-900/50">
                <CardTitle className="capitalize text-xl">{user.role} Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8 pt-8">
                {user.role === 'student' ? (
                  <>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Professional Bio</p>
                      <BioEditor initialBio={profileData?.bio} />
                    </div>
                    <div className="grid grid-cols-2 gap-8 pt-4 border-t">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Name</p>
                        <p className="text-lg font-medium">{profileData?.name || 'Not set'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Primary Skill</p>
                        <p className="text-lg font-medium">{profileData?.primarySkill || 'Not set'}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Contact Person</p>
                      <p className="text-lg font-medium">{profileData?.name || 'Not set'}</p>
                    </div>
                    <div className="space-y-1 pt-4 border-t">
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Company Name</p>
                      <p className="text-lg font-medium">{profileData?.companyName || 'Not set'}</p>
                    </div>
                    <div className="space-y-1 pt-4 border-t">
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Industry</p>
                      <p className="text-lg font-medium">{profileData?.industry || 'Not set'}</p>
                    </div>
                  </>
                )}
                <div className="space-y-1 pt-4 border-t">
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Email Address</p>
                  <p className="text-lg font-medium">{user.email}</p>
                </div>
                
                {user.role === 'student' && (
                  <div className="mt-8 p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <p className="text-sm text-primary font-medium text-center">
                      Quick Tip: A complete profile with skills and projects increases your visibility to employers by 3x.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            {user.role === 'student' && (
              <PlatformConnections 
                initialData={{
                  githubUrl: profileData?.githubUrl,
                  leetcodeUrl: profileData?.leetcodeUrl,
                  codeforcesUrl: profileData?.codeforcesUrl,
                  linkedinUrl: profileData?.linkedinUrl,
                  githubUsername: profileData?.githubUsername,
                  leetcodeUsername: profileData?.leetcodeUsername,
                  codeforcesUsername: profileData?.codeforcesUsername,
                }} 
              />
            )}
          </div>
        </main>
      </div>
    </DashboardLayout>
  )
}
