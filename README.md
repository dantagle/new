# TourDesk

Booking, box-office and back-office for experience operators (museums, tours, attractions),
built with **Vue 3 + TypeScript**, and with an **AI configuration assistant** powered by Claude.

> Portfolio project. Brand, venues and data are fictional; payments are mocked.

## Why
Operators spend a lot of time configuring schedules, capacity and prices. TourDesk explores two things:
1. A clean, tested Vue 3 front end for the visitor booking flow and the operator back office.
2. An assistant that turns plain language ("Kayak tour on Saturdays at 9 and 12, 15 spots,
   $450 adult / $300 child") into structured configuration that the operator **reviews before saving**.

## Features
- [ ] Visitor: catalog, date & time-slot picker with live capacity, ticket types, cart, mock checkout
- [ ] Back office: create/edit experiences, schedules, capacity, prices; simple sales report
- [ ] AI configuration assistant (Claude API, tool use, zod validation, human-in-the-loop review)
- [ ] Unit and component tests (Vitest + Vue Test Utils), CI on GitHub Actions

## Stack
Vue 3 · TypeScript · Vite · Vue Router · Pinia · Vitest · Vue Test Utils · zod · Node · Anthropic Claude API

## How I used AI to build this
I built TourDesk with Claude Code as a pair programmer while learning Vue 3, coming from React/Next.js.
- `CLAUDE.md` defines the project conventions and guardrails the agent must follow.
- `AI_LOG.md` records each session: what I delegated, what I changed, and the issues I caught in review.
- Small commits, tests and CI act as quality gates for both human- and AI-written code.

## Run it
```bash
npm install
npm run dev
# AI assistant (optional)
cp server/.env.example server/.env   # add ANTHROPIC_API_KEY
npm run dev:server
```

## Roadmap
See [docs/PLAN.md](docs/PLAN.md).
