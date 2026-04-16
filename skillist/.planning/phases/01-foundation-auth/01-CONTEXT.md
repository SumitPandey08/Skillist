# Phase 01: Foundation & Auth - Context

**Gathered:** April 12, 2026
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase delivers the core infrastructure for ECHFLUX, focusing on secure user authentication and basic account management for both Students and Companies. It establishes the database schema, ORM integration, and initial user profile structure required for the "Skills-First" model.

</domain>

<decisions>
## Implementation Decisions

### Authentication & Authorization
- **D-01: Auth Provider**: **Clerk** — Chosen for rapid development and built-in support for multi-tenant roles (Student vs. Company) and secure session management.
- **D-02: Auth Flows**: Email/Password and OAuth (Google/GitHub) are enabled. Social login is prioritized to reduce friction for tech-centric users.
- **D-03: Role Management**: Unified signup flow with a mandatory "Choose Your Path" onboarding step for Student vs. Company selection.

### Core Infrastructure
- **D-04: Database**: **PostgreSQL (Supabase)** with `pgvector` extension. This ensures the foundational layer is ready for the Phase 4 hybrid matching engine.
- **D-05: ORM**: **Drizzle ORM** — Preferred for its native `pgvector` support and low-latency performance in high-concurrency AI workloads.
- **D-06: Frontend Framework**: **Next.js 16 (App Router)** with TypeScript for a type-safe, server-side rendered foundation.
- **D-07: Styling**: **Tailwind CSS** — Standard for modern, responsive AI interfaces and consistency with Vercel AI SDK components.

### User Data
- **D-08: Initial Profile Collection**: Name, email, role, and a "primary skill" tag for students; Name, email, role, and "company name" for employers.
- **D-09: Session Handling**: Secure, JWT-based sessions managed by Clerk, maintained across browser restarts.

### Claude's Discretion
- **D-10: Component Library**: I will use **Radix UI / shadcn/ui** for high-quality, accessible base components (Cards, Dialogs, Inputs).
- **D-11: Folder Structure**: Standard Next.js App Router organization (`src/app`, `src/components`, `src/lib`, `src/db`).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project & Roadmap
- `.planning/PROJECT.md` — Project context and core goals.
- `.planning/REQUIREMENTS.md` — REQ-IDs: AUTH-01, AUTH-02.
- `.planning/ROADMAP.md` — Phase 1 goals and success criteria.

### Technical Research
- `.planning/research/STACK.md` — Prescribed 2025 stack details (Clerk, Drizzle, Supabase).
- `.planning/research/SUMMARY.md` — Executive summary of the ECHFLUX architecture.

### Library Documentation (External)
- [Clerk Next.js SDK Docs](https://clerk.com/docs/nextjs) — Implementation of `authMiddleware` and `Organization` support.
- [Drizzle ORM Docs](https://orm.drizzle.team/) — Schema definition and PostgreSQL integration.
- [shadcn/ui Docs](https://ui.shadcn.com/) — UI component patterns.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None (Greenfield project).

### Established Patterns
- Next.js 16 App Router patterns (Server Components, Actions, Middleware).
- Drizzle schema patterns for multi-tenant PostgreSQL databases.

### Integration Points
- `/src/lib/clerk.ts` (Auth client/server setup).
- `/src/db/schema.ts` (Drizzle schema definitions).
- `/src/app/layout.tsx` (Global providers and root layout).

</code_context>

<specifics>
## Specific Ideas
- **Onboarding UX**: A clean, "Skills-First" onboarding experience that asks "What is your primary superpower?" to set the tone for the student profile early.

</specifics>

<deferred>
## Deferred Ideas
- **Skill Tracking Engine**: Deferred to Phase 2.
- **AI Matching Formulas**: Deferred to Phase 4.
- **Agentic Scheduling**: Deferred to Phase 2 (for basic automation).

</deferred>

---

*Phase: 01-foundation-auth*
*Context gathered: April 12, 2026*
