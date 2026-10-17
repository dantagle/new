<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

import { useCartStore } from '@/stores/cart'

const cart = useCartStore()
</script>

<template>
  <header>
    <RouterLink :to="{ name: 'catalog' }" class="brand">TourDesk</RouterLink>
    <!-- Reading cart.ticketCount through the store object keeps it reactive (no destructuring). -->
    <RouterLink :to="{ name: 'cart' }" class="cart">Carrito ({{ cart.ticketCount }})</RouterLink>
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

.cart {
  margin-left: auto;
}

.brand {
  font-weight: 700;
  color: var(--accent);
  text-decoration: none;
}
</style>
