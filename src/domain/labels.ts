import type { BookingRejection } from './availability'
import type { TicketKind } from './types'

// Spanish UI text for domain values.

export const TICKET_LABELS: Record<TicketKind, string> = {
  adult: 'Adulto',
  child: 'Niño',
  senior: 'Adulto mayor',
}

export const CHECKOUT_MESSAGES = {
  'empty-cart': 'Tu carrito está vacío.',
  'unknown-slot': 'Uno de los horarios ya no existe. Quítalo del carrito.',
} as const

export const REJECTION_MESSAGES: Record<BookingRejection, string> = {
  'invalid-quantity': 'Las cantidades no son válidas.',
  empty: 'Elige al menos un boleto.',
  'too-many-tickets': 'Máximo 10 boletos por reserva.',
  'child-without-adult': 'Los niños deben ir con al menos un adulto o adulto mayor.',
  'slot-started': 'Este horario ya comenzó.',
  'not-enough-spots': 'No hay lugares suficientes en este horario.',
}
