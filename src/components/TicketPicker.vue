<script setup lang="ts">
import { computed } from 'vue'

import { totalTickets } from '@/domain/availability'
import { formatMoney } from '@/domain/format'
import { TICKET_LABELS } from '@/domain/labels'
import { TICKET_KINDS, type Cents, type TicketKind, type TicketQuantities } from '@/domain/types'

const quantities = defineModel<TicketQuantities>({ required: true })

const { maxTickets } = defineProps<{
  prices: Record<TicketKind, Cents>
  /** Upper bound for the total: the booking limit or the spots left, whichever is lower. */
  maxTickets: number
}>()

const total = computed(() => totalTickets(quantities.value))

function change(kind: TicketKind, delta: number): void {
  // vs React: replace the object, as you would with setState. `quantities.value.adult++` would
  // also "work", but it mutates the parent's object directly without emitting
  // update:modelValue: the parent's state changes behind its back (one-way data flow broken).
  quantities.value = { ...quantities.value, [kind]: quantities.value[kind] + delta }
}
</script>

<template>
  <ul class="tickets">
    <li v-for="kind in TICKET_KINDS" :key="kind">
      <span class="label">
        {{ TICKET_LABELS[kind] }} <small>{{ formatMoney(prices[kind]) }}</small>
      </span>
      <button
        type="button"
        :aria-label="`Quitar ${TICKET_LABELS[kind]}`"
        :disabled="quantities[kind] === 0"
        @click="change(kind, -1)"
      >
        −
      </button>
      <output :aria-label="`Boletos ${TICKET_LABELS[kind]}`">{{ quantities[kind] }}</output>
      <button
        type="button"
        :aria-label="`Agregar ${TICKET_LABELS[kind]}`"
        :disabled="total >= maxTickets"
        @click="change(kind, 1)"
      >
        +
      </button>
    </li>
  </ul>
</template>

<style scoped>
.tickets {
  display: grid;
  gap: 0.5rem;
  max-width: 360px;
  padding: 0;
  list-style: none;
}

li {
  display: grid;
  grid-template-columns: 1fr 2rem 2rem 2rem;
  align-items: center;
  gap: 0.5rem;
}

small {
  color: var(--muted);
}

button {
  height: 2rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--surface);
}

output {
  text-align: center;
}
</style>
