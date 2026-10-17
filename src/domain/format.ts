import type { Cents } from './types'

const TIMEZONE = 'America/Mexico_City'

const money = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' })
const dayLabel = new Intl.DateTimeFormat('es-MX', {
  timeZone: TIMEZONE,
  weekday: 'short',
  day: 'numeric',
  month: 'short',
})
const timeLabel = new Intl.DateTimeFormat('es-MX', {
  timeZone: TIMEZONE,
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})
// en-CA formats dates as YYYY-MM-DD.
const isoDate = new Intl.DateTimeFormat('en-CA', {
  timeZone: TIMEZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

/** 45000 → "$450.00" */
export function formatMoney(amount: Cents): string {
  return money.format(amount / 100)
}

/** "2026-11-07" → "sáb 7 de nov" */
export function formatDay(date: string): string {
  // Noon avoids landing on the previous day when converting to the venue's timezone.
  return dayLabel.format(new Date(`${date}T12:00:00-06:00`))
}

/** "2026-11-07T09:00:00-06:00" → "09:00" */
export function formatTime(startsAt: string): string {
  return timeLabel.format(new Date(startsAt))
}

/** The venue-local date ("YYYY-MM-DD") of a slot or instant. */
export function localDate(instant: string | Date): string {
  return isoDate.format(typeof instant === 'string' ? new Date(instant) : instant)
}
