"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden px-6">
      {/* Immersive background for mobile */}
      <div className="absolute inset-0 bg-primary/5 -z-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 rounded-full blur-[120px] -z-10 pointer-events-none opacity-50" />

      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-panel rounded-[3rem] p-8 md:p-20 text-center relative overflow-hidden shadow-2xl"
        >
          {/* Accent decoration */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center mb-8"
          >
            <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 text-primary shadow-inner">
              <Sparkles className="h-8 w-8" />
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            Your Career Deserves <span className="text-primary">Clarity</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-lg md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto font-bold uppercase tracking-tight"
          >
            Stop guessing. Start building. Join thousands of students engineering their future.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-4"
          >
            <Link href="/sign-up" className="btn-mobile bg-primary text-primary-foreground text-lg w-full sm:w-auto px-10 shadow-xl shadow-primary/20">
              Get Started for Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mt-2">
              No credit card required • Join in 60 seconds
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
