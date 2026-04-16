# ECHFLUX

## What This Is

A scalable, AI-first, dual-sided platform connecting students and employers through intelligent career development tools and hiring automation. It goes beyond a simple job portal by providing a complete career lifecycle ecosystem, including skill tracking, AI-driven roadmaps, intelligent matching, and agentic automation for both sides of the hiring marketplace.

## Core Value

Intelligently matching candidate skills and potential to employer needs, drastically reducing hiring time by 50% while maximizing placement success and providing a skills-first hiring model.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Student Career Dashboard & Skill Tracking System
- [ ] AI Resume Builder (ATS-optimized)
- [ ] Career Roadmap Engine (AI-generated learning paths)
- [ ] AI Recommendation Engine (job matches, skill gap analysis)
- [ ] AI Mock Interviewer (real-time simulation and feedback)
- [ ] Portfolio Hub (unified profile with GitHub/LeetCode integrations)
- [ ] Company Dashboard & Analytics (post jobs, pipeline, time-to-hire)
- [ ] AI Candidate Sourcing & Automated Resume Screening
- [ ] Interview Management System (scheduling, tracking)
- [ ] AI Matching Engine & Predictive Scoring (Skill-to-Role, Success Probability)
- [ ] Agentic AI Layer (auto-scheduling, follow-up emails, candidate notifications)
- [ ] Subscription Plans (Student & Company tiers)

### Out of Scope

- [Generic Job Portal] — The goal is a skills-driven, unified ecosystem (a "Netflix for careers"), not a traditional, manual job board.

## Context

We are building a production-ready platform to outperform existing tools like LinkedIn and Handshake by being fundamentally AI-first. The architecture will be a modular microservice or modular monolith starting point, utilizing Node.js, Next.js, PostgreSQL/MongoDB, and a dedicated AI layer with Vector Databases. The project will be developed incrementally across 3 main phases (MVP, Phase 2, Phase 3).

## Constraints

- **Tech Stack**: Must use React + Next.js for frontend (SSR/SEO), Node.js for backend, and specialized AI/Vector DB tooling.
- **Architecture**: Must follow scalable, modular design from day one; avoid overengineering initially but prepare for scale.
- **AI-Centric**: AI is not an add-on; the system relies heavily on matching formulas (Match Score: 40% skills, 20% experience, 20% projects, 20% potential).

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Node.js + Next.js Stack | Strong developer ecosystem and built-in SSR/SEO for the platform. | — Pending |
| Skills-First Model | Degrees are secondary to validated skills, projects, and performance. | — Pending |
| Agentic Automation | Automating routine hiring tasks (scheduling, follow-ups) is essential to reduce time-to-hire. | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: April 12, 2026 after initialization*