# TourDesk — build plan

One phase per Claude Code session (or two). Start each one with `/clear` and the kickoff prompt.
Commit after every small step. Update `AI_LOG.md` at the end of each phase.

## Phase 0 — Setup (≈1 h)
**Goal:** working Vue 3 project, repo on GitHub, CI green.
**You'll learn:** Vue project anatomy, SFCs, Vite, how `CLAUDE.md` steers the agent.
**Kickoff prompt:**
> Read CLAUDE.md, README.md and docs/PLAN.md. We're starting Phase 0. Scaffold the project with
> `npm create vue@latest` (TypeScript, Router, Pinia, Vitest, ESLint, Prettier) in this folder without
> overwriting my docs. Then add a GitHub Actions workflow that runs type-check, lint and tests.
> Before running anything, explain the plan, and explain in Spanish what each generated file does,
> comparing to a Next.js project.

## Phase 1 — Domain model & seed data (≈1–2 h)
**Goal:** types and pure functions with tests; no UI yet.
**You'll learn:** TypeScript-first modeling, Vitest basics.
**Kickoff prompt:**
> Phase 1. Propose types in src/domain for Venue, Experience, TimeSlot (date, start time, capacity, sold),
> TicketType (adult/child/senior, price in cents) and Booking. Add pure functions: availableSpots(slot),
> cartTotal(items), canBook(slot, qty). I'll define the business rules: [write them here].
> Then seed 2 fictional venues in Querétaro with 4 experiences. Write Vitest tests first for the functions.

## Phase 2 — Visitor booking flow (≈3–4 h)
**Goal:** catalog → experience detail → date & slot → ticket picker → cart → mock checkout.
**You'll learn:** components, props/emits, v-model, computed, watch, Vue Router, Pinia, component tests.
**Kickoff prompt:**
> Phase 2. Plan the visitor flow as routes, views and components, and the Pinia stores it needs.
> Build it step by step, one component per step. Before each new Vue concept, explain it in Spanish
> vs React. Use "modo práctica" for TicketPicker: give me a stub and let me write it.
> Add component tests for TicketPicker and the cart store.

## Phase 3 — Back office (≈2–3 h)
**Goal:** operator CRUD for experiences, schedules, capacity and prices + a sales report.
**You'll learn:** forms, validation with zod, composables, route guards.
**Kickoff prompt:**
> Phase 3. Build the operator back office: list/create/edit experiences, generate time slots for a
> weekly schedule, edit capacity and prices, and a simple sales report from bookings. Extract shared
> form logic into composables. Explain composables vs React custom hooks.

## Phase 4 — AI configuration assistant (≈3 h)
**Goal:** operator types a description in Spanish or English → Claude returns structured config →
validated with zod → shown as an editable preview → operator confirms → saved.
**You'll learn:** server-side LLM calls, tool use / structured output, validation, human-in-the-loop UX,
testing with a mocked API.
**Kickoff prompt:**
> Phase 4. Add a tiny Node server in server/ with one endpoint POST /api/parse-experience that calls the
> Anthropic API with tool use, using a tool whose input schema matches our Experience + schedule types.
> Validate the result with zod; on failure return a clear error. In the back office, add an
> "Asistente de configuración" screen: textarea → preview of the parsed config (editable) → Confirm.
> Never save without confirmation. Mock the API in tests. Explain each decision, especially prompt design
> and failure handling.

## Phase 5 — Polish & ship (≈2 h)
**Goal:** something a recruiter can open in 2 minutes.
**Kickoff prompt:**
> Phase 5. Review the whole codebase as a senior Vue reviewer and list issues by priority before fixing.
> Then: README with screenshots/GIF, deploy (Vercel or Netlify), make sure CI is green, and help me
> clean up AI_LOG.md (I'll write the final words).

## Optional — Phase 6: Nuxt 3
Port to Nuxt 3: file-based pages, `useFetch`, and move the AI endpoint to `server/api`.
