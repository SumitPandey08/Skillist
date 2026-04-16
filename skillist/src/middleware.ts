import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)', '/api/webhooks(.*)', '/jobs(.*)', '/portfolio(.*)'])
const isOnboardingRoute = createRouteMatcher(['/onboarding(.*)'])
const isStudentDashboard = createRouteMatcher(['/dashboard/student(.*)'])
const isCompanyDashboard = createRouteMatcher(['/dashboard/company(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth()
  const metadata = (sessionClaims as any)?.metadata || (sessionClaims as any)?.publicMetadata;

  // 1. If public route, skip
  if (isPublicRoute(req)) return

  // 2. If not signed in, protect
  if (!userId) {
    const signInUrl = new URL('/sign-in', req.url)
    return NextResponse.redirect(signInUrl)
  }

  // 3. If signed in but no role (onboarding incomplete), redirect to onboarding
  const onboardingComplete = metadata?.onboardingComplete || (sessionClaims as any)?.publicMetadata?.onboardingComplete
  if (!onboardingComplete && !isOnboardingRoute(req)) {
    console.log('[MIDDLEWARE DEBUG] Redirection to Onboarding! OnboardingComplete is falsy.');
    const onboardingUrl = new URL('/onboarding', req.url)
    return NextResponse.redirect(onboardingUrl)
  }

  // 4. If onboarding complete but trying to access onboarding, redirect to dispatcher
  if (onboardingComplete && isOnboardingRoute(req)) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // 5. Role-based protection for dashboards
  const userRole = metadata?.role
  if (isStudentDashboard(req) && userRole !== 'student') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
  if (isCompanyDashboard(req) && userRole !== 'company') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|musl)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
