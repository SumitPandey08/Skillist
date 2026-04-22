import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { UserButton } from '@clerk/nextjs'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export async function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col relative overflow-hidden bg-background">
      {/* Subtle glowing animated orbs for background ambiance */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Minimal Dashboard Header for Actions */}
      <header className="relative z-50 flex items-center justify-between px-6 py-4 border-b border-border/40 backdrop-blur-md bg-background/50">
        <Link href="/" className="font-extrabold text-xl tracking-tight flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gradient-to-tr from-primary to-indigo-500 font-sans text-xs flex items-center justify-center font-bold text-white shadow-sm">E</div>
          <span className="hidden sm:inline-block">SKILLIST</span>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-9 h-9 border-2 border-primary/20 hover:border-primary/50 transition-colors"
              }
            }}
          />
        </div>
      </header>

      <main className="container relative z-10 flex-1 pt-12 pb-8 mx-auto px-4 sm:px-6 md:px-8">
        {children}
      </main>
    </div>
  )
}
