"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Clock, Target, FileX } from "lucide-react";

const problems = [
  {
    icon: <Target className="h-6 w-6 text-orange-500" />,
    stat: "~42%",
    text: "of graduates are truly job-ready, leaving a massive skills gap.",
  },
  {
    icon: <AlertTriangle className="h-6 w-6 text-red-500" />,
    stat: "80%+",
    text: "of employers struggle to find the right talent for modern roles.",
  },
  {
    icon: <Clock className="h-6 w-6 text-amber-500" />,
    stat: "Random",
    text: "learning paths leave students without clear career direction.",
  },
  {
    icon: <FileX className="h-6 w-6 text-rose-500" />,
    stat: "Resumes",
    text: "fail to reflect real, practical, and verifiable skills.",
  },
];

export function ProblemSection() {
  return (
    <section className="relative py-24 bg-slate-50 dark:bg-slate-950/50 overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute left-1/2 top-1/2 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 opacity-20 dark:opacity-10 blur-[100px] bg-gradient-to-r from-red-500 to-orange-500 rounded-full mix-blend-multiply flex-none" />

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-destructive/20 bg-destructive/5 px-3 py-1 text-sm font-medium text-destructive mb-6"
          >
            <AlertTriangle className="h-4 w-4" />
            <span>The Reality Check</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-6"
          >
            The Traditional System is <span className="text-destructive">Broken</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground mx-auto max-w-2xl"
          >
            A massive disconnect exists between education and employment. It&apos;s costing everyone.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {problems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index + 0.3 }}
              className="relative group rounded-2xl border border-border bg-background p-6 shadow-sm hover:shadow-md hover:border-destructive/30 transition-all duration-300"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-muted group-hover:bg-destructive/10 transition-colors">
                {item.icon}
              </div>
              <h3 className="text-3xl font-bold mb-2 tracking-tight">{item.stat}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-br from-destructive/10 via-background to-background p-[1px]"
        >
          <div className="rounded-2xl bg-background/80 backdrop-blur-xl px-6 py-8 text-center border shadow-sm">
            <h4 className="text-xl md:text-2xl font-semibold mb-2">
              Result: <span className="text-destructive">Time wasted. Talent wasted. Opportunities missed.</span>
            </h4>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
