<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import { formatDay, formatMoney, formatTime, localDate } from '@/domain/format'
import { TICKET_LABELS } from '@/domain/labels'
import { useBookingsStore } from '@/stores/bookings'
import { useCatalogStore } from '@/stores/catalog'

const { reference } = defineProps<{ reference: string }>()

const bookings = useBookingsStore()
const catalog = useCatalogStore()

const booked = computed(() =>
  bookings.byReference(reference).map((booking) => {
    const slot = catalog.slotById(booking.slotId)
    return {
      booking,
      slot,
      experience: slot ? catalog.experienceById(slot.experienceId) : undefined,
    }
  }),
)
const total = computed(() => booked.value.reduce((sum, { booking }) => sum + booking.total, 0))
</script>

<template>
  <main>
    <template v-if="booked.length > 0">
      <h1>¡Reserva confirmada!</h1>
      <p>
        Código <strong>{{ reference }}</strong> a nombre de {{ booked[0]?.booking.customer.name }}.
        Enviaríamos la confirmación a {{ booked[0]?.booking.customer.email }}.
      </p>

      <article v-for="{ booking, slot, experience } in booked" :key="booking.id" class="booking">
        <h2>{{ experience?.name }}</h2>
        <p v-if="slot" class="when">
          {{ formatDay(localDate(slot.startsAt)) }} · {{ formatTime(slot.startsAt) }}
        </p>
        <ul>
          <li v-for="line in booking.lines" :key="line.kind">
            {{ line.quantity }} × {{ TICKET_LABELS[line.kind] }}
          </li>
        </ul>
      </article>

      <p class="total">
        Total pagado (simulado): <strong>{{ formatMoney(total) }}</strong>
      </p>
    </template>

    <template v-else>
      <h1>Reserva no encontrada</h1>
      <p>Las reservas se guardan solo en memoria y se pierden al recargar la página.</p>
    </template>

    <RouterLink :to="{ name: 'catalog' }">Ver más experiencias</RouterLink>
  </main>
</template>

<style scoped>
.booking {
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 8px;
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
