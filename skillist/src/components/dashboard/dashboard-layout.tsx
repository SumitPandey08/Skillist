import Link from 'next/link'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export async function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col relative overflow-hidden bg-background">
      {/* Subtle glowing animated orbs for background ambiance */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />
      
      <main className="container relative z-10 flex-1 pt-24 pb-8 mx-auto px-4 sm:px-6 md:px-8">
        {children}
      </main>
    </div>
  )
}
