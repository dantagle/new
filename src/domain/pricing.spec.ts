import { describe, expect, it } from 'vitest'

import { cartTotal, ticketLines } from './pricing'
import type { Experience } from './types'

const kayak: Experience = {
  id: 'exp-1',
  venueId: 'venue-1',
  name: 'Kayak',
  description: '',
  durationMinutes: 120,
  prices: { adult: 45000, child: 30000, senior: 35000 },
}

describe('ticketLines', () => {
  it('prices each chosen kind and skips kinds with quantity 0', () => {
    expect(ticketLines(kayak, { adult: 2, child: 0, senior: 1 })).toEqual([
      { kind: 'adult', quantity: 2, unitPrice: 45000 },
      { kind: 'senior', quantity: 1, unitPrice: 35000 },
    ])
  })
})

describe('cartTotal', () => {
  it('is 0 for an empty cart', () => {
    expect(cartTotal([])).toBe(0)
  })

  it('adds price × quantity for every line', () => {
    const lines = ticketLines(kayak, { adult: 2, child: 1, senior: 1 })
    // 2 × 450 + 1 × 300 + 1 × 350 = 1,550.00 MXN
    expect(cartTotal(lines)).toBe(155000)
  })
})
