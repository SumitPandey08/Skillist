"use client";

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Briefcase, GraduationCap, User, Settings, Search, MessageSquare, Bot, Sparkles, Target, FileText, Code2, Layers, Zap, CheckCircle2 } from 'lucide-react'
import { useState, useEffect } from 'react'

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

const NavGroup = ({ items, pathname, title, themeClass, iconBgClass, iconTextClass, layoutIdShared }: any) => {
  return (
    <div className="px-3 mb-6 relative">
      <div className="flex items-center gap-2 px-3 mb-3">
        <div className="h-[1px] flex-1 bg-border/40" />
        <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">{title}</p>
        <div className="h-[1px] flex-1 bg-border/40" />
      </div>
      <div className="space-y-1 relative">
        {items.map((item: any) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 z-10",
                isActive ? "text-white" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId={layoutIdShared}
                  className={cn("absolute inset-0 rounded-xl shadow-lg -z-10", themeClass)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              <motion.div 
                whileHover={{ scale: isActive ? 1 : 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "p-1.5 rounded-lg transition-all duration-300 shadow-sm",
                  isActive 
                    ? "bg-white/20 text-white" 
                    : cn("bg-muted group-hover:bg-background border border-transparent shadow-none", iconBgClass, "group-hover:border-border/50")
                )}
              >
                <Icon className={cn("w-[1.125rem] h-[1.125rem]", !isActive && iconTextClass)} />
              </motion.div>
              
              <span className="truncate">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-2 p-4 h-full">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 px-3 pt-2"
      >
        <div className="group flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-indigo-500/10 border border-primary/20 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-500 relative overflow-hidden backdrop-blur-sm cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[200%] group-hover:animate-pulse" />
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center font-black text-white shadow-md shadow-primary/30 group-hover:scale-105 transition-transform duration-300">
            S
          </div>
          <div>
            <h1 className="font-extrabold text-xl tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">Skillist</h1>
            <p className="text-[9px] font-bold text-primary uppercase tracking-[0.2em] mt-1">Student Portal</p>
          </div>
        </div>
      </motion.div>
      
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide py-2">
        <NavGroup 
          items={navItems} 
          pathname={pathname} 
          title="Main Hub" 
          themeClass="bg-gradient-to-r from-primary to-indigo-600 shadow-primary/20"
          iconBgClass="group-hover:text-primary"
          iconTextClass="text-muted-foreground group-hover:text-primary"
          layoutIdShared="nav-indicator"
        />

        <NavGroup 
          items={prepItems} 
          pathname={pathname} 
          title="Prep Zone" 
          themeClass="bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-500/20"
          iconBgClass="group-hover:text-emerald-500"
          iconTextClass="text-muted-foreground group-hover:text-emerald-500"
          layoutIdShared="nav-indicator"
        />

        <NavGroup 
          items={aiItems} 
          pathname={pathname} 
          title="AI Ecosystem" 
          themeClass="bg-gradient-to-r from-indigo-500 to-purple-600 shadow-indigo-500/20"
          iconBgClass="group-hover:text-indigo-500"
          iconTextClass="text-muted-foreground group-hover:text-indigo-500"
          layoutIdShared="nav-indicator"
        />
      </div>

      <div className="px-3 mt-4 pt-4 border-t border-border/40">
        <NavGroup 
          items={secondaryItems} 
          pathname={pathname} 
          title="Settings" 
          themeClass="bg-muted shadow-sm border border-border/50"
          iconBgClass=""
          iconTextClass="text-muted-foreground"
          layoutIdShared="nav-indicator-secondary"
        />
      </div>
    </nav>
  )
}
