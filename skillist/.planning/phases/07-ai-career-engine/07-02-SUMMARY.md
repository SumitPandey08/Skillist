---
phase: 07-ai-career-engine
plan: 02
subsystem: ai-roadmap
tags: ["openai", "server-actions", "zod"]
requires: ["07-01"]
provides: ["ROADMAP-GENERATION-01"]
affects: ["student-dashboard", "ai-logic"]
tech-stack: ["openai", "zod", "drizzle-orm"]
key-files:
  - "src/lib/ai/roadmap.ts"
  - "src/app/dashboard/student/_actions.ts"
decisions:
  - "Used OpenAI's structured output (json_object) with Zod validation for robust roadmap parsing."
  - "Implemented roadmap replacement logic (delete-then-insert) in a single transaction to ensure atomicity."
metrics:
  duration: "15m"
---

# Phase 07 Plan 02 Summary: AI Roadmap Generation Service

## Objective
Implement the core AI logic to generate personalized learning roadmaps for students based on their current skill sets and target professional roles.

## Accomplishments
- **AI Utility Developed**: Built `generateRoadmap` in `src/lib/ai/roadmap.ts` using `gpt-4o-mini`.
- **Structured Response**: Defined Zod schemas for roadmaps and steps to ensure data integrity from LLM output.
- **Atomic Persistence**: Created `generateAndSaveRoadmap` server action which uses `db.transaction` to clean up old roadmaps and save new ones safely.
- **Skill Mapping**: Added logic to automatically link generated roadmap steps to existing skills in the database.

## Deviations from Plan
- None.
