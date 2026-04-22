"use client";

import { motion } from "framer-motion";
import { Check, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ImpactPricingSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* IMPACT SECTION */}
        <div className="mb-32 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-12"
          >
            Real Impact
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { stat: "50%", text: "Reduction in average hiring time globally", highlight: "Faster Hiring" },
              { stat: "3x", text: "Improvement in candidate-job compatibility", highlight: "Better Fit" },
              { stat: "+85%", text: "Increase in overall student success & placement rates", highlight: "Higher Success" }
            ].map((impact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-3xl bg-muted/30 border text-center"
              >
                <div className="text-5xl font-extrabold text-primary mb-2">{impact.stat}</div>
                <div className="text-xl font-bold mb-2">{impact.highlight}</div>
                <p className="text-muted-foreground">{impact.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* PRICING SECTION */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
          >
            Simple Pricing
          </motion.h2>
          <p className="text-lg text-muted-foreground">Invest in your career growth today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl border bg-background flex flex-col"
          >
            <h3 className="text-2xl font-bold mb-2">Free</h3>
            <div className="text-3xl font-bold mb-6">₹0<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
            <p className="text-muted-foreground mb-8 flex-1">Start your journey and explore the platform.</p>
            <Button variant="outline" className="w-full rounded-full h-12">Get Started</Button>
          </motion.div>

          {/* Pro */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-8 rounded-3xl border-2 border-primary bg-primary/5 flex flex-col relative"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Star className="w-3 h-3" /> Most Popular
            </div>
            <h3 className="text-2xl font-bold mb-2 text-primary">Pro</h3>
            <div className="text-3xl font-bold mb-6">₹199<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
            <p className="text-muted-foreground mb-8 flex-1">Full career intelligence and roadmap guidance.</p>
            <Button className="w-full rounded-full h-12">Upgrade to Pro</Button>
          </motion.div>

          {/* Premium */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-8 rounded-3xl border bg-background flex flex-col"
          >
            <h3 className="text-2xl font-bold mb-2">Premium</h3>
            <div className="text-3xl font-bold mb-6">₹699<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
            <p className="text-muted-foreground mb-8 flex-1">Advanced AI practice + priority job matching.</p>
            <Button variant="outline" className="w-full rounded-full h-12 bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20 border-indigo-500/20">Go Premium</Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
