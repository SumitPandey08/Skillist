---
phase: 05-hiring-pipeline
plan: 01
subsystem: pipeline-view
tags: ["data-table", "ranking", "employer-ui"]
requires: ["04-03"]
provides: ["RANKED-LIST-01"]
affects: ["company-dashboard"]
tech-stack: ["@tanstack/react-table", "lucide-react"]
key-files:
  - "src/components/jobs/applicant-table.tsx"
  - "src/app/(dashboard)/dashboard/company/jobs/[id]/applicants/page.tsx"
decisions:
  - "Used @tanstack/react-table for high-performance candidate ranking"
  - "Implemented 'AI Pick' badges for candidates scoring above 80%"
metrics:
  duration: "15m"
---

# Phase 05 Plan 01 Summary: Ranked Applicant List

## Objective
Implement the ranked applicant list for employers, providing a sortable data table that defaults to the highest match scores first.

## Accomplishments
- **TanStack Table Integration**: Installed and configured `@tanstack/react-table` for the pipeline view.
- **Ranked DataTable**: Built `ApplicantTable` with default sorting by `matchScore` DESC.
- **AI Picking**: Added visual indicators for high-performing candidates.
- **Pipeline Access**: Updated `JobActions` to link directly to the applicant list for each job.

## Deviations from Plan
- None.
