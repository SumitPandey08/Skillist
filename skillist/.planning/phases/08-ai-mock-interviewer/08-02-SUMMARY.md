---
phase: 08-ai-mock-interviewer
plan: 02
subsystem: interview-ui
tags: ["web-speech-api", "framer-motion", "nextjs"]
requires: ["08-01"]
provides: ["INTERVIEW-UI-01"]
affects: ["candidate-dashboard", "interview-flow"]
tech-stack: ["react", "framer-motion", "lucide-react"]
key-files:
  - "src/hooks/use-speech.ts"
  - "src/components/dashboard/student/mock-interview.tsx"
  - "src/app/(dashboard)/candidate/mock-interview/page.tsx"
decisions:
  - "Used Web Speech API (webkitSpeechRecognition) for real-time browser-based transcription to minimize latency and cost."
  - "Implemented a custom Framer Motion waveform to provide visual feedback during audio capture."
metrics:
  duration: "15m"
---

# Phase 08 Plan 02 Summary: Real-time Speech-to-Text & Interview UI

## Objective
Implement an immersive, real-time interview interface that handles voice transcription and provides immediate visual feedback to the student.

## Accomplishments
- **Speech Hook**: Created `useSpeech` custom hook to wrap the Web Speech API with support for continuous transcription and error handling.
- **Dynamic Interview UI**: Developed `MockInterview` component with a scrollable conversation log, real-time transcript preview, and interactive recording controls.
- **Waveform Visualization**: Built a high-performance CSS/Framer Motion waveform that reacts to the recording state.
- **Dedicated Page**: Launched `/candidate/mock-interview` page with full session loading and automatic redirection for active sessions.

## Deviations from Plan
- None.
