<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <RouterLink :to="{ name: 'catalog' }" class="brand">TourDesk</RouterLink>
  </header>
  <!-- vs React: <RouterView /> renders the component of the active route, like {children} in a
       Next.js layout or <Outlet /> in React Router. -->
  <RouterView />
</template>

<style scoped>
header {
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border);
}

.brand {
  font-weight: 700;
  color: var(--accent);
  text-decoration: none;
}
</style>
