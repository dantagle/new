import { TICKET_KINDS, type TicketQuantities, type TimeSlot } from './types'

export const MAX_TICKETS_PER_BOOKING = 10

export type BookingRejection =
  | 'invalid-quantity'
  | 'empty'
  | 'too-many-tickets'
  | 'child-without-adult'
  | 'slot-started'
  | 'not-enough-spots'

export type BookingCheck = { ok: true } | { ok: false; reason: BookingRejection }

/** Spots left in a slot. Never negative, even if the slot was oversold. */
export function availableSpots(slot: TimeSlot): number {
  return Math.max(0, slot.capacity - slot.sold)
}

export function totalTickets(quantities: TicketQuantities): number {
  return TICKET_KINDS.reduce((sum, kind) => sum + quantities[kind], 0)
}

/**
 * Whether these tickets can be booked in the slot right now.
 * Returns the first rule that fails, so the UI can say why.
 */
export function canBook(slot: TimeSlot, quantities: TicketQuantities, now: Date): BookingCheck {
  const isValid = TICKET_KINDS.every(
    (kind) => Number.isInteger(quantities[kind]) && quantities[kind] >= 0,
  )
  if (!isValid) return { ok: false, reason: 'invalid-quantity' }

  const total = totalTickets(quantities)
  if (total === 0) return { ok: false, reason: 'empty' }
  if (total > MAX_TICKETS_PER_BOOKING) return { ok: false, reason: 'too-many-tickets' }

  if (quantities.child > 0 && quantities.adult + quantities.senior === 0) {
    return { ok: false, reason: 'child-without-adult' }
  }

  // Same-day bookings are allowed until the slot starts.
  if (Date.parse(slot.startsAt) <= now.getTime()) return { ok: false, reason: 'slot-started' }

  if (total > availableSpots(slot)) return { ok: false, reason: 'not-enough-spots' }

  return { ok: true }
}
