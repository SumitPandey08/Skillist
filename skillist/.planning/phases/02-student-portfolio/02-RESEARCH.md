# Phase 02: Student Portfolio & Skills - Research

**Researched:** 2026-04-12
**Domain:** Student Profiles, Portfolios, Skill Tracking, Progress Indicators
**Confidence:** HIGH

## Summary

Phase 2 focuses on empowering students to track and showcase their professional identity. This involves building a comprehensive tracking system for skills, projects, and certifications, along with a public-facing, SEO-optimized portfolio hub. A key feature is the inclusion of "progress indicators" to encourage profile completion and highlight proficiency levels.

**Primary recommendation:** Use a hybrid Slug-ID strategy (`johndoe-8f2a`) for public portfolio URLs to ensure SEO benefits while maintaining data stability. Implement a normalized database schema to support advanced skill-to-job matching in later phases.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Skill Tracking | DB / Backend | Client | Centralized storage for matching; dashboard for user updates |
| Project Tracking | DB / Backend | Client | Stores project metadata, links to skills; dashboard for CRUD |
| Certifications | DB / Backend | Client | Persistent record of credentials; dashboard for CRUD |
| Progress Indicators | Client | Logic (Backend) | Real-time feedback for completion; backend provides scores |
| Portfolio Hub | SSR / Client | CDN | Publicly accessible, SEO-optimized, pre-rendered for speed |
| Public Sharing (Slugs) | DB / Backend | — | Unique slug generation at student creation/update |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `drizzle-orm` | 0.45.2 | Database Schema | Type-safe SQL migrations and queries (already in project) |
| `next` | 16.2.3 | SSR & Routing | App Router support, SEO metadata, Server Components |
| `slugify` | ^1.6.6 | URL Slugs | Battle-tested utility for URL-safe string generation |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|--------------|
| `shadcn/ui` | 4.2.0 | UI Components | Progress, Tabs, Dialog, Badge, Card, Button (already in project) |
| `lucide-react` | 1.8.0 | Icons | Consistent iconography for skills/projects |
| `react-hook-form` | — | Form Handling | Standard for shadcn/ui form interactions |
| `zod` | 4.3.6 | Validation | Schema validation for forms and API routes |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `slugify` | Custom Regex | Risky for edge cases and special characters |
| Stored Progress | Computed | Simple computed fields reduce DB storage but increase CPU load during fetches |

**Installation:**
```bash
# Core additions
npm install slugify
# UI additions (if not already installed)
npx shadcn@latest add progress badge tabs dialog
```

**Version verification:**
- `next`: 16.2.3 (Verified via node_modules, 2026-04-12)
- `drizzle-orm`: 0.45.2 (Verified via package.json, 2026-04-12)

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/
│   ├── (dashboard)/
│   │   └── dashboard/
│   │       ├── skills/      # Skill tracking UI
│   │       ├── projects/    # Project tracking UI
│   │       └── profile/     # Profile/Bio/Slug settings
│   └── portfolio/
│       └── [slug]/          # Public portfolio hub (SSR)
├── components/
│   ├── portfolio/           # Reusable portfolio components
│   └── dashboard/           # Dashboard-specific components
└── lib/
    ├── progress.ts          # Logic for completeness calculation
    └── slugs.ts             # Slug generation & uniqueness logic
```

### Pattern 1: Public Portfolio Slugs (Hybrid Strategy)
**What:** Use a unique slug (`username` or `name-shortid`) as the primary lookup for public profiles.
**When to use:** For all public-facing pages that require SEO and human-readability.
**Example:**
```typescript
// src/lib/slugs.ts
import slugify from 'slugify';
import { nanoid } from 'nanoid';

export function generateStudentSlug(name: string): string {
  const base = slugify(name, { lower: true, strict: true });
  const suffix = nanoid(4); // Short ID for uniqueness
  return `${base}-${suffix}`;
}
```

### Anti-Patterns to Avoid
- **Pure UUIDs in URLs:** `/portfolio/550e8400-e29b-41d4-a716-446655440000` is bad for SEO and user experience.
- **Client-Side-Only Rendering for Portfolios:** Public portfolios MUST be server-rendered or pre-rendered to be indexed by search engines.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| URL Sanitization | Custom Regex | `slugify` | Handles unicode, special characters, and edge cases safely |
| Complex Forms | `useState` chaos | `react-hook-form` | Better performance, validation, and error state management |
| Modal/Dialogs | Custom overlay | `shadcn/ui` Dialog | Handles accessibility (ARIA), focus trapping, and transitions |
| Progress Bars | Native `<progress>` | `shadcn/ui` Progress | Consistent styling with Tailwind and Radix UI |

**Key insight:** Using standard UI primitives ensures the platform remains accessible and mobile-responsive with minimal effort.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| PostgreSQL | Persistence | ✓ | 16.2+ | — |
| Next.js | Routing/SSR | ✓ | 16.2.3 | — |
| Clerk | Auth Context | ✓ | 7.0.12 | — |

**Missing dependencies with no fallback:**
- None identified.

## Common Pitfalls

### Pitfall 1: Slug Collisions
**What goes wrong:** Two "Jane Does" get the same slug, leading to data overwrites or incorrect lookups.
**Why it happens:** Name-based slugs are not unique by default.
**How to avoid:** Always append a short, random suffix or the last 4 characters of the student's ID to the slug.
**Warning signs:** DB constraint violations or multiple students showing up on the same portfolio URL.

### Pitfall 2: Over-calculating Progress on the Fly
**What goes wrong:** Calculating complex profile completion scores on every page load slows down the dashboard.
**Why it happens:** Heavy aggregations (counting skills, projects, certs) in every request.
**How to avoid:** Use a simple weighting system (e.g., 25% each for Bio, Skills, Projects, Certs) or cache the score in the `students` table.

## Code Examples

### Drizzle Schema Updates
```typescript
// src/db/schema.ts updates
import { pgTable, text, timestamp, integer, boolean, uuid } from "drizzle-orm/pg-core";

export const skills = pgTable("skills", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  category: text("category"), // e.g., 'Technical', 'Soft Skill', 'Language'
});

export const studentSkills = pgTable("student_skills", {
  studentId: text("student_id").references(() => students.id, { onDelete: 'cascade' }),
  skillId: uuid("skill_id").references(() => skills.id, { onDelete: 'cascade' }),
  proficiency: integer("proficiency"), // 0-100 or 1-5
  isEndorsed: boolean("is_endorsed").default(false),
});

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: text("student_id").references(() => students.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  description: text("description"),
  url: text("url"),
  imageUrl: text("image_url"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
});

export const certifications = pgTable("certifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: text("student_id").references(() => students.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  issuer: text("issuer").notNull(),
  issueDate: timestamp("issue_date"),
  credentialUrl: text("credential_url"),
});
```

### Next.js Dynamic Metadata for SEO
```typescript
// src/app/portfolio/[slug]/page.tsx
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const student = await getStudentBySlug(params.slug);
  if (!student) return { title: 'Not Found' };

  return {
    title: `${student.name} | ECHFLUX Portfolio`,
    description: `Professional skills, projects, and certifications for ${student.name}.`,
    openGraph: {
      images: [student.profilePictureUrl || '/default-avatar.png'],
    },
  };
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| UUID-only URLs | Slugs + Metadata | ~2018 | Significantly better SEO and social sharing |
| Plain Text Skills | Vectorized Skills | 2023+ (AI era) | Enables semantic matching beyond exact keywords |
| Static Portfolio | Real-time Dashboard | Ongoing | Better user engagement and fresh data |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `slugify` is compatible with Next.js 16 | Standard Stack | Minimal, it's a pure JS library |
| A2 | Proficieny is better as 0-100% than 1-5 scale | Progress Logic | Scalability of matching algorithm |
| A3 | Progress indicators mean Profile Completeness | Summary | Potential misalignment with STU-01 |

## Open Questions

1. **How detailed should the skill progress be?**
   - What we know: STU-01 requires progress indicators.
   - What's unclear: Does it mean "course completion" (e.g., 50% through a course) or "subjective proficiency" (e.g., I rate myself 4/5)?
   - Recommendation: Start with subjective proficiency (1-5 or 0-100) for skills and "Profile Completion %" for the dashboard.

2. **How to handle project images?**
   - What we know: Projects usually have images.
   - What's unclear: Should we host them or just allow external URLs for Phase 2?
   - Recommendation: Allow external URLs initially; add Uploadthing/Cloudinary in a later phase if needed.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.4 |
| Config file | `vitest.config.ts` |
| Quick run command | `npm run test` |
| Full suite command | `npm run test:e2e` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| STU-01 | CRUD Skills/Projects/Certs | Unit | `vitest src/lib/crud.test.ts` | ❌ Wave 0 |
| STU-01 | Progress calculation logic | Unit | `vitest src/lib/progress.test.ts` | ❌ Wave 0 |
| STU-02 | Public profile rendering | Integration | `vitest src/app/portfolio/page.test.tsx` | ❌ Wave 0 |
| STU-02 | Slug generation & lookup | Unit | `vitest src/lib/slugs.test.ts` | ❌ Wave 0 |

### Wave 0 Gaps
- [ ] `src/lib/slugs.test.ts` — covers slug generation uniqueness.
- [ ] `src/lib/progress.test.ts` — covers profile completion math.
- [ ] `src/db/crud.test.ts` — covers many-to-many relationship handling.

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | yes | Managed by Clerk |
| V3 Session Management | yes | Managed by Clerk |
| V4 Access Control | yes | Verify user ID against owner of project/skill |
| V5 Input Validation | yes | `zod` schema enforcement |

### Known Threat Patterns for Next.js

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Insecure Direct Object Reference (IDOR) | Information Disclosure | Check `auth().userId` against `studentId` in every update |
| Data Leakage on Public Portfolio | Information Disclosure | Explicitly whitelist fields for the public API/view |
| XSS in Project Descriptions | Tampering | Next.js auto-escapes, but sanitize if using custom HTML/Markdown |

## Sources

### Primary (HIGH confidence)
- `drizzle-orm` - Official docs checked for many-to-many and UUID generation.
- `next.js` - App Router docs checked for `generateMetadata` and `generateStaticParams`.
- `shadcn/ui` - Registry checked for `progress` and `badge` availability.

### Secondary (MEDIUM confidence)
- SEO best practices for slugs (from industry standards).

### Tertiary (LOW confidence)
- Skill progress calculation logic (based on common LMS patterns).

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Libraries are current and well-supported.
- Architecture: HIGH - Follows Next.js 16 + App Router best practices.
- Pitfalls: MEDIUM - Based on common experience in portfolio platforms.

**Research date:** 2026-04-12
**Valid until:** 2026-05-12
