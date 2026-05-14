import { HeroSection } from "@/components/landing/hero-section";
import { ProblemSection } from "@/components/landing/problem-section";
import { SolutionSection } from "@/components/landing/solution-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { DataEdgeSection } from "@/components/landing/data-edge-section";
import { AudienceTabsSection } from "@/components/landing/audience-tabs-section";
import { DifferentiationSection } from "@/components/landing/differentiation-section";
import { ImpactPricingSection } from "@/components/landing/impact-pricing-section";
import { CTASection } from "@/components/landing/cta-section";
import { Rocket } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col w-full overflow-hidden">
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <HowItWorksSection />
      <FeaturesSection />
      <DataEdgeSection />
      <AudienceTabsSection />
      <DifferentiationSection />
      <ImpactPricingSection />
      <CTASection />

      <footer className="py-20 bg-muted/30 border-t border-border px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-6 group">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                  <Rocket className="w-6 h-6" />
                </div>
                <span className="font-black text-xl tracking-tighter">
                  SKILLIST
                </span>
              </Link>
              <p className="text-muted-foreground font-medium max-w-sm leading-relaxed">
                The AI-First, Skills-Driven Career Ecosystem. Engineering the future of technical hiring through verified ability.
              </p>
            </div>
            
            <div>
              <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-6 text-foreground/50">Platform</h4>
              <ul className="space-y-4">
                <li><Link href="/jobs" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">Browse Jobs</Link></li>
                <li><Link href="/skills" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">Skill Assessments</Link></li>
                <li><Link href="/portfolio" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">Candidate Search</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-6 text-foreground/50">Company</h4>
              <ul className="space-y-4">
                <li><Link href="/about" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">Our Mission</Link></li>
                <li><Link href="/privacy" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs font-black text-muted-foreground/50 uppercase tracking-widest text-center md:text-left">
              © {new Date().getFullYear()} Skillist Engine. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Systems Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
