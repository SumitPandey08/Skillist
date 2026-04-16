---
phase: 04-ai-resume-matching
plan: 02
subsystem: resume-pipeline
tags: ["pdf", "upload", "supabase", "ai-sync"]
requires: ["04-01"]
provides: ["RESUME-PIPELINE-01"]
affects: ["storage", "student-profile"]
tech-stack: ["pdf-parse", "@supabase/supabase-js", "openai"]
key-files:
  - "src/lib/ai/pdf.ts"
  - "src/lib/supabase.ts"
  - "src/app/dashboard/student/_actions.ts"
  - "src/app/dashboard/student/resume-upload.tsx"
decisions:
  - "Used Supabase Storage for secure PDF hosting"
  - "Implemented a 'clean sync' strategy where parsed resume data replaces existing experience/education records"
  - "Added resumeUrl to students table to track uploaded files"
metrics:
  duration: "20m"
---

# Phase 04 Plan 02 Summary: Resume Pipeline

## Objective
Implement the automated resume parsing pipeline, allowing students to import their professional background directly from a PDF.

## Accomplishments
- **PDF Extraction**: Integrated `pdf-parse` to extract raw text from buffers.
- **Storage Client**: Initialized `supabaseAdmin` for server-side storage management.
- **Bucket Provisioning**: Created a `resumes` bucket in Supabase via an automation script.
- **Upload Action**: Developed `uploadAndParseResume` which handles file upload, text extraction, AI parsing, and database synchronization.
- **UI Widget**: Built a drag-and-drop-ready `ResumeUpload` component with real-time parsing status.

## Deviations from Plan
- **Unified Action**: Consolidated upload and parsing into a single Server Action for atomicity.
- **Storage Script**: Added `scripts/ensure-storage.ts` to automate bucket setup.
