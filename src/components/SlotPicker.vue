<script setup lang="ts">
import { availableSpots } from '@/domain/availability'
import { formatTime } from '@/domain/format'
import type { TimeSlot } from '@/domain/types'

const slotId = defineModel<string | null>({ required: true })

const { now } = defineProps<{ slots: TimeSlot[]; now: Date }>()

function hasStarted(slot: TimeSlot): boolean {
  return Date.parse(slot.startsAt) <= now.getTime()
}

function status(slot: TimeSlot): string {
  if (hasStarted(slot)) return 'Ya comenzó'
  const spots = availableSpots(slot)
  if (spots === 0) return 'Agotado'
  return spots === 1 ? '1 lugar' : `${spots} lugares`
}
</script>

<template>
  <div class="slots" role="group" aria-label="Horario">
    <!-- vs React: `:disabled` with a boolean adds or removes the attribute, like disabled={...}. -->
    <button
      v-for="slot in slots"
      :key="slot.id"
      type="button"
      :aria-pressed="slot.id === slotId"
      :disabled="hasStarted(slot) || availableSpots(slot) === 0"
      @click="slotId = slot.id"
    >
      <strong>{{ formatTime(slot.startsAt) }}</strong>
      <span>{{ status(slot) }}</span>
    </button>
  </div>
</template>

<style scoped>
.slots {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

button {
  display: grid;
  min-width: 6.5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  text-align: left;
}

button[aria-pressed='true'] {
  border-color: var(--accent);
  box-shadow: inset 0 0 0 1px var(--accent);
}

button:disabled {
  color: var(--muted);
  background: #f3f4f6;
}

span {
  font-size: 0.85rem;
  color: var(--muted);
}
</style>
