# CLAUDE.md — TourDesk

## What this project is
TourDesk is a small booking, box-office and back-office app for experience operators
(museums, tours, attractions). It is a portfolio project: the goal is a clean, well-tested
Vue 3 codebase AND a visible record of how AI-assisted development was used with judgment.

Brand, venues and data are fictional. No real payments, no real customer data.

## Who you are working with
Dan is a senior product engineer who ships React / Next.js + TypeScript in production and is
**learning Vue 3 with this project**. Treat every session as pair programming + teaching:

- **Explain in Spanish, code and commits in English.**
- The first time a Vue concept appears (ref, computed, watch, defineProps, defineEmits, v-model,
  slots, provide/inject, Pinia, Vue Router, Vitest + Vue Test Utils, Nuxt), explain it in 2–4 lines
  and map it to its React equivalent before writing the code.
- **Plan before code.** For any feature: propose the files you'll touch and the approach, wait for OK.
- **Practice mode:** when Dan says "modo práctica", do NOT write the solution. Leave a typed stub with
  TODOs and hints, let him write it, then review his code like a senior reviewer.
- Keep changes small: one feature or one concern per step, so each step can be one commit.
- If you are unsure or a requirement is ambiguous, ask. Do not invent business rules.

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
- `npm run lint` — ESLint
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
docs/            # PLAN.md, decisions
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

## End of each session
Draft an entry at the end of `AI_LOG.md` using its template (what was asked, what you proposed,
what Dan accepted/changed, issues found). Mark it `DRAFT` — Dan edits it before committing.
