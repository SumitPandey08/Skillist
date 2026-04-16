# Phase 8 Research: AI Mock Interviewer

## Objective
To design and implement a real-time, AI-driven interview simulation that provides students with actionable feedback and scores, improving their hiring success probability.

## Architecture

### 1. Audio Processing & Transcription
- **Option A (Browser Web Speech API)**: Fast, free, but quality depends on the browser/OS.
- **Option B (OpenAI Whisper)**: Highest quality, handle via backend worker for low latency on file uploads.
- **Decision**: Use Web Speech API for real-time visual feedback and Whisper for the final "official" transcription to ensure accurate AI evaluation.

### 2. Interview Agent Logic (State Machine)
We need a dynamic "Interviewer" that follows a structured yet adaptive path:
1. **Introduction**: Sets the scene for the role.
2. **Technical Deep Dive**: 2-3 questions based on specific skills.
3. **Behavioral/Soft Skills**: 1-2 situational questions (STAR method).
4. **Follow-ups**: Agent can ask "Could you elaborate?" if an answer is too brief.

### 3. Feedback Engine
- **Evaluation Criteria**: 
    - **Technical Accuracy** (0-10)
    - **Clarity of Communication** (0-10)
    - **Confidence** (AI-detected via sentiment/fluency)
    - **Actionable Advice** (Specific points to improve)

## Data Layer Sync
- `mock_interviews`: `id`, `studentId`, `role`, `score`, `feedback`, `status`.
- `interview_messages`: (New table required) Tracks the conversation history for feedback analysis.

## User Flow
1. Student selects a target role or a specific job posting.
2. System initializes a new `mock_interview` session.
3. **Loop (3-5 times)**:
    - AI generates a question.
    - System transcribes student response.
    - AI analyzes response and decides whether to ask a follow-up or move to the next topic.
4. Final evaluation is generated and saved.

## Key Challenges
- **Latency**: Use streaming for AI text generation to keep the conversation natural.
- **UI/UX**: Needs to feel "alive" – use voice visualization (waveform) and responsive animations.
- **Context Management**: The AI must remember previous answers to ask relevant follow-ups.

## Next Steps (Plan 08-01)
1. Add `interview_messages` table to `src/db/schema.ts`.
2. Implement mock interview session management (Start, End).
3. Create server actions for message persistence.
