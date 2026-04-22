"use client";

import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Building2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function AudienceTabsSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-5xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold tracking-tight mb-12"
        >
          Two Sides, One <span className="text-primary">Ecosystem</span>
        </motion.h2>

        <Tabs defaultValue="students" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12 h-14 bg-muted/50 p-1 rounded-full border">
            <TabsTrigger value="students" className="rounded-full text-base font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <GraduationCap className="w-5 h-5 mr-2" />
              For Students
            </TabsTrigger>
            <TabsTrigger value="companies" className="rounded-full text-base font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Building2 className="w-5 h-5 mr-2" />
              For Companies
            </TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="mt-0 focus-visible:outline-none focus-[outline]:none">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center text-left"
            >
              <div className="rounded-3xl bg-gradient-to-br from-indigo-500/10 to-transparent p-1 border">
                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Students collaborating" className="rounded-[1.4rem] w-full object-cover aspect-square shadow-inner" />
              </div>
              <div>
                <h3 className="text-3xl md:text-4xl font-bold mb-4">From Confused to Career-Ready</h3>
                <p className="text-lg text-muted-foreground mb-8">
                  Get exactly what you need to break into tech. No more tutorial hell. No more applying into the void.
                </p>
                <ul className="space-y-4 mb-8">
                  {["Clear direction & personalized roadmaps", "Structured learning with real projects", "Real skill proof through unified data", "Better job chances via direct matching"].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/sign-up?role=student">
                  <Button size="lg" className="rounded-full px-8 h-12 shadow-md">Join as a Student</Button>
                </Link>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="companies" className="mt-0 focus-visible:outline-none focus-[outline]:none">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center text-left"
            >
            <div className="order-2 md:order-1">
                <h3 className="text-3xl md:text-4xl font-bold mb-4">Hire Based on Skills, Not Resumes</h3>
                <p className="text-lg text-muted-foreground mb-8">
                  Stop sifting through keyword-stuffed resumes. Hire talent whose skills have already been validated.
                </p>
                <ul className="space-y-4 mb-8">
                  {["Verified candidates with complete profiles", "Faster hiring through data matching", "Better candidate-job fit & retention", "Significantly reduced hiring costs"].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 text-blue-500 shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/sign-up?role=employer">
                  <Button size="lg" className="rounded-full px-8 h-12 shadow-md bg-blue-600 hover:bg-blue-700 text-white">Join as a Company</Button>
                </Link>
              </div>
              <div className="order-1 md:order-2 rounded-3xl bg-gradient-to-br from-blue-500/10 to-transparent p-1 border">
                <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Hiring managers" className="rounded-[1.4rem] w-full object-cover aspect-square shadow-inner" />
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
