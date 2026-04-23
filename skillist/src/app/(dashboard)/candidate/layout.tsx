import { ReactNode } from "react";
import { User, LayoutDashboard, FileText, Settings, Sparkles } from "lucide-react";
import Link from "next/link";
import { AnimatedButton } from "@/components/ui/animated-button";

export default function CandidateLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar for Candidate */}
      <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-xl flex flex-col pt-6">
        <div className="px-6 mb-8 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <span className="font-bold text-lg tracking-tight">Skillist <span className="text-muted-foreground text-xs font-normal">Candidate</span></span>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <Link href="/candidate" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-primary bg-primary/10 transition-colors">
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link href="/candidate/profile" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:bg-white/5 transition-colors">
            <User className="w-4 h-4" />
            Skill Graph
          </Link>
          <Link href="/candidate/matches" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:bg-white/5 transition-colors">
            <FileText className="w-4 h-4" />
            Job Matches
          </Link>
        </nav>

        <div className="p-4 mt-auto border-t border-border/50">
          <Link href="/settings" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:bg-white/5 transition-colors mb-4">
            <Settings className="w-4 h-4" />
            Settings
          </Link>
          <div className="glass p-4 rounded-xl border border-white/5">
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2 text-primary">Match Score Active</h4>
            <p className="text-xs text-muted-foreground">Your profile is actively being matched with top employers.</p>
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
