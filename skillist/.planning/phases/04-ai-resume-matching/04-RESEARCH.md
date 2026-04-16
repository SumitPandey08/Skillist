# Phase 4: AI Resume & Matching Engine - Research

**Researched:** 2026-04-12
**Domain:** AI, PDF Processing, Vector Databases (pgvector)
**Confidence:** HIGH

## Summary

This phase implements the core "AI-first" value proposition of ECHFLUX: automated resume parsing, intelligent matching between students and jobs, and tailored resume generation. 

We will use **OpenAI GPT-4o-mini** for cost-effective structured extraction (parsing) and tailored content generation. **pgvector** with **OpenAI text-embedding-3-small** (1536 dimensions) will power the semantic matching component. Resume storage will utilize **Supabase Storage** for secure file management.

**Primary recommendation:** Use OpenAI's **Structured Outputs** (with Zod schemas) for resume extraction to ensure a 100% reliable data pipeline from unstructured PDF text to our structured database.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Resume Parsing | API (Server Action) | AI (OpenAI) | API handles file upload; AI extracts structured data. |
| Resume Content Tailoring | AI (OpenAI) | API (Server Action) | AI performs the heavy lifting of rewriting content for JD. |
| PDF Generation | Client / API | — | `@react-pdf/renderer` converts tailored data to PDF. |
| Match Score Calculation | Database (pgvector) | API (Server Action) | Vector similarity for skills + weighted logic for other factors. |
| Resume Storage | External (Supabase) | API (Server Action) | Supabase Storage for binary persistence; DB for metadata. |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `openai` | ^4.0.0 | LLM & Embeddings | Industry leader for structured extraction and generation. |
| `pdf-parse` | ^1.1.1 | PDF Text Extraction | Lightweight, battle-tested for raw PDF text extraction. |
| `@react-pdf/renderer`| ^4.0.0 | PDF Generation | React-native style declarative PDF creation; supports SSR/Browser. |
| `@supabase/ssr` | ^0.5.0 | Storage SDK | Native integration with the project's Supabase infrastructure. |
| `zod` | ^3.23.0 | Schema Validation | Required for OpenAI Structured Outputs and DB safety. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|--------------|
| `drizzle-orm` | ^0.31.0 | Vector Queries | Already used in project; supports `pgvector` distance/similarity. |
| `react-markdown` | ^9.0.0 | Preview Rendering | To show the student the tailored resume before PDF generation. |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `pdf-parse` | `pdfjs-dist` | `pdfjs-dist` is more modern but significantly more complex to set up in Next.js. |
| `@react-pdf/renderer` | `puppeteer` | Puppeteer is heavy and slow (browser instance); `@react-pdf` is fast and client-side capable. |
| Direct Match | Vector Search | Direct skill matching fails on synonyms (e.g., "JS" vs "JavaScript"); Vectors handle semantics. |

**Installation:**
```bash
npm install openai pdf-parse @react-pdf/renderer @supabase/ssr react-markdown zod
npm install --save-dev @types/pdf-parse
```

**Version verification:**
- `openai`: 4.x (Latest: 4.38.3+) - Verified [npm registry]
- `pdf-parse`: 1.1.1 (Stable, no recent updates but standard) - Verified [npm registry]
- `@react-pdf/renderer`: 4.x (Latest: 4.2.1+) - Verified [npm registry]

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/
│   ├── api/
│   │   └── webhooks/        # Storage/Supabase webhooks if needed
│   └── (dashboard)/
│       └── student/
│           └── resume/      # Resume builder & uploader UI
├── lib/
│   ├── ai/
│   │   ├── openai.ts        # Client initialization & helper wrappers
│   │   ├── parser.ts        # Extraction logic
│   │   ├── generator.ts     # Tailoring logic
│   │   └── matcher.ts       # Embedding & similarity logic
│   └── storage.ts           # Supabase storage helpers
└── components/
    └── resume/
        ├── pdf-template.tsx # @react-pdf/renderer components
        └── resume-preview.tsx # Markdown preview
```

### Pattern 1: Resume Extraction Pipeline (MATCH-01)
**What:** PDF Text -> OpenAI Structured Output -> Drizzle Save.
**Example:**
```typescript
// lib/ai/parser.ts
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { ResumeExtractionSchema } from "@/lib/schemas/resume";

const openai = new OpenAI();

export async function extractResumeData(text: string) {
  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-mini", // Cost efficient
    messages: [
      { role: "system", content: "Extract skills, experience, and education from resume text." },
      { role: "user", content: text },
    ],
    response_format: zodResponseFormat(ResumeExtractionSchema, "resume_data"),
  });
  return completion.choices[0].message.parsed;
}
```

### Pattern 2: Tailored Resume Generation (STU-03)
**What:** Profile + JD -> LLM -> Tailored JSON -> PDF.
**Rationale:** By generating JSON instead of raw Markdown, we can map sections directly to a professional PDF template in `@react-pdf/renderer`.

### Anti-Patterns to Avoid
- **Hand-rolling Cosine Similarity:** Don't do it in the API. Use `pgvector`'s `<=>` or `<#>` operators in SQL for efficiency.
- **Client-side OpenAI keys:** Never expose the API key. All AI calls must happen in Server Actions or Route Handlers.
- **Passing full PDF buffers to AI:** Don't do this; extract text first with `pdf-parse` to save tokens and avoid multimodality costs unless strictly needed for layout analysis.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| PDF Text Extraction | Custom parser | `pdf-parse` | Handles binary decoding, font mappings, and character encoding. |
| Vector Similarity | `Math.sqrt` loops | `pgvector` | Blazing fast C-extension for PostgreSQL; supports HNSW indexing. |
| PDF Layout | Canvas/HTML absolute pos | `@react-pdf/renderer` | Handles page breaks, hyphenation, and PDF metadata correctly. |

## Common Pitfalls

### Pitfall 1: Next.js + `pdf-parse` Import Error
**What goes wrong:** `pdf-parse` includes test data that fails in the webpack/Next.js environment.
**How to avoid:** Import from the internal path: `import pdf from 'pdf-parse/lib/pdf-parse'`.
**Warning signs:** Build errors like `Module not found: Can't resolve 'fs'`.

### Pitfall 2: Match Score Normalization
**What goes wrong:** Raw cosine distance is 0 to 2. Similarity is (1 - distance). 
**How to avoid:** Ensure the Match Score formula always outputs 0-100.
**Formula:** `Score = (0.4 * Similarity + 0.2 * ExpScore + 0.2 * ProjScore + 0.2 * PotentialScore) * 100`.

### Pitfall 3: Supabase Storage RLS
**What goes wrong:** File uploads fail with 403.
**How to avoid:** Set a policy: `auth.uid() = owner_id` on the `resumes` bucket.

## Code Examples

### Match Score Calculation (MATCH-02)
```typescript
// lib/ai/matcher.ts
import { db } from "@/db";
import { students, jobs } from "@/db/schema";
import { cosineDistance, sql } from "drizzle-orm";

export async function calculateMatch(studentId: string, jobId: string) {
  const [job] = await db.select().from(jobs).where(eq(jobs.id, jobId));
  const [student] = await db.select().from(students).where(eq(students.id, studentId));

  // 1. Skill Score (Vector Similarity)
  // Assumes jobVector and skillVector are already populated via embeddings
  const similarityScore = sql<number>`1 - (${cosineDistance(students.skillVector, job.jobVector)})`;

  // 2. Weighting logic (as per requirements)
  // PotentialScore, ExpScore, ProjScore are derived from LLM assessment or direct comparison
  // ...
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Keyword Matching | Vector Embeddings | 2023 (LLM rise) | Handles synonyms, context, and semantic meaning. |
| Regex Resume Parsing | LLM Structured Extraction | 2024 (OpenAI) | Near-perfect extraction from any layout/formatting. |
| HTML-to-PDF | Declarative React PDFs | 2023 | No need for headless browsers (Puppeteer) for simple layouts. |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `pgvector` extension is available on the Supabase instance. | Summary | High (blocks matching engine). |
| A2 | `gpt-4o-mini` is sufficient for high-quality extraction. | Summary | Low (can upgrade to `gpt-4o`). |

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| OpenAI API Key | All AI features | ✓ | — | — |
| Supabase URL/Key | Resume Storage | ✓ | — | — |
| pgvector Extension | Matching Engine | ✓ | 0.7.0+ | — |

**Missing dependencies with no fallback:**
- None.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest |
| Config file | `vitest.config.ts` |
| Quick run command | `npm test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| MATCH-01 | Extracts skills from a sample PDF | Integration | `npm test src/__tests__/parser.test.ts` | ❌ Wave 0 |
| MATCH-02 | Returns 1.0 for identical vectors | Unit | `npm test src/__tests__/matcher.test.ts` | ❌ Wave 0 |
| STU-03 | Generates a valid PDF blob | Unit | `npm test src/__tests__/generator.test.ts` | ❌ Wave 0 |

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V5 Input Validation | yes | Zod validation for all LLM outputs and file uploads. |
| V13 Data Protection | yes | RLS on Supabase Storage buckets to prevent cross-user access. |
| V14 AI Security | yes | Prompt injection mitigation by using Structured Outputs (strict mode). |

### Known Threat Patterns for Next.js AI

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| AI Data Leakage | Information Disclosure | Ensure prompt doesn't include PII of other users. |
| API Key Exposure | Information Disclosure | Use environment variables; only call AI from server side. |
| Malicious PDF | Tampering | Sanitize text extracted from PDF before passing to LLM. |

## Sources

### Primary (HIGH confidence)
- `openai` - Official Docs (Structured Outputs)
- `drizzle-orm` - Official Docs (pgvector)
- `react-pdf.org` - Documentation

### Secondary (MEDIUM confidence)
- Blog posts on Next.js + `pdf-parse` integration (pitfall 1 verification).

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Libraries are standard and tested in similar projects.
- Architecture: HIGH - Matches requirements for "AI-first" and specific formulas.
- Pitfalls: MEDIUM - Depends on specific PDF complexities.

**Research date:** 2026-04-12
**Valid until:** 2026-05-12
