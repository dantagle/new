# React → Vue 3: practical differences

What a React / Next.js developer needs to know to work in Vue 3, collected while building TourDesk.
Each row links to where the concept is used in this codebase. The code itself carries
`// vs React:` comments at those spots.

## Project & tooling

| Concept | React / Next.js | Vue 3 | Trap | In the code |
|---|---|---|---|---|
| Entry point | Next builds the HTML; `app/layout.tsx` is the root | You own `index.html` (`<div id="app">`) and `main.ts` calls `createApp(App).mount('#app')` | Plugins (router, Pinia) must be registered with `app.use()` before `mount` | [src/main.ts](../src/main.ts) |
| Component file | `.tsx`: logic and JSX in one function | `.vue` Single File Component: `<script setup>`, `<template>`, `<style scoped>` | The template is not JavaScript: no `.map()`, you use directives (`v-for`, `v-if`) | [src/App.vue](../src/App.vue) |
| Scoped CSS | CSS Modules / Tailwind | `<style scoped>` in the SFC | Scoped styles reach only a child component's root element; deeper elements need `:deep()` | [src/App.vue](../src/App.vue) |
| Routing | File-based (`app/about/page.tsx`) | Routes declared in an array (`src/router/index.ts`) | `<RouterView />` is where the active page renders, like `{children}` in a layout | [src/router/index.ts](../src/router/index.ts) |
| Type-check | `tsc` | `vue-tsc` (understands `.vue` files) | Plain `tsc` ignores `.vue` files and reports nothing | `package.json` → `type-check` |

## Reactivity & components

_Filled in from Part 2 on._
