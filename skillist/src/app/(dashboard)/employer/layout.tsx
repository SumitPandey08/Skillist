"use client";

import { ReactNode, useState } from "react";
import { 
  Building2, LayoutDashboard, Search, 
  Users, Settings, Zap, BarChart3, Calendar, Menu, X 
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { UserButton } from "@clerk/nextjs";

export default function EmployerLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { href: "/employer", label: "Command Center", icon: LayoutDashboard },
    { href: "/employer/jobs", label: "Job Postings", icon: Search },
    { href: "/employer/candidates", label: "Talent Pipeline", icon: Users },
    { href: "/employer/interviews", label: "Interview Hub", icon: Calendar },
    { href: "/employer/analytics", label: "Pipeline Insights", icon: BarChart3 },
  ];

  const SidebarContent = () => (
    <>
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
              onClick={() => setIsSidebarOpen(false)}
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
        <Link 
          href="/employer/settings" 
          onClick={() => setIsSidebarOpen(false)}
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:bg-white/5 transition-colors mb-4"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
        <div className="glass p-4 rounded-xl border border-white/5 bg-indigo-500/5">
          <h4 className="text-xs font-bold uppercase tracking-wider mb-2 text-indigo-400 flex items-center gap-1"><Zap className="w-3 h-3" /> Agentic AI On</h4>
          <p className="text-xs text-muted-foreground">Automated candidate screening is running.</p>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop Sidebar */}
      <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-xl hidden md:flex flex-col pt-6 fixed inset-y-0 left-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-64 bg-background z-50 flex flex-col pt-6 border-r border-border md:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="h-16 border-b border-border/50 flex md:hidden items-center justify-between px-6 bg-background/50 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <Menu className="w-5 h-5 text-indigo-400" />
            </button>
            <div className="w-6 h-6 rounded bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-400 text-[10px]">S</div>
            <span className="font-bold text-sm tracking-tight">Employer Portal</span>
          </div>
          <UserButton appearance={{ elements: { avatarBox: "w-8 h-8 border-2 border-indigo-500/20" } }} />
        </header>

        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
