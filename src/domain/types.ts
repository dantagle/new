/** Integer amount in MXN cents. 45000 = $450.00 MXN. */
export type Cents = number

export type TicketKind = 'adult' | 'child' | 'senior'

export const TICKET_KINDS: readonly TicketKind[] = ['adult', 'child', 'senior']

/** How many tickets of each kind; every kind is always present (0 when not chosen). */
export type TicketQuantities = Record<TicketKind, number>

export interface Venue {
  id: string
  name: string
  city: string
  /** IANA timezone; slot times are local to it. */
  timezone: string
}

export interface Experience {
  id: string
  venueId: string
  name: string
  description: string
  durationMinutes: number
  /** Price per ticket kind, VAT included. */
  prices: Record<TicketKind, Cents>
}

export interface TimeSlot {
  id: string
  experienceId: string
  /** ISO 8601 with the venue's UTC offset, e.g. "2026-11-07T09:00:00-06:00". */
  startsAt: string
  /** People per slot: every ticket takes one spot, children included. */
  capacity: number
  sold: number
}

/** One priced line of a cart or booking. */
export interface TicketLine {
  kind: TicketKind
  quantity: number
  unitPrice: Cents
}

export interface Booking {
  id: string
  slotId: string
  lines: TicketLine[]
  total: Cents
  /** ISO 8601 timestamp. */
  createdAt: string
}
