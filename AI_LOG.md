# AI Log — how TourDesk was built with Claude Code

This log records how AI-assisted development was used on this project: what was delegated,
what was reviewed, and what was corrected. Entries are drafted by Claude Code at the end of a
session and edited by me before committing.

**Rules I followed**
- Every AI-generated change was read and understood before merging.
- Business rules (pricing, capacity) were specified by me, not invented by the model.
- Anything touching payments or customer data got extra review.

---

## Template

### YYYY-MM-DD — Phase N: <short title>
**Goal:**
**What I asked Claude Code:**
**What it proposed:**
**What I accepted / changed and why:**
**Issues caught in review (bugs, bad assumptions, over-engineering):**
**What I learned (Vue / tooling): How a Vue 3 project differs from Next.js (explicit index.html + main.ts entry, routes declared by hand instead of file-based), Single File Components (.vue files with <script setup>, <template> and scoped styles), and how the Vue plugin is wired into Vite.**
**Commits:**

---

### 2026-10-17 — Phase 0: Project setup — DRAFT
**Goal:** Working Vue 3 project in the existing repo, with CI running type-check, lint and tests.
**What I asked Claude Code:** Scaffold with `npm create vue@latest` (TypeScript, Router, Pinia, Vitest,
ESLint, Prettier) without overwriting my docs, add a GitHub Actions workflow, and explain the plan and
every generated file (compared to Next.js) before running anything.
**What it proposed:**
- Scaffold into a temp folder and merge into the repo, instead of `--force` on a non-empty folder:
  keep my README, merge `.gitignore`, leave CLAUDE.md / AI_LOG.md / docs untouched.
- Before explaining, it ran `create-vue --help` and a throwaway scaffold outside the repo so the file
  walkthrough described the real output of create-vue 3.24.0, not what it remembered.
- Three decisions for me (below), then two commits: scaffold, then CI.
**What I accepted / changed and why:**
- Added `lint:check` without `--fix` for CI: the generated `lint` scripts autofix, so in CI they could
  hide errors instead of failing the build. `lint` now lists its scripts explicitly so `run-s "lint:*"`
  would not also pick up `lint:check`.
- Tests live next to the code (`Foo.spec.ts`), per CLAUDE.md, instead of `__tests__/`: changed the
  patterns in `tsconfig.app.json`, `tsconfig.vitest.json` and `eslint.config.ts` to `src/**/*.spec.ts`.
- Demo code (HelloWorld, counter store, icons) is kept for now; it gets removed in a separate
  `refactor:` commit at the start of Phase 1.
**Issues caught in review (bugs, bad assumptions, over-engineering):**
- Autofix in the lint scripts (above) would have made the CI lint step unable to fail.
- The generated test setup only recognized `__tests__/`; a co-located spec would have been
  type-checked with the app config (no test types).
- Verified the checks can fail: a `debugger` statement made `lint:check` exit 1, and a type error in a
  co-located spec made `type-check` exit 2. Both were removed afterwards.
- `npm audit` reports 4 high-severity issues, all from one dev-only chain
  (`braces` → `micromatch` → `fast-glob` → `@vue/eslint-config-typescript`). The only fix npm offers
  is a breaking downgrade of the ESLint config, so it was left as is for now.
**What I learned (Vue / tooling):** _(Dan to write)_
**Commits:** `21d21a8` chore: scaffold Vue 3 project with create-vue · `50cd9e8` ci: add GitHub Actions workflow (CI run #1 green)

### 2026-10-17 — Part 1: Domain model & seed data — DRAFT
**Goal:** Domain types, booking and pricing rules as tested pure functions, and seed data.
**What I asked Claude Code:** Change the way we work (Claude builds, I read; comments only where Vue
differs from React; a React vs Vue guide), then build Part 1 with business rules it proposes as
assumptions for me to approve.
**What it proposed:** Seven business rules (capacity counts people, children included; 1–10 tickets;
children need an adult or senior; same-day booking until the slot starts; total = price × quantity,
VAT included). `canBook` returns the reason a booking is rejected so the UI can explain it. Slots are
generated relative to a start date so the demo never runs out of future slots.
**What I accepted / changed and why:** Accepted the seven rules as proposed.
**Issues caught in review (bugs, bad assumptions, over-engineering):**
- Commit order changed: the demo was removed after the domain tests existed, because Vitest fails
  when there are no test files.
- Two rows of the React vs Vue guide were inaccurate (the template "can't use `.map()`"; plain `tsc`
  "reports nothing" on `.vue` files) and were corrected before pushing.
**What I learned (Vue / tooling):** _(Dan to write)_
**Commits:** `9b5ae1f` docs · `a8770b0` domain · `6128442` seed · `df1b975` remove demo · `7a4d7f0` guide fix (CI run #2 green)
