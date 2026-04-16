"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Building2, CheckCircle2, Sparkles, FileText, LayoutDashboard, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const data = {
  candidate: {
    title: "For Candidates",
    headline: "Build Your Skills Identity",
    points: [
      "Upload your PDF and let AI parse your entire career history.",
      "Get matched to jobs based on a scientific 40/20/20/20 fit score.",
      "Download tailored resumes for every application in one click.",
      "Share your unique portfolio URL with recruiters anywhere."
    ],
    highlights: [
      { icon: <Sparkles className="w-5 h-5" />, text: "AI Match Score" },
      { icon: <FileText className="w-5 h-5" />, text: "Resume Tailoring" },
      { icon: <LayoutDashboard className="w-5 h-5" />, text: "Skill Tracking" },
    ]
  },
  employer: {
    title: "For Employers",
    headline: "Hire Based on Proven Skill",
    points: [
      "Post jobs with specific skill tags for precise AI matching.",
      "View automatically ranked pipelines — no more manual screening.",
      "Drill down into AI-generated analysis for every candidate.",
      "Manage the entire pipeline from 'Pending' to 'Offered'."
    ],
    highlights: [
      { icon: <Search className="w-5 h-5" />, text: "Ranked Pipelines" },
      { icon: <Sparkles className="w-5 h-5" />, text: "Fit Analysis" },
      { icon: <Building2 className="w-5 h-5" />, text: "Job Management" },
    ]
  }
};

export function DualSidedSection() {
  const [activeTab, setActiveTab] = useState<"candidate" | "employer">("candidate");

  return (
    <section id="how-it-works" className="py-24 relative border-y border-white/5 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
      
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          <div className="w-full lg:w-1/2 space-y-10">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              A True Dual-Sided Ecosystem
            </h2>
            
            <div className="flex p-1.5 glass rounded-full w-full max-w-md relative overflow-hidden">
              <div 
                className={cn(
                  "absolute inset-y-1.5 w-[calc(50%-0.375rem)] bg-primary/20 backdrop-blur-md rounded-full transition-all duration-500 ease-in-out z-0",
                  activeTab === "candidate" ? "left-1.5" : "left-[calc(50%+0.1875rem)]"
                )}
              />
              <button
                onClick={() => setActiveTab("candidate")}
                className={cn(
                  "relative z-10 flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold transition-all duration-300",
                  activeTab === "candidate" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <User className="w-4 h-4" /> Candidates
              </button>
              <button
                onClick={() => setActiveTab("employer")}
                className={cn(
                  "relative z-10 flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold transition-all duration-300",
                  activeTab === "employer" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Building2 className="w-4 h-4" /> Employers
              </button>
            </div>

            <div className="min-h-[300px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: -20, filter: "blur(5px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: 20, filter: "blur(5px)" }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6 pt-4"
                >
                  <h3 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400">
                    {data[activeTab].headline}
                  </h3>
                  <ul className="space-y-5 pt-4">
                    {data[activeTab].points.map((point, i) => (
                      <motion.li 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i} 
                        className="flex items-start gap-4 text-lg text-muted-foreground"
                      >
                        <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5 animate-pulse-glow" />
                        <span className="leading-relaxed">{point}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, scale: 0.95, rotateY: -10 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="relative w-full aspect-square md:aspect-[4/3] rounded-[2rem] glass p-8 overflow-hidden shadow-2xl hover:shadow-[0_0_50px_rgba(var(--color-primary),0.2)] transition-shadow duration-700"
              style={{ perspective: "1000px" }}
            >
              {/* Scanline effect entirely in CSS via globals.css animated scanline */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent shadow-[0_0_10px_rgba(var(--color-primary),0.8)] opacity-50 animate-scanline pointer-events-none z-50 mix-blend-screen" />

              <div className="h-full flex flex-col gap-6 relative z-10">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(var(--color-primary),0.4)]">
                      {activeTab === 'candidate' ? <User className="w-6 h-6" /> : <Building2 className="w-6 h-6" />}
                    </div>
                    <div>
                      <div className="text-base font-bold text-foreground">
                        {activeTab === 'candidate' ? 'Candidate Dashboard' : 'Employer Command Center'}
                      </div>
                      <div className="text-xs text-primary tracking-widest uppercase mt-1">Live Preview</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div className="col-span-2 p-5 rounded-2xl bg-background/40 border border-white/5 backdrop-blur-md">
                    <div className="h-2 w-32 bg-primary/20 rounded-full mb-4" />
                    <div className="space-y-3">
                      <div className="h-4 w-full bg-secondary/50 rounded flex overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-primary to-indigo-500"
                          initial={{ width: "0%" }}
                          animate={{ width: activeTab === 'candidate' ? "85%" : "92%" }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                      <div className="h-4 w-3/4 bg-border/30 rounded" />
                    </div>
                  </div>
                  {data[activeTab].highlights.map((h, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className="p-5 rounded-2xl bg-background/40 border border-white/5 backdrop-blur-md flex flex-col items-center justify-center gap-3 text-center cursor-default hover:bg-primary/10 transition-colors"
                    >
                      <div className="text-primary bg-primary/10 p-3 rounded-xl">{h.icon}</div>
                      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{h.text}</div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-auto h-14 w-full bg-primary/10 rounded-2xl border border-primary/20 flex items-center justify-center shadow-inner">
                  <div className="flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-widest">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    AI Engine Initialized
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
