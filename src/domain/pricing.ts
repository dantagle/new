import {
  TICKET_KINDS,
  type Cents,
  type Experience,
  type TicketLine,
  type TicketQuantities,
} from './types'

/** Turns chosen quantities into priced lines, skipping kinds with quantity 0. */
export function ticketLines(experience: Experience, quantities: TicketQuantities): TicketLine[] {
  return TICKET_KINDS.filter((kind) => quantities[kind] > 0).map((kind) => ({
    kind,
    quantity: quantities[kind],
    unitPrice: experience.prices[kind],
  }))
}

/** Sum of price × quantity. No discounts or extra fees. */
export function cartTotal(lines: readonly TicketLine[]): Cents {
  return lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0)
}
