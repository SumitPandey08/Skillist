"use client";

import { ReactNode } from "react";
import { 
  Building2, LayoutDashboard, Search, 
  Users, Settings, Zap, BarChart3, Calendar 
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function EmployerLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: "/employer", label: "Command Center", icon: LayoutDashboard },
    { href: "/employer/jobs", label: "Job Postings", icon: Search },
    { href: "/employer/candidates", label: "Talent Pipeline", icon: Users },
    { href: "/employer/interviews", label: "Interview Hub", icon: Calendar },
    { href: "/employer/analytics", label: "Pipeline Insights", icon: BarChart3 },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar for Employer */}
      <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-xl flex flex-col pt-6 fixed inset-y-0 left-0">
        <div className="px-6 mb-8 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="font-bold text-lg tracking-tight">Skillist <span className="text-muted-foreground text-xs font-normal">Employer</span></span>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/employer" && pathname?.startsWith(item.href));
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all border border-transparent",
                  isActive 
                    ? "text-indigo-400 bg-indigo-500/10 border-indigo-500/20 shadow-sm" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                )}
              >
                <item.icon className={cn("w-4 h-4", isActive ? "text-indigo-400" : "")} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-border/50">
          <Link href="/employer/settings" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:bg-white/5 transition-colors mb-4">
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
      <main className="flex-1 ml-64 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
