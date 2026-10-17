import { describe, expect, it } from 'vitest'

import { formatDay, formatMoney, formatTime, localDate } from './format'

describe('format', () => {
  it('formats cents as MXN', () => {
    expect(formatMoney(45000)).toBe('$450.00')
    expect(formatMoney(155000)).toBe('$1,550.00')
  })

  it('formats a day and a time in Spanish', () => {
    expect(formatDay('2026-11-07')).toBe('sáb 7 de nov')
    expect(formatTime('2026-11-07T09:00:00-06:00')).toBe('09:00')
  })

  it('gives the Mexico City date of an instant', () => {
    // 03:00 UTC on Nov 8 is still Nov 7 in Mexico City.
    expect(localDate(new Date('2026-11-08T03:00:00Z'))).toBe('2026-11-07')
    expect(localDate('2026-11-07T20:00:00-06:00')).toBe('2026-11-07')
  })
})
