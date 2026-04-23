"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Target, Rocket } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-16 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background blobs for mobile vibrancy */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full -z-10 pointer-events-none opacity-50">
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent/20 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/10 text-sm font-bold mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Career Intelligence</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            Stop Guessing Your Career.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-400 to-accent animate-gradient-x">
              Start Building It.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-2xl text-lg md:text-xl text-muted-foreground mb-12"
          >
            Skillist uses AI to map your natural strengths to market demand, giving you a verifiable roadmap to your dream role.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto"
          >
            <Link href="/sign-up" className="btn-mobile bg-primary text-primary-foreground text-lg shadow-xl shadow-primary/20">
              Get Started for Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link href="/skills" className="btn-mobile bg-muted text-foreground border text-lg">
              Get Skill Score
            </Link>
          </motion.div>

          {/* Floating Feature Cards for Mobile Impact */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-20 w-full max-w-4xl">
            {[
              { label: "AI Roadmap", icon: <Target className="w-5 h-5" />, color: "bg-blue-500" },
              { label: "Real Proof", icon: <Rocket className="w-5 h-5" />, color: "bg-purple-500" },
              { label: "Direct Match", icon: <Sparkles className="w-5 h-5" />, color: "bg-amber-500" },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="mobile-card flex flex-col items-center gap-3 text-center"
              >
                <div className={`${feature.color} w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-black/5`}>
                  {feature.icon}
                </div>
                <span className="font-bold text-sm">{feature.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
