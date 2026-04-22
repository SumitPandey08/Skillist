"use client";

import { motion } from "framer-motion";
import { Sparkles, Route, Hammer, BarChart3, Handshake } from "lucide-react";

const solutions = [
  {
    title: "Choose the right career path",
    icon: <Route className="h-5 w-5 text-indigo-400" />,
    delay: 0.2,
  },
  {
    title: "Build real, job-ready skills",
    icon: <Hammer className="h-5 w-5 text-indigo-400" />,
    delay: 0.3,
  },
  {
    title: "Prove your ability with data",
    icon: <BarChart3 className="h-5 w-5 text-indigo-400" />,
    delay: 0.4,
  },
  {
    title: "Get matched to opportunities",
    icon: <Handshake className="h-5 w-5 text-indigo-400" />,
    delay: 0.5,
  },
];

export function SolutionSection() {
  return (
    <section className="relative py-24 bg-background overflow-hidden border-y border-border/50">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-background to-background" />

      <div className="container relative mx-auto px-4 max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-8 shadow-lg shadow-indigo-500/25"
        >
          <Sparkles className="h-8 w-8 text-white" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6"
        >
          Your AI Career <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Operating System</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-16"
        >
          We don&apos;t just help you learn. <span className="text-foreground font-medium">We help you execute.</span>
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {solutions.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: item.delay }}
              className="flex items-center gap-4 p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 backdrop-blur-sm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500/10">
                {item.icon}
              </div>
              <p className="text-lg font-medium text-left">{item.title}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
