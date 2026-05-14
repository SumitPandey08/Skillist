"use client";

import { motion } from "framer-motion";
import { Sparkles, Route, Hammer, BarChart3, Handshake } from "lucide-react";
import { cn } from "@/lib/utils";

const solutions = [
  {
    title: "AI Career Mapping",
    description: "Align your natural strengths with market demand using deep behavioral analysis.",
    icon: <Route className="h-6 w-6" />,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    title: "Job-Ready Skill Building",
    description: "Hands-on projects and curated roadmaps that focus on what employers actually need.",
    icon: <Hammer className="h-6 w-6" />,
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  },
  {
    title: "Verifiable Skill Data",
    description: "Replace resumes with a live, AI-validated profile that proves your technical ability.",
    icon: <BarChart3 className="h-6 w-6" />,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10"
  },
  {
    title: "Precision Job Matching",
    description: "Direct connections to high-growth roles where you're a mathematically perfect fit.",
    icon: <Handshake className="h-6 w-6" />,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  },
];

export function SolutionSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-muted/30">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />

      <div className="container relative mx-auto px-6">
        <div className="text-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground mx-auto mb-8 shadow-xl shadow-primary/20 rotate-3"
          >
            <Sparkles className="h-8 w-8" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            Your AI Career <span className="text-primary">Operating System</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground"
          >
            We don&apos;t just help you learn. <span className="text-foreground font-black">We help you execute.</span> Skillist is the engine for your professional growth.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-5xl mx-auto">
          {solutions.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="mobile-card flex flex-col items-start gap-4 p-8"
            >
              <div className={cn("p-4 rounded-2xl", item.bg, item.color)}>
                {item.icon}
              </div>
              <div>
                <h3 className="text-xl font-black mb-2 tracking-tight uppercase">{item.title}</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
