<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import { formatMoney } from '@/domain/format'
import type { Experience } from '@/domain/types'

// vs React: defineProps is a compiler macro, not an import. The type parameter is the props
// interface, like `function ExperienceCard(props: Props)`. Since Vue 3.5 you can destructure it
// and stay reactive, but passing a destructured prop to watch() needs a getter: () => experience.
const { experience } = defineProps<{ experience: Experience }>()

// vs React: computed() is like useMemo without a dependency array. Vue records which reactive
// values were read while computing and recalculates only when one of them changes.
const fromPrice = computed(() => Math.min(...Object.values(experience.prices)))
</script>

<template>
  <!-- vs React: `:to` binds a JavaScript expression (like to={...} in JSX); without the colon
       the attribute is a plain string. `class` instead of className. -->
  <RouterLink :to="{ name: 'experience', params: { id: experience.id } }" class="card">
    <h3>{{ experience.name }}</h3>
    <p>{{ experience.description }}</p>
    <p class="meta">
      {{ experience.durationMinutes }} min · desde <strong>{{ formatMoney(fromPrice) }}</strong>
    </p>
  </RouterLink>
</template>

<!-- vs React: `scoped` works like CSS Modules: these rules only apply to this component's
     elements, without renaming classes by hand. -->
<style scoped>
.card {
  display: block;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  color: inherit;
  text-decoration: none;
}

.card:hover {
  border-color: var(--accent);
}

h3 {
  margin: 0 0 0.5rem;
}

.meta {
  margin-bottom: 0;
  color: var(--muted);
}
</style>
