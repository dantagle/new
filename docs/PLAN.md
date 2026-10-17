# TourDesk — build plan

**Goal:** learn the practical differences between React and Vue 3 by reading a real app, built
part by part. Claude writes the code; Dan reads each part. Comments marked `// vs React:` explain only
what differs from React, and every difference is collected in [react-vs-vue.md](react-vs-vue.md).

One part per session (or two). Each part ends with small commits, green CI and an `AI_LOG.md` draft.
Exercises are optional ("modo práctica").

## Part 0 — Setup ✅
Vue 3 + TypeScript project scaffolded with create-vue, CI running type-check, lint and tests.

## Part 1 — Domain model & seed data
**Builds:** remove the create-vue demo code; types in `src/domain` (Venue, Experience, TimeSlot,
TicketType, Booking) and pure functions (`availableSpots`, `cartTotal`, `canBook`) with tests;
seed data for 2 fictional venues in Querétaro.
**React vs Vue:** almost none — plain TypeScript and Vitest, which works like Jest. This part is the
base the rest is built on, so it stays short.
**Kickoff:** "Part 1. Propose the domain types and the business rules as assumptions before coding."

## Part 2 — Visitor booking flow
**Builds:** catalog → experience detail → date & slot → ticket picker → cart → mock checkout.
**React vs Vue:** SFCs and templates vs JSX · `ref` / `reactive` vs `useState` · `computed` vs
`useMemo` (no dependency arrays) · `watch` vs `useEffect` · `defineProps` / `defineEmits` vs props and
callbacks · `v-model` on components · `v-if` / `v-for` / `:key` · slots vs `children` · Vue Router vs
the Next.js router · Pinia vs Context / Zustand · Vue Test Utils vs Testing Library.
**Kickoff:** "Part 2. Plan the routes, views, components and stores, then build one piece at a time."

## Part 3 — Back office
**Builds:** operator CRUD for experiences, weekly schedules, capacity and prices, plus a sales report.
**React vs Vue:** forms with `v-model` vs controlled inputs · composables vs custom hooks ·
validation with zod in both worlds · route guards vs middleware · `provide` / `inject` vs Context.
**Kickoff:** "Part 3. Plan the back office and extract shared form logic into composables."

## Part 4 — AI configuration assistant
**Builds:** a tiny Node server (`server/`) with `POST /api/parse-experience` that calls the Anthropic
API with tool use, validates the result with zod and returns it; in the back office, a screen where
the operator types a description, reviews an editable preview and confirms. Never saved without
confirmation. The API is mocked in tests.
**React vs Vue:** async state and loading/error UI · editing a copy of the data before saving.
**Kickoff:** "Part 4. Plan the endpoint, the prompt and tool schema, and the review screen."

## Part 5 — Polish & ship
**Builds:** review of the whole codebase, README with screenshots, deploy (Vercel or Netlify),
green CI, final `AI_LOG.md`. Decide whether the `// vs React:` comments stay in the public repo.
**Kickoff:** "Part 5. Review the codebase, list issues by priority, then ship."

## Optional — Part 6: Nuxt 3
Port to Nuxt 3: file-based pages, `useFetch`, the AI endpoint in `server/api`.
**React vs Vue:** Nuxt vs Next.js.
