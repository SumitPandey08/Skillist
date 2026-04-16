# Phase 01: Foundation & Auth - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in 01-CONTEXT.md — this log preserves the alternatives considered.

**Date:** April 12, 2026
**Phase:** 01-foundation-auth
**Areas discussed:** Auth Provider, ORM, Database, Onboarding Strategy, Framework/Styling

---

## Auth Provider
[auto] Selected: **Clerk** (Recommended in research for rapid multi-tenant dev)

| Option | Description | Selected |
|--------|-------------|----------|
| Clerk | Fast multi-tenant support, secure session management, built-in roles. | ✓ |
| NextAuth (Auth.js) | Flexible, open-source, but requires more manual setup for complex multi-tenancy. | |
| Supabase Auth | Native to Supabase, but less focused on specialized UI features compared to Clerk. | |

**User's choice:** [auto-selected] Clerk

---

## Database ORM
[auto] Selected: **Drizzle ORM** (Recommended in research for `pgvector` support)

| Option | Description | Selected |
|--------|-------------|----------|
| Drizzle ORM | Native `pgvector` support, lightweight, type-safe. | ✓ |
| Prisma | Well-known, but higher overhead and lagging `pgvector` support compared to Drizzle. | |

**User's choice:** [auto-selected] Drizzle ORM

---

## Database Provider
[auto] Selected: **Supabase / PostgreSQL** (Recommended in research)

| Option | Description | Selected |
|--------|-------------|----------|
| Supabase / PostgreSQL | Managed Postgres with `pgvector` extension, standard for AI-first apps. | ✓ |
| MongoDB | Good for flexible data, but lacks robust relational matching for skills-first model. | |

**User's choice:** [auto-selected] Supabase / PostgreSQL

---

## Onboarding Strategy
[auto] Selected: **Unified Signup + Role Step** (Standard for dual-sided marketplaces)

| Option | Description | Selected |
|--------|-------------|----------|
| Unified Signup + Role Step | Single entry point, role chosen post-signup. | ✓ |
| Separate Signup Pages | Dedicated entry points for Students and Companies. | |

**User's choice:** [auto-selected] Unified Signup + Role Step

---

## Framework & Styling
[auto] Selected: **Next.js 16 + Tailwind CSS** (Industry standard for 2025/2026)

| Option | Description | Selected |
|--------|-------------|----------|
| Next.js 16 + Tailwind | High-performance, SEO-friendly, and modern aesthetics. | ✓ |
| React + MUI | Solid, but Next.js offers superior performance and SEO for a public platform. | |

**User's choice:** [auto-selected] Next.js 16 + Tailwind CSS

---

## Claude's Discretion
- **Component Library**: shadcn/ui (Radix UI)
- **Folder Structure**: Standard Next.js 16 App Router organization

## Deferred Ideas
- Skill tracking, AI matching formulas, and agentic scheduling are deferred to subsequent phases.
