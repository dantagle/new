import { describe, expect, it } from 'vitest'

import { availableSpots, canBook, totalTickets } from './availability'
import type { TicketQuantities, TimeSlot } from './types'

const slot = (overrides: Partial<TimeSlot> = {}): TimeSlot => ({
  id: 'slot-1',
  experienceId: 'exp-1',
  startsAt: '2026-11-07T09:00:00-06:00',
  capacity: 15,
  sold: 5,
  ...overrides,
})

const qty = (overrides: Partial<TicketQuantities> = {}): TicketQuantities => ({
  adult: 0,
  child: 0,
  senior: 0,
  ...overrides,
})

const before = new Date('2026-11-07T08:00:00-06:00')

describe('availableSpots', () => {
  it('is capacity minus sold', () => {
    expect(availableSpots(slot({ capacity: 15, sold: 5 }))).toBe(10)
  })

  it('is 0 when the slot is full', () => {
    expect(availableSpots(slot({ capacity: 15, sold: 15 }))).toBe(0)
  })

  it('never goes below 0 when the slot is oversold', () => {
    expect(availableSpots(slot({ capacity: 15, sold: 17 }))).toBe(0)
  })
})

describe('totalTickets', () => {
  it('adds every kind', () => {
    expect(totalTickets(qty({ adult: 2, child: 1, senior: 1 }))).toBe(4)
  })
})

describe('canBook', () => {
  it('accepts a valid booking', () => {
    expect(canBook(slot(), qty({ adult: 2, child: 1 }), before)).toEqual({ ok: true })
  })

  it('rejects negative or fractional quantities', () => {
    expect(canBook(slot(), qty({ adult: -1 }), before)).toEqual({
      ok: false,
      reason: 'invalid-quantity',
    })
    expect(canBook(slot(), qty({ adult: 1.5 }), before)).toEqual({
      ok: false,
      reason: 'invalid-quantity',
    })
  })

  it('rejects an empty booking', () => {
    expect(canBook(slot(), qty(), before)).toEqual({ ok: false, reason: 'empty' })
  })

  it('accepts up to 10 tickets and rejects 11', () => {
    const big = slot({ capacity: 50, sold: 0 })
    expect(canBook(big, qty({ adult: 10 }), before)).toEqual({ ok: true })
    expect(canBook(big, qty({ adult: 6, senior: 5 }), before)).toEqual({
      ok: false,
      reason: 'too-many-tickets',
    })
  })

  it('rejects children without an adult or senior', () => {
    expect(canBook(slot(), qty({ child: 2 }), before)).toEqual({
      ok: false,
      reason: 'child-without-adult',
    })
  })

  it('accepts children with a senior', () => {
    expect(canBook(slot(), qty({ child: 2, senior: 1 }), before)).toEqual({ ok: true })
  })

  it('allows same-day booking until the slot starts', () => {
    const oneMinuteBefore = new Date('2026-11-07T08:59:00-06:00')
    const atStart = new Date('2026-11-07T09:00:00-06:00')
    expect(canBook(slot(), qty({ adult: 1 }), oneMinuteBefore)).toEqual({ ok: true })
    expect(canBook(slot(), qty({ adult: 1 }), atStart)).toEqual({
      ok: false,
      reason: 'slot-started',
    })
  })

  it('rejects more tickets than spots left, counting children', () => {
    const almostFull = slot({ capacity: 15, sold: 13 })
    expect(canBook(almostFull, qty({ adult: 2 }), before)).toEqual({ ok: true })
    expect(canBook(almostFull, qty({ adult: 2, child: 1 }), before)).toEqual({
      ok: false,
      reason: 'not-enough-spots',
    })
  })
})
