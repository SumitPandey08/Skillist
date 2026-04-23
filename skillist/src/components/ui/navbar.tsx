"use client";

import Link from "next/link";
import { UserButton, useAuth } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Rocket, Briefcase, User, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isSignedIn, isLoaded } = useAuth();
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [isOpen]);

  if (isDashboard) return null;

  const navLinks = [
    { name: "Jobs", href: "/jobs", icon: <Briefcase className="w-5 h-5" /> },
    { name: "Portfolio", href: "/portfolio", icon: <User className="w-5 h-5" /> },
    { name: "Skills", href: "/skills", icon: <Sparkles className="w-5 h-5" /> },
  ];

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-500 px-4 pt-4 pb-2",
          isScrolled ? "pt-2" : "pt-6"
        )}
      >
        <div className={cn(
          "mx-auto max-w-5xl flex items-center justify-between px-5 py-3 rounded-2xl border transition-all duration-500",
          isScrolled 
            ? "glass-panel shadow-lg shadow-primary/5 bg-background/80" 
            : "bg-transparent border-transparent"
        )}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              <Rocket className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              SKILLIST
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <div className="h-4 w-px bg-border mx-2" />
            <ThemeToggle />
            {isLoaded && !isSignedIn && (
              <Link href="/sign-up" className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-bold shadow-md shadow-primary/10 hover:opacity-90 transition-opacity">
                Get Started
              </Link>
            )}
            {isSignedIn && <UserButton />}
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(true)}
              className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary active:scale-90 transition-transform"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl md:hidden flex flex-col p-6"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="font-bold text-xl tracking-tight">Menu</span>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center active:scale-90 transition-transform"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-primary border shadow-sm">
                      {link.icon}
                    </div>
                    <span className="text-lg font-bold">{link.name}</span>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-auto pt-8 border-t space-y-4">
              {!isSignedIn ? (
                <>
                  <Link 
                    href="/sign-in" 
                    className="w-full h-14 flex items-center justify-center font-bold text-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/sign-up" 
                    className="w-full h-14 flex items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-lg shadow-primary/20"
                    onClick={() => setIsOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/50">
                  <span className="font-medium">My Account</span>
                  <UserButton />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
