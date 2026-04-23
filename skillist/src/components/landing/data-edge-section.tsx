"use client";

import { motion } from "framer-motion";
import { Activity, Code2, LineChart, Trophy, ShieldCheck } from "lucide-react";

export function DataEdgeSection() {
  return (
    <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
            >
              Built on Real Data, <br />
              <span className="text-blue-400">Not Guesswork</span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-slate-300 mb-8 border-l-4 border-blue-500 pl-4"
            >
              "Your profile reflects what you DO, not what you SAY"
            </motion.p>
            
            <div className="space-y-6">
              {[
                { icon: <Trophy className="h-5 w-5" />, title: "Skill Score (0-100)", desc: "Quantifiable metric based on evaluations." },
                { icon: <Activity className="h-5 w-5" />, title: "Consistency Tracking", desc: "Long-term data representing reliability." },
                { icon: <Code2 className="h-5 w-5" />, title: "Real Coding Activity", desc: "Direct integrations with source control." },
                { icon: <LineChart className="h-5 w-5" />, title: "Project Evaluation", desc: "Weighted scoring of tangible assets." },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="mt-1 h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">{item.title}</h4>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Mock Dashboard UI */}
            <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-6 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-lg font-medium text-slate-200">Global Skill Rating</h3>
                  <p className="text-sm text-slate-400">Top 15% of Candidates</p>
                </div>
                <div className="h-16 w-16 rounded-full border-4 border-blue-500 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">92</span>
                </div>
              </div>

              <div className="space-y-5">
                {[
                  { skill: "Frontend Development", val: "88%", color: "bg-emerald-500" },
                  { skill: "System Design", val: "74%", color: "bg-blue-500" },
                  { skill: "Data Structures", val: "95%", color: "bg-purple-500" },
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-300">{stat.skill}</span>
                      <span className="text-slate-400">{stat.val}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: stat.val }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 + i * 0.2 }}
                        className={`h-full rounded-full ${stat.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* GitHub Mock graph */}
              <div className="mt-8 pt-6 border-t border-slate-700">
                <p className="text-sm text-slate-400 mb-3">Activity Heatmap</p>
                <div className="flex gap-1">
                  {Array.from({ length: 28 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.8 + ((i * 7) % 5) * 0.1 }}
                      className={`h-4 w-4 rounded-sm ${
                        (i * 7 + 3) % 10 > 7
                          ? "bg-emerald-500" 
                          : (i * 13 + 5) % 10 > 5
                            ? "bg-emerald-500/60" 
                            : (i * 11 + 2) % 10 > 3
                              ? "bg-emerald-500/30" 
                              : "bg-slate-700"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Element */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute -right-6 -top-6 rounded-xl bg-slate-800 border border-slate-700 p-4 shadow-xl hidden md:block"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Verified Profile</p>
                  <p className="text-xs text-slate-400">Immutable record</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
