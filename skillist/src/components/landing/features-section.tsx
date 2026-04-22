"use client";

import { motion } from "framer-motion";
import { Compass, LayoutDashboard, MessageSquareText, ShieldCheck, GitBranch, Briefcase } from "lucide-react";

const features = [
  {
    title: "AI Career Pathfinder",
    description: "Find your ideal career path with confidence using predictive intelligence.",
    icon: <Compass className="h-8 w-8 text-emerald-400" />,
    gradient: "from-emerald-500/10 to-teal-500/5",
  },
  {
    title: "Skill Intelligence Dashboard",
    description: "Track real progress, not assumptions, with deep analytics.",
    icon: <LayoutDashboard className="h-8 w-8 text-blue-400" />,
    gradient: "from-blue-500/10 to-cyan-500/5",
  },
  {
    title: "AI Interviewer",
    description: "Practice with structured, real-time feedback in simulated environments.",
    icon: <MessageSquareText className="h-8 w-8 text-purple-400" />,
    gradient: "from-purple-500/10 to-fuchsia-500/5",
  },
  {
    title: "Skill Validation Engine",
    description: "Prove what you actually know through comprehensive skill assessments.",
    icon: <ShieldCheck className="h-8 w-8 text-rose-400" />,
    gradient: "from-rose-500/10 to-pink-500/5",
  },
  {
    title: "GitHub & Coding Integration",
    description: "Connect your repo to show real work, commits, and true capabilities.",
    icon: <GitBranch className="h-8 w-8 text-slate-400" />,
    gradient: "from-slate-500/10 to-gray-500/5",
  },
  {
    title: "Smart Job Matching",
    description: "Get matched directly to vetted employers based solely on verified skills.",
    icon: <Briefcase className="h-8 w-8 text-amber-400" />,
    gradient: "from-amber-500/10 to-yellow-500/5",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
          >
            Core Features
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground mx-auto max-w-2xl"
          >
            Everything you need to level up your career trajectory, packed into one seamless platform.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative overflow-hidden group p-8 rounded-3xl border bg-gradient-to-br ${feature.gradient} backdrop-blur-sm transition-all hover:shadow-xl hover:-translate-y-1`}
            >
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 group-hover:scale-150 transition-all duration-500">
                {feature.icon}
              </div>
              <div className="relative z-10">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-background/80 shadow-sm backdrop-blur-md">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
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
