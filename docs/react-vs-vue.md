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
| Conditionals | `cond ? <A /> : <B />`, `cond && <A />` | `v-if` / `v-else-if` / `v-else` on elements | `v-else` must be on the element right after the `v-if` one | [ExperienceView.vue](../src/views/ExperienceView.vue) |
| Template scope | Anything in the function's scope is usable in JSX | Top-level imports and variables of `<script setup>` are usable in the template | Only top-level: a variable declared inside a function is not visible to the template | [ExperienceView.vue](../src/views/ExperienceView.vue) |
| Side effects | `useEffect(fn, [deps])` | `watchEffect(fn)`: runs now and re-runs when anything reactive it read changes | Only reactive reads are tracked; reading a plain variable won't re-trigger it | [ExperienceView.vue](../src/views/ExperienceView.vue) |
| Unmount cleanup | Function returned from `useEffect` | `onUnmounted(fn)` (lifecycle hooks are separate functions) | Lifecycle hooks must be registered while the component is being set up, not later from a callback or a `setTimeout` | [ExperienceView.vue](../src/views/ExperienceView.vue) |
| Two-way binding | `value={x} onChange={setX}` | Parent: `v-model="x"`. Child: `const x = defineModel()`, a ref you read and assign | Assigning the model emits `update:modelValue` to the parent; the parent's ref is what changes | [DatePicker.vue](../src/components/DatePicker.vue) |
| Events | `onClick={() => …}` | `@click="…"` (short for `v-on:click`); can be a statement like `@click="date = day"` | In the template refs are unwrapped, so you assign `date`, not `date.value` | [DatePicker.vue](../src/components/DatePicker.vue) |
| Effect on one value | `useEffect(fn, [x])` | `watch(x, fn)` or `watch(() => prop, fn)` | `watch` does not run on mount unless `{ immediate: true }`; for a destructured prop you must pass a getter | [ExperienceView.vue](../src/views/ExperienceView.vue) |
| Fragments | `<>…</>` | `<template>` with a directive (`v-if`, `v-for`) renders only its children | A bare `<template>` without a directive inside a template does nothing useful | [ExperienceView.vue](../src/views/ExperienceView.vue) |
| Same route, new params | Depends on the router | Vue Router reuses the component instance for `/experiences/a` → `/experiences/b` | Local `ref` state survives the navigation; reset it in a `watch` on the param | [ExperienceView.vue](../src/views/ExperienceView.vue) |
| v-model with objects | `onChange({ ...value, adult: 2 })` | Assign a new object to the model: `model.value = { ...model.value, adult: 2 }` | `model.value.adult++` mutates the parent's object without emitting `update:modelValue`; it seems to work but breaks one-way data flow (the TicketPicker test catches it) | [TicketPicker.vue](../src/components/TicketPicker.vue) |
| Prop names in templates | `maxTickets={3}` | `:max-tickets="3"` (kebab-case in templates, camelCase in `defineProps`) | Both spellings work in SFC templates; kebab-case is the Vue style-guide convention | [ExperienceView.vue](../src/views/ExperienceView.vue) |
| Component tests | Testing Library `render()` + `fireEvent` | Vue Test Utils `mount()` + `trigger()`; `wrapper.emitted()` lists emitted events | `trigger()` returns a promise: `await` it before asserting on the DOM | [TicketPicker.spec.ts](../src/components/TicketPicker.spec.ts) |
| Using a store | `const { lines } = useCartStore()` (Zustand selector) | `const cart = useCartStore()`, then `cart.lines` | Destructuring the store loses reactivity; use `storeToRefs(cart)` for state/getters. Actions can be destructured | [CartView.vue](../src/views/CartView.vue) |
| Store refs from outside | — | The store unwraps its refs: `cart.total`, not `cart.total.value` | Inside the store's setup function you still write `.value` | [cart.spec.ts](../src/stores/cart.spec.ts) |
| Stores using stores | One hook calling another | Call `useCatalogStore()` inside the cart store's setup | Call it inside the setup function, not at module top level (Pinia must be active) | [cart.ts](../src/stores/cart.ts) |
| Navigation in code | `useRouter().push('/cart')` (Next.js) | `useRouter().push({ name: 'cart' })` | `useRouter()` must be called in setup, not inside the click handler | [ExperienceView.vue](../src/views/ExperienceView.vue) |
| Testing stores | Render a provider or test the store module | `setActivePinia(createPinia())` per test, then call the store | Without a fresh Pinia per test, state leaks between tests | [cart.spec.ts](../src/stores/cart.spec.ts) |
| Form inputs | `value={name} onChange={e => setName(e.target.value)}` | `<input v-model="name">`; modifiers `.trim`, `.number`, `.lazy` | `v-model` on `type="number"` still gives a string unless you add `.number` | [CartView.vue](../src/views/CartView.vue) |
| Event modifiers | `e.preventDefault()` / `e.stopPropagation()` in the handler | `@submit.prevent`, `@click.stop`, `@click.once` | The modifier replaces the call; the handler doesn't need the event at all | [CartView.vue](../src/views/CartView.vue) |
