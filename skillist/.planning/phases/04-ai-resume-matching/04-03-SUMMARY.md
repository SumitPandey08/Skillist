---
phase: 04-ai-resume-matching
plan: 03
subsystem: matching-engine
tags: ["matching", "vector-similarity", "openai", "applications"]
requires: ["04-01", "04-02"]
provides: ["MATCHING-ENGINE-01"]
affects: ["job-board", "ai-logic"]
tech-stack: ["pgvector", "openai", "drizzle-orm"]
key-files:
  - "src/lib/ai/matcher.ts"
  - "src/app/jobs/_actions.ts"
  - "src/components/jobs/apply-button.tsx"
decisions:
  - "Implemented a 40/20/20/20 weighted scoring model"
  - "Used pgvector cosine distance for the skill-fit component (40%)"
  - "Used LLM-based qualitative analysis for experience, projects, and potential (60%)"
metrics:
  duration: "25m"
---

# Phase 04 Plan 03 Summary: AI Match Score Engine

## Objective
Develop the intelligent matching engine that determines the fit between candidates and roles using a hybrid of vector similarity and LLM reasoning.

## Accomplishments
- **Job Vectorization**: Updated job creation/editing to automatically generate and store embeddings for semantic matching.
- **Match Engine**: Implemented `calculateMatchScore` which combines vector math with GPT-4o-mini analysis.
- **Application Flow**: Created the `applyForJob` action which triggers matching and persists results.
- **Instant Feedback**: Developed an interactive `ApplyButton` that shows candidates their Match Score immediately upon application.
- **Authorization**: Added checks to ensure only students can apply and ownership is verified.

## Deviations from Plan
- **Consolidated Actions**: Kept all job-related actions in `src/app/dashboard/_actions.ts` for consistency with existing structure.
- **Client Component Optimization**: Created `ApplyButton` as a client component to handle the complex state of AI calculation and feedback.
