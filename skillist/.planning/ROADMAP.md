# ROADMAP

## Phases

- [x] **Phase 1: Foundation & Auth** - Core infrastructure and secure user access for students and companies.
- [x] **Phase 2: Student Portfolio & Skills** - Skill tracking and public portfolio hub for candidates.
- [x] **Phase 3: Company Job Management** - Tools for employers to post and manage skill-centric job listings.
- [x] **Phase 4: AI Resume & Matching Engine** - Automated resume parsing and predictive Match Score calculation.
- [x] **Phase 5: Hiring Pipeline & Candidate Ranking** - Advanced applicant ranking and pipeline management for employers.
- [x] **Phase 6: External Platform Integrations** - Enriched candidate profiles via GitHub, LeetCode, and Codeforces.
- [x] **Phase 7: AI Career Engine & Agentic Foundation** - Learning roadmaps and scalable agent infrastructure.
- [x] **Phase 8: AI Mock Interviewer** - Real-time interview simulation and AI-driven feedback.
- [ ] **Phase 9: Subscription & Monetization** - Tiered plans and payment integration.

## Phase Details

### Phase 1: Foundation & Auth
**Goal**: Users can securely access and manage their accounts.
**Depends on**: Nothing
**Requirements**: AUTH-01, AUTH-02
**Success Criteria** (what must be TRUE):
  1. User can sign up/in as Student or Company via email/password or OAuth.
  2. User can update their profile information and account settings.
  3. Session state is maintained securely across browser restarts.
**Plans**: 4 plans
- [x] 01-00-PLAN.md — Initialize testing infrastructure and scaffold test files.
- [x] 01-01-PLAN.md — Initialize project infrastructure and database schema.
- [x] 01-02-PLAN.md — Integrate Clerk authentication and protect routes.
- [x] 01-03-PLAN.md — Implement onboarding flow and data sync.
**UI hint**: yes

### Phase 2: Student Portfolio & Skills
**Goal**: Students can manage their professional identity through skills and projects.
**Depends on**: Phase 1
**Requirements**: STU-01, STU-02
**Success Criteria** (what must be TRUE):
  1. Student can add, update, and track skills and projects with progress indicators.
  2. Student can generate and share a public URL for their unified portfolio hub.
  3. The public portfolio correctly displays the student's validated skills and project history.
**Plans**: 4 plans
- [x] 02-01-PLAN.md — Database schema for skills, projects, and certifications.
- [x] 02-02-PLAN.md — Student dashboard for skill and project management.
- [x] 02-03-PLAN.md — Public portfolio hub with shareable URL.
- [x] 02-04-PLAN.md — Progress indicators and profile completeness logic.
**UI hint**: yes

### Phase 3: Company Job Management
**Goal**: Companies can define their hiring needs.
**Depends on**: Phase 1
**Requirements**: COMP-01
**Success Criteria** (what must be TRUE):
  1. Company can create and publish job postings with explicit skill requirements.
  2. Company can manage (edit, close, delete) their active job listings.
  3. Job data is correctly persisted and searchable within the platform.
**Plans**: 4 plans
- [x] 03-01-PLAN.md — Database schema for jobs and job-skill requirements.
- [x] 03-02-PLAN.md — Company dashboard UI for job management.
- [x] 03-03-PLAN.md — Job creation and editing flow with skill tags.
- [x] 03-04-PLAN.md — Public job detail pages (SSR) and listing.
**UI hint**: yes

### Phase 4: AI Resume & Matching Engine
**Goal**: The system can intelligently interpret candidate data and calculate fit.
**Depends on**: Phase 2, Phase 3
**Requirements**: STU-03, MATCH-01, MATCH-02
**Success Criteria** (what must be TRUE):
  1. System accurately extracts skills, experience, and education from uploaded PDF resumes.
  2. Student can generate a downloadable, ATS-optimized resume tailored to a job description.
  3. Match Score is calculated for every applicant based on the 40/20/20/20 formula.
**Plans**: 4 plans
- [x] 04-01-PLAN.md — AI Utilities & OpenAI Integration (Embeddings, Structured Extraction).
- [x] 04-02-PLAN.md — Resume Parsing Pipeline (Upload, Text Extraction, DB Sync).
- [x] 04-03-PLAN.md — AI Match Score Engine (Vector Similarity + LLM Analysis).
- [x] 04-04-PLAN.md — ATS-Optimized Resume Generation (@react-pdf/renderer).
**UI hint**: yes

### Phase 5: Hiring Pipeline & Candidate Ranking
**Goal**: Companies can efficiently identify and manage top talent.
**Depends on**: Phase 4
**Requirements**: COMP-02, MATCH-03
**Success Criteria** (what must be TRUE):
  1. Company can view a dedicated pipeline of applicants for each job posting.
  2. Applicants are automatically ranked in the UI based on their Match Score.
  3. Company can drill down into individual applicant details and see the score breakdown.
**Plans**: 4 plans
- [x] 05-01-PLAN.md — Ranked Applicant List (DataTable) for each job.
- [x] 05-02-PLAN.md — Applicant Detail View with Score Visualization (Radar Chart).
- [x] 05-03-PLAN.md — Pipeline Status Management (Interviewing, Offered, Rejected).
- [x] 05-04-PLAN.md — Employer Dashboard Stats & Overview.
**UI hint**: yes

### Phase 7: AI Career Engine & Agentic Foundation
**Goal**: Provide candidates with clear learning paths and establish the core infrastructure for autonomous agents.
**Depends on**: Phase 6
**Requirements**: CAREER-01, AGENT-01
**Success Criteria** (what must be TRUE):
  1. Drizzle schema is synced with Prisma to include Roadmap and Agent-related models.
  2. Student can generate a personalized learning roadmap based on a target role and their current skill gaps.
  3. Backend worker is configured with LangGraph to handle multi-step agentic tasks (e.g., roadmap refinement).
  4. Roadmap progress can be tracked and displayed in the student dashboard.
**Plans**: 4 plans
- [x] 07-01-PLAN.md — DB Schema Sync & Roadmap Data Layer.
- [x] 07-02-PLAN.md — AI Roadmap Generation Service (LangChain/OpenAI).
- [x] 07-03-PLAN.md — Student Roadmap UI & Progress Tracking.
- [x] 07-04-PLAN.md — Agentic Worker Infrastructure (LangGraph + BullMQ).
**UI hint**: yes

### Phase 8: AI Mock Interviewer
**Goal**: Enable students to practice for real-world interviews with specialized AI feedback.
**Depends on**: Phase 7
**Requirements**: INT-01, INT-02
**Success Criteria** (what must be TRUE):
  1. Student can start a mock interview for a specific role or job posting.
  2. System records/transcribes student answers (via Whisper/Web Speech).
  3. AI evaluates performance across Technical, Communication, and Behavioral criteria.
  4. Final score and actionable feedback are persisted and displayed.
**Plans**: 4 plans
- [x] 08-01-PLAN.md — Mock Interview Data Layer & Session Management.
- [x] 08-02-PLAN.md — Real-time Speech-to-Text & Interview UI.
- [x] 08-03-PLAN.md — AI Interview Agent (Dynamic Questions & Logic).
- [x] 08-04-PLAN.md — Performance Analysis & Feedback Visualization.
**UI hint**: yes

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Auth | 4/4 | Completed | 2026-04-12 |
| 2. Student Portfolio & Skills | 4/4 | Completed | 2026-04-12 |
| 3. Company Job Management | 4/4 | Completed | 2026-04-12 |
| 4. AI Resume & Matching Engine | 4/4 | Completed | 2026-04-12 |
| 5. Hiring Pipeline & Candidate Ranking | 4/4 | Completed | 2026-04-12 |
| 6. External Platform Integrations | 1/1 | Completed | 2026-04-12 |
| 7. AI Career Engine & Agentic Foundation | 4/4 | Completed | 2026-04-14 |
| 8. AI Mock Interviewer | 4/4 | Completed | 2026-04-14 |
