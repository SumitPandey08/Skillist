"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Clock, Target, FileX } from "lucide-react";
import { cn } from "@/lib/utils";

const problems = [
  {
    icon: <Target className="h-6 w-6" />,
    stat: "~42%",
    text: "of graduates are truly job-ready, leaving a massive skills gap.",
    color: "text-orange-500",
    bg: "bg-orange-500/10"
  },
  {
    icon: <AlertTriangle className="h-6 w-6" />,
    stat: "80%+",
    text: "of employers struggle to find the right talent for modern roles.",
    color: "text-red-500",
    bg: "bg-red-500/10"
  },
  {
    icon: <Clock className="h-6 w-6" />,
    stat: "Random",
    text: "learning paths leave students without clear career direction.",
    color: "text-amber-500",
    bg: "bg-amber-500/10"
  },
  {
    icon: <FileX className="h-6 w-6" />,
    stat: "Resumes",
    text: "fail to reflect real, practical, and verifiable skills.",
    color: "text-rose-500",
    bg: "bg-rose-500/10"
  },
];

export function ProblemSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Dynamic background element for mobile impact */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 opacity-30 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-destructive/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6">
        <div className="text-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive border border-destructive/10 text-xs font-black uppercase tracking-widest mb-6"
          >
            <AlertTriangle className="h-4 w-4" />
            <span>The Reality Check</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6 max-w-3xl mx-auto"
          >
            The Traditional System is <span className="text-destructive">Broken</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground"
          >
            A massive disconnect exists between education and employment. It&apos;s costing everyone time, talent, and opportunity.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16">
          {problems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="mobile-card flex flex-col items-start gap-4 group"
            >
              <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110", item.bg, item.color)}>
                {item.icon}
              </div>
              <div>
                <h3 className="text-3xl font-black tracking-tighter mb-1">{item.stat}</h3>
                <p className="text-sm font-bold text-muted-foreground leading-relaxed uppercase tracking-tight">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="glass-panel rounded-[2rem] p-8 md:p-12 text-center shadow-xl">
             <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-6">
                <FileX className="w-8 h-8" />
             </div>
             <h4 className="text-2xl md:text-3xl font-black tracking-tight mb-4">
               Result: <span className="text-destructive">Wasted Talent.</span>
             </h4>
             <p className="text-muted-foreground font-bold uppercase tracking-widest text-sm max-w-md mx-auto">
               Degrees and resumes are no longer enough to prove you can do the job.
             </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
