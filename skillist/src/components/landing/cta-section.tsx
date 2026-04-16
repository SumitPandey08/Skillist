"use client";

import { motion } from "framer-motion";
import { AnimatedButton } from "@/components/ui/animated-button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-32 relative overflow-hidden flex items-center justify-center bg-slate-950 text-white">
      {/* Background glowing orb */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
        <div className="w-[40rem] h-[20rem] bg-primary/30 rounded-full blur-[150px]" />
      </div>

      <div className="container px-4 md:px-6 relative z-10 text-center space-y-8 mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-widest"
        >
          <Sparkles className="w-3 h-3 text-primary" />
          Join the Future of Work
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl mx-auto leading-tight"
        >
          Ready to Redefine the Hiring Lifecycle?
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-xl text-slate-400 max-w-xl mx-auto leading-relaxed"
        >
          Whether you're looking for your dream role or your next 10x engineer, ECHFLUX is the platform where potential meets opportunity.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/sign-up">
            <AnimatedButton size="lg" className="w-[220px] bg-primary hover:bg-primary/90 text-white border-none h-14 text-lg">
              Start Free Today <ArrowRight className="w-5 h-5 ml-2" />
            </AnimatedButton>
          </Link>
          <Link href="/jobs">
            <AnimatedButton variant="outline" size="lg" className="w-[220px] border-white/20 hover:bg-white/10 text-white h-14 text-lg">
              Explore Jobs
            </AnimatedButton>
          </Link>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-sm text-slate-500 pt-4"
        >
          No credit card required. AI-powered matching starts instantly.
        </motion.p>
      </div>
    </section>
  );
}
