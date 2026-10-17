import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { useCartStore } from './cart'

// vs React: stores are tested without mounting anything: give Pinia a fresh instance per test,
// then call the store like a function.
beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-11-07T08:00:00-06:00'))
  setActivePinia(createPinia())
})

afterEach(() => {
  vi.useRealTimers()
})

// Saturday 2026-11-07 slots from the seed: kayak 450 adult / 300 child, rappel 650 adult.
const kayakSlot = 'pena-kayak-2026-11-07-0900'
const rappelSlot = 'pena-rappel-2026-11-07-0800'

describe('cart store', () => {
  it('prices an item from the catalog', () => {
    const cart = useCartStore()
    cart.setItem(kayakSlot, { adult: 2, child: 1, senior: 0 })

    // vs React: the store unwraps its refs, so it's `cart.lines`, not `cart.lines.value`.
    expect(cart.lines).toHaveLength(1)
    expect(cart.lines[0]?.experience.id).toBe('pena-kayak')
    expect(cart.lines[0]?.subtotal).toBe(120000)
    expect(cart.ticketCount).toBe(3)
  })

  it('replaces the quantities when the same slot is added again', () => {
    const cart = useCartStore()
    cart.setItem(kayakSlot, { adult: 2, child: 1, senior: 0 })
    cart.setItem(kayakSlot, { adult: 1, child: 0, senior: 0 })

    expect(cart.items).toEqual([
      { slotId: kayakSlot, quantities: { adult: 1, child: 0, senior: 0 } },
    ])
  })

  it('adds up several slots and removes one', () => {
    const cart = useCartStore()
    cart.setItem(kayakSlot, { adult: 1, child: 0, senior: 0 })
    cart.setItem(rappelSlot, { adult: 1, child: 0, senior: 0 })
    expect(cart.total).toBe(45000 + 65000)

    cart.removeItem(kayakSlot)
    expect(cart.total).toBe(65000)
  })

  it('keeps its own copy of the quantities', () => {
    const cart = useCartStore()
    const quantities = { adult: 1, child: 0, senior: 0 }
    cart.setItem(kayakSlot, quantities)
    quantities.adult = 5

    expect(cart.ticketCount).toBe(1)
  })
})
