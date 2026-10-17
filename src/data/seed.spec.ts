import { describe, expect, it } from 'vitest'

import { experiences, seedSlots, venues } from './seed'

describe('seed data', () => {
  it('links every experience to an existing venue', () => {
    const venueIds = new Set(venues.map((venue) => venue.id))
    for (const experience of experiences) {
      expect(venueIds.has(experience.venueId)).toBe(true)
    }
  })
})

describe('seedSlots', () => {
  // 2026-11-07 is a Saturday.
  const slots = seedSlots('2026-11-07', 14)

  it('creates slots only on scheduled weekdays', () => {
    const rappel = slots.filter((slot) => slot.experienceId === 'pena-rappel')
    expect(rappel.map((slot) => slot.startsAt)).toEqual([
      '2026-11-07T08:00:00-06:00',
      '2026-11-14T08:00:00-06:00',
    ])
  })

  it('gives every slot a unique id', () => {
    expect(new Set(slots.map((slot) => slot.id)).size).toBe(slots.length)
  })

  it('never sells more than capacity, and includes some sold-out slots', () => {
    expect(slots.every((slot) => slot.sold >= 0 && slot.sold <= slot.capacity)).toBe(true)
    expect(slots.some((slot) => slot.sold === slot.capacity)).toBe(true)
  })
})
