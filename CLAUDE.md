# CLAUDE.md — TourDesk

## What this project is
TourDesk is a small booking, box-office and back-office app for experience operators
(museums, tours, attractions). It is a portfolio project: the goal is a clean, well-tested
Vue 3 codebase AND a visible record of how AI-assisted development was used with judgment.

Brand, venues and data are fictional. No real payments, no real customer data.

## Who you are working with
Dan is a senior product engineer who ships React / Next.js + TypeScript in production.
**Goal: learn the practical differences between React and Vue 3** — what is the same under another
name, what works differently, and where a React developer trips up. Not a from-scratch course:
do not explain TypeScript, testing or general architecture.

How we work:
- **Claude builds the app part by part; Dan reads each part.** Small commits, one concern each, so
  every part can be read on its own.
- **Comment only where Vue differs from React**, with the prefix `// vs React:` in scripts and
  `<!-- vs React: -->` in templates. Each comment says what the Vue code does, why Vue does it that
  way, and the React equivalent or the trap. No comments for things that work the same as in React.
- **Keep `docs/react-vs-vue.md` up to date**: every new difference gets a row
  (concept · React · Vue · trap · where it is used in the code).
- **Explain in Spanish, code and commits in English.**
- **Plan before code.** For each part: propose the files you'll touch and the approach, wait for OK.
- Exercises are optional: if Dan says "modo práctica", leave a typed stub with TODOs and hints, let
  him write it, then review it like a senior reviewer.
- Business rules: propose simple ones, marked as assumptions, and wait for Dan to approve or
  change them. If a requirement is ambiguous, ask.

## Stack
- Vue 3 (Composition API, `<script setup lang="ts">` only — no Options API in new code)
- TypeScript (strict). No `any`; use `unknown` + narrowing.
- Vite, Vue Router, Pinia (setup-store syntax), Vitest + @vue/test-utils, ESLint + Prettier
- AI feature: Anthropic Claude API, called ONLY from the server folder (`server/`), never from the browser.
- Validation: zod for anything that crosses a boundary (API responses, AI output, forms).

## Commands
- `npm run dev` — start the app
- `npm run test:unit` — Vitest
- `npm run type-check` — vue-tsc
- `npm run lint` — oxlint + ESLint with autofix; `npm run lint:check` — same checks without fixing (CI)
- Before every commit: type-check, lint and tests must pass.

## Structure
```
src/
  domain/        # types + pure functions (pricing, capacity). No Vue imports here.
  data/          # seed data (fictional venues, experiences)
  stores/        # Pinia stores (useCatalogStore, useCartStore, useBookingsStore)
  composables/   # useX() reusable logic
  components/    # presentational components, PascalCase.vue
  views/         # route-level pages
  router/
server/          # tiny Node API (Anthropic SDK lives here)
docs/            # PLAN.md, react-vs-vue.md, decisions
AI_LOG.md        # human-curated log of AI-assisted work
```

## Conventions
- Components: props typed with `defineProps<{...}>()`, events with `defineEmits<{...}>()`.
- Business logic (prices, capacity, availability) goes in `src/domain/` as pure functions with tests.
- Tests live next to the code: `Foo.vue` → `Foo.spec.ts`. Test behavior (rendered text, emitted events),
  not internal state.
- Money is integer cents (MXN). Dates are ISO strings; times in the venue's timezone (America/Mexico_City).
- Conventional commits: `feat:`, `fix:`, `test:`, `refactor:`, `docs:`, `chore:`.

## Guardrails
- Never commit secrets. `ANTHROPIC_API_KEY` only in `server/.env` (gitignored). Provide `.env.example`.
- Payments are mocked. Never collect real card data.
- AI output is never saved directly: it is validated with zod and shown to the operator for review
  (human-in-the-loop) before it changes any data.
- Do not add dependencies without saying why and asking first.
- GitHub access is plain `git` over SSH only (remote `git@github.com:...`). Never use the `gh` CLI
  in this repo and never switch the remote to HTTPS: `gh` on this machine is signed in to a
  different account. For PRs, issues or CI status, read the github.com page in the Claude app's
  built-in browser, or give Dan the link.

## End of each session
Draft an entry at the end of `AI_LOG.md` using its template (what was asked, what you proposed,
what Dan accepted/changed, issues found). Mark it `DRAFT` — Dan edits it before committing.
