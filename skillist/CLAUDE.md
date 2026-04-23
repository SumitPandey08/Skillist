<!-- GSD:project-start source:PROJECT.md -->
## Project

**Skillist**

A scalable, AI-first, dual-sided platform connecting students and employers through intelligent career development tools and hiring automation. It goes beyond a simple job portal by providing a complete career lifecycle ecosystem, including skill tracking, AI-driven roadmaps, intelligent matching, and agentic automation for both sides of the hiring marketplace.

**Core Value:** Intelligently matching candidate skills and potential to employer needs, drastically reducing hiring time by 50% while maximizing placement success and providing a skills-first hiring model.

### Constraints

- **Tech Stack**: Must use React + Next.js for frontend (SSR/SEO), Node.js for backend, and specialized AI/Vector DB tooling.
- **Architecture**: Must follow scalable, modular design from day one; avoid overengineering initially but prepare for scale.
- **AI-Centric**: AI is not an add-on; the system relies heavily on matching formulas (Match Score: 40% skills, 20% experience, 20% projects, 20% potential).
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## Recommended Stack
### Core Framework & Runtime
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **Next.js** | 16.x | Fullstack Framework | Industry standard for SSR/SEO. Next.js 16 offers stable Turbopack and Model Context Protocol (MCP) support. | HIGH |
| **Node.js** | 22 (LTS) | Backend Runtime | Required for performance, worker threads (BullMQ), and compatibility with the latest AI SDKs. | HIGH |
| **TypeScript** | 5.7+ | Language | Crucial for managing complex AI schemas, agent states, and database models. | HIGH |
### Database & Intelligence
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **PostgreSQL** | 17+ | Primary Database | Relational integrity for hiring pipelines (Candidates, Jobs, Interviews). | HIGH |
| **pgvector** | 0.8+ | Vector Search | Allows hybrid search (SQL + Vector) in a single query. Essential for the Match Score formula. | HIGH |
| **Drizzle ORM** | 0.45+ | ORM / Schema | TypeScript-first, high performance, and natively supports `pgvector` better than Prisma. | MEDIUM |
### AI Orchestration & UI
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **Vercel AI SDK** | 6.x | Streaming & GenUI | Best-in-class for real-time AI responses and streaming Generative UI components. | HIGH |
| **LangGraph.js** | 1.x | Agentic Workflows | Handles complex, stateful loops (e.g., multi-step career roadmaps, automated hiring follow-ups). | MEDIUM |
| **LiveKit Agents** | Latest | Real-time Interviewer | Low-latency WebRTC framework for the AI Mock Interviewer (Speech-to-Speech). | MEDIUM |
### Infrastructure & Supporting Libraries
| Library | Version | Purpose | When to Use | Confidence |
|---------|---------|---------|-------------|------------|
| **Clerk** | 7.x | Authentication | Best for multi-tenancy (Student vs Company portals) and rapid B2B/B2C setup. | HIGH |
| **BullMQ** | 5.x | Background Jobs | For agentic tasks (follow-ups, resume parsing) that shouldn't block the main thread. | HIGH |
| **Tailwind CSS** | 4.x | Styling | High-performance CSS framework with modern engine and better container queries. | HIGH |
| **Shadcn UI** | Latest | Component Library | Modern, accessible UI components that work seamlessly with Next.js 16. | HIGH |
## AI Model Selection
| Use Case | Recommended Model | Rationale | Confidence |
|----------|-------------------|-----------|------------|
| **Core Reasoning** | **Claude 3.5 Sonnet** | Superior logic for career roadmaps; stays in character better than competitors. | HIGH |
| **Multimodal / Vision** | **GPT-4o** | Best for analyzing video interviews and resume layouts. | HIGH |
| **Fast / Cheap Tasks** | **GPT-4o-mini** | Ideal for high-volume tasks like initial resume screening. | HIGH |
| **Real-time Voice** | **GPT-4o-realtime** | Native low-latency voice integration via LiveKit. | MEDIUM |
## Alternatives Considered
| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| **Database** | PostgreSQL | MongoDB | Postgres + `pgvector` handles relational hiring logic and vector matching in one ACID-compliant engine. |
| **Vector DB** | pgvector | Pinecone | Pinecone adds infra complexity; `pgvector` is sufficient for millions of candidate profiles and easier to query. |
| **ORM** | Drizzle | Prisma | Drizzle is faster for AI apps and has better support for raw SQL/Vector operators. |
| **Auth** | Clerk | Auth.js (v5) | Clerk's B2B/Organization features (for companies) are more mature for a hiring platform. |
## Installation
# Core Stack
# AI & State
# Database
# Real-time & Agents
# Auth & UI
## Sources
- [Vercel AI SDK Documentation (v6)](https://sdk.vercel.ai/docs)
- [LangGraph.js Conceptual Guide](https://langchain-ai.github.io/langgraphjs/)
- [LiveKit Agents for Real-time AI](https://livekit.io/agents)
- [pgvector GitHub - Hybrid Search Patterns](https://github.com/pgvector/pgvector)
- [Next.js 16 Release Notes (Turbopack & MCP)](https://nextjs.org/blog)
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, or `.github/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
