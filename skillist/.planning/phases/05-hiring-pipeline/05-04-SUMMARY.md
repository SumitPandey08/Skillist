---
phase: 05-hiring-pipeline
plan: 04
subsystem: employer-insights
tags: ["analytics", "aggregation", "sql"]
requires: ["05-01"]
provides: ["EMPLOYER-STATS-01"]
affects: ["company-dashboard"]
tech-stack: ["drizzle-orm", "sql"]
key-files:
  - "src/app/(dashboard)/dashboard/company/jobs/page.tsx"
  - "src/components/dashboard/company-stats.tsx"
decisions:
  - "Used SQL aggregates for efficient dashboard stat calculation"
  - "Implemented a 'Top Talent Spotlight' to highlight high-matches across all active roles"
metrics:
  duration: "15m"
---

# Phase 05 Plan 04 Summary: Employer Dashboard Stats

## Objective
Update the main employer dashboard with an aggregate overview of recruitment performance and top talent highlights.

## Accomplishments
- **Aggregate Analytics**: Implemented SQL-based calculation for total applicants, pending reviews, and average scores.
- **Talent Spotlight**: Developed a cross-job "Top Talent" query to surface the best candidates globally.
- **Visual Metrics**: Built `CompanyStats` suite of cards for an at-a-glance overview of hiring health.
- **Dashboard Refresh**: Integrated all stats into the primary employer dashboard view.

## Deviations from Plan
- None.
