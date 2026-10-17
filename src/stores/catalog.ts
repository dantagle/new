import { defineStore } from 'pinia'
import { ref } from 'vue'

import { experiences as seedExperiences, seedSlots, venues as seedVenues } from '@/data/seed'
import { localDate } from '@/domain/format'
import type { Experience, TimeSlot, Venue } from '@/domain/types'

const DAYS_AHEAD = 14

// vs React: a setup store is like a custom hook whose state is shared by every component that
// calls it (one instance per app, like a Zustand store). The function runs once, not on every
// render: Vue components don't re-run their setup code when state changes.
export const useCatalogStore = defineStore('catalog', () => {
  // vs React: ref() is the counterpart of useState, but there is no setter. You read and write
  // `.value`, and Vue tracks who read it to update only what depends on it.
  const venues = ref<Venue[]>(seedVenues)
  const experiences = ref<Experience[]>(seedExperiences)
  const slots = ref<TimeSlot[]>(seedSlots(localDate(new Date()), DAYS_AHEAD))

  function venueById(id: string): Venue | undefined {
    return venues.value.find((venue) => venue.id === id)
  }

  function experienceById(id: string): Experience | undefined {
    return experiences.value.find((experience) => experience.id === id)
  }

  function slotById(id: string): TimeSlot | undefined {
    return slots.value.find((slot) => slot.id === id)
  }

  function slotsFor(experienceId: string): TimeSlot[] {
    return slots.value
      .filter((slot) => slot.experienceId === experienceId)
      .sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt))
  }

  function experiencesAt(venueId: string): Experience[] {
    return experiences.value.filter((experience) => experience.venueId === venueId)
  }

  function recordSale(slotId: string, quantity: number): void {
    const slot = slotById(slotId)
    // vs React: mutating a nested property is fine here. ref() makes the whole array deeply
    // reactive, so every view showing this slot updates. No need to copy the array.
    if (slot) slot.sold += quantity
  }

  return {
    venues,
    experiences,
    slots,
    venueById,
    experienceById,
    slotById,
    slotsFor,
    experiencesAt,
    recordSale,
  }
})
