import { auth } from '@clerk/nextjs/server'
import { UserProfile } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function SettingsPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  return (
    <div className="flex min-h-screen flex-col p-8">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </header>

      <main className="flex justify-center">
        <UserProfile routing="hash" />
      </main>
    </div>
  )
}
