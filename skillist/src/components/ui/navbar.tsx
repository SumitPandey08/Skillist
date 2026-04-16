"use client";

import Link from "next/link";
import { UserButton, useAuth } from "@clerk/nextjs";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatedButton } from "@/components/ui/animated-button";

export function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const { isSignedIn, isLoaded } = useAuth();
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  if (isDashboard) return null;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 inset-x-0 z-50 flex justify-center py-4 px-4 transition-all duration-300 ${isScrolled ? "pt-2" : "pt-6"}`}
    >
      <div 
        className={`w-full max-w-5xl flex items-center justify-between px-6 py-3 rounded-full border border-border/40 backdrop-blur-md transition-all duration-300 ${
          isScrolled ? "bg-background/80 shadow-[0_0_20px_rgba(var(--primary),0.1)]" : "bg-background/50"
        }`}
      >
        <Link href="/" className="font-extrabold text-xl tracking-tight flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gradient-to-tr from-primary to-indigo-500 font-sans text-xs flex items-center justify-center font-bold text-white shadow-sm">E</div>
          <span className="hidden sm:inline-block">ECHFLUX</span>
        </Link>

        {isLoaded && (
          <nav className="flex items-center gap-6">
            {!isSignedIn ? (
              <>
                <Link href="/sign-in" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Sign In
                </Link>
                <Link href="/sign-up">
                  <AnimatedButton size="sm" className="h-9">
                    Get Started
                  </AnimatedButton>
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mr-2">
                  Dashboard
                </Link>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-9 h-9 border-2 border-primary/20 hover:border-primary/50 transition-colors"
                    }
                  }} 
                />
              </>
            )}
          </nav>
        )}
      </div>
    </motion.header>
  );
}
