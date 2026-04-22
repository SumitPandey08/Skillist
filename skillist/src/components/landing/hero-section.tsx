"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background pt-24 md:pt-32 pb-16 md:pb-24">
      {/* Background Gradients */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-indigo-500/10 blur-[120px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto flex max-w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-8"
        >
          <Sparkles className="h-4 w-4" />
          <span>The Future of Hiring is Here</span>
        </motion.div>

        <motion.h1 
          className="mx-auto max-w-4xl font-extrabold tracking-tight text-4xl sm:text-5xl md:text-7xl lg:text-[5rem] leading-[1.1] mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="block">Stop Guessing Your Career.</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-400 to-purple-500">
            Start Building It.
          </span>
        </motion.h1>

        <motion.p 
          className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          AI-powered platform that helps you choose the right path, build real skills, and get hired based on proof—not resumes.
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link href="/sign-up">
            <Button size="lg" className="h-14 px-8 text-lg rounded-full w-full sm:w-auto shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
              Start Your Career Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/skills">
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full w-full sm:w-auto border-primary/20 hover:bg-primary/5 backdrop-blur-sm">
              Get Your Skill Score
            </Button>
          </Link>
        </motion.div>

        <motion.div 
          className="mt-16 flex flex-col items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            Used by students preparing for tech careers | Built for real-world hiring
          </p>
          <div className="flex -space-x-2 overflow-hidden mt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <img
                key={i}
                className="inline-block h-8 w-8 rounded-full ring-2 ring-background object-cover"
                src={`https://i.pravatar.cc/100?img=${i + 10}`}
                alt="Student avatar"
              />
            ))}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted ring-2 ring-background">
              <span className="text-[10px] font-medium text-muted-foreground">10k+</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Abstract Graphic Element at Bottom */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
      />
    </section>
  );
}
