# Phase 03: Company Job Management - Research

**Researched:** 2026-05-22
**Domain:** Job Listings, Skill Requirements, Company Dashboard, Status Management
**Confidence:** HIGH

## Summary

Phase 3 focuses on the employer side of the ECHFLUX marketplace, specifically enabling companies to create and manage job postings with granular skill requirements. This is a foundational step for the "Skills-First" matching engine planned for Phase 4. Key technical challenges include implementing a robust skill-tagging UI and maintaining a clean many-to-many relationship between jobs and skills.

**Primary recommendation:** Use `emblor` for the skill-tagging interface, as it integrates seamlessly with shadcn/ui and supports both autocomplete from existing skills and adding new ones. Implement a strict "Company-Only" access control in the dashboard and server actions to prevent unauthorized job modifications.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Auth Provider**: Clerk (established in Phase 1).
- **Database**: PostgreSQL with Drizzle ORM.
- **Frontend**: Next.js 16 (App Router) + Tailwind CSS + shadcn/ui.
- **Skill Taxonomy**: Global `skills` table with name-based uniqueness.

### the agent's Discretion
- **Tagging Library**: I recommend **Emblor** for the skill-input field due to its high degree of customization and shadcn/ui compatibility.
- **Dashboard Structure**: Separate the Company Dashboard view from the Student Dashboard via role-based conditional rendering or dedicated sub-routes (e.g., `/dashboard/company`).

### Deferred Ideas (OUT OF SCOPE)
- **AI Matching Engine**: Deferred to Phase 4.
- **Candidate Pipeline Analytics**: Deferred to Phase 5.
- **Automated Scheduling**: Deferred to Phase 2 (for basic automation, full agentic layer later).
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| COMP-01 | Company can post and manage job listings with explicit skill requirements. | Standard CRUD with `emblor` tagging and many-to-many DB schema. |
</phase_requirements>

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Job Posting CRUD | API / Backend | Browser | Server Actions handle persistence; Browser handles form input. |
| Job-Skill Association | DB / Backend | — | Many-to-many join table (`job_skills`) tracks requirements. |
| Skill Tagging UI | Browser / Client | DB / Backend | Interactive multi-select with autocomplete from global `skills` table. |
| Job Status Workflow | API / Backend | — | Enum-driven state (Draft -> Active -> Closed). |
| Job SEO & Discovery | SSR / Frontend Server | Browser | Server-rendered public pages for job listings. |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `emblor` | Latest | Skill Tag Input | Optimized for shadcn/ui; handles complex tagging scenarios. [VERIFIED: web search] |
| `drizzle-orm` | 0.45.2 | Database ORM | Handles relational queries and enums natively. [VERIFIED: package.json] |
| `zod` | 4.3.6 | Validation | Schema validation for job creation forms. [VERIFIED: package.json] |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|--------------|
| `lucide-react` | 1.8.0 | Icons | Status indicators and UI elements. [VERIFIED: package.json] |
| `nanoid` | 5.1.7 | Unique IDs | Generating IDs for new jobs. [VERIFIED: package.json] |
| `date-fns` | — | Date Formatting | Displaying "Posted X days ago". [ASSUMED] |

**Installation:**
```bash
npm install emblor date-fns
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/
│   ├── (dashboard)/
│   │   └── dashboard/
│   │       ├── company/     # Company-specific dashboard pages
│   │       │   ├── jobs/    # Job management (List view)
│   │       │   └── new/     # Job creation form
│   │       └── _components/ # Dashboard-specific shared UI
│   └── jobs/
│       └── [id]/            # Public job detail page (SSR)
├── components/
│   └── jobs/                # Reusable job UI components
└── lib/
    └── jobs.ts              # Job-specific utility functions
```

### Pattern 1: Role-Based Dashboard Dispatching
**What:** Use the user's role to redirect or conditionally render the appropriate dashboard experience.
**When to use:** In `/dashboard/page.tsx` to handle multi-tenant landing.
**Example:**
```typescript
// src/app/(dashboard)/dashboard/page.tsx
const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
if (user.role === 'company') {
  return <CompanyDashboard ... />;
}
return <StudentDashboard ... />;
```

### Anti-Patterns to Avoid
- **Client-Side Permission Checks Only:** Never trust the client role; always verify the `userId` owns the `companyId` in Server Actions.
- **Deleting Active Jobs:** Prefer `status = 'closed'` instead of hard deletion to maintain applicant history and data integrity.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Multi-Select Tags | Custom dropdown + state | `emblor` | Handles keyboard nav, truncation, and deletion out-of-the-box. |
| Status State Machine | String constants | Drizzle `pgEnum` | Ensures database-level integrity for job states. |
| Form Validation | Manual if/else checks | `zod` + `react-hook-form` | Consistent error handling and typesafety. |

## Common Pitfalls

### Pitfall 1: Missing Company ID Association
**What goes wrong:** Jobs are created but not linked to a company, making them unmanageable.
**How to avoid:** Always extract `companyId` from the `companies` table using the `auth().userId` before insertion.

### Pitfall 2: Duplicate Skills in Database
**What goes wrong:** "React" and "react" saved as separate skills.
**How to avoid:** Normalize skill names (lowercase/trim) before checking for existence in the global `skills` table.

## Code Examples

### Job Status Enum & Schema
```typescript
// src/db/schema.ts
export const jobStatusEnum = pgEnum("job_status", ["draft", "active", "closed"])

export const jobs = pgTable("jobs", {
  id: text("id").primaryKey(),
  companyId: text("company_id").notNull().references(() => companies.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location"),
  salaryRange: text("salary_range"),
  jobType: text("job_type"), // 'full-time', 'part-time', etc.
  status: jobStatusEnum("status").notNull().default('draft'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const jobSkills = pgTable("job_skills", {
  jobId: text("job_id").notNull().references(() => jobs.id, { onDelete: 'cascade' }),
  skillId: text("skill_id").notNull().references(() => skills.id),
  requiredProficiency: text("required_proficiency").notNull().default('beginner'),
}, (t) => ({
  pk: primaryKey({ columns: [t.jobId, t.skillId] }),
}))
```

### Job Creation Server Action
```typescript
// src/app/dashboard/_actions.ts (additions)
export async function createJob(data: JobInput) {
  const { userId } = await auth();
  const company = await db.query.companies.findFirst({ where: eq(companies.id, userId) });
  if (!company) throw new Error('Unauthorized');

  const jobId = nanoid();
  await db.insert(jobs).values({
    id: jobId,
    companyId: company.id,
    title: data.title,
    // ... rest of data
  });

  // Link skills
  for (const skill of data.skills) {
    // 1. Ensure skill exists (reuse addSkill logic)
    // 2. Insert into jobSkills
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Multi-page forms | Single-page dynamic forms | 2023+ | Higher completion rates and better UX. |
| manual SQL join tables | Drizzle relational queries | 2024 | Faster development and built-in type safety. |
| Hard-coded skills | LLM-normalized taxonomy | 2024/25 | Better matching quality (matching "Java" to "Backend"). |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `emblor` works with React 19/Next.js 16 | Standard Stack | Medium - might need a fallback if not compatible. |
| A2 | Job search is not required for companies in Phase 3 | Summary | Low - basic listing is usually enough for MVP. |

## Open Questions

1. **How should we handle job categories?**
   - Recommendation: Use a predefined list of industry categories or infer from skills. Start with a simple text field.
2. **Should jobs have their own slugs?**
   - Recommendation: Use `id` for MVP to avoid slug collision logic; add slugs later if SEO becomes a primary focus.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Runtime | ✓ | 24.12.0 | — |
| PostgreSQL | Data layer | ✓ | 17.x | — |
| Clerk | Auth | ✓ | 7.x | — |

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.4 + Playwright |
| Quick run command | `npm run test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| COMP-01 | Create Job with Skills | E2E | `npx playwright test tests/jobs.spec.ts` | ❌ Wave 0 |
| COMP-01 | Toggle Job Status | Unit | `vitest tests/job-logic.test.ts` | ❌ Wave 0 |
| COMP-01 | Unauthorized Job Edit | Integration | `vitest tests/auth-jobs.test.ts` | ❌ Wave 0 |

## Security Domain

### Applicable ASVS Categories
- **V4 Access Control**: Verify `companyId` matches `auth().userId` on all job mutations.
- **V5 Input Validation**: Strictly validate job description and salary ranges via Zod.

### Known Threat Patterns
- **Job Posting Spam**: Rate-limit job creation per company.
- **Cross-User Leakage**: Ensure companies cannot see "Draft" jobs of other companies.

## Sources
- [Clerk Docs: Organizations](https://clerk.com/docs/organizations/overview)
- [Drizzle Docs: Relational Queries](https://orm.drizzle.team/docs/rq)
- [Emblor Github](https://github.com/jaleelbennett/emblor)

## Metadata
- Standard stack: HIGH
- Architecture: HIGH
- Pitfalls: HIGH
- Research date: 2026-05-22
