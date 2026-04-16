"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Code, Network, Briefcase, User, Building, Zap } from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function HeroSection() {
  const [activeTab, setActiveTab] = useState<"candidate" | "employer">("candidate");

  return (
    <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden bg-background pt-32 pb-20">
      {/* Background glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '1.5s' }} />

      {/* Floating abstract tech elements representing skills/nodes */}
      <motion.div
        animate={{ y: [-10, 20, -10], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 right-[20%] hidden lg:flex items-center justify-center w-20 h-20 rounded-2xl glass border-primary/20 shadow-primary/20 animate-float"
      >
        <Code className="text-primary w-10 h-10" />
      </motion.div>
      <motion.div
        animate={{ y: [10, -20, 10], rotate: [0, -5, 5, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/3 left-[15%] hidden lg:flex items-center justify-center w-20 h-20 rounded-2xl glass border-indigo-500/20 shadow-indigo-500/20 animate-float"
        style={{ animationDelay: '1s' }}
      >
        <Network className="text-indigo-400 w-10 h-10" />
      </motion.div>

      <div className="container relative z-10 px-4 md:px-6">
        <div className="text-center max-w-5xl mx-auto space-y-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-border text-sm font-medium text-foreground"
          >
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-400">The AI-First Career Ecosystem</span>
          </motion.div>

          {/* Role Toggle Switch */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center justify-center gap-4 mx-auto"
          >
            <div className="glass p-1.5 rounded-full flex items-center relative overflow-hidden">
              <div 
                className={cn(
                  "absolute inset-y-1.5 w-[calc(50%-0.375rem)] bg-primary rounded-full transition-all duration-500 ease-in-out z-0",
                  activeTab === "candidate" ? "left-1.5" : "left-[calc(50%+0.1875rem)]"
                )}
              />
              <button 
                onClick={() => setActiveTab("candidate")}
                className={cn(
                  "relative z-10 px-8 py-2.5 rounded-full text-sm font-semibold transition-colors duration-300 flex items-center gap-2",
                  activeTab === "candidate" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <User className="w-4 h-4" />
                For Candidates
              </button>
              <button 
                onClick={() => setActiveTab("employer")}
                className={cn(
                  "relative z-10 px-8 py-2.5 rounded-full text-sm font-semibold transition-colors duration-300 flex items-center gap-2",
                  activeTab === "employer" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Building className="w-4 h-4" />
                For Employers
              </button>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -30, filter: "blur(10px)" }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {activeTab === "candidate" ? (
                <>
                  <h1 className="text-5xl md:text-8xl font-extrabold tracking-tight leading-tight">
                    Find roles that <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400">match your DNA.</span>
                  </h1>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    Stop throwing resumes into the void. Our AI graphs your skills, projects, and potential to place you directly in front of companies looking for exactly you.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Link href="/sign-up" className="w-full sm:w-auto">
                      <AnimatedButton size="lg" className="w-full group">
                        Build My Skill Graph <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </AnimatedButton>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <h1 className="text-5xl md:text-8xl font-extrabold tracking-tight leading-tight">
                    Hire <span className="text-transparent bg-clip-text bg-gradient-to-l from-indigo-400 to-purple-500">capability,</span><br/> not keywords.
                  </h1>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    Instantly uncover top-tier talent through AI-powered vector matching. We parse candidates for true skill depth, drastically cutting your time to hire.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Link href="/sign-up" className="w-full sm:w-auto">
                      <AnimatedButton size="lg" className="w-full group !bg-indigo-600 hover:bg-indigo-700">
                        Start Hiring Smarter <Zap className="w-4 h-4 ml-2 group-hover:animate-pulse" />
                      </AnimatedButton>
                    </Link>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="pt-12 hidden md:flex items-center justify-center"
          >
            <Link href="/jobs" className="glass px-6 py-3 rounded-full text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Browse Open Opportunities Now
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
