"use client";

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Briefcase, GraduationCap, User, Settings, Search, BookOpen, MessageSquare, Bot, Sparkles, Target, FileText, Code2, Layers, Zap, CheckCircle2 } from 'lucide-react'

const navItems = [
  { name: 'Overview', href: '/dashboard/student', icon: LayoutDashboard },
  { name: 'Applications', href: '/dashboard/student/applications', icon: Briefcase },
  { name: 'Portfolio', href: '/dashboard/student/portfolio', icon: GraduationCap },
  { name: 'Find Jobs', href: '/jobs', icon: Search },
]

const prepItems = [
  { name: 'Study DSA', href: '/dashboard/student/dsa', icon: Code2 },
  { name: 'System Design', href: '/dashboard/student/system-design', icon: Layers },
]

const aiItems = [
  { name: 'AI Resume Maker', href: '/dashboard/student/resume', icon: FileText },
  { name: 'AI Interviewer', href: '/dashboard/student/interviews', icon: Bot },
  { name: 'Career Roadmap', href: '/dashboard/student/roadmap', icon: Target },
  { name: 'Skill Analysis', href: '/dashboard/student/analysis', icon: Sparkles },
  { name: 'Skill Assessment', href: '/dashboard/student/assessment', icon: CheckCircle2 },
  { name: 'Career Engine', href: '/dashboard/student/career', icon: Zap },
]

const secondaryItems = [
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help Center', href: '/help', icon: MessageSquare },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-2 p-4">
      <div className="mb-6 px-3">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-indigo-500/10 border border-primary/10">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center font-black text-white shadow-lg shadow-primary/25">
            E
          </div>
          <div>
            <h1 className="font-black text-xl tracking-tight leading-tight">ECHFLUX</h1>
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Student Portal</p>
          </div>
        </div>
      </div>
      
      <div className="px-3 mb-4">
        <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest px-3 mb-2">Main</p>
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 relative overflow-hidden",
                  isActive 
                    ? "bg-gradient-to-r from-primary to-indigo-600 text-white shadow-lg shadow-primary/20" 
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:shadow-sm"
                )}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
                )}
                <div className={cn(
                  "p-1.5 rounded-lg transition-all duration-200",
                  isActive 
                    ? "bg-white/20" 
                    : "bg-muted group-hover:bg-primary/10"
                )}>
                  <Icon className="w-4 h-4" />
                </div>
                {item.name}
              </Link>
            )
          })}
        </div>
      </div>

      <div className="px-3 mb-4">
        <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest px-3 mb-2">Prep Zone</p>
        <div className="space-y-1">
          {prepItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 relative overflow-hidden",
                  isActive 
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20" 
                    : "text-muted-foreground hover:bg-emerald-500/5 hover:text-emerald-600 hover:shadow-sm"
                )}
              >
                <div className={cn(
                  "p-1.5 rounded-lg transition-all duration-200",
                  isActive 
                    ? "bg-white/20" 
                    : "bg-emerald-500/10 group-hover:bg-emerald-500/20"
                )}>
                  <Icon className="w-4 h-4 text-emerald-500 group-hover:text-emerald-600 transition-colors" />
                </div>
                {item.name}
              </Link>
            )
          })}
        </div>
      </div>

      <div className="px-3 mb-4">
        <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest px-3 mb-2">AI Ecosystem</p>
        <div className="space-y-1">
          {aiItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 relative overflow-hidden",
                  isActive 
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20" 
                    : "text-muted-foreground hover:bg-indigo-500/5 hover:text-indigo-600 hover:shadow-sm"
                )}
              >
                <div className={cn(
                  "p-1.5 rounded-lg transition-all duration-200",
                  isActive 
                    ? "bg-white/20" 
                    : "bg-indigo-500/10 group-hover:bg-indigo-500/20"
                )}>
                  <Icon className="w-4 h-4 text-indigo-500 group-hover:text-indigo-600 transition-colors" />
                </div>
                {item.name}
              </Link>
            )
          })}
        </div>
      </div>

      <div className="px-3 mt-auto">
        <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest px-3 mb-2">Settings</p>
        <div className="space-y-1">
          {secondaryItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200",
                  isActive 
                    ? "bg-gradient-to-r from-primary to-indigo-600 text-white shadow-lg shadow-primary/20" 
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:shadow-sm"
                )}
              >
                <div className={cn(
                  "p-1.5 rounded-lg transition-all duration-200",
                  isActive 
                    ? "bg-white/20" 
                    : "bg-muted group-hover:bg-primary/10"
                )}>
                  <Icon className="w-4 h-4" />
                </div>
                {item.name}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
