# React → Vue 3: practical differences

What a React / Next.js developer needs to know to work in Vue 3, collected while building TourDesk.
Each row links to where the concept is used in this codebase. The code itself carries
`// vs React:` comments at those spots.

## Project & tooling

| Concept | React / Next.js | Vue 3 | Trap | In the code |
|---|---|---|---|---|
| Entry point | Next builds the HTML; `app/layout.tsx` is the root | You own `index.html` (`<div id="app">`) and `main.ts` calls `createApp(App).mount('#app')` | Plugins (router, Pinia) must be registered with `app.use()` before `mount` | [src/main.ts](../src/main.ts) |
| Component file | `.tsx`: logic and JSX in one function | `.vue` Single File Component: `<script setup>`, `<template>`, `<style scoped>` | The template is not JSX: lists and conditions use directives (`v-for`, `v-if`) instead of `.map()` or `&&` | [src/App.vue](../src/App.vue) |
| Scoped CSS | CSS Modules / Tailwind | `<style scoped>` in the SFC | Scoped styles reach only a child component's root element; deeper elements need `:deep()` | [ExperienceCard.vue](../src/components/ExperienceCard.vue) |
| Routing | File-based (`app/about/page.tsx`) | Routes declared in an array (`src/router/index.ts`) | `<RouterView />` is where the active page renders, like `{children}` in a layout | [src/router/index.ts](../src/router/index.ts) |
| Links | `<Link href>` from `next/link` | `<RouterLink :to>`; `:to` can be a path or `{ name, params }` | Linking by route name breaks loudly if the route doesn't exist | [ExperienceCard.vue](../src/components/ExperienceCard.vue) |
| Route params | `params` prop of a page / `useParams()` | `props: true` on the route passes `:id` as a prop (or `useRoute().params`) | Without `props: true` the view only gets params through `useRoute()` | [src/router/index.ts](../src/router/index.ts) |
| Type-check | `tsc` | `vue-tsc` (understands `.vue` files) | Plain `tsc` cannot type-check `.vue` files; `vue-tsc` wraps it and understands SFCs | `package.json` → `type-check` |

## Reactivity & components

| Concept | React | Vue 3 | Trap | In the code |
|---|---|---|---|---|
| Component function | Runs on every render | `<script setup>` runs **once** per component instance; only the template re-renders | No stale closures, so no `useCallback` / dependency arrays — but code that should react to changes must be in `computed` or `watch` | [catalog.ts](../src/stores/catalog.ts) |
| State | `const [x, setX] = useState()` | `const x = ref()`; read and write `x.value` | `.value` in script, but the template unwraps it: `{{ x }}`, not `{{ x.value }}` | [catalog.ts](../src/stores/catalog.ts) |
| Updating state | Replace with a new object/array | Mutate in place (`slot.sold += n`); `ref` is deeply reactive | Copying "to be safe" is unnecessary, and mutating props is still wrong (see v-model) | [catalog.ts](../src/stores/catalog.ts) |
| Derived values | `useMemo(fn, [deps])` | `computed(fn)` with no dependency list | Vue tracks what `fn` read; a value not read through a ref/reactive is not tracked | [ExperienceCard.vue](../src/components/ExperienceCard.vue) |
| Props | `function C(props: Props)` | `defineProps<Props>()` compiler macro, no import | Destructuring stays reactive since Vue 3.5, but `watch` needs a getter: `watch(() => prop, …)` | [ExperienceCard.vue](../src/components/ExperienceCard.vue) |
| Expressions | `{x}`, `to={x}`, `className` | `{{ x }}`, `:to="x"`, `class` | Without `:` the attribute is a plain string: `to="x"` passes the text "x" | [ExperienceCard.vue](../src/components/ExperienceCard.vue) |
| Lists | `items.map(i => <C key={i.id} />)` | `<C v-for="i in items" :key="i.id" />` | `v-for` goes on the element being repeated | [CatalogView.vue](../src/views/CatalogView.vue) |
| Global state | Context / Zustand | Pinia setup store: `defineStore('id', () => { … return { … } })` | Only what you return is exposed and reactive from outside | [catalog.ts](../src/stores/catalog.ts) |
