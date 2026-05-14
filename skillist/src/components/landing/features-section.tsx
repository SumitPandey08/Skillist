"use client";

import { motion } from "framer-motion";
import { Compass, LayoutDashboard, MessageSquareText, ShieldCheck, GitBranch, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "AI Career Pathfinder",
    description: "Find your ideal career path with confidence using predictive intelligence.",
    icon: <Compass className="h-6 w-6" />,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  },
  {
    title: "Skill Intelligence",
    description: "Track real progress, not assumptions, with deep analytics and verified data.",
    icon: <LayoutDashboard className="h-6 w-6" />,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    title: "AI Interviewer",
    description: "Practice with structured, real-time feedback in simulated environments.",
    icon: <MessageSquareText className="h-6 w-6" />,
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  },
  {
    title: "Validation Engine",
    description: "Prove what you actually know through comprehensive AI-proctored skill assessments.",
    icon: <ShieldCheck className="h-6 w-6" />,
    color: "text-rose-500",
    bg: "bg-rose-500/10"
  },
  {
    title: "Git Integration",
    description: "Connect your repo to show real work, commits, and true capabilities automatically.",
    icon: <GitBranch className="h-6 w-6" />,
    color: "text-slate-500",
    bg: "bg-slate-500/10"
  },
  {
    title: "Smart Matching",
    description: "Get matched directly to vetted employers based solely on your verified skill proof.",
    icon: <Briefcase className="h-6 w-6" />,
    color: "text-amber-500",
    bg: "bg-amber-500/10"
  },
];

export function FeaturesSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 md:mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            Core Features
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground"
          >
            Everything you need to level up your career trajectory, packed into one seamless platform.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="mobile-card flex flex-col items-start gap-6 group hover:border-primary/20 transition-all p-8"
            >
              <div className={cn("p-4 rounded-2xl transition-transform group-hover:scale-110 shadow-sm", feature.bg, feature.color)}>
                {feature.icon}
              </div>
              <div>
                <h3 className="text-2xl font-black mb-3 tracking-tight uppercase">{feature.title}</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
