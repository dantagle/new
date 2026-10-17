import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { totalTickets } from '@/domain/availability'
import { cartTotal, ticketLines } from '@/domain/pricing'
import type { Cents, Experience, TicketLine, TicketQuantities, TimeSlot } from '@/domain/types'
import { useCatalogStore } from './catalog'

export interface CartItem {
  slotId: string
  quantities: TicketQuantities
}

/** A cart item joined with its slot and experience, priced. */
export interface CartLine {
  slot: TimeSlot
  experience: Experience
  lines: TicketLine[]
  subtotal: Cents
}

export const useCartStore = defineStore('cart', () => {
  // vs React: a store can use another store just by calling it, like one hook calling another.
  const catalog = useCatalogStore()

  const items = ref<CartItem[]>([])

  const lines = computed<CartLine[]>(() =>
    items.value.flatMap((item) => {
      const slot = catalog.slotById(item.slotId)
      const experience = slot ? catalog.experienceById(slot.experienceId) : undefined
      if (!slot || !experience) return []
      const priced = ticketLines(experience, item.quantities)
      return [{ slot, experience, lines: priced, subtotal: cartTotal(priced) }]
    }),
  )

  const total = computed(() => lines.value.reduce((sum, line) => sum + line.subtotal, 0))
  const ticketCount = computed(() =>
    items.value.reduce((sum, item) => sum + totalTickets(item.quantities), 0),
  )

  /** One line per slot: adding the same slot again replaces its quantities. */
  function setItem(slotId: string, quantities: TicketQuantities): void {
    const copy = { ...quantities }
    const existing = items.value.find((item) => item.slotId === slotId)
    if (existing) existing.quantities = copy
    else items.value.push({ slotId, quantities: copy })
  }

  function removeItem(slotId: string): void {
    items.value = items.value.filter((item) => item.slotId !== slotId)
  }

  function clear(): void {
    items.value = []
  }

  return { items, lines, total, ticketCount, setItem, removeItem, clear }
})
