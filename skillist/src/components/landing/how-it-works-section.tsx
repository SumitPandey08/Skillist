"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Compass, Blocks, ShieldCheck, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    step: "01",
    title: "Understand You",
    description: "AI analyzes your interests, current skills, and behavioral traits to find your natural fit.",
    icon: <BrainCircuit className="h-6 w-6" />,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    step: "02",
    title: "Guide You",
    description: "Receive a deeply personalized roadmap tailored with daily missions and milestones.",
    icon: <Compass className="h-6 w-6" />,
    color: "text-sky-500",
    bg: "bg-sky-500/10"
  },
  {
    step: "03",
    title: "Build You",
    description: "Execute real projects, consume curated learning resources, and practice continuously.",
    icon: <Blocks className="h-6 w-6" />,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10"
  },
  {
    step: "04",
    title: "Validate You",
    description: "Prove competence through quizzes, GitHub activity tracking, and AI-led interviews.",
    icon: <ShieldCheck className="h-6 w-6" />,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  },
  {
    step: "05",
    title: "Place You",
    description: "Fast-track your job search with pure skill-based, data-driven job matching.",
    icon: <Briefcase className="h-6 w-6" />,
    color: "text-primary",
    bg: "bg-primary/10"
  },
];

export function HowItWorksSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden px-6 bg-muted/20">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-16 md:mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            How it Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground"
          >
            A systematic engineering process applied to your career growth.
          </motion.p>
        </div>

        <div className="relative space-y-4 md:space-y-6">
          {/* Connector line for desktop */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2 hidden md:block" />

          {steps.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={cn(
                "relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12",
                index % 2 === 0 ? "md:flex-row-reverse" : ""
              )}
            >
              {/* Timeline marker */}
              <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background -translate-x-1/2 z-10 hidden md:block shadow-sm shadow-primary/20" />

              {/* Step number and content */}
              <div className={cn(
                "w-full md:w-1/2 flex flex-col",
                index % 2 === 0 ? "md:items-start" : "md:items-end"
              )}>
                 <div className="mobile-card flex flex-col items-start gap-4 p-8 w-full group hover:border-primary/20 transition-all">
                    <div className="flex items-center justify-between w-full mb-2">
                       <div className={cn("p-3 rounded-2xl group-hover:scale-110 transition-transform shadow-sm", item.bg, item.color)}>
                          {item.icon}
                       </div>
                       <span className="text-4xl font-black text-foreground/5 opacity-20 tracking-tighter">
                          {item.step}
                       </span>
                    </div>
                    <div>
                       <h3 className="text-xl font-black mb-2 tracking-tight uppercase">{item.title}</h3>
                       <p className="text-muted-foreground font-medium leading-relaxed">
                          {item.description}
                       </p>
                    </div>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
