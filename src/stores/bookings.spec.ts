import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { useBookingsStore } from './bookings'
import { useCartStore } from './cart'
import { useCatalogStore } from './catalog'

const customer = { name: 'Ana López', email: 'ana@example.com' }

let kayakSlotId: string
let rappelSlotId: string
let beforeSlots: Date

beforeEach(() => {
  setActivePinia(createPinia())
  // The catalog builds slots from today's date, so take real slot ids from it and book
  // "one minute before" the earliest of them.
  const catalog = useCatalogStore()
  const kayak = catalog.slotsFor('pena-kayak')[0]
  const rappel = catalog.slotsFor('pena-rappel')[0]
  if (!kayak || !rappel) throw new Error('seed has no kayak or rappel slots')
  kayakSlotId = kayak.id
  rappelSlotId = rappel.id
  // Fresh state for these slots, whatever the seed pattern gave them.
  kayak.sold = 0
  rappel.sold = 0
  beforeSlots = new Date(Math.min(Date.parse(kayak.startsAt), Date.parse(rappel.startsAt)) - 60_000)
})

describe('checkout', () => {
  it('books every item under one reference, sells the spots and empties the cart', () => {
    const catalog = useCatalogStore()
    const cart = useCartStore()
    const bookings = useBookingsStore()
    cart.setItem(kayakSlotId, { adult: 2, child: 1, senior: 0 })
    cart.setItem(rappelSlotId, { adult: 1, child: 0, senior: 0 })

    const result = bookings.checkout(customer, beforeSlots)

    expect(result).toEqual({ ok: true, reference: 'TD-0001' })
    expect(bookings.byReference('TD-0001').map((b) => b.total)).toEqual([120000, 65000])
    expect(catalog.slotById(kayakSlotId)?.sold).toBe(3)
    expect(catalog.slotById(rappelSlotId)?.sold).toBe(1)
    expect(cart.items).toEqual([])
  })

  it('books nothing when one item no longer fits', () => {
    const catalog = useCatalogStore()
    const cart = useCartStore()
    const bookings = useBookingsStore()
    cart.setItem(kayakSlotId, { adult: 1, child: 0, senior: 0 })
    cart.setItem(rappelSlotId, { adult: 2, child: 0, senior: 0 })
    const rappel = catalog.slotById(rappelSlotId)
    if (rappel) rappel.sold = rappel.capacity - 1 // someone else bought in the meantime

    const result = bookings.checkout(customer, beforeSlots)

    expect(result).toEqual({ ok: false, reason: 'not-enough-spots', slotId: rappelSlotId })
    expect(bookings.bookings).toEqual([])
    expect(catalog.slotById(kayakSlotId)?.sold).toBe(0)
    expect(cart.items).toHaveLength(2)
  })

  it('rejects a slot that already started', () => {
    const cart = useCartStore()
    const bookings = useBookingsStore()
    cart.setItem(kayakSlotId, { adult: 1, child: 0, senior: 0 })
    const afterStart = new Date(Date.parse(useCatalogStore().slotById(kayakSlotId)!.startsAt))

    expect(bookings.checkout(customer, afterStart)).toEqual({
      ok: false,
      reason: 'slot-started',
      slotId: kayakSlotId,
    })
  })

  it('rejects an empty cart', () => {
    expect(useBookingsStore().checkout(customer, beforeSlots)).toEqual({
      ok: false,
      reason: 'empty-cart',
    })
  })
})
