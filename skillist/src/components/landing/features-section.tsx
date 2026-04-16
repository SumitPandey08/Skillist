"use client";

import { motion } from "framer-motion";
import { BrainCircuit, LineChart, FileText, SearchCode, Sparkles, Target, Zap, ShieldCheck } from "lucide-react";

const features = [
  {
    title: "AI Match Scoring",
    description: "Our proprietary 40/20/20/20 formula uses vector embeddings to calculate the exact semantic fit between your skills and company needs.",
    icon: <SearchCode className="w-6 h-6 text-primary" />,
  },
  {
    title: "ATS-Optimized Tailoring",
    description: "Instantly rewrite your resume bullet points using AI to highlight the exact experience recruiters are looking for in specific roles.",
    icon: <FileText className="w-6 h-6 text-primary" />,
  },
  {
    title: "Semantic Job Discovery",
    description: "Don't just search for keywords. Our AI understands the context of your skills to find roles you didn't even know you were qualified for.",
    icon: <Sparkles className="w-6 h-6 text-primary" />,
  },
  {
    title: "Ranked Pipelines",
    description: "For employers, candidates are automatically ranked by Match Score, eliminating hours of manual resume screening.",
    icon: <Target className="w-6 h-6 text-primary" />,
  },
  {
    title: "Verified Skill Identity",
    description: "Build a persistent professional profile centered on validated projects and certifications rather than just static text.",
    icon: <ShieldCheck className="w-6 h-6 text-primary" />,
  },
  {
    title: "Real-time Analytics",
    description: "Track your profile completeness and application status with deep insights into how you compare to the market.",
    icon: <LineChart className="w-6 h-6 text-primary" />,
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-card relative overflow-hidden text-card-foreground">
      <div className="container px-4 md:px-6 relative z-10 mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight"
          >
            Intelligence at Every Step
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground leading-relaxed"
          >
            ECHFLUX uses state-of-the-art Large Language Models and Vector Databases to bridge the gap between human potential and organizational need.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -10 }}
              className="relative p-8 rounded-3xl glass border border-white/5 shadow-xl hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/30 transition-all duration-500 group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-transform duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
