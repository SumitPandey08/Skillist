"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

export function DifferentiationSection() {
  const comparisons = [
    { label: "Core Focus", trad: "Resume-based", ech: "Skill-based" },
    { label: "Platform", trad: "Fragmented tools", ech: "Unified system" },
    { label: "Evaluation", trad: "Guesswork", ech: "Data-driven" },
    { label: "Competence", trad: "No validation", ech: "Verified skills" },
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold tracking-tight mb-16"
        >
          Why <span className="text-primary">ECHFLUX</span> Wins
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border bg-background overflow-hidden shadow-xl"
        >
          {/* Header Row */}
          <div className="grid grid-cols-3 bg-muted/50 p-6 border-b text-lg md:text-xl font-bold">
            <div className="text-left text-muted-foreground font-medium">Approach</div>
            <div className="text-muted-foreground">Traditional Platforms</div>
            <div className="text-primary bg-primary/10 rounded-lg py-1">ECHFLUX</div>
          </div>

          {/* Body Rows */}
          <div className="divide-y">
            {comparisons.map((row, index) => (
              <div key={index} className="grid grid-cols-3 p-6 items-center hover:bg-muted/30 transition-colors">
                <div className="text-left font-medium text-muted-foreground">{row.label}</div>
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <X className="h-5 w-5 text-destructive/70" />
                  <span className="text-sm md:text-base">{row.trad}</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-foreground font-semibold">
                  <Check className="h-5 w-5 text-emerald-500" />
                  <span className="text-sm md:text-base">{row.ech}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
