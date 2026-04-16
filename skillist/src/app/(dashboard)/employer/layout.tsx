import { ReactNode } from "react";
import { Building2, LayoutDashboard, Search, Users, Settings, Zap } from "lucide-react";
import Link from "next/link";

export default function EmployerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar for Employer */}
      <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-xl flex flex-col pt-6">
        <div className="px-6 mb-8 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="font-bold text-lg tracking-tight">ECHFLUX <span className="text-muted-foreground text-xs font-normal">Employer</span></span>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <Link href="/employer" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-primary bg-primary/10 transition-colors border border-primary/10">
            <LayoutDashboard className="w-4 h-4" />
            Command Center
          </Link>
          <Link href="/employer/jobs" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:bg-white/5 transition-colors">
            <Search className="w-4 h-4" />
            Job Postings
          </Link>
          <Link href="/employer/candidates" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:bg-white/5 transition-colors">
            <Users className="w-4 h-4" />
            Talent Pipeline
          </Link>
        </nav>

        <div className="p-4 mt-auto border-t border-border/50">
          <Link href="/settings" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:bg-white/5 transition-colors mb-4">
            <Settings className="w-4 h-4" />
            Settings
          </Link>
          <div className="glass p-4 rounded-xl border border-white/5 bg-indigo-500/5">
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2 text-indigo-400 flex items-center gap-1"><Zap className="w-3 h-3" /> Agentic AI On</h4>
            <p className="text-xs text-muted-foreground">Automated candidate screening is running.</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
