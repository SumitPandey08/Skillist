'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { completeOnboarding } from '@/app/onboarding/_actions'
import { motion } from 'framer-motion'
import { AnimatedButton } from '@/components/ui/animated-button'
import { User, Building2 } from 'lucide-react'
import { useSession } from '@clerk/nextjs'

export function OnboardingForm() {
  const [role, setRole] = React.useState<'student' | 'company'>('student')
  const [isPending, startTransition] = React.useTransition()
  const router = useRouter()
  const { session } = useSession()

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        const res = await completeOnboarding(formData)
        if (res?.success) {
          // Force Clerk to fetch a new JWT session token so middleware sees onboardingComplete: true
          await session?.reload()
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('Error during onboarding:', error)
      }
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full max-w-lg mt-20"
    >
      <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <Card className="relative overflow-hidden bg-background/60 backdrop-blur-xl border-border/50 shadow-2xl shadow-primary/5">
        
        {/* Animated header glow */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <form action={handleSubmit}>
          <CardHeader className="space-y-3 pb-8 text-center pt-10">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}>
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 mx-auto flex items-center justify-center mb-4 text-primary font-bold text-xl">
                E
              </div>
            </motion.div>
            <CardTitle className="text-3xl font-bold tracking-tight">Complete Your Profile</CardTitle>
            <CardDescription className="text-base">Tell us a bit about yourself to jumpstart your AI ecosystem.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 px-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.3 }}
              className="space-y-3"
            >
              <Label htmlFor="name" className="text-muted-foreground">Full Name</Label>
              <Input id="name" name="name" placeholder="John Doe" required className="bg-background/50 h-12 text-lg focus-visible:ring-primary/50 border-border/50" />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <Label className="text-muted-foreground text-center block">I am joining as a...</Label>
              <RadioGroup 
                defaultValue="student" 
                name="role"
                onValueChange={(value) => setRole(value as 'student' | 'company')}
                className="grid grid-cols-2 gap-4"
              >
                <div className="relative group">
                  <RadioGroupItem value="student" id="student" className="peer absolute inset-0 z-10 opacity-0 w-full h-full cursor-pointer" />
                  <div
                    className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-border/50 bg-background/30 p-6 group-hover:bg-accent/50 group-hover:border-primary/30 peer-data-checked:border-primary peer-data-checked:bg-primary/5 transition-all h-full text-center"
                  >
                    <User className="w-8 h-8 text-muted-foreground peer-data-checked:text-primary mb-1" />
                    <span className="font-bold text-lg">Student</span>
                    <span className="text-xs text-muted-foreground leading-tight">Scale my career.</span>
                  </div>
                </div>
                <div className="relative group">
                  <RadioGroupItem value="company" id="company" className="peer absolute inset-0 z-10 opacity-0 w-full h-full cursor-pointer" />
                  <div
                    className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-border/50 bg-background/30 p-6 group-hover:bg-accent/50 group-hover:border-primary/30 peer-data-checked:border-primary peer-data-checked:bg-primary/5 transition-all h-full text-center"
                  >
                    <Building2 className="w-8 h-8 text-muted-foreground peer-data-checked:text-primary mb-1" />
                    <span className="font-bold text-lg">Company</span>
                    <span className="text-xs text-muted-foreground leading-tight">Find top tier talent.</span>
                  </div>
                </div>
              </RadioGroup>
            </motion.div>

            <motion.div
               key={role}
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: 'auto' }}
               transition={{ duration: 0.3 }}
            >
              {role === 'student' ? (
                <div className="space-y-3 pb-2">
                  <Label htmlFor="primarySkill" className="text-muted-foreground">Primary Skill</Label>
                  <Input id="primarySkill" name="primarySkill" placeholder="e.g. React, Python, UI Design" required className="bg-background/50 h-12 text-lg focus-visible:ring-primary/50 border-border/50" />
                </div>
              ) : (
                <div className="space-y-6 pb-2">
                  <div className="space-y-3">
                    <Label htmlFor="companyName" className="text-muted-foreground">Company Name</Label>
                    <Input id="companyName" name="companyName" placeholder="Acme Inc." required className="bg-background/50 h-12 text-lg border-border/50" />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="industry" className="text-muted-foreground">Industry</Label>
                    <Input id="industry" name="industry" placeholder="Technology, Finance, etc." required className="bg-background/50 h-12 text-lg border-border/50" />
                  </div>
                </div>
              )}
            </motion.div>
          </CardContent>
          <CardFooter className="px-8 pb-10 pt-4">
            <AnimatedButton type="submit" className="w-full h-14 text-lg" disabled={isPending}>
              {isPending ? 'Activating Profile...' : 'Enter Ecosystem'}
            </AnimatedButton>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  )
}
