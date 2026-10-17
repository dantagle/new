<script setup lang="ts">
import { computed, onUnmounted, ref, watch, watchEffect } from 'vue'
import { RouterLink } from 'vue-router'

import DatePicker from '@/components/DatePicker.vue'
import SlotPicker from '@/components/SlotPicker.vue'
import { formatMoney, localDate } from '@/domain/format'
import { TICKET_LABELS } from '@/domain/labels'
import { TICKET_KINDS } from '@/domain/types'
import { useCatalogStore } from '@/stores/catalog'

// `id` comes from the route (/experiences/:id) because the route has `props: true`.
const { id } = defineProps<{ id: string }>()

const catalog = useCatalogStore()

const experience = computed(() => catalog.experienceById(id))
const venue = computed(() =>
  experience.value ? catalog.venueById(experience.value.venueId) : undefined,
)

const slots = computed(() => catalog.slotsFor(id))
const dates = computed(() => [...new Set(slots.value.map((slot) => localDate(slot.startsAt)))])

const selectedDate = ref<string | null>(null)
const selectedSlotId = ref<string | null>(null)
const slotsOnDate = computed(() =>
  slots.value.filter((slot) => localDate(slot.startsAt) === selectedDate.value),
)
const now = new Date()

// vs React: watch(source, callback) is useEffect with an explicit dependency, but it does not
// run on mount by default (pass { immediate: true } for that). Picking another date clears the
// chosen time slot.
watch(selectedDate, () => {
  selectedSlotId.value = null
})

// vs React: Vue Router reuses this same component instance when going from /experiences/a to
// /experiences/b, so local state survives the navigation and must be reset when the id changes.
// The getter `() => id` is needed because `id` is a destructured prop, not a ref.
watch(
  () => id,
  () => {
    selectedDate.value = null
    selectedSlotId.value = null
  },
)

// vs React: watchEffect is like useEffect, but the dependencies are tracked for you: it runs
// now and again whenever a reactive value it read changes (here `experience`, which depends on
// the `id` prop). There is no dependency array to keep in sync.
watchEffect(() => {
  document.title = experience.value ? `${experience.value.name} · TourDesk` : 'TourDesk'
})

// vs React: cleanup on unmount is a separate hook, not the function returned by useEffect.
onUnmounted(() => {
  document.title = 'TourDesk'
})
</script>

<template>
  <main>
    <!-- vs React: v-if / v-else replace `cond ? <A /> : <B />`. The v-else element must come
         right after the v-if one. -->
    <section v-if="experience">
      <RouterLink :to="{ name: 'catalog' }">← Todas las experiencias</RouterLink>
      <h1>{{ experience.name }}</h1>
      <p class="venue">{{ venue?.name }} · {{ experience.durationMinutes }} min</p>
      <p>{{ experience.description }}</p>

      <h2>Precios</h2>
      <ul class="prices">
        <li v-for="kind in TICKET_KINDS" :key="kind">
          {{ TICKET_LABELS[kind] }}: <strong>{{ formatMoney(experience.prices[kind]) }}</strong>
        </li>
      </ul>

      <h2>Fecha</h2>
      <!-- vs React: v-model="selectedDate" = value + onChange in one directive. -->
      <DatePicker v-model="selectedDate" :dates="dates" />

      <!-- vs React: <template> groups elements without rendering a wrapper, like <></>. -->
      <template v-if="selectedDate">
        <h2>Horario</h2>
        <SlotPicker v-model="selectedSlotId" :slots="slotsOnDate" :now="now" />
      </template>
    </section>

    <section v-else>
      <h1>Experiencia no encontrada</h1>
      <RouterLink :to="{ name: 'catalog' }">Ver todas las experiencias</RouterLink>
    </section>
  </main>
</template>

<style scoped>
.venue {
  color: var(--muted);
}

.prices {
  padding-left: 1.25rem;
}
</style>
