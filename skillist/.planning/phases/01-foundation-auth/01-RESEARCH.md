# Phase 01: Foundation & Auth - Research

**Researched:** May 2026
**Domain:** Infrastructure, Authentication, Database Schema
**Confidence:** HIGH

## Summary

This research establishes the foundational patterns for ECHFLUX using Clerk for authentication, Drizzle ORM with Supabase (PostgreSQL) for data persistence, and Next.js 16 App Router for the frontend. The architecture focuses on a "Skills-First" multi-tenant model (Students vs. Companies) with built-in support for vector embeddings to enable future AI matching.

**Primary recommendation:** Use Clerk's `publicMetadata` to track onboarding state and user roles, coupled with a Next.js middleware check to enforce the onboarding flow before accessing dashboard features.

<user_constraints>
## User Constraints (from 01-CONTEXT.md)

### Locked Decisions
- **Auth Provider**: **Clerk** (Email/Password, Google/GitHub).
- **Role Management**: Unified signup with "Choose Your Path" onboarding step.
- **Database**: **PostgreSQL (Supabase)** with `pgvector`.
- **ORM**: **Drizzle ORM**.
- **Frontend Framework**: **Next.js 16 (App Router)** with TypeScript.
- **Styling**: **Tailwind CSS**.
- **Component Library**: **Radix UI / shadcn/ui**.
- **Folder Structure**: `src/app`, `src/components`, `src/lib`, `src/db`.

### the agent's Discretion
- **Component Library**: I will use **Radix UI / shadcn/ui** for high-quality, accessible base components (Cards, Dialogs, Inputs).
- **Folder Structure**: Standard Next.js App Router organization (`src/app`, `src/components`, `src/lib`, `src/db`).

### Deferred Ideas (OUT OF SCOPE)
- **Skill Tracking Engine**: Deferred to Phase 2.
- **AI Matching Formulas**: Deferred to Phase 4.
- **Agentic Scheduling**: Deferred to Phase 2 (for basic automation).
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| AUTH-01 | User can create a student or company account using email/password or OAuth. | Clerk 7.x supports unified signup; `publicMetadata` handles role selection. |
| AUTH-02 | User can manage their profile, settings, and session state. | Clerk Dashboard and `useUser()` hook provide native profile/session management. |
</phase_requirements>

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| User Authentication | Frontend Server (SSR) | Clerk (Third Party) | Clerk manages identity; Next.js middleware enforces protection. |
| Role Management | API / Backend | Clerk Metadata | Syncing roles to Clerk ensures rapid authorization checks in middleware. |
| User Data Persistence | Database (Supabase) | — | Single source of truth for business logic and matching data. |
| User Onboarding Flow | Browser / Client | Frontend Server (SSR) | Multi-step form interaction on client; state persisted via server actions. |
| DB Migrations | Dev CLI | — | Drizzle Kit manages schema synchronization. |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@clerk/nextjs` | 7.x | Authentication | Built-in multi-tenant/organization support and App Router stability. [VERIFIED: npm registry] |
| `drizzle-orm` | 0.45+ | Database ORM | High performance, native `pgvector` support, and type-safety. [VERIFIED: drizzle-team] |
| `drizzle-kit` | 0.31+ | Migration Tool | Rapid schema prototyping and deployment. [VERIFIED: environment probe] |
| `pg` | 8.x | Postgres Client | Standard node-postgres driver for Drizzle. [VERIFIED: STACK.md] |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|--------------|
| `svix` | 1.x | Webhook Verification | For secure sync between Clerk and custom DB. [CITED: clerk docs] |
| `zod` | 3.x | Validation | Schema validation for forms and Drizzle definitions. [ASSUMED] |
| `lucide-react` | Latest | Icons | Standard UI icons. [CITED: STACK.md] |

**Installation:**
```bash
npm install @clerk/nextjs drizzle-orm pg svix zod lucide-react
npm install -D drizzle-kit @types/pg
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/              # App Router Pages & API Routes
│   ├── api/          # Webhooks (Clerk sync)
│   ├── onboarding/   # Multi-step onboarding flow
│   └── (dashboard)/  # Protected routes (Student/Company)
├── components/       # Shared UI components (shadcn/ui)
├── db/               # Drizzle schema & client
│   └── schema.ts     # Table definitions
├── lib/              # Utility functions/shared logic
│   └── utils.ts      # Tailwind class merging
└── middleware.ts     # Clerk auth & onboarding redirection
```

### Pattern 1: Multi-Step Onboarding with Clerk
**What:** Users are redirected to an onboarding flow immediately after signup if they haven't completed their profile.
**When to use:** Every first-time signup to capture Student vs. Company role.
**Example:**
```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/api/webhooks(.*)'])
const isOnboardingRoute = createRouteMatcher(['/onboarding(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth()

  // 1. If public route, skip
  if (isPublicRoute(req)) return

  // 2. If not signed in, protect
  if (!userId) {
    const signInUrl = new URL('/sign-in', req.url)
    return NextResponse.redirect(signInUrl)
  }

  // 3. If signed in but no role (onboarding incomplete), redirect to onboarding
  const onboardingComplete = sessionClaims?.metadata?.onboardingComplete
  if (!onboardingComplete && !isOnboardingRoute(req)) {
    const onboardingUrl = new URL('/onboarding', req.url)
    return NextResponse.redirect(onboardingUrl)
  }

  // 4. If onboarding complete but trying to access onboarding, redirect to dashboard
  if (onboardingComplete && isOnboardingRoute(req)) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
})
```

### Pattern 2: Multi-Tenant Schema (Drizzle)
**What:** A shared `users` table with specific `students` and `companies` tables linked via Clerk ID.
**Example:**
```typescript
// src/db/schema.ts
import { pgTable, text, timestamp, varchar, vector, pgEnum } from "drizzle-orm/pg-core"

export const userRoleEnum = pgEnum("user_role", ["student", "company"])

export const users = pgTable("users", {
  id: text("id").primaryKey(), // Clerk User ID
  email: text("email").notNull().unique(),
  role: userRoleEnum("role"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const students = pgTable("students", {
  id: text("id").primaryKey().references(() => users.id),
  name: text("name").notNull(),
  primarySkill: text("primary_skill"),
  skillVector: vector("skill_vector", { dimensions: 1536 }), // Ready for Phase 4
})

export const companies = pgTable("companies", {
  id: text("id").primaryKey().references(() => users.id),
  companyName: text("company_name").notNull(),
  industry: text("industry"),
})
```

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Authentication | Custom JWT/Cookies | Clerk | Session management, OAuth, and multi-tenancy are complex and high-risk. |
| Component UI | Custom CSS components | shadcn/ui (Radix) | Accessibility, consistency, and speed. |
| DB Migrations | Manual SQL scripts | Drizzle Kit | Typesafe migrations that stay in sync with your TypeScript schema. |
| Webhook Verification | Custom crypto logic | `svix` | Prevents replay attacks and unauthorized payload injection. |

## Common Pitfalls

### Pitfall 1: Middleware Infinite Redirects
**What goes wrong:** Redirecting to `/onboarding` when the user is already on `/onboarding`.
**How to avoid:** Use `createRouteMatcher` to exclude the onboarding route from the redirection logic.

### Pitfall 2: Syncing Lag
**What goes wrong:** User signs up, database record is created via webhook, but user is redirected to dashboard before record exists.
**How to avoid:** Treat the database record as "lazy". The UI should handle missing DB profiles gracefully or use Clerk's `publicMetadata` as the source of truth for high-frequency checks.

## Code Examples

### Webhook Handler (Clerk Sync)
```typescript
// src/app/api/webhooks/clerk/route.ts
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { db } from '@/db'
import { users } from '@/db/schema'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
  if (!WEBHOOK_SECRET) throw new Error('Missing secret')

  const headerPayload = await headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  const payload = await req.json()
  const body = JSON.stringify(payload)
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id!,
      "svix-timestamp": svix_timestamp!,
      "svix-signature": svix_signature!,
    }) as WebhookEvent
  } catch (err) {
    return new Response('Error occured', { status: 400 })
  }

  if (evt.type === 'user.created') {
    const { id, email_addresses } = evt.data
    await db.insert(users).values({
      id,
      email: email_addresses[0].email_address,
    })
  }

  return new Response('', { status: 200 })
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `authMiddleware` | `clerkMiddleware` | Clerk v5/v6 | Better performance and App Router integration. |
| Prisma | Drizzle | 2024/2025 | native `pgvector` and significantly lower overhead in edge functions. |
| Multi-app auth | Clerk Organizations | 2024 | Easier management of "Company" users under a single tenant. |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `zod` is standard for validation | Standard Stack | Low - can use Joi or others, but Zod is most common with Drizzle. |
| A2 | Clerk `publicMetadata` is sufficient for roles | Summary | Low - can always move to a custom table, but Clerk is faster for V1. |

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Runtime | ✓ | 24.12.0 | — |
| npm | Package Manager | ✓ | 11.6.2 | — |
| PostgreSQL | Data layer | ✓ | 17.x | Supabase |
| Drizzle Kit | Migrations | ✓ | 0.31.10 | — |

## Validation Architecture

> **Note:** Detailed validation architecture is maintained in [01-VALIDATION.md](./01-VALIDATION.md).

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 3.x + Playwright |
| Config file | `vitest.config.ts` |
| Quick run command | `npm run test` |
| Full suite command | `npm run test:e2e` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| AUTH-01 | User signup (Student/Company) | E2E | `npx playwright test tests/e2e/auth.spec.ts` | ❌ Wave 0 |
| AUTH-02 | User profile management | E2E | `npx playwright test tests/e2e/onboarding.spec.ts` | ❌ Wave 0 |
| AUTH-SYNC | Clerk-to-DB Sync | Integration | `npm run test tests/integration/webhooks.test.ts` | ❌ Wave 0 |
| AUTH-SEC | Middleware protection | Unit | `npm run test tests/unit/middleware.test.ts` | ❌ Wave 0 |

### Wave 0 Gaps
- [ ] `vitest.config.ts` — configuration needed
- [ ] `playwright.config.ts` — E2E setup
- [ ] `tests/setup.ts` — database mocks and Clerk mocks

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | yes | Clerk (OIDC / Managed JWT) |
| V3 Session Management | yes | Clerk Session Tokens |
| V4 Access Control | yes | Middleware RBAC + Clerk Roles |
| V5 Input Validation | yes | Zod schemas |
| V6 Cryptography | yes | Clerk (Credentials) |

### Known Threat Patterns for Next.js/Clerk

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Insecure Direct Object Reference | Information Disclosure | Clerk `auth().userId` checks on every Server Action/API route. |
| Webhook Spoofing | Tampering | Svix signature verification for Clerk webhooks. |
| Cross-Site Scripting (XSS) | Tampering | React auto-escaping + CSP headers in Next.js. |

## Sources

### Primary (HIGH confidence)
- `/clerk/clerk-docs` - Clerk middleware, metadata, and webhooks.
- `/drizzle-team/drizzle-orm-docs` - Schema definition, `pgvector`, and `drizzle-kit`.
- [Clerk Docs: Sync Data](https://clerk.com/docs/integrations/webhooks/sync-data)

### Secondary (MEDIUM confidence)
- [Drizzle + Supabase Guide](https://orm.drizzle.team/docs/get-started-postgresql#supabase)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Verified via registry and STACK.md.
- Architecture: HIGH - Clerk + Next.js patterns are industry standard.
- Pitfalls: HIGH - Common middleware/sync issues documented.

**Research date:** May 12, 2026
**Valid until:** June 12, 2026
