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

      <footer className="border-t border-border py-12 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 text-center">
          <div className="text-2xl font-bold mb-4">ECHFLUX</div>
          <p className="text-muted-foreground mb-8">The AI-First, Skills-Driven Career Ecosystem.</p>
          <div className="flex justify-center gap-8 text-sm text-muted-foreground">
            <a href="/jobs" className="hover:text-primary transition-colors">Browse Jobs</a>
            <a href="/sign-up" className="hover:text-primary transition-colors">Join as Student</a>
            <a href="/sign-up" className="hover:text-primary transition-colors">Join as Company</a>
          </div>
          <p className="mt-12 text-xs text-muted-foreground/50">
            © {new Date().getFullYear()} ECHFLUX. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
