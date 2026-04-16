# Phase 7 Research: AI Career Engine & Agentic Foundation

## Objective
To design and implement the foundation for AI-driven career roadmaps and autonomous agent infrastructure, bridging the gap between current student profiles and their target professional goals.

## Architecture

### 1. Unified Schema Sync
Currently, Prisma (backend) has more models than Drizzle (root). We need to sync the following models into `src/db/schema.ts`:
- `roadmaps`: Tracks overall goal (e.g., "Senior React Developer") and student link.
- `roadmap_steps`: Individual milestones, skill-linked, with status tracking.
- `mock_interviews`: Session tracking for voice/text simulations.
- `notifications`: Cross-platform alert system.

### 2. AI Roadmap Generation Service
- **LLM Strategy**: Use LangChain with OpenAI's `gpt-4o-mini` for efficient roadmap generation.
- **Input**: Current student skills (from DB), target role (user input), and industry standards.
- **Output**: Structured JSON containing 5-7 actionable steps, each linked to a skill and describing specific learning resources or projects.

### 3. Agentic Worker Layer (Backend)
- **Framework**: LangGraph for multi-step reasoning.
- **Queue**: BullMQ for handling asynchronous roadmap generation and future agentic tasks (like interview scheduling).
- **Triggers**: Server Actions in Next.js will push jobs to the queue.

## Key Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| **Latency** | Generating a full roadmap can take 5-10s. Use optimistic UI and BullMQ background processing with real-time status updates via Pusher or long-polling. |
| **Schema Fragmentation** | Maintain Drizzle as the "source of truth" for the Next.js app, but ensure Prisma is updated to match for backend service access. |
| **Step Validation** | Roadmap steps should be "verifiable" where possible (e.g., linked to a project the student must complete). |

## Proposed Roadmap Structure (JSON)
```json
{
  "target_role": "Fullstack Engineer",
  "description": "Transition from frontend-focused to a full-stack role.",
  "steps": [
    {
      "title": "Master Server-Side Fundamentals",
      "description": "Learn Node.js event loop and Express middleware architecture.",
      "skill_id": "nanoid-for-nodejs",
      "order": 1
    },
    ...
  ]
}
```

## Next Steps (Plan 07-01)
1. Update `src/db/schema.ts` with Roadmap models.
2. Run `npm run db:push` to sync local DB.
3. Create server actions for roadmap CRUD.
