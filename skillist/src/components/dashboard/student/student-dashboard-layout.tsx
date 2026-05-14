"use client";

import { UserButton } from "@clerk/nextjs";
import { DashboardNav } from "./dashboard-nav";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface StudentDashboardLayoutProps {
  children: React.ReactNode
  maxWidth?: string
}

export function StudentDashboardLayout({ children, maxWidth = "max-w-7xl" }: StudentDashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] -z-10" />

      {/* Desktop Sidebar */}
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

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-background z-50 flex flex-col border-r border-border lg:hidden overflow-y-auto"
            >
              <DashboardNav />
              <div className="mt-auto p-4 border-t border-border">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/50">
                  <UserButton appearance={{ elements: { avatarBox: "w-9 h-9 border-2 border-primary/20" } }} />
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">My Account</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Profile Settings</p>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 border-b border-border/40 flex items-center justify-between px-6 lg:px-12 bg-background/50 backdrop-blur-md sticky top-0 z-30 lg:hidden">
           <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center font-black text-white text-xs">S</div>
              <h1 className="font-black text-lg tracking-tight">Skillist</h1>
           </div>
           <UserButton appearance={{ elements: { avatarBox: "w-9 h-9 border-2 border-primary/20" } }} />
        </header>

        <div className={cn("flex-1 p-6 md:p-12 lg:p-16 mx-auto w-full", maxWidth)}>
          {children}
        </div>
      </main>
    </div>
  )
}
