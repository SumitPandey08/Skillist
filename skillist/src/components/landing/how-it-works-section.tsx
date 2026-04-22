"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Compass, Blocks, ShieldCheck, Briefcase } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Understand You",
    description: "AI analyzes your interests, current skills, and behavioral traits.",
    icon: <BrainCircuit className="h-6 w-6 text-sky-400" />,
  },
  {
    step: "02",
    title: "Guide You",
    description: "Receive a deeply personalized roadmap tailored with daily missions.",
    icon: <Compass className="h-6 w-6 text-sky-400" />,
  },
  {
    step: "03",
    title: "Build You",
    description: "Execute real projects, consume curated learning resources, and practice continuously.",
    icon: <Blocks className="h-6 w-6 text-sky-400" />,
  },
  {
    step: "04",
    title: "Validate You",
    description: "Prove competence through quizzes, GitHub activity tracking, and AI-led interviews.",
    icon: <ShieldCheck className="h-6 w-6 text-sky-400" />,
  },
  {
    step: "05",
    title: "Place You",
    description: "Fast-track your job search with pure skill-based, data-driven job matching.",
    icon: <Briefcase className="h-6 w-6 text-sky-400" />,
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
          >
            How it Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            A systematic engineering process applied to your career growth.
          </motion.p>
        </div>

        <div className="relative">
          {/* Connector Line */}
          <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-1 bg-border -translate-x-1/2 hidden sm:block" />

          {steps.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className={`relative flex flex-col sm:flex-row items-start sm:items-center gap-8 mb-12 sm:mb-20 ${
                index % 2 === 0 ? "sm:flex-row-reverse" : ""
              }`}
            >
              {/* Timeline Dot */}
              <div className="absolute left-[28px] sm:left-1/2 w-14 h-14 -translate-x-1/2 rounded-full border-4 border-background bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-md z-10 hidden sm:flex">
                <span className="text-sm font-bold text-muted-foreground">{item.step}</span>
              </div>

              {/* Mobile Step Bubble */}
              <div className="sm:hidden flex items-center justify-center w-12 h-12 rounded-full bg-sky-500/10 text-sky-500 font-bold mb-4">
                {item.step}
              </div>

              {/* Content Card */}
              <div className={`w-full sm:w-1/2 ${index % 2 === 0 ? "sm:text-right sm:pr-16" : "sm:pl-16"}`}>
                <div className={`p-6 rounded-2xl bg-background border shadow-sm hover:shadow-md transition-shadow group ${index % 2 === 0 ? "sm:items-end" : "sm:items-start"} flex flex-col`}>
                  <div className="mb-4 p-3 rounded-xl bg-sky-500/10 w-fit group-hover:scale-110 group-hover:bg-sky-500/20 transition-all">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
