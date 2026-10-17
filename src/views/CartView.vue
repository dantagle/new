<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

import { formatDay, formatMoney, formatTime, localDate } from '@/domain/format'
import { CHECKOUT_MESSAGES, REJECTION_MESSAGES, TICKET_LABELS } from '@/domain/labels'
import { useBookingsStore } from '@/stores/bookings'
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()

// vs React: destructuring a store (`const { lines } = cart`) copies the current values and
// loses reactivity, a classic Vue bug. storeToRefs turns state and computed values into refs
// that stay linked to the store. Actions are plain functions and can be destructured directly.
const { lines, total } = storeToRefs(cart)
const { removeItem } = cart

const bookings = useBookingsStore()
const router = useRouter()

const name = ref('')
const email = ref('')
const error = ref<string | null>(null)

function pay(): void {
  const result = bookings.checkout({ name: name.value, email: email.value }, new Date())
  if (result.ok) {
    router.push({ name: 'confirmation', params: { reference: result.reference } })
    return
  }
  if (result.reason === 'empty-cart') {
    error.value = CHECKOUT_MESSAGES['empty-cart']
    return
  }
  const line = lines.value.find((l) => l.slot.id === result.slotId)
  const message =
    result.reason === 'unknown-slot'
      ? CHECKOUT_MESSAGES['unknown-slot']
      : REJECTION_MESSAGES[result.reason]
  error.value = line ? `${line.experience.name}: ${message}` : message
}
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

      <!-- vs React: @submit.prevent = onSubmit={(e) => { e.preventDefault(); … }}. `.prevent` is
           an event modifier; others include .stop and .once. -->
      <form class="checkout" @submit.prevent="pay">
        <h2>Datos de contacto</h2>
        <!-- vs React: v-model on an input replaces value + onChange. `.trim` trims the text
             before storing it. Native `required` / `type="email"` validate the form. -->
        <label>
          Nombre
          <input v-model.trim="name" name="name" autocomplete="name" required />
        </label>
        <label>
          Correo
          <input v-model.trim="email" name="email" type="email" autocomplete="email" required />
        </label>
        <p v-if="error" class="error" role="alert">{{ error }}</p>
        <p class="note">Pago simulado: no se cobra nada.</p>
        <button type="submit" class="primary">Pagar (simulado) {{ formatMoney(total) }}</button>
      </form>
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

.checkout {
  display: grid;
  gap: 0.75rem;
  max-width: 360px;
}

label {
  display: grid;
  gap: 0.25rem;
}

input {
  padding: 0.5rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  font: inherit;
}

.error {
  color: var(--danger);
}

.note {
  margin: 0;
  color: var(--muted);
}

.primary {
  padding: 0.6rem 1.2rem;
  border: 0;
  border-radius: 8px;
  background: var(--accent);
  color: #fff;
}
</style>
