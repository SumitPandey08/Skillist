import { UserButton } from "@clerk/nextjs";
import { DashboardNav } from "./dashboard-nav";

interface StudentDashboardLayoutProps {
  children: React.ReactNode
}

export function StudentDashboardLayout({ children }: StudentDashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] -z-10" />

{/* Sidebar */}
      <aside className="w-64 lg:w-72 border-r border-border/30 hidden lg:flex flex-col bg-background/80 backdrop-blur-xl sticky top-0 h-screen overflow-y-auto">
        <DashboardNav />
        <div className="mt-auto p-4">
           <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50 hover:border-primary/20 hover:bg-muted/60 transition-all duration-200 cursor-pointer">
               <UserButton appearance={{ elements: { avatarBox: "w-9 h-9 border-2 border-primary/20" } }} />
               <div className="min-w-0">
                 <p className="text-sm font-bold truncate">My Account</p>
                 <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Profile Settings</p>
               </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 border-b border-border/40 flex items-center justify-between px-8 lg:px-12 bg-background/50 backdrop-blur-md sticky top-0 z-30 lg:hidden">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center font-black text-white text-xs">E</div>
              <h1 className="font-black text-lg tracking-tight">ECHFLUX</h1>
           </div>
           <UserButton appearance={{ elements: { avatarBox: "w-9 h-9 border-2 border-primary/20" } }} />
        </header>

        <div className="flex-1 p-8 md:p-12 lg:p-16 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  )
}
