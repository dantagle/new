<script setup lang="ts">
import { formatDay } from '@/domain/format'

// vs React: defineModel() is the component side of `v-model`. The parent writes
// <DatePicker v-model="selectedDate" />, which is shorthand for the React pair
// value={selectedDate} onChange={setSelectedDate}. Here `date` is a ref: reading `date.value`
// reads the parent's value, and assigning to it emits the change to the parent.
const date = defineModel<string | null>({ required: true })

defineProps<{ dates: string[] }>()
</script>

<template>
  <div class="chips" role="group" aria-label="Fecha">
    <!-- vs React: @click is onClick. Inside the template, `date = day` assigns the model (the
         template unwraps refs, so no `.value`). -->
    <button
      v-for="day in dates"
      :key="day"
      type="button"
      :aria-pressed="day === date"
      @click="date = day"
    >
      {{ formatDay(day) }}
    </button>
    <p v-if="dates.length === 0">No hay fechas disponibles.</p>
  </div>
</template>

<style scoped>
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

button {
  padding: 0.4rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--surface);
}

button[aria-pressed='true'] {
  border-color: var(--accent);
  background: var(--accent);
  color: #fff;
}
</style>
