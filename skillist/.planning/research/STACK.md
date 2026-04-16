# Technology Stack: ECHFLUX

**Project:** ECHFLUX (AI-Powered Career & Hiring Ecosystem)
**Researched:** May 2025 (Reflecting 2025/2026 standards)
**Overall Confidence:** HIGH

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

```bash
# Core Stack
npx create-next-app@latest echflux --typescript --tailwind --eslint

# AI & State
npm install ai @langchain/langgraph @langchain/openai @langchain/anthropic

# Database
npm install drizzle-orm pg
npm install -D drizzle-kit @types/pg

# Real-time & Agents
npm install livekit-client @livekit/components-react @livekit/agents

# Auth & UI
npm install @clerk/nextjs lucide-react clsx tailwind-merge
```

## Sources

- [Vercel AI SDK Documentation (v6)](https://sdk.vercel.ai/docs)
- [LangGraph.js Conceptual Guide](https://langchain-ai.github.io/langgraphjs/)
- [LiveKit Agents for Real-time AI](https://livekit.io/agents)
- [pgvector GitHub - Hybrid Search Patterns](https://github.com/pgvector/pgvector)
- [Next.js 16 Release Notes (Turbopack & MCP)](https://nextjs.org/blog)
