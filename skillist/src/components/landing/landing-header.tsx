'use client'

import Link from 'next/link'
import { AnimatedButton } from '@/components/ui/animated-button'
import { useAuth } from '@clerk/nextjs'
import { motion } from 'framer-motion'

export function LandingHeader() {
  const { isSignedIn } = useAuth()

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold tracking-tight">ECHFLUX</Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/jobs" className="text-muted-foreground hover:text-foreground transition-colors">Browse Jobs</Link>
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <Link href="/dashboard">
              <AnimatedButton variant="outline" size="sm">Go to Dashboard</AnimatedButton>
            </Link>
          ) : (
            <>
              <Link href="/sign-in" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Sign In
              </Link>
              <Link href="/sign-up">
                <AnimatedButton size="sm">Get Started</AnimatedButton>
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.header>
  )
}
