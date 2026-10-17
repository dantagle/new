import { defineStore } from 'pinia'
import { ref } from 'vue'

import { canBook, totalTickets, type BookingRejection } from '@/domain/availability'
import { cartTotal, ticketLines } from '@/domain/pricing'
import type { Booking, Customer } from '@/domain/types'
import { useCartStore } from './cart'
import { useCatalogStore } from './catalog'

export type CheckoutResult =
  | { ok: true; reference: string }
  | { ok: false; reason: 'empty-cart' }
  | { ok: false; reason: BookingRejection | 'unknown-slot'; slotId: string }

// Bookings live in memory only; they are lost on reload (mock checkout, no backend).
export const useBookingsStore = defineStore('bookings', () => {
  const catalog = useCatalogStore()
  const cart = useCartStore()

  const bookings = ref<Booking[]>([])
  let lastNumber = 0

  /**
   * Books every cart item or none: each item is checked again with canBook (spots may have
   * changed since it was added). On success the slots' sold counts go up and the cart is emptied.
   */
  function checkout(customer: Customer, now: Date): CheckoutResult {
    if (cart.items.length === 0) return { ok: false, reason: 'empty-cart' }

    for (const item of cart.items) {
      const slot = catalog.slotById(item.slotId)
      if (!slot) return { ok: false, reason: 'unknown-slot', slotId: item.slotId }
      const check = canBook(slot, item.quantities, now)
      if (!check.ok) return { ok: false, reason: check.reason, slotId: item.slotId }
    }

    lastNumber += 1
    const reference = `TD-${String(lastNumber).padStart(4, '0')}`

    for (const item of cart.items) {
      const slot = catalog.slotById(item.slotId)
      const experience = slot ? catalog.experienceById(slot.experienceId) : undefined
      if (!slot || !experience) continue
      const lines = ticketLines(experience, item.quantities)
      bookings.value.push({
        id: `${reference}-${slot.id}`,
        reference,
        slotId: slot.id,
        customer: { ...customer },
        lines,
        total: cartTotal(lines),
        createdAt: now.toISOString(),
      })
      catalog.recordSale(slot.id, totalTickets(item.quantities))
    }

    cart.clear()
    return { ok: true, reference }
  }

  function byReference(reference: string): Booking[] {
    return bookings.value.filter((booking) => booking.reference === reference)
  }

  return { bookings, checkout, byReference }
})
