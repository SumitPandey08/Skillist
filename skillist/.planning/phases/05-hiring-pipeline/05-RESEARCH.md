# Phase 5: Hiring Pipeline & Candidate Ranking - Research

**Researched:** 2026-04-12
**Domain:** Applicant Tracking System (ATS), Candidate Ranking, Data Visualization
**Confidence:** HIGH

## Summary
Phase 5 transforms the company dashboard from a simple job management tool into a functional hiring pipeline. Leveraging the scores generated in Phase 4, we will implement a ranked applicant list and a deep-dive detail view using interactive charts.

**Primary recommendation:** Use the **Shadcn Chart** component (built on Recharts) to render Radar charts for the Match Score breakdown, allowing recruiters to visually distinguish "Skill-heavy" vs. "Experience-heavy" candidates.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Candidate Ranking | Database (SQL) | — | `ORDER BY match_score DESC` is the most efficient ranking method. |
| Pipeline Status Updates | API (Server Action)| — | Atomic updates to the `applications.status` field. |
| Score Visualization | Browser (Client) | — | Recharts/Shadcn Chart for interactive Radar charts. |
| Dashboard Summary | API (Server Action)| Database | Aggregated counts (pending, total) for the employer overview. |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `recharts` | ^2.12.0 | Visualization | Powering Shadcn Radar charts for score breakdowns. |
| `@tanstack/react-table` | ^8.10.0 | Pipeline View | Industry standard for sortable, filterable ranked lists. |
| `lucide-react` | 1.8.0 | Icons | Visual cues for status (e.g., `CircleCheck`, `UserMinus`). |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|--------------|
| `framer-motion` | 12.38.0 | UI Feedback | Smooth transitions between pipeline stages. |

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/
│   └── (dashboard)/
│       └── dashboard/
│           └── company/
│               ├── jobs/
│               │   └── [id]/
│               │       ├── applicants/     # Ranked list view
│               │       │   └── [appId]/    # Applicant detail view
│               │       └── _components/    # Radar chart, status toggle
│               └── _components/            # Dashboard stats overview
```

### Pattern: Ranked Data Table
**What:** A DataTable that default-sorts by `matchScore` descending.
**UI Strategy:** Highlight the top 3 applicants with a special badge (e.g., "AI Pick") or a border color to aid quick selection.

## Common Pitfalls

### Pitfall 1: Over-reliance on Total Score
**What goes wrong:** A high total score might hide a critical skill gap.
**How to avoid:** Always show the Radar chart in the detail view to expose the "shape" of the candidate's fit.

### Pitfall 2: N+1 Queries in Pipeline View
**What goes wrong:** Fetching student details for each application row individually.
**How to avoid:** Use single JOIN to fetch applications + student profiles in one go.
