<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { RouterLink } from 'vue-router'

import { formatDay, formatMoney, formatTime, localDate } from '@/domain/format'
import { TICKET_LABELS } from '@/domain/labels'
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()

// vs React: destructuring a store (`const { lines } = cart`) copies the current values and
// loses reactivity, a classic Vue bug. storeToRefs turns state and computed values into refs
// that stay linked to the store. Actions are plain functions and can be destructured directly.
const { lines, total } = storeToRefs(cart)
const { removeItem } = cart
</script>

<template>
  <main>
    <h1>Carrito</h1>

    <p v-if="lines.length === 0">
      Tu carrito está vacío. <RouterLink :to="{ name: 'catalog' }">Ver experiencias</RouterLink>
    </p>

    <template v-else>
      <article v-for="line in lines" :key="line.slot.id" class="line">
        <header>
          <h2>{{ line.experience.name }}</h2>
          <button type="button" @click="removeItem(line.slot.id)">Quitar</button>
        </header>
        <p class="when">
          {{ formatDay(localDate(line.slot.startsAt)) }} · {{ formatTime(line.slot.startsAt) }}
        </p>
        <ul>
          <li v-for="ticket in line.lines" :key="ticket.kind">
            {{ ticket.quantity }} × {{ TICKET_LABELS[ticket.kind] }} ·
            {{ formatMoney(ticket.unitPrice * ticket.quantity) }}
          </li>
        </ul>
        <p>
          Subtotal: <strong>{{ formatMoney(line.subtotal) }}</strong>
        </p>
      </article>

      <p class="total">
        Total: <strong>{{ formatMoney(total) }}</strong>
      </p>
    </template>
  </main>
</template>

<style scoped>
.line {
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 8px;
}

.line header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h2 {
  margin: 0;
  font-size: 1.1rem;
}

.when {
  color: var(--muted);
}

.total {
  font-size: 1.2rem;
}
</style>
