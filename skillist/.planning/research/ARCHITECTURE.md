# Architecture Patterns

**Domain:** AI-Powered Career Development & Hiring Ecosystem (ECHFLUX)
**Researched:** May 20, 2024
**Confidence:** HIGH

## Recommended Architecture

ECHFLUX is structured as a **Modular Monolith** transitioning to **Microservices**, utilizing a **Cascaded AI Pipeline** for real-time interactions and a **Two-Stage Retrieval & Re-ranking** system for matching.

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| **API Gateway / BFF** | Entry point, Auth (Clerk/NextAuth), Rate Limiting, Request Routing. | All Backend Services |
| **User/Profile Service** | Manages Student/Company profiles, skills, and portfolio data. | PostgreSQL, Vector DB |
| **Matching Engine** | Executes Match Score formula (40% skills, 20% exp, etc.) using hybrid search. | Vector DB, LLM Service, Job Service |
| **Agentic AI Layer** | Orchestrates scheduling, multi-channel candidate communication (Email/SMS). | Twilio/SendGrid, Scheduling Engine, ATS |
| **Mock Interviewer** | Manages real-time WebRTC voice/video sessions with streaming AI feedback. | STT (Deepgram), LLM (Groq), TTS (Cartesia/ElevenLabs) |
| **Roadmap Engine** | Generates personalized learning paths based on skill gap analysis. | Knowledge Graph (Neo4j), LLM Service, Learning Data |
| **Vector DB (Qdrant/Pinecone)**| Stores high-dimensional embeddings for resumes, JDs, and skills. | Matching Engine, Profile Service |
| **Knowledge Graph (Neo4j)** | Maps semantic relationships between skills, roles, and learning content. | Roadmap Engine, Matching Engine |

### Data Flow

#### 1. The Skills-First Matching Flow
1.  **Ingestion:** Student uploads resume; JD is posted by Company.
2.  **Standardization:** AI parses documents into a structured "Skills Taxonomy" (normalized via LLM).
3.  **Retrieval (Stage 1):** Vector DB performs semantic similarity search to find top 50-100 candidates.
4.  **Scoring (Stage 2):** LLM applies the **Match Score Formula** (40/20/20/20) to the top candidates, generating a ranked list with natural language "Match Rationale."

#### 2. Agentic Scheduling Flow
1.  **Trigger:** Recruiter selects "Schedule Interview" in Company Dashboard.
2.  **Availability Check:** Scheduling Engine queries interviewer calendars (Google/Outlook) for "Free/Busy" blocks.
3.  **Conversational Outreach:** Agentic LLM sends personalized Email/SMS to candidate with suggested slots.
4.  **Confirmation:** Candidate replies (Natural Language) -> LLM parses intent -> Scheduling Engine confirms slot -> Calendar invites dispatched.

#### 3. Real-Time Mock Interview Pipeline
1.  **Audio Stream:** Client captures audio via WebRTC and streams to Orchestrator.
2.  **Streaming STT:** Deepgram converts audio to partial transcripts in <150ms.
3.  **Streaming LLM:** Groq/GPT-4o-mini generates response tokens as transcripts arrive.
4.  **Streaming TTS:** Cartesia/ElevenLabs synthesizes audio chunks from LLM tokens.
5.  **Playback:** Audio chunks are streamed back to Client via WebRTC for <500ms total turn-around time.

---

## Patterns to Follow

### Pattern 1: Two-Stage Retrieval & Re-ranking
**What:** Decoupling the fast, "fuzzy" vector search from the intensive, high-precision LLM scoring.
**When:** Used in the Matching Engine to handle large candidate pools efficiently.
**Example:**
```typescript
// Stage 1: Fast Retrieval
const candidates = await vectorDb.search(jobEmbedding, { limit: 100 });

// Stage 2: Precision Re-ranking (Match Score Formula)
const rankedCandidates = await llm.score(candidates, {
  formula: { skills: 0.4, experience: 0.2, projects: 0.2, potential: 0.2 },
  jobDescription: jobText
});
```

### Pattern 2: GraphRAG for Roadmaps
**What:** Combining Knowledge Graphs (for structured skill hierarchies) with RAG (for natural language advice).
**When:** Generating Career Roadmaps to ensure learning paths are logically sequenced.
**Example:** Use Neo4j to find prerequisites (e.g., "Must know SQL before Data Science") and pass the graph context to the LLM to write the roadmap.

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Sequential Voice Pipelines
**What:** Waiting for the full transcript before calling the LLM, and waiting for the full LLM response before calling TTS.
**Why bad:** Creates 3-5 second delays, making mock interviews feel robotic and frustrating.
**Instead:** Use a fully streaming pipeline where STT, LLM, and TTS overlap.

### Anti-Pattern 2: PII Leakage in Embeddings
**What:** Including names, addresses, or demographics in the text sent to the Vector DB.
**Why bad:** Introduces bias into the matching algorithm and creates privacy risks.
**Instead:** Strip PII and normalize data into a skills-first representation before embedding.

---

## Scalability Considerations

| Concern | At 100 users | At 10K users | At 1M users |
|---------|--------------|--------------|-------------|
| **Vector Search** | Local `pgvector` index. | Managed Pinecone/Qdrant. | Sharded Vector DB with metadata filtering. |
| **Agentic Comms** | Simple Webhooks. | Message Queue (RabbitMQ/SQS). | Distributed Event-Driven Architecture. |
| **Real-time Voice** | Single regional server. | Global SFU network (LiveKit). | Edge-deployed Orchestration (Fly.io/Vercel Edge). |
| **Matching Engine**| Real-time LLM calls. | Async background jobs. | Pre-computed embeddings + Cache layer. |

## Sources

- [Vapi.ai / Retell AI Voice Architectures](https://vapi.ai)
- [Pinecone: Two-Stage Retrieval Patterns](https://www.pinecone.io/learn/series/rag/rerankers/)
- [Deepgram: Low-Latency STT Guide](https://deepgram.com)
- [Neo4j: Career Path Modeling](https://neo4j.com/case-studies/careerbuilder/)
