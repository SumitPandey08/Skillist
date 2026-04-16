# Phase 01: Foundation & Auth - Validation Architecture

This document defines the validation strategy for Phase 01 to ensure the core infrastructure and authentication layers meet the Nyquist requirements for ECHFLUX.

## 1. Validation Dimensions

| Dimension | Focus Area | Verification Method |
|-----------|------------|---------------------|
| **1. Functional** | Auth flows, role selection, profile management | E2E Testing (Playwright) |
| **2. Visual** | Responsive UI, component rendering, accessibility | Visual Regression & Accessibility Audits |
| **3. Security** | Middleware protection, RBAC, webhook integrity | Integration & Unit Testing |
| **4. Performance** | Page load speed, redirect latency, query performance | Lighthouse & Custom Metrics |
| **5. Reliability** | Database connectivity, service fallback, error handling | Chaos/Fault Injection & Mocking |
| **6. Data Integrity** | Schema constraints, Clerk-to-DB sync consistency | DB Integration Testing |
| **7. User Experience** | Form validation, onboarding friction, flow clarity | Manual UX Review & E2E |
| **8. Observability** | Auth event logging, webhook tracking, error reporting | Log Audit & Metric Verification |

## 2. Test Cases (Dimensions 1-7)

### Dimension 1: Functional Validation
- **TC-F1-01**: New user signs up via Email/Password -> Redirected to Onboarding.
- **TC-F1-02**: User selects "Student" role -> Record created in `students` table -> Redirected to Dashboard.
- **TC-F1-03**: User selects "Company" role -> Record created in `companies` table -> Redirected to Dashboard.
- **TC-F1-04**: Logged-in user can update profile name and primary skill.
- **TC-F1-05**: User can log out successfully and cannot access `/dashboard` via back button.

### Dimension 2: Visual Validation
- **TC-V2-01**: `/sign-in` and `/sign-up` pages render correctly on Desktop (1440p) and Mobile (iPhone 12).
- **TC-V2-02**: "Choose Your Path" cards show active state when selected.
- **TC-V2-03**: All auth forms meet WCAG 2.1 AA accessibility standards (contrast, labels, focus states).

### Dimension 3: Security Validation
- **TC-S3-01**: Unauthenticated request to `/dashboard` is intercepted by middleware and redirected to `/sign-in`.
- **TC-S3-02**: Authenticated user *without* `onboardingComplete` metadata is forced to `/onboarding`.
- **TC-S3-03**: Clerk Webhook endpoint rejects requests with invalid `svix-signature`.
- **TC-S3-04**: Verify that session tokens are marked `HttpOnly` and `Secure`.

### Dimension 4: Performance Validation
- **TC-P4-01**: `/sign-in` page achieves a Lighthouse Performance score of > 90.
- **TC-P4-02**: Middleware execution adds < 50ms to request latency.
- **TC-P4-03**: Database synchronization via webhook completes in < 200ms.

### Dimension 5: Reliability Validation
- **TC-R5-01**: Webhook handler implements a 3-retry backoff strategy if the database is temporarily busy.
- **TC-R5-02**: App displays a graceful "Service Degraded" message if the Clerk API returns a 5xx error.

### Dimension 6: Data Integrity Validation
- **TC-D6-01**: `users.id` in PostgreSQL exactly matches `clerk_id` for all records.
- **TC-D6-02**: Foreign key constraints prevent `students` or `companies` records without a corresponding `users` record.
- **TC-D6-03**: Ensure `skill_vector` in `students` table accepts 1536-dimension vectors (for future-proofing).

### Dimension 7: User Experience (UX) Validation
- **TC-U7-01**: Inline validation prevents submitting the onboarding form with missing mandatory fields.
- **TC-U7-02**: Loading states (spinners/skeletons) are shown during auth transitions to prevent "blank screen" anxiety.

## 3. Test Infrastructure

### Tools & Frameworks
| Tool | Use Case | Command |
|------|----------|---------|
| **Vitest** | Unit & Integration (Middleware, Webhooks, DB) | `npm run test` |
| **Playwright** | E2E (Flows, Visual, Security) | `npx playwright test` |
| **Lighthouse** | Performance & Accessibility | `npx lighthouse http://localhost:3000` |

### Exact Test Files
| File Path | Purpose | Dimension(s) |
|-----------|---------|--------------|
| `tests/auth.spec.ts` | E2E signup/login/logout flows | 1, 3, 7 |
| `tests/onboarding.spec.ts` | Role selection and profile creation | 1, 2, 7 |
| `src/__tests__/webhook.test.ts` | Clerk sync logic and Svix verification | 3, 5, 6 |
| `src/__tests__/middleware.test.ts` | Route protection and redirect logic | 3, 4 |
| `src/__tests__/schema.test.ts` | Drizzle constraint and relation verification | 6 |

## 4. Phase Requirements → Test Map

| Req ID | Behavior | Test Case Reference | File |
|--------|----------|---------------------|------|
| **AUTH-01** | Student/Company Signup | TC-F1-01, TC-F1-02, TC-F1-03 | `tests/auth.spec.ts` |
| **AUTH-02** | Profile Management | TC-F1-04, TC-D6-01 | `tests/onboarding.spec.ts` |
| **SEC-01** | Route Protection | TC-S3-01, TC-S3-02 | `src/__tests__/middleware.test.ts` |
